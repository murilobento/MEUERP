import { Request, Response } from 'express';
import { BoardService } from '../services/BoardService';

const boardService = new BoardService();

export class BoardController {
    async list(req: Request, res: Response) {
        try {
            const boards = await boardService.list();
            res.json(boards);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch boards' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const board = await boardService.getById(id);

            if (!board) {
                return res.status(404).json({ error: 'Board not found' });
            }

            res.json(board);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch board' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const board = await boardService.create(req.body);
            res.status(201).json(board);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create board' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const board = await boardService.update(id, req.body);
            res.json(board);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update board' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await boardService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete board' });
        }
    }

    // Column operations
    async createColumn(req: Request, res: Response) {
        try {
            const boardId = parseInt(req.params.id);
            const column = await boardService.createColumn(boardId, req.body);
            res.status(201).json(column);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create column' });
        }
    }

    async updateColumn(req: Request, res: Response) {
        try {
            const columnId = parseInt(req.params.columnId);
            const column = await boardService.updateColumn(columnId, req.body);
            res.json(column);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update column' });
        }
    }

    async deleteColumn(req: Request, res: Response) {
        try {
            const columnId = parseInt(req.params.columnId);
            await boardService.deleteColumn(columnId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete column' });
        }
    }

    async reorderColumns(req: Request, res: Response) {
        try {
            const boardId = parseInt(req.params.id);
            const { columnOrders } = req.body;
            const columns = await boardService.reorderColumns(boardId, columnOrders);
            res.json(columns);
        } catch (error) {
            res.status(500).json({ error: 'Failed to reorder columns' });
        }
    }
}
