import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

// Validações
const loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
    validate,
];

const registerValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    validate,
];

// Rotas públicas
router.post('/login', loginValidation, authController.login.bind(authController));
router.post('/register', registerValidation, authController.register.bind(authController));

// Rotas protegidas
router.get('/me', authMiddleware, authController.me.bind(authController));

export default router;
