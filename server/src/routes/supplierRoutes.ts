import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', SupplierController.list);
router.get('/:id', SupplierController.getById);
router.post('/', SupplierController.create);
router.put('/:id', SupplierController.update);
router.delete('/:id', SupplierController.delete);

export default router;
