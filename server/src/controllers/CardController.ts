import { Request, Response } from 'express';
import { CardService } from '../services/CardService';

const cardService = new CardService();

export class CardController {
    async list(req: Request, res: Response) {
        try {
            const columnId = req.query.columnId ? parseInt(req.query.columnId as string) : undefined;
            const cards = await cardService.list(columnId);
            res.json(cards);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch cards' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const card = await cardService.getById(id);

            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }

            res.json(card);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch card' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const card = await cardService.create(req.body);
            res.status(201).json(card);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create card' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const card = await cardService.update(id, req.body);
            res.json(card);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update card' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await cardService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete card' });
        }
    }

    async moveCard(req: Request, res: Response) {
        try {
            const cardId = parseInt(req.params.id);
            const { targetColumnId, targetPosition } = req.body;
            const card = await cardService.moveCard(cardId, targetColumnId, targetPosition);
            res.json(card);
        } catch (error) {
            res.status(500).json({ error: 'Failed to move card' });
        }
    }
}
