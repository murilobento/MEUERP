import { Router } from 'express';
import { CardController } from '../controllers/CardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const cardController = new CardController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', cardController.list);
router.get('/:id', cardController.getById);
router.post('/', cardController.create);
router.put('/:id', cardController.update);
router.delete('/:id', cardController.delete);
router.post('/:id/move', cardController.moveCard);

export default router;
