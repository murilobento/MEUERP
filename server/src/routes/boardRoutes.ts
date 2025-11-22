import { Router } from 'express';
import { BoardController } from '../controllers/BoardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const boardController = new BoardController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Board routes
router.get('/', boardController.list);
router.get('/:id', boardController.getById);
router.post('/', boardController.create);
router.put('/:id', boardController.update);
router.delete('/:id', boardController.delete);

// Member routes
router.post('/:id/members', boardController.inviteUser);
router.delete('/:id/members/:userId', boardController.removeUser);

// Column routes
router.post('/:id/columns', boardController.createColumn);
router.put('/:id/columns/:columnId', boardController.updateColumn);
router.delete('/:id/columns/:columnId', boardController.deleteColumn);
router.post('/:id/columns/reorder', boardController.reorderColumns);

export default router;
