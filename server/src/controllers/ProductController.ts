import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { ProductStatus } from '@prisma/client';

const productService = new ProductService();

export class ProductController {
    async getAll(req: Request, res: Response) {
        try {
            const { status, search, categoryId } = req.query;
            const filters = {
                status: status as ProductStatus,
                search: search as string,
                categoryId: categoryId ? parseInt(categoryId as string) : undefined,
            };
            const products = await productService.getAll(filters);
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const product = await productService.getById(id);
            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar produto' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const product = await productService.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar produto' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const product = await productService.update(id, req.body);
            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar produto' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await productService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar produto' });
        }
    }
}
