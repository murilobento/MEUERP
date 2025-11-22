import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import UsersPage from './pages/UsersPage/UsersPage';
import CustomersPage from './pages/CustomersPage/CustomersPage';
import SalesOrdersPage from './pages/SalesOrdersPage/SalesOrdersPage';
import SuppliersPage from './pages/SuppliersPage/SuppliersPage';
import CompanySettings from './pages/Admin/Settings/CompanySettings';
import RolesPage from './pages/Admin/Roles/RolesPage';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import { KanbanPage } from './pages/KanbanPage/KanbanPage';
import InventoryPage from './pages/InventoryPage/InventoryPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AuthProvider>
        <LayoutProvider>
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas protegidas */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/users" replace />} />
                {/* ... */}

                <Route path="admin/users" element={<UsersPage />} />
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/configuracoes" element={<CompanySettings />} />
                <Route path="admin/funcoes" element={<RolesPage />} />

                {/* Placeholder para outras rotas */}
                <Route path="financeiro/*" element={<div className="card">Módulo Financeiro em desenvolvimento</div>} />
                <Route path="estoque/dashboard" element={<div className="card">Dashboard de Estoque em desenvolvimento</div>} />
                <Route path="estoque/inventario" element={<InventoryPage />} />
                <Route path="estoque/fornecedores" element={<SuppliersPage />} />
                <Route path="estoque/*" element={<Navigate to="/estoque/dashboard" replace />} />
                <Route path="comercial/clientes" element={<CustomersPage />} />
                <Route path="comercial/vendas" element={<SalesOrdersPage />} />
                <Route path="comercial/*" element={<div className="card">Módulo Comercial em desenvolvimento</div>} />
                <Route path="kanban" element={<KanbanPage />} />
                <Route path="configuracoes" element={<div className="card">Configurações em desenvolvimento</div>} />
                <Route path="ajuda" element={<div className="card">Ajuda em desenvolvimento</div>} />
              </Route>

              {/* Rota 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
