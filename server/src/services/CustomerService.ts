import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const CustomerService = {
    async list(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;
        const where: Prisma.CustomerWhereInput = search ? {
            OR: [
                { name: { contains: search } },
                { email: { contains: search } },
                { document: { contains: search } }
            ]
        } : {};

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.customer.count({ where })
        ]);

        return {
            data: customers,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    },

    async getById(id: number) {
        return prisma.customer.findUnique({ where: { id } });
    },

    async create(data: Prisma.CustomerCreateInput) {
        // Verificar duplicidade de documento ou email
        if (data.document) {
            const existingDoc = await prisma.customer.findUnique({ where: { document: data.document } });
            if (existingDoc) throw new Error('Documento já cadastrado');
        }
        if (data.email) {
            const existingEmail = await prisma.customer.findUnique({ where: { email: data.email } });
            if (existingEmail) throw new Error('E-mail já cadastrado');
        }

        return prisma.customer.create({ data });
    },

    async update(id: number, data: Prisma.CustomerUpdateInput) {
        return prisma.customer.update({
            where: { id },
            data
        });
    },

    async delete(id: number) {
        return prisma.customer.delete({ where: { id } });
    }
};
