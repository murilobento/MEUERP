import { Router } from 'express';
import { BoardController } from '../controllers/BoardController';

const router = Router();
const boardController = new BoardController();

// Board routes
router.get('/', boardController.list);
router.get('/:id', boardController.getById);
router.post('/', boardController.create);
router.put('/:id', boardController.update);
router.delete('/:id', boardController.delete);

// Column routes
router.post('/:id/columns', boardController.createColumn);
router.put('/:id/columns/:columnId', boardController.updateColumn);
router.delete('/:id/columns/:columnId', boardController.deleteColumn);
router.post('/:id/columns/reorder', boardController.reorderColumns);

export default router;
