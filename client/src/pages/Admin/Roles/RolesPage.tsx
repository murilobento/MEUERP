import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import './RolesPage.css';

interface Permission {
    module: string;
    action: string;
    admin: boolean;
    manager: boolean;
    editor: boolean;
    viewer: boolean;
}

const RolesPage: React.FC = () => {
    const permissions: Permission[] = [
        // Administrativo
        { module: 'Administrativo', action: 'Gerenciar Usuários', admin: true, manager: false, editor: false, viewer: false },
        { module: 'Administrativo', action: 'Configurações da Empresa', admin: true, manager: false, editor: false, viewer: false },

        // Financeiro
        { module: 'Financeiro', action: 'Visualizar Relatórios', admin: true, manager: true, editor: false, viewer: false },
        { module: 'Financeiro', action: 'Gerenciar Contas', admin: true, manager: true, editor: false, viewer: false },

        // Estoque
        { module: 'Estoque', action: 'Visualizar Produtos', admin: true, manager: true, editor: true, viewer: true },
        { module: 'Estoque', action: 'Movimentar Estoque', admin: true, manager: true, editor: true, viewer: false },
        { module: 'Estoque', action: 'Cadastrar Produtos', admin: true, manager: true, editor: true, viewer: false },

        // Comercial
        { module: 'Comercial', action: 'Visualizar Vendas', admin: true, manager: true, editor: true, viewer: true },
        { module: 'Comercial', action: 'Realizar Vendas', admin: true, manager: true, editor: true, viewer: false },
        { module: 'Comercial', action: 'Gerenciar Clientes', admin: true, manager: true, editor: true, viewer: false },
    ];

    const roles = [
        { key: 'admin', label: 'Administrador', color: 'primary' },
        { key: 'manager', label: 'Gerente', color: 'info' },
        { key: 'editor', label: 'Editor', color: 'warning' },
        { key: 'viewer', label: 'Visualizador', color: 'secondary' },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div className="breadcrumb">
                        <span>Administrativo</span>
                        <span>/</span>
                        <span>Funções e Acesso</span>
                    </div>
                    <h1>Controle de Acesso</h1>
                </div>
            </div>

            <div className="card">
                <div className="roles-header">
                    <Shield size={24} className="text-primary" />
                    <div>
                        <h2>Matriz de Permissões</h2>
                        <p>Visualize o que cada perfil de usuário pode acessar no sistema.</p>
                    </div>
                </div>

                <div className="table-container">
                    <table className="roles-table">
                        <thead>
                            <tr>
                                <th>Módulo / Ação</th>
                                {roles.map(role => (
                                    <th key={role.key} className="text-center">
                                        <span className={`badge badge-${role.color}`}>
                                            {role.label}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="permission-name">
                                            <span className="module-tag">{perm.module}</span>
                                            <span>{perm.action}</span>
                                        </div>
                                    </td>
                                    {roles.map(role => (
                                        <td key={role.key} className="text-center">
                                            {(perm as any)[role.key] ? (
                                                <Check size={20} className="text-success icon-center" />
                                            ) : (
                                                <X size={20} className="text-danger icon-center" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RolesPage;
