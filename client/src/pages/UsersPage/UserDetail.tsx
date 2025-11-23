import React from 'react';
import { Mail, Shield, Calendar, Building, Phone } from 'lucide-react';
import type { User as UserType } from '../../types/index';


interface UserDetailProps {
    user: UserType;
}

const UserDetail: React.FC<UserDetailProps> = ({ user }) => {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-text-primary m-0">{user.name}</h2>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                        {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Informações Pessoais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
                        <Mail size={18} className="text-text-tertiary mt-0.5" />
                        <div>
                            <label className="block text-xs text-text-secondary mb-0.5">E-mail</label>
                            <p className="text-sm font-medium text-text-primary m-0">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
                        <Phone size={18} className="text-text-tertiary mt-0.5" />
                        <div>
                            <label className="block text-xs text-text-secondary mb-0.5">Telefone</label>
                            <p className="text-sm font-medium text-text-primary m-0">{(user as any).phone || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Acesso e Permissões</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
                        <Shield size={18} className="text-text-tertiary mt-0.5" />
                        <div>
                            <label className="block text-xs text-text-secondary mb-0.5">Função</label>
                            <p className="text-sm font-medium text-text-primary m-0">{user.role}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
                        <Building size={18} className="text-text-tertiary mt-0.5" />
                        <div>
                            <label className="block text-xs text-text-secondary mb-0.5">Departamentos</label>
                            <p className="text-sm font-medium text-text-primary m-0">
                                {user.departments && user.departments.length > 0
                                    ? user.departments.map(d => d.name).join(', ')
                                    : 'Não atribuído'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Metadados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
                        <Calendar size={18} className="text-text-tertiary mt-0.5" />
                        <div>
                            <label className="block text-xs text-text-secondary mb-0.5">Data de Cadastro</label>
                            <p className="text-sm font-medium text-text-primary m-0">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {user.lastLogin && (
                        <div className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border">
                            <Calendar size={18} className="text-text-tertiary mt-0.5" />
                            <div>
                                <label className="block text-xs text-text-secondary mb-0.5">Último Login</label>
                                <p className="text-sm font-medium text-text-primary m-0">{new Date(user.lastLogin).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
