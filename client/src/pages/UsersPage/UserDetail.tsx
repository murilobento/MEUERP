import React from 'react';
import { Mail, Shield, Calendar, Building, Phone } from 'lucide-react';
import type { User as UserType } from '../../types/index';
import './UserDetail.css';

interface UserDetailProps {
    user: UserType;
}

const UserDetail: React.FC<UserDetailProps> = ({ user }) => {
    return (
        <div className="user-detail">
            <div className="user-header-profile">
                <div className="user-avatar-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info-main">
                    <h2>{user.name}</h2>
                    <span className={`badge badge-${user.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                        {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
            </div>

            <div className="detail-section">
                <h3>Informações Pessoais</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <Mail size={18} className="text-secondary" />
                        <div>
                            <label>E-mail</label>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Phone size={18} className="text-secondary" />
                        <div>
                            <label>Telefone</label>
                            <p>{(user as any).phone || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>Acesso e Permissões</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <Shield size={18} className="text-secondary" />
                        <div>
                            <label>Função</label>
                            <p>{user.role}</p>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Building size={18} className="text-secondary" />
                        <div>
                            <label>Departamento</label>
                            <p>{user.department?.name || 'Não atribuído'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>Metadados</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <Calendar size={18} className="text-secondary" />
                        <div>
                            <label>Data de Cadastro</label>
                            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {user.lastLogin && (
                        <div className="detail-item">
                            <Calendar size={18} className="text-secondary" />
                            <div>
                                <label>Último Login</label>
                                <p>{new Date(user.lastLogin).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
