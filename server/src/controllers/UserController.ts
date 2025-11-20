import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = {
                status: req.query.status as string,
                role: req.query.role as string,
                departmentId: req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined,
                search: req.query.search as string,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            };

            const result = await userService.getAll(filters);

            return res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const user = await userService.getById(id);

            return res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.create(req.body);

            return res.status(201).json({
                success: true,
                data: user,
                message: 'Usuário criado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const user = await userService.update(id, req.body);

            return res.json({
                success: true,
                data: user,
                message: 'Usuário atualizado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await userService.delete(id);

            return res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const { password } = req.body;

            const result = await userService.updatePassword(id, password);

            return res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
}
