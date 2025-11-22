# 🚀 IMPLEMENTAÇÃO FASE 1 - Componentes Base

## ✅ O que será implementado agora:

### 1. TopBar Melhorado
- Toggle Sidebar (recolher/expandir)
- Widget Data/Hora
- Widget Clima
- Dropdown de Notificações
- Dropdown de Perfil (Meu Perfil + Logout)

### 2. Sidebar Reestruturado  
- Logo da empresa
- Link para Dashboard
- Seletor de Módulos expandido
- Responsivo (colapsável)

### 3. Componentes Reutilizáveis
- FilterBar (filtros globais)
- DataTable (tabela com ordenação e paginação)
- DateRangePicker
- Modal genérico
- Toast notifications

### 4. Dashboard Inicial
- Cards com métricas
- Layout responsivo

---

## 📦 Dependências Necessárias

Vou instalar as seguintes bibliotecas:

```bash
cd client
npm install date-fns react-hot-toast
```

---

## 🎯 Estrutura de Arquivos

```
client/src/
├── components/
│   ├── Header/          # TopBar melhorado
│   ├── Sidebar/         # Sidebar reestruturado
│   ├── FilterBar/       # Barra de filtros
│   ├── DataTable/       # Tabela reutilizável
│   ├── DateRangePicker/ # Seletor de datas
│   ├── Modal/           # Modal genérico
│   └── Toast/           # Configuração de toasts
├── pages/
│   ├── Dashboard/       # Dashboard principal
│   ├── Admin/           # Módulo Administrativo
│   ├── Financial/       # Módulo Financeiro
│   ├── Inventory/       # Módulo Estoque
│   └── Commercial/      # Módulo Comercial
└── hooks/
    ├── useDateTime.ts   # Hook para data/hora
    ├── useWeather.ts    # Hook para clima
    └── useTable.ts      # Hook para tabelas
```

---

Vou começar a implementação!
