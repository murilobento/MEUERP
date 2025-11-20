# 📁 Estrutura Completa do Projeto ERP

## 🎯 Visão Geral

Este documento descreve a estrutura completa do projeto ERP Full Stack criado.

## 📂 Estrutura de Diretórios

```
erp-sistema/
├── client/                          # Frontend React + Vite
│   ├── public/                      # Assets estáticos
│   ├── src/
│   │   ├── assets/                  # Imagens, fontes, ícones
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Header.css
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Sidebar.css
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/                # Context API
│   │   │   ├── AuthContext.tsx      # Gerenciamento de autenticação
│   │   │   └── ThemeContext.tsx     # Gerenciamento de tema
│   │   ├── hooks/                   # Custom Hooks
│   │   ├── layouts/                 # Layouts de página
│   │   │   ├── MainLayout.tsx
│   │   │   └── MainLayout.css
│   │   ├── pages/                   # Páginas da aplicação
│   │   │   ├── LoginPage/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── LoginPage.css
│   │   │   └── UsersPage/
│   │   │       ├── UsersPage.tsx
│   │   │       └── UsersPage.css
│   │   ├── services/                # Comunicação com API
│   │   │   ├── api.ts               # Configuração Axios
│   │   │   ├── authService.ts       # Serviços de autenticação
│   │   │   └── userService.ts       # Serviços de usuários
│   │   ├── types/                   # Tipos TypeScript
│   │   │   └── index.ts
│   │   ├── utils/                   # Funções auxiliares
│   │   ├── App.tsx                  # Componente principal
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Estilos globais
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── server/                          # Backend Express + Prisma
│   ├── prisma/
│   │   ├── migrations/              # Migrações do banco
│   │   ├── schema.prisma            # Schema do Prisma
│   │   └── seed.ts                  # Seed de dados iniciais
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # Configuração Prisma
│   │   ├── controllers/             # Controllers (HTTP)
│   │   │   ├── AuthController.ts
│   │   │   ├── UserController.ts
│   │   │   └── DepartmentController.ts
│   │   ├── middlewares/             # Middlewares
│   │   │   ├── authMiddleware.ts    # Verificação de autenticação
│   │   │   ├── authorize.ts         # Verificação de permissões
│   │   │   └── validate.ts          # Validação de dados
│   │   ├── routes/                  # Definição de rotas
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── departmentRoutes.ts
│   │   │   └── index.ts
│   │   ├── services/                # Lógica de negócio
│   │   │   ├── AuthService.ts
│   │   │   ├── UserService.ts
│   │   │   └── DepartmentService.ts
│   │   ├── types/                   # Tipos TypeScript
│   │   │   └── api.ts
│   │   ├── utils/                   # Utilitários
│   │   │   ├── jwt.ts               # Geração/verificação de tokens
│   │   │   ├── password.ts          # Hash de senhas
│   │   │   └── errors.ts            # Tratamento de erros
│   │   ├── app.ts                   # Configuração Express
│   │   └── server.ts                # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                     # Scripts do monorepo
└── README.md
```

## 🗄️ Modelos do Banco de Dados

### Módulo Administrativo
- **User**: Usuários do sistema
- **Department**: Departamentos da empresa

### Módulo Financeiro
- **Account**: Contas bancárias/caixa
- **Transaction**: Transações financeiras

### Módulo Estoque
- **Product**: Produtos
- **Category**: Categorias de produtos
- **StockMovement**: Movimentações de estoque

### Módulo Comercial
- **Customer**: Clientes
- **Supplier**: Fornecedores
- **Sale**: Vendas
- **SaleItem**: Itens de venda
- **Purchase**: Compras
- **PurchaseItem**: Itens de compra

## 🎨 Sistema de Design

### Cores (Tema Claro)
- **Primary**: #3b82f6 (Azul)
- **Success**: #10b981 (Verde)
- **Warning**: #f59e0b (Amarelo)
- **Danger**: #ef4444 (Vermelho)
- **Info**: #6366f1 (Índigo)

### Cores (Tema Escuro)
- Paleta adaptada para fundo escuro (#0f172a)
- Mantém as cores de ação mas com backgrounds ajustados

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Tamanhos**: 0.75rem - 1.75rem

## 🔐 Autenticação e Autorização

### Níveis de Permissão
1. **ADMIN**: Acesso total ao sistema
2. **MANAGER**: Gerenciamento de módulos específicos
3. **EDITOR**: Edição de dados
4. **VIEWER**: Apenas visualização

### Fluxo de Autenticação
1. Login com email/senha
2. Geração de JWT (válido por 7 dias)
3. Token armazenado no localStorage
4. Interceptor Axios adiciona token automaticamente
5. Middleware backend valida token em rotas protegidas

## 🚀 Funcionalidades Implementadas

### ✅ Completas
- [x] Autenticação (Login/Logout)
- [x] Gestão de Usuários (CRUD completo)
- [x] Gestão de Departamentos
- [x] Sistema de Permissões (RBAC)
- [x] Tema Claro/Escuro
- [x] Layout Responsivo
- [x] Filtros e Paginação

### 🚧 Para Implementar
- [ ] Módulo Financeiro (Contas, Transações)
- [ ] Módulo Estoque (Produtos, Categorias, Movimentações)
- [ ] Módulo Comercial (Vendas, Compras, Clientes, Fornecedores)
- [ ] Dashboard com gráficos
- [ ] Relatórios em PDF
- [ ] Notificações em tempo real
- [ ] Upload de arquivos/imagens

## 📝 Scripts Disponíveis

### Raiz do Projeto
```bash
npm install              # Instalar todas as dependências
npm run dev              # Rodar client e server simultaneamente
npm run build            # Build de produção
```

### Server
```bash
cd server
npm run dev              # Modo desenvolvimento
npm run build            # Build TypeScript
npm run start            # Produção
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:migrate   # Executar migrações
npm run prisma:seed      # Popular banco com dados iniciais
```

### Client
```bash
cd client
npm run dev              # Modo desenvolvimento
npm run build            # Build de produção
npm run preview          # Preview do build
```

## 🔑 Credenciais de Teste

Após executar o seed:
- **Email**: admin@erp.com
- **Senha**: admin123

## 📚 Tecnologias Utilizadas

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Lucide React (ícones)

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- JWT
- Bcrypt

## 🎯 Próximos Passos

1. Instalar dependências: `npm install`
2. Configurar banco de dados no `.env`
3. Executar migrações: `npm run prisma:migrate`
4. Popular banco: `npm run prisma:seed`
5. Iniciar aplicação: `npm run dev`

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação oficial das tecnologias utilizadas.
