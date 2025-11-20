import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from '../services/DepartmentService';

const departmentService = new DepartmentService();

export class DepartmentController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const departments = await departmentService.getAll();

            return res.json({
                success: true,
                data: departments,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const department = await departmentService.getById(id);

            return res.json({
                success: true,
                data: department,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const department = await departmentService.create(req.body);

            return res.status(201).json({
                success: true,
                data: department,
                message: 'Departamento criado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const department = await departmentService.update(id, req.body);

            return res.json({
                success: true,
                data: department,
                message: 'Departamento atualizado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await departmentService.delete(id);

            return res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
}
