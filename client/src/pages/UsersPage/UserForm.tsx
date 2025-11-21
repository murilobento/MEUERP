import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield } from 'lucide-react';
import Select from 'react-select';
import type { User as UserType, Department } from '../../types/index';
import { Switch } from '../../components/ui/Switch/Switch';
import { departmentService } from '../../services/departmentService';
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
    const [departments, setDepartments] = useState<Department[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VIEWER',
        departmentIds: [] as string[],
        status: 'ACTIVE',
    });

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const data = await departmentService.getAll();
                setDepartments(data);
            } catch (error) {
                console.error('Erro ao carregar departamentos:', error);
            }
        };
        loadDepartments();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                password: '',
                role: initialData.role,
                departmentIds: initialData.departments?.map(d => d.id.toString()) || [],
                status: initialData.status,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDepartmentChange = (selectedOptions: any) => {
        const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setFormData(prev => ({ ...prev, departmentIds: selectedIds }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit: any = {
            ...formData,
            departmentIds: formData.departmentIds.map(Number)
        };

        if (!dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        onSubmit(dataToSubmit);
    };

    const departmentOptions = departments.map(dept => ({
        value: dept.id.toString(),
        label: dept.name
    }));

    const selectedDepartments = departmentOptions.filter(option =>
        formData.departmentIds.includes(option.value)
    );

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            minHeight: '42px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'var(--primary-color)'
            }
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            zIndex: 50
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'var(--primary-color)'
                : state.isFocused
                    ? 'var(--bg-tertiary)'
                    : 'transparent',
            color: state.isSelected ? '#fff' : 'var(--text-primary)',
            cursor: 'pointer',
            ':active': {
                backgroundColor: 'var(--primary-color)'
            }
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: 'var(--bg-tertiary)',
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: 'var(--text-primary)',
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: 'var(--text-secondary)',
            ':hover': {
                backgroundColor: 'var(--danger-color)',
                color: 'white',
            },
        }),
        input: (provided: any) => ({
            ...provided,
            color: 'var(--text-primary)',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'var(--text-primary)',
        }),
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
                    <label>Departamentos</label>
                    <Select
                        isMulti
                        name="departments"
                        options={departmentOptions}
                        value={selectedDepartments}
                        onChange={handleDepartmentChange}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Selecione..."
                        styles={customStyles}
                        noOptionsMessage={() => "Nenhum departamento encontrado"}
                    />
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
