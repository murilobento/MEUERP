import React from 'react';
import { Shield, Check, X } from 'lucide-react';


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
        <div className="p-6 h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <span>Administrativo</span>
                        <span>/</span>
                        <span>Funções e Acesso</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary m-0">Controle de Acesso</h1>
                </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-lg border border-border bg-bg-primary flex flex-col">
                <div className="flex items-center gap-4 p-6 border-b border-border">
                    <Shield size={24} className="text-primary" />
                    <div>
                        <h2 className="m-0 text-lg font-semibold text-text-primary">Matriz de Permissões</h2>
                        <p className="mt-1 text-sm text-text-secondary">Visualize o que cada perfil de usuário pode acessar no sistema.</p>
                    </div>
                </div>

                <div className="overflow-auto flex-1">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 border-b border-border bg-bg-tertiary font-semibold text-text-secondary text-left sticky top-0 z-10">Módulo / Ação</th>
                                {roles.map(role => (
                                    <th key={role.key} className="p-4 border-b border-border bg-bg-tertiary font-semibold text-text-secondary text-center sticky top-0 z-10">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${role.color}-light text-${role.color}`}>
                                            {role.label}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm, index) => (
                                <tr key={index} className="hover:bg-bg-tertiary transition-colors">
                                    <td className="p-4 border-b border-border">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">{perm.module}</span>
                                            <span className="text-text-primary">{perm.action}</span>
                                        </div>
                                    </td>
                                    {roles.map(role => (
                                        <td key={role.key} className="p-4 border-b border-border text-center">
                                            {(perm as any)[role.key] ? (
                                                <Check size={20} className="text-success mx-auto block" />
                                            ) : (
                                                <X size={20} className="text-danger mx-auto block" />
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
