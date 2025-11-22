# 🚀 Guia de Início Rápido - Sistema ERP

## ⚡ Instalação e Configuração

### 1️⃣ Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** >= 18.0.0
- **MySQL** >= 8.0
- **npm** >= 9.0.0

### 2️⃣ Configuração do Banco de Dados

1. Crie um banco de dados MySQL:
```sql
CREATE DATABASE erp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copie o arquivo de exemplo de variáveis de ambiente do servidor:
```bash
cp server/.env.example server/.env
```

3. Edite `server/.env` e configure sua conexão MySQL:
```env
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/erp_db"
PORT=3000
NODE_ENV=development
JWT_SECRET=seu_secret_super_seguro_mude_isso
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 3️⃣ Configuração do Frontend

1. Copie o arquivo de exemplo de variáveis de ambiente do client:
```bash
cp client/.env.example client/.env
```

2. O arquivo já está configurado corretamente, mas você pode ajustar se necessário:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4️⃣ Instalação de Dependências

As dependências já foram instaladas! Mas se precisar reinstalar:

```bash
# Instalar todas as dependências (raiz, server e client)
npm install --legacy-peer-deps
```

### 5️⃣ Configuração do Prisma

1. Gerar o Prisma Client:
```bash
cd server
npx prisma generate
```

2. Executar as migrações (criar tabelas):
```bash
npx prisma migrate dev --name init
```

3. Popular o banco com dados iniciais:
```bash
npm run prisma:seed
```

Isso criará:
- Departamentos (Vendas, Financeiro, Estoque, RH)
- Usuário admin (admin@erp.com / admin123)
- Usuários de exemplo
- Categorias de produtos

### 6️⃣ Iniciar a Aplicação

**Opção 1: Rodar tudo de uma vez (Recomendado)**
```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- Backend em `http://localhost:3000`
- Frontend em `http://localhost:5173`

**Opção 2: Rodar separadamente**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### 7️⃣ Acessar o Sistema

1. Abra o navegador em: `http://localhost:5173`
2. Faça login com as credenciais:
   - **Email**: admin@erp.com
   - **Senha**: admin123

## 🎨 Funcionalidades Disponíveis

### ✅ Implementadas
- Login/Logout
- Gestão de Usuários (listar, criar, editar, deletar)
- Filtros por status, permissão e busca
- Paginação
- Tema claro/escuro
- Layout responsivo

### 🚧 Em Desenvolvimento
- Módulo Financeiro
- Módulo Estoque
- Módulo Comercial
- Dashboard
- Relatórios

## 🛠️ Comandos Úteis

### Prisma Studio (Interface visual do banco)
```bash
cd server
npm run prisma:studio
```
Abre em: `http://localhost:5555`

### Build de Produção
```bash
# Build completo
npm run build

# Ou separadamente
cd server && npm run build
cd client && npm run build
```

### Resetar Banco de Dados
```bash
cd server
npx prisma migrate reset
```
⚠️ **ATENÇÃO**: Isso apagará todos os dados!

## 📝 Estrutura de Pastas

```
erp-sistema/
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express + Prisma)
├── package.json     # Scripts do monorepo
└── README.md
```

## 🔐 Usuários de Teste

Após executar o seed, você terá:

| Email | Senha | Permissão | Status |
|-------|-------|-----------|--------|
| admin@erp.com | admin123 | ADMIN | Ativo |
| olivia@email.com | 123456 | ADMIN | Ativo |
| phoenix@email.com | 123456 | EDITOR | Ativo |
| lana@email.com | 123456 | VIEWER | Inativo |

## 🐛 Solução de Problemas

### Erro de conexão com o banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `mysql -u seu_usuario -p`

### Porta já em uso
- Backend (3000): Mude a variável `PORT` no `server/.env`
- Frontend (5173): Mude em `client/vite.config.ts`

### Erro de dependências
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules client/node_modules server/node_modules
npm install --legacy-peer-deps
```

## 📚 Próximos Passos

1. ✅ Explorar a gestão de usuários
2. ✅ Testar o tema claro/escuro
3. 🔨 Implementar módulos adicionais
4. 🔨 Adicionar dashboard com gráficos
5. 🔨 Criar relatórios em PDF

## 💡 Dicas

- Use o **Prisma Studio** para visualizar e editar dados facilmente
- O sistema já tem **autenticação JWT** configurada
- Todos os endpoints da API estão em `/api/*`
- O **tema** é salvo no localStorage
- Use **Ctrl+Shift+I** para abrir o DevTools e ver as requisições

## 🎯 Tecnologias

**Frontend**: React 19, TypeScript, Vite, React Router, Axios, Lucide Icons

**Backend**: Node.js, Express, TypeScript, Prisma, MySQL, JWT, Bcrypt

---

**Pronto para começar! 🚀**

Se tiver dúvidas, consulte o arquivo `ESTRUTURA.md` para mais detalhes sobre a arquitetura do projeto.
