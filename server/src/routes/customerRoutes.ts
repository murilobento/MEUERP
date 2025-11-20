import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', CustomerController.list);
router.get('/:id', CustomerController.getById);
router.post('/', CustomerController.create);
router.put('/:id', CustomerController.update);
router.delete('/:id', CustomerController.delete);

export default router;
