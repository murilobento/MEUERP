import prisma from '../config/database';
import { AppError } from '../utils/errors';

export class DepartmentService {
    async getAll() {
        return prisma.department.findMany({
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async getById(id: number) {
        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
            },
        });

        if (!department) {
            throw new AppError('Departamento não encontrado', 404);
        }

        return department;
    }

    async create(data: { name: string; description?: string }) {
        const existing = await prisma.department.findUnique({
            where: { name: data.name },
        });

        if (existing) {
            throw new AppError('Departamento já existe', 400);
        }

        return prisma.department.create({ data });
    }

    async update(id: number, data: { name?: string; description?: string }) {
        const department = await prisma.department.findUnique({ where: { id } });

        if (!department) {
            throw new AppError('Departamento não encontrado', 404);
        }

        if (data.name && data.name !== department.name) {
            const existing = await prisma.department.findUnique({
                where: { name: data.name },
            });

            if (existing) {
                throw new AppError('Departamento já existe', 400);
            }
        }

        return prisma.department.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        const department = await prisma.department.findUnique({
            where: { id },
            include: { users: true },
        });

        if (!department) {
            throw new AppError('Departamento não encontrado', 404);
        }

        if (department.users.length > 0) {
            throw new AppError('Não é possível deletar departamento com usuários', 400);
        }

        await prisma.department.delete({ where: { id } });

        return { message: 'Departamento deletado com sucesso' };
    }
}
