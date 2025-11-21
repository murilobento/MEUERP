import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const SaleService = {
  async list(page: number, limit: number, search?: string, status?: string, startDate?: string, endDate?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.SaleWhereInput = {
      ...(search ? {
        OR: [
          { number: { contains: search } },
          { customer: { name: { contains: search } } }
        ]
      } : {}),
      ...(status ? { status: status as any } : {}),
      ...(startDate && endDate ? {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {})
    };

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true
        }
      }),
      prisma.sale.count({ where })
    ]);

    return {
      data: sales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getById(id: number) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true,
        createdBy: true
      }
    });
  },

  async create(data: any, createdById: number) {
    // Generate sequential number
    const latestSale = await prisma.sale.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    const nextNumber = latestSale
      ? (parseInt(latestSale.number) + 1).toString().padStart(3, '0')
      : '001';

    // Sanitize data
    if (data.date) {
      data.date = new Date(data.date);
    }
    if (data.paymentMethod === '') {
      data.paymentMethod = null;
    }

    return await prisma.$transaction(async (tx) => {
      // Check stock if confirming immediately
      if (data.status === 'CONFIRMED') {
        for (const item of data.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) throw new Error(`Produto ${item.productId} não encontrado`);

          // Update stock
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      const saleItems = data.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      }));

      const sale = await tx.sale.create({
        data: {
          ...data,
          createdById,
          number: nextNumber,
          items: {
            create: saleItems
          }
        },
        include: {
          items: {
            include: { product: true }
          },
          customer: true,
          createdBy: true
        }
      });
      return sale;
    });
  },

  async update(id: number, data: any, createdById?: number) {
    // Sanitize data
    if (data.date) {
      data.date = new Date(data.date);
    }
    if (data.paymentMethod === '') {
      data.paymentMethod = null;
    }

    return await prisma.$transaction(async (tx) => {
      const currentSale = await tx.sale.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!currentSale) throw new Error('Venda não encontrada');

      // Prevent editing if already confirmed, unless cancelling
      if (currentSale.status === 'CONFIRMED' && data.status !== 'CANCELLED') {
        throw new Error('Não é possível editar uma venda concluída. Apenas estorno é permitido.');
      }

      // Handle Stock Logic
      if (currentSale.status !== 'CONFIRMED' && data.status === 'CONFIRMED') {
        // Pending -> Confirmed: Decrease Stock
        const itemsToProcess = data.items ? data.items : currentSale.items;
        for (const item of itemsToProcess) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      } else if (currentSale.status === 'CONFIRMED' && data.status === 'CANCELLED') {
        // Confirmed -> Cancelled: Increase Stock (Reverse)
        for (const item of currentSale.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }

      if (data.items && data.items.length > 0) {
        await tx.saleItem.deleteMany({ where: { saleId: id } });
        const saleItems = data.items.map((item: any) => ({
          saleId: id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        }));
        await tx.saleItem.createMany({
          data: saleItems
        });
        delete data.items; // remove from sale update
      }

      return tx.sale.update({
        where: { id },
        data: {
          ...data,
          ...(createdById && { createdById })
        },
        include: {
          items: {
            include: { product: true }
          },
          customer: true,
          createdBy: true
        }
      });
    });
  },

  async delete(id: number) {
    const sale = await prisma.sale.findUnique({ where: { id } });
    if (sale?.status === 'CONFIRMED') {
      throw new Error('Não é possível excluir uma venda concluída. Realize o estorno (cancelamento).');
    }

    return await prisma.$transaction(async (tx) => {
      await tx.saleItem.deleteMany({ where: { saleId: id } });
      return tx.sale.delete({ where: { id } });
    });
  }
};