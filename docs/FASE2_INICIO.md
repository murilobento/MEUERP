# 🚀 FASE 2 - Módulo Administrativo

## 🎯 Objetivos
Implementar as funcionalidades administrativas focando na experiência do usuário e gestão do sistema.

## 📋 Tarefas

### 1. Componentes Base (Prioridade Alta)
- [ ] **Modal Genérico**: Componente reutilizável para formulários e confirmações.
- [ ] **Form Components**: Inputs, Selects e Textareas padronizados.

### 2. Configurações da Empresa (`/admin/configuracoes`)
- [ ] Formulário com dados da empresa (Nome, CNPJ, Endereço, Logo).
- [ ] *Nota*: Inicialmente usaremos persistência local (mock) até atualização do backend.

### 3. Funções e Acesso (`/admin/funcoes`)
- [ ] Matriz de Permissões (Visualização).
- [ ] Exibição do que cada perfil (ADMIN, MANAGER, etc.) pode fazer.

### 4. Gestão de Usuários - Melhorias (`/admin/users`)
- [ ] Modal de Criação de Usuário.
- [ ] Modal de Edição de Usuário.
- [ ] Confirmação de Exclusão.
- [ ] Feedback visual (Toasts) para ações.

---

## 🛠️ Estrutura de Arquivos

```
client/src/
├── components/
│   ├── Modal/           # Novo componente Modal
│   └── Form/            # Componentes de formulário (Input, Select)
├── pages/
│   ├── Admin/
│   │   ├── Settings/    # Configurações da Empresa
│   │   └── Roles/       # Funções e Acesso
│   └── UsersPage/       # Atualização com Modais
```
