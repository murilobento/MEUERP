import dotenv from 'dotenv';
import app from './app';
import prisma from './config/database';

// Carregar variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor
const startServer = async () => {
    try {
        // Testar conexão com o banco
        await prisma.$connect();
        console.log('✅ Conectado ao banco de dados');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

// Iniciar
startServer();
