# 🏢 Sistema ERP - Gestão Empresarial

Sistema ERP completo para gestão empresarial com módulos de Administrativo, Financeiro, Estoque e Comercial.

## 🚀 Tecnologias

### Frontend
- **React 18** com **Vite**
- **TypeScript**
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Context API** para gerenciamento de estado

### Backend
- **Node.js** com **Express**
- **TypeScript**
- **Prisma ORM** para acesso ao banco de dados
- **MySQL** como banco de dados
- **JWT** para autenticação

## 📁 Estrutura do Projeto

```
erp-sistema/
├── client/          # Frontend React + Vite
├── server/          # Backend Express + Prisma
├── package.json     # Scripts do monorepo
└── README.md
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd erp-sistema
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**

Crie um arquivo `.env` na pasta `server/`:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/erp_db"
PORT=3000
JWT_SECRET=seu_secret_super_seguro
NODE_ENV=development
```

4. **Execute as migrações do Prisma**
```bash
npm run prisma:migrate
```

5. **Inicie o projeto**
```bash
npm run dev
```

Isso iniciará:
- Frontend em `http://localhost:5173`
- Backend em `http://localhost:3000`

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia client e server em modo desenvolvimento
- `npm run dev:client` - Inicia apenas o frontend
- `npm run dev:server` - Inicia apenas o backend
- `npm run build` - Build de produção (client e server)
- `npm run prisma:studio` - Abre o Prisma Studio
- `npm run prisma:migrate` - Executa migrações do banco

## 🎨 Módulos do Sistema

### 📊 Administrativo
- **Gestão de Usuários**: Criar, editar, visualizar e gerenciar usuários
- **Permissões**: Controle de acesso por níveis (Admin, Editor, Visualizador, Gerente)
- **Departamentos**: Organização por setores

### 💰 Financeiro
- Contas a pagar e receber
- Fluxo de caixa
- Relatórios financeiros

### 📦 Estoque
- Controle de produtos
- Movimentações de estoque
- Inventário

### 🛒 Comercial
- Vendas
- Clientes
- Pedidos

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Após o login, o token é armazenado no localStorage e enviado em todas as requisições.

## 🎨 Temas

O sistema suporta tema claro e escuro, com alternância automática baseada na preferência do usuário.

## 📝 Licença

Este projeto está sob a licença MIT.
