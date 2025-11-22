import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import departmentRoutes from './departmentRoutes';
import companyRoutes from './companyRoutes';
import customerRoutes from './customerRoutes';
import supplierRoutes from './supplierRoutes';
import boardRoutes from './boardRoutes';
import cardRoutes from './cardRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import salesRoutes from './salesRoutes';
import invitationRoutes from './invitationRoutes';

const router = Router();

// Rotas da API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/company', companyRoutes);
router.use('/customers', customerRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/boards', boardRoutes);
router.use('/cards', cardRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/sales', salesRoutes);
router.use('/invitations', invitationRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
