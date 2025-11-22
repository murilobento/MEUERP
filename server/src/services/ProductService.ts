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
        const productData: any = {
            name: data.name,
            code: data.code || null,
            barcode: data.barcode || null,
            description: data.description || null,
            price: data.price ? parseFloat(data.price) : 0,
            cost: data.cost ? parseFloat(data.cost) : 0,
            stock: data.stock ? parseInt(data.stock) : 0,
            minStock: data.minStock ? parseInt(data.minStock) : 0,
            unit: data.unit || 'UN',
            status: data.status || 'ACTIVE',
            imageUrl: data.imageUrl || null,
            width: data.width ? parseFloat(data.width) : null,
            height: data.height ? parseFloat(data.height) : null,
            length: data.length ? parseFloat(data.length) : null,
            weight: data.weight ? parseFloat(data.weight) : null,
        };

        if (data.categoryId && Number(data.categoryId) > 0) {
            productData.categoryId = Number(data.categoryId);
        }

        if (data.supplierId && Number(data.supplierId) > 0) {
            productData.supplierId = Number(data.supplierId);
        }

        return prisma.product.create({
            data: productData,
        });
    }

    async update(id: number, data: any): Promise<Product> {
        const productData: any = {
            name: data.name,
            code: data.code || null,
            barcode: data.barcode || null,
            description: data.description || null,
            unit: data.unit,
            status: data.status,
            imageUrl: data.imageUrl || null,
        };

        if (data.price !== undefined) productData.price = parseFloat(data.price);
        if (data.cost !== undefined) productData.cost = parseFloat(data.cost);
        if (data.stock !== undefined) productData.stock = parseInt(data.stock);
        if (data.minStock !== undefined) productData.minStock = parseInt(data.minStock);
        if (data.width !== undefined) productData.width = data.width ? parseFloat(data.width) : null;
        if (data.height !== undefined) productData.height = data.height ? parseFloat(data.height) : null;
        if (data.length !== undefined) productData.length = data.length ? parseFloat(data.length) : null;
        if (data.weight !== undefined) productData.weight = data.weight ? parseFloat(data.weight) : null;

        if (data.categoryId !== undefined) {
            productData.categoryId = Number(data.categoryId) > 0 ? Number(data.categoryId) : null;
        }

        if (data.supplierId !== undefined) {
            productData.supplierId = Number(data.supplierId) > 0 ? Number(data.supplierId) : null;
        }

        return prisma.product.update({
            where: { id },
            data: productData,
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.product.delete({
            where: { id },
        });
    }
}
