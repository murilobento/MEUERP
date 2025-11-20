import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);

            return res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await authService.register(req.body);

            return res.status(201).json({
                success: true,
                data: user,
                message: 'Usuário criado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const user = await authService.me(userId);

            return res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }
}
