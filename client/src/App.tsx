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
import CompanySettings from './pages/Admin/Settings/CompanySettings';
import RolesPage from './pages/Admin/Roles/RolesPage';

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
                <Route path="admin/configuracoes" element={<CompanySettings />} />
                <Route path="admin/funcoes" element={<RolesPage />} />

                {/* Placeholder para outras rotas */}
                <Route path="financeiro/*" element={<div className="card">Módulo Financeiro em desenvolvimento</div>} />
                <Route path="estoque/*" element={<div className="card">Módulo Estoque em desenvolvimento</div>} />
                <Route path="comercial/clientes" element={<CustomersPage />} />
                <Route path="comercial/*" element={<div className="card">Módulo Comercial em desenvolvimento</div>} />
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
