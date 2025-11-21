import { Request, Response } from 'express';
import { SupplierService } from '../services/SupplierService';

export const SupplierController = {
    async list(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const status = req.query.status as string;

            const result = await SupplierService.list(page, limit, search, status);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao listar fornecedores' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const supplier = await SupplierService.getById(id);
            if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado' });
            res.json(supplier);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar fornecedor' });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const supplier = await SupplierService.create(req.body);
            res.status(201).json(supplier);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Erro ao criar fornecedor' });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const supplier = await SupplierService.update(id, req.body);
            res.json(supplier);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao atualizar fornecedor' });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await SupplierService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: 'Erro ao excluir fornecedor' });
        }
    }
};
