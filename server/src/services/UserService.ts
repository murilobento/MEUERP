import prisma from '../config/database';
import { UserRole, UserStatus } from '@prisma/client';
import { hashPassword } from '../utils/password';
import { AppError } from '../utils/errors';

export class UserService {
    async getAll(filters?: {
        status?: string;
        role?: string;
        departmentId?: number;
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.role) {
            where.role = filters.role;
        }

        if (filters?.departmentId) {
            where.departmentId = filters.departmentId;
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { email: { contains: filters.search } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: { department: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        const usersWithoutPassword = users.map(({ password, ...user }) => user);

        return {
            data: usersWithoutPassword,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getById(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { department: true },
        });

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    async create(data: {
        email: string;
        password: string;
        name: string;
        role?: string;
        departmentId?: number;
        avatar?: string;
    }) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError('Email já cadastrado', 400);
        }

        const hashedPassword = await hashPassword(data.password);

        const { departmentId, role, ...userData } = data;

        const user = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                ...(role && { role: role as UserRole }),
                ...(departmentId && {
                    department: {
                        connect: { id: departmentId },
                    },
                }),
            },
            include: { department: true },
        });

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    async update(id: number, data: {
        name?: string;
        email?: string;
        role?: string;
        status?: string;
        departmentId?: number;
        avatar?: string;
    }) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        if (data.email && data.email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser) {
                throw new AppError('Email já cadastrado', 400);
            }
        }

        const { departmentId, role, status, ...updateData } = data;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...updateData,
                ...(role && { role: role as UserRole }),
                ...(status && { status: status as UserStatus }),
                ...(departmentId && {
                    department: {
                        connect: { id: departmentId },
                    },
                }),
            },
            include: { department: true },
        });

        const { password, ...userWithoutPassword } = updatedUser;

        return userWithoutPassword;
    }

    async delete(id: number) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        await prisma.user.delete({ where: { id } });

        return { message: 'Usuário deletado com sucesso' };
    }

    async updatePassword(id: number, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });

        return { message: 'Senha atualizada com sucesso' };
    }
}
