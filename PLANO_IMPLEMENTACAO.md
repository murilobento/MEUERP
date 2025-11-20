# 🎯 Plano de Implementação - Melhorias ERP

## 📋 Visão Geral das Mudanças

### 1. **TopBar (Header) - Melhorias**
- [x] Toggle para recolher/expandir sidebar
- [x] Widget de Data/Hora (atualização em tempo real)
- [x] Widget de Clima (baseado na cidade)
- [x] Toggle Light/Dark Mode (já implementado)
- [x] Notificações com dropdown
- [x] Perfil do usuário com dropdown (Meu Perfil, Logout)

### 2. **Sidebar - Reestruturação**
- [x] Logo e nome da empresa
- [x] Painel Principal (Dashboard com métricas)
- [x] Seletor de Módulos com submódulos:
  - **Administrativo**
    - Configurações (Dados da Empresa)
    - Funções e Acesso (Controle Granular)
    - Gestão de Usuários
  - **Financeiro**
    - Contas a Pagar
    - Contas a Receber
    - Relatórios
  - **Estoque**
    - Acerto de Estoque
    - Compras
    - Fornecedores
    - Inventário (Categorias e Produtos)
    - Movimentação de Estoque
    - Relatórios
  - **Comercial**
    - Clientes
    - Pedidos
    - Relatórios

### 3. **Responsividade**
- [x] Mobile First Design
- [x] Breakpoints: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)
- [x] Sidebar colapsável em mobile
- [x] Menu hamburguer
- [x] Tabelas responsivas com scroll horizontal

### 4. **Filtros Globais (Todas as Páginas)**
- [x] Filtro por Nome/Produto
- [x] Filtro por Datas:
  - Ontem
  - Hoje
  - Mês Atual
  - Mês Anterior
  - Range Customizado (Data Início - Data Fim)
- [x] Filtro por Status (Ativo/Inativo)

### 5. **DataTables**
- [x] Ordenação por colunas
- [x] Paginação (5 itens por página)
- [x] Indicadores visuais de ordenação
- [x] Loading states
- [x] Empty states

---

## 🚀 Fases de Implementação

### **FASE 1: Componentes Base** ✅
**Prioridade: ALTA**

#### 1.1 TopBar Melhorado
- [x] Componente ToggleSidebar
- [x] Widget DateTime
- [x] Widget Weather (API OpenWeather)
- [x] Dropdown de Notificações
- [x] Dropdown de Perfil

#### 1.2 Sidebar Reestruturado
- [x] Logo da Empresa
- [x] Link para Dashboard
- [x] Módulos com ícones
- [x] Animações de expansão/colapso
- [x] Estado colapsado em mobile

#### 1.3 Componentes Reutilizáveis
- [x] FilterBar (barra de filtros global)
- [x] DateRangePicker
- [x] DataTable (tabela com ordenação e paginação)
- [x] StatusBadge
- [x] EmptyState
- [x] LoadingSpinner

---

### **FASE 2: Módulo Administrativo** 🔄
**Prioridade: ALTA**

#### 2.1 Configurações
- [x] Página de Dados da Empresa
  - Nome, CNPJ, Endereço
  - Logo da empresa
  - Informações de contato

#### 2.2 Funções e Acesso
- [x] CRUD de Roles (Funções)
- [x] Controle granular de permissões
  - Por módulo
  - Por ação (criar, ler, atualizar, deletar)
- [x] Atribuição de roles a usuários

#### 2.3 Gestão de Usuários (Melhorar Existente)
- [ ] Adicionar filtros completos
- [ ] Adicionar modal de criação/edição
- [ ] Adicionar confirmação de exclusão
- [ ] Upload de avatar

---

### **FASE 3: Módulo Financeiro** 📊
**Prioridade: MÉDIA**

#### 3.1 Contas a Pagar
- [ ] Listagem com filtros
- [ ] CRUD completo
- [ ] Status: Pendente, Pago, Vencido
- [ ] Anexos (comprovantes)

#### 3.2 Contas a Receber
- [ ] Listagem com filtros
- [ ] CRUD completo
- [ ] Status: Pendente, Recebido, Vencido
- [ ] Integração com vendas

#### 3.3 Relatórios Financeiros
- [ ] Fluxo de Caixa
- [ ] DRE (Demonstrativo de Resultados)
- [ ] Gráficos (Chart.js ou Recharts)
- [ ] Exportação PDF/Excel

---

### **FASE 4: Módulo Estoque** 📦
**Prioridade: MÉDIA**

#### 4.1 Inventário
- [ ] CRUD de Categorias
- [ ] CRUD de Produtos
  - Código, Nome, Descrição
  - Preço de Custo e Venda
  - Estoque Atual e Mínimo
  - Categoria
  - Imagem do produto

#### 4.2 Fornecedores
- [ ] CRUD de Fornecedores
- [ ] Histórico de compras

