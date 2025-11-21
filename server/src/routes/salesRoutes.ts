import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', SaleController.list);
router.get('/:id', SaleController.getById);
router.post('/', SaleController.create);
router.put('/:id', SaleController.update);
router.delete('/:id', SaleController.delete);

export default router;