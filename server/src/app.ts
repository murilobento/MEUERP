import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './utils/errors';

const app = express();

// Middlewares globais
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'API do Sistema ERP',
        version: '1.0.0',
        status: 'running',
    });
});

// Middleware de erro (deve ser o último)
app.use(errorHandler);

export default app;