#### 4.3 Compras
- [ ] Registro de compras
- [ ] Itens da compra
- [ ] Atualização automática de estoque

#### 4.4 Acerto de Estoque
- [ ] Ajustes manuais de estoque
- [ ] Motivos (Perda, Dano, Contagem)
- [ ] Histórico de ajustes

#### 4.5 Movimentação de Estoque
- [ ] Registro automático de movimentações
- [ ] Tipos: Entrada (Compra), Saída (Venda), Ajuste
- [ ] Filtros e relatórios

#### 4.6 Relatórios de Estoque
- [ ] Produtos em estoque baixo
- [ ] Movimentações por período
- [ ] Valor do estoque

---

### **FASE 5: Módulo Comercial** 🛒
**Prioridade: MÉDIA**

#### 5.1 Clientes
- [ ] CRUD de Clientes
- [ ] Filtros completos
- [ ] API ViaCep no endereço
- [ ] CPF/CNPJ, Contato, Endereço
- [ ] Histórico de pedidos

#### 5.2 Pedidos (Vendas)
- [ ] Criação de pedidos
- [ ] Itens do pedido
- [ ] Cálculo de totais e descontos
- [ ] Status: Pendente, Confirmado, Cancelado
- [ ] Atualização automática de estoque

#### 5.3 Relatórios Comerciais
- [ ] Vendas por período
- [ ] Produtos mais vendidos
- [ ] Clientes top

---

### **FASE 6: Dashboard** 📈
**Prioridade: BAIXA**

#### 6.1 Métricas Principais
- [ ] Total de Vendas (mês atual)
- [ ] Contas a Receber (pendentes)
- [ ] Contas a Pagar (pendentes)
- [ ] Produtos em estoque baixo

#### 6.2 Gráficos
- [ ] Vendas por mês (últimos 6 meses)
- [ ] Produtos mais vendidos
- [ ] Fluxo de caixa

#### 6.3 Atividades Recentes
- [ ] Últimas vendas
- [ ] Últimas compras
- [ ] Alertas (estoque baixo, contas vencidas)

---

## 🎨 Design System

### Cores
```css
/* Light Mode */
--primary: #3b82f6;
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;
--info: #6366f1;

/* Dark Mode */
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--text-primary: #f1f5f9;
```

### Componentes
- **Buttons**: Primary, Secondary, Danger, Success
- **Inputs**: Text, Select, Date, Checkbox
- **Badges**: Status indicators
- **Cards**: Container padrão
- **Modals**: Criação/Edição
- **Toasts**: Notificações de sucesso/erro

### Ícones
- **Lucide React** (já em uso)

---

## 📱 Responsividade

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) {
  - Sidebar colapsado por padrão
  - Menu hamburguer
  - Cards em coluna única
  - Tabelas com scroll horizontal
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  - Sidebar colapsável
  - Cards em 2 colunas
}

/* Desktop */
@media (min-width: 1024px) {
  - Sidebar expandido
  - Cards em 3-4 colunas
  - Tabelas completas
}
```

---

## 🔧 Tecnologias Adicionais

### Frontend
- [ ] **date-fns** - Manipulação de datas
- [ ] **react-hot-toast** - Notificações
- [ ] **recharts** - Gráficos
- [ ] **react-hook-form** - Formulários
- [ ] **zod** - Validação

### Backend
- [ ] **multer** - Upload de arquivos
- [ ] **pdfkit** - Geração de PDFs
- [ ] **exceljs** - Geração de Excel

---

## ✅ Checklist de Implementação

### Prioridade 1 (Esta Semana)
- [ ] TopBar melhorado
- [ ] Sidebar reestruturado
- [ ] Componentes reutilizáveis (FilterBar, DataTable)
- [ ] Responsividade base

### Prioridade 2 (Próxima Semana)
- [ ] Módulo Administrativo completo
- [ ] Módulo Financeiro (Contas)

### Prioridade 3 (Semana 3)
- [ ] Módulo Estoque completo
- [ ] Módulo Comercial completo

### Prioridade 4 (Semana 4)
- [ ] Dashboard com métricas
- [ ] Relatórios e gráficos
- [ ] Testes e ajustes finais

---

## 📝 Notas de Implementação

### Boas Práticas
1. **Componentes pequenos e reutilizáveis**
2. **Hooks customizados** para lógica compartilhada
3. **Context API** para estado global
4. **Lazy loading** para rotas
5. **Memoization** para performance
6. **Error boundaries** para tratamento de erros
7. **Loading states** em todas as operações assíncronas
8. **Validação** client-side e server-side

### Padrões de Código
- **Nomenclatura**: camelCase para variáveis, PascalCase para componentes
- **Organização**: Feature-based (por módulo)
- **Comentários**: JSDoc para funções complexas
- **Commits**: Conventional Commits

---

**Próximo Passo**: Implementar FASE 1 - Componentes Base
