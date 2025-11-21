import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import departmentRoutes from './departmentRoutes';
import companyRoutes from './companyRoutes';
import customerRoutes from './customerRoutes';
import boardRoutes from './boardRoutes';
import cardRoutes from './cardRoutes';

const router = Router();

// Rotas da API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/company', companyRoutes);
router.use('/customers', customerRoutes);
router.use('/boards', boardRoutes);
router.use('/cards', cardRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
