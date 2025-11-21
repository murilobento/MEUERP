import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
    async getAll(): Promise<Category[]> {
        return prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
    }

    async getById(id: number): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id },
        });
    }

    async create(data: { name: string; description?: string }): Promise<Category> {
        return prisma.category.create({
            data,
        });
    }

    async update(id: number, data: { name?: string; description?: string }): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.category.delete({
            where: { id },
        });
    }
}
