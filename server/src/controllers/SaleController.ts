import { Request, Response } from 'express';
import { SaleService } from '../services/SaleService';

export const SaleController = {
  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;
      const status = req.query.status as string;

      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const result = await SaleService.list(page, limit, search, status, startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar pedidos de venda' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const sale = await SaleService.getById(id);
      if (!sale) return res.status(404).json({ error: 'Pedido de venda não encontrado' });
      res.json(sale);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar pedido de venda' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const createdById = (req.user as any).userId;
      const sale = await SaleService.create(req.body, createdById);
      res.status(201).json(sale);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message || 'Erro ao criar pedido de venda' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const sale = await SaleService.update(id, req.body);
      res.json(sale);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message || 'Erro ao atualizar pedido de venda' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await SaleService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Erro ao excluir pedido de venda' });
    }
  }
};