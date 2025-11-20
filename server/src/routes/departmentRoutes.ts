import { Router } from 'express';
import { body } from 'express-validator';
import { DepartmentController } from '../controllers/DepartmentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';

const router = Router();
const departmentController = new DepartmentController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Validações
const createDepartmentValidation = [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    validate,
];

const updateDepartmentValidation = [
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    validate,
];

// Rotas
router.get('/', departmentController.getAll.bind(departmentController));
router.get('/:id', departmentController.getById.bind(departmentController));

// Apenas ADMIN e MANAGER podem criar, atualizar e deletar
router.post(
    '/',
    authorize('ADMIN', 'MANAGER'),
    createDepartmentValidation,
    departmentController.create.bind(departmentController)
);

router.put(
    '/:id',
    authorize('ADMIN', 'MANAGER'),
    updateDepartmentValidation,
    departmentController.update.bind(departmentController)
);

router.delete(
    '/:id',
    authorize('ADMIN'),
    departmentController.delete.bind(departmentController)
);

export default router;
