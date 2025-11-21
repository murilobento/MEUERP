import prisma from '../config/database';
import { UserRole } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

export class AuthService {
    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { departments: true },
        });

        if (!user) {
            throw new AppError('Email ou senha inválidos', 401);
        }

        if (user.status !== 'ACTIVE') {
            throw new AppError('Usuário inativo', 401);
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Email ou senha inválidos', 401);
        }

        // Atualizar último login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const { password: _, ...userWithoutPassword } = user;

        return {
            token,
            user: userWithoutPassword,
        };
    }

    async register(data: {
        email: string;
        password: string;
        name: string;
        role?: string;
        departmentIds?: number[];
    }) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError('Email já cadastrado', 400);
        }

        const hashedPassword = await hashPassword(data.password);

        const { departmentIds, role, ...userData } = data;

        const user = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                ...(role && { role: role as UserRole }),
                ...(departmentIds && {
                    departments: {
                        connect: departmentIds.map(id => ({ id })),
                    },
                }),
            },
            include: { departments: true },
        });

        const { password: _, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }

    async me(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { departments: true },
        });

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        const { password: _, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }
}
