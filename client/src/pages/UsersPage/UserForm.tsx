import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield } from 'lucide-react';
import Select from 'react-select';
import type { User as UserType, Department } from '../../types/index';
import { Switch } from '../../components/ui/Switch/Switch';
import { departmentService } from '../../services/departmentService';


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
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto flex-1">
                <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium text-text-primary">Nome Completo</label>
                    <div className="relative flex items-center">
                        <User size={16} className="absolute left-3 text-text-tertiary pointer-events-none" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                            placeholder="Nome do usuário"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary">E-mail</label>
                    <div className="relative flex items-center">
                        <Mail size={16} className="absolute left-3 text-text-tertiary pointer-events-none" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                            placeholder="email@empresa.com"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary">Senha</label>
                    <div className="relative flex items-center">
                        <Lock size={16} className="absolute left-3 text-text-tertiary pointer-events-none" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                            placeholder={initialData ? "Deixe em branco para manter" : "Senha segura"}
                            required={!initialData}
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium text-text-primary">Função (Role)</label>
                    <div className="relative flex items-center">
                        <Shield size={16} className="absolute left-3 text-text-tertiary pointer-events-none z-10" />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none appearance-none cursor-pointer"
                        >
                            <option value="ADMIN">Administrador</option>
                            <option value="MANAGER">Gerente</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Visualizador</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium text-text-primary">Departamentos</label>
                    <Select
                        isMulti
                        name="departments"
                        options={departmentOptions}
                        value={selectedDepartments}
                        onChange={handleDepartmentChange}
                        classNamePrefix="react-select"
                        placeholder="Selecione..."
                        styles={customStyles}
                        noOptionsMessage={() => "Nenhum departamento encontrado"}
                    />
                </div>

                <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium text-text-primary">Status</label>
                    <div style={{ marginTop: '0.5rem' }}>
                        <Switch
                            checked={formData.status === 'ACTIVE'}
                            onChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'ACTIVE' : 'INACTIVE' }))}
                            label={formData.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-border bg-bg-primary mt-auto">
                <button
                    type="button"
                    className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border border-border text-text-primary hover:bg-bg-secondary"
                    onClick={onCancel}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-hover"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Usuário'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
