import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar departamentos
    const departments = await Promise.all([
        prisma.department.upsert({
            where: { name: 'Vendas' },
            update: {},
            create: {
                name: 'Vendas',
                description: 'Departamento de vendas e marketing',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Financeiro' },
            update: {},
            create: {
                name: 'Financeiro',
                description: 'Departamento financeiro',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Estoque' },
            update: {},
            create: {
                name: 'Estoque',
                description: 'Departamento de estoque e logística',
            },
        }),
        prisma.department.upsert({
            where: { name: 'Recursos Humanos' },
            update: {},
            create: {
                name: 'Recursos Humanos',
                description: 'Departamento de RH',
            },
        }),
    ]);

    console.log('✅ Departamentos criados');

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@erp.com' },
        update: {},
        create: {
            email: 'admin@erp.com',
            password: hashedPassword,
            name: 'Administrador',
            role: 'ADMIN',
            status: 'ACTIVE',
            departmentId: departments[0].id,
        },
    });

    console.log('✅ Usuário admin criado');
    console.log('📧 Email: admin@erp.com');
    console.log('🔑 Senha: admin123');

    // Criar usuários de exemplo
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'olivia@email.com' },
            update: {},
            create: {
                email: 'olivia@email.com',
                password: await bcrypt.hash('123456', 10),
                name: 'Olivia Rhye',
                role: 'ADMIN',
                status: 'ACTIVE',
                departmentId: departments[0].id,
            },
        }),
        prisma.user.upsert({
            where: { email: 'phoenix@email.com' },
            update: {},
            create: {
                email: 'phoenix@email.com',
                password: await bcrypt.hash('123456', 10),
                name: 'Phoenix Baker',
                role: 'EDITOR',
                status: 'ACTIVE',
                departmentId: departments[1].id,
            },
        }),
        prisma.user.upsert({
            where: { email: 'lana@email.com' },
            update: {},
            create: {
                email: 'lana@email.com',
                password: await bcrypt.hash('123456', 10),
                name: 'Lana Steiner',
                role: 'VIEWER',
                status: 'INACTIVE',
                departmentId: departments[2].id,
            },
        }),
    ]);

    console.log('✅ Usuários de exemplo criados');

    // Criar categorias de produtos
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Eletrônicos' },
            update: {},
            create: {
                name: 'Eletrônicos',
                description: 'Produtos eletrônicos',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Informática' },
            update: {},
            create: {
                name: 'Informática',
                description: 'Produtos de informática',
            },
        }),
    ]);

    console.log('✅ Categorias criadas');

    console.log('🎉 Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
