import { PrismaClient, Product, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
    async getAll(filters?: { status?: ProductStatus; search?: string; categoryId?: number }): Promise<Product[]> {
        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search } }, // Removed mode: 'insensitive' for MySQL compatibility if collation is default
                { code: { contains: filters.search } },
                { barcode: { contains: filters.search } },
            ];
        }

        return prisma.product.findMany({
            where,
            include: {
                category: true,
                supplier: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    async getById(id: number): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                supplier: true,
            },
        });
    }

    async create(data: any): Promise<Product> {
        return prisma.product.create({
            data: {
                ...data,
                price: data.price ? parseFloat(data.price) : 0,
                cost: data.cost ? parseFloat(data.cost) : 0,
                width: data.width ? parseFloat(data.width) : null,
                height: data.height ? parseFloat(data.height) : null,
                length: data.length ? parseFloat(data.length) : null,
                weight: data.weight ? parseFloat(data.weight) : null,
            },
        });
    }

    async update(id: number, data: any): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data: {
                ...data,
                price: data.price ? parseFloat(data.price) : undefined,
                cost: data.cost ? parseFloat(data.cost) : undefined,
                width: data.width ? parseFloat(data.width) : undefined,
                height: data.height ? parseFloat(data.height) : undefined,
                length: data.length ? parseFloat(data.length) : undefined,
                weight: data.weight ? parseFloat(data.weight) : undefined,
            },
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.product.delete({
            where: { id },
        });
    }
}
