import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield } from 'lucide-react';
import type { User as UserType } from '../../types/index';
import { Switch } from '../../components/ui/Switch/Switch';
import './UserForm.css';

interface UserFormProps {
    initialData?: UserType | null;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VIEWER',
        departmentId: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                password: '',
                role: initialData.role,
                departmentId: initialData.department?.id?.toString() || '',
                status: initialData.status,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            departmentId: formData.departmentId ? Number(formData.departmentId) : undefined
        };
        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="form-grid">
                <div className="form-group span-2">
                    <label>Nome Completo</label>
                    <div className="input-icon-wrapper">
                        <User size={16} />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="Nome do usuário"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>E-mail</label>
                    <div className="input-icon-wrapper">
                        <Mail size={16} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="email@empresa.com"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Senha</label>
                    <div className="input-icon-wrapper">
                        <Lock size={16} />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder={initialData ? "Deixe em branco para manter" : "Senha segura"}
                            required={!initialData}
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="form-group span-2">
                    <label>Função (Role)</label>
                    <div className="input-icon-wrapper">
                        <Shield size={16} />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="ADMIN">Administrador</option>
                            <option value="MANAGER">Gerente</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Visualizador</option>
                        </select>
                    </div>
                </div>

                <div className="form-group span-2">
                    <label>Status</label>
                    <div style={{ marginTop: '0.5rem' }}>
                        <Switch
                            checked={formData.status === 'ACTIVE'}
                            onChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'ACTIVE' : 'INACTIVE' }))}
                            label={formData.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        />
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Usuário'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
