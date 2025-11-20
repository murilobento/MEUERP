import { Request, Response } from 'express';
import { CustomerService } from '../services/CustomerService';

export const CustomerController = {
    async list(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;

            const result = await CustomerService.list(page, limit, search);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao listar clientes' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const customer = await CustomerService.getById(id);
            if (!customer) return res.status(404).json({ error: 'Cliente não encontrado' });
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const customer = await CustomerService.create(req.body);
            res.status(201).json(customer);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Erro ao criar cliente' });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const customer = await CustomerService.update(id, req.body);
            res.json(customer);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao atualizar cliente' });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await CustomerService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: 'Erro ao excluir cliente' });
        }
    }
};
