import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';

const router = Router();
const userController = new UserController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Validações
const createUserValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    validate,
];

const updateUserValidation = [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    validate,
];

const updatePasswordValidation = [
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    validate,
];

// Rotas
router.get('/', userController.getAll.bind(userController));
router.get('/:id', userController.getById.bind(userController));

// Apenas ADMIN e MANAGER podem criar, atualizar e deletar
router.post(
    '/',
    authorize('ADMIN', 'MANAGER'),
    createUserValidation,
    userController.create.bind(userController)
);

router.put(
    '/:id',
    authorize('ADMIN', 'MANAGER'),
    updateUserValidation,
    userController.update.bind(userController)
);

router.delete(
    '/:id',
    authorize('ADMIN'),
    userController.delete.bind(userController)
);

router.patch(
    '/:id/password',
    authorize('ADMIN', 'MANAGER'),
    updatePasswordValidation,
    userController.updatePassword.bind(userController)
);

export default router;
