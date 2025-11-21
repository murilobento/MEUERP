import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const SupplierService = {
    async list(page: number, limit: number, search?: string, status?: string) {
        const skip = (page - 1) * limit;
        const where: Prisma.SupplierWhereInput = {
            ...(search ? {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } },
                    { document: { contains: search } }
                ]
            } : {}),
            ...(status ? { status: status as any } : {})
        };

        const [suppliers, total] = await Promise.all([
            prisma.supplier.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.supplier.count({ where })
        ]);

        return {
            data: suppliers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async getById(id: number) {
        return prisma.supplier.findUnique({ where: { id } });
    },

    async create(data: Prisma.SupplierCreateInput) {
        // Verificar duplicidade de documento ou email
        if (data.document) {
            const existingDoc = await prisma.supplier.findUnique({ where: { document: data.document } });
            if (existingDoc) throw new Error('Documento já cadastrado');
        }
        if (data.email) {
            const existingEmail = await prisma.supplier.findUnique({ where: { email: data.email } });
            if (existingEmail) throw new Error('E-mail já cadastrado');
        }

        return prisma.supplier.create({ data });
    },

    async update(id: number, data: Prisma.SupplierUpdateInput) {
        return prisma.supplier.update({
            where: { id },
            data
        });
    },

    async delete(id: number) {
        return prisma.supplier.delete({ where: { id } });
    }
};
