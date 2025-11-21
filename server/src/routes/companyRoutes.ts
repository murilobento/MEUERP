import { Router } from 'express';
import { CompanyController } from '../controllers/CompanyController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorize';

const router = Router();
const companyController = new CompanyController();

// Apenas ADMIN e MANAGER podem gerenciar configurações da empresa
router.get('/', authMiddleware, authorize('ADMIN', 'MANAGER'), companyController.getSettings);
router.put('/', authMiddleware, authorize('ADMIN', 'MANAGER'), companyController.updateSettings);

export default router;
