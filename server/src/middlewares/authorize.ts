import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

type UserRole = 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';

export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Usuário não autenticado', 401);
        }

        if (!allowedRoles.includes(req.user.role as UserRole)) {
            throw new AppError('Acesso negado', 403);
        }

        next();
    };
};
