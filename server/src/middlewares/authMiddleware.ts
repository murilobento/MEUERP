import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError('Token não fornecido', 401);
        }

        const [, token] = authHeader.split(' ');

        if (!token) {
            throw new AppError('Token inválido', 401);
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado',
        });
    }
};
