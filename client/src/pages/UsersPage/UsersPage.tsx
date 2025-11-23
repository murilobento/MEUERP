
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService, type UserFilters } from '../../services/userService';
import type { User } from '../../types/index';
import FilterBar from '../../components/FilterBar/FilterBar';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import UserForm from './UserForm';

import { Sheet } from '../../components/ui/Sheet/Sheet';
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog';
import UserDetail from './UserDetail';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const filters: UserFilters = {
                page,
                limit: 5,
            };

            if (search) filters.search = search;
            if (statusFilter !== 'all') filters.status = statusFilter;

            const response = await userService.getAll(filters);
            setUsers(response.data);
            setPagination({
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.totalPages
            });
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            toast.error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page, search, statusFilter]);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user: User, e: React.MouseEvent) => {
        e.stopPropagation();
        setUserToDelete(user);
        setIsDeleteAlertOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await userService.delete(id);
            toast.success('Usuário excluído com sucesso', {
                style: {
                    background: '#10B981',
                    color: '#fff',
                    fontWeight: 'bold',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#10B981',
                },
            });
            setIsDeleteAlertOpen(false);
            loadUsers();
        } catch (error) {
            toast.error('Erro ao excluir usuário');
        }
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            await handleDelete(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const handleView = (user: User, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedUser(user);
        setIsViewOpen(true);
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedUser) {
                await userService.update(selectedUser.id, data);
                toast.success('Usuário atualizado com sucesso', {
                    style: {
                        background: '#10B981',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10B981',
                    },
                });
            } else {
                await userService.create(data);
                toast.success('Usuário criado com sucesso', {
                    style: {
                        background: '#10B981',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10B981',
                    },
                });
            }
            setIsModalOpen(false);
            loadUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao salvar usuário');
        } finally {
            setIsSubmitting(false);
        }
    };



    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-primary-light text-primary';
            case 'MANAGER': return 'bg-info-light text-info';
            case 'EDITOR': return 'bg-warning-light text-warning';
            default: return 'bg-bg-tertiary text-text-secondary';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'Administrador';
            case 'MANAGER': return 'Gerente';
            case 'EDITOR': return 'Editor';
            default: return 'Visualizador';
        }
    };

    const columns: Column<User>[] = [
        {
            key: 'name',
            header: 'USUÁRIO',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-text-primary leading-tight">{user.name}</span>
                        <span className="text-sm text-text-secondary leading-tight">{user.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'STATUS',
            render: (user) => (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${user.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                    {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'role',
            header: 'NÍVEL DE PERMISSÃO',
            render: (user) => (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                    {getRoleLabel(user.role)}
                </span>
            )
        },
        {
            key: 'department',
            header: 'DEPARTAMENTOS',
            render: (user) => {
                if (!user.departments || user.departments.length === 0) return '-';
                if (user.departments.length === 1) return user.departments[0].name;
                return (
                    <span title={user.departments.map(d => d.name).join(', ')}>
                        {user.departments[0].name} +{user.departments.length - 1}
                    </span>
                );
            }
        },
        {
            key: 'lastLogin',
            header: 'ÚLTIMA ATIVIDADE',
            render: (user) => user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'
        },
        {
            key: 'actions',
            header: 'AÇÕES',
            render: (user) => (
                <div className="flex gap-2 justify-end">
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
                        title="Editar"
                        onClick={(e) => handleEdit(user, e)}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
                        title="Visualizar"
                        onClick={(e) => handleView(user, e)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-danger-light hover:text-danger"
                        title="Excluir"
                        onClick={(e) => handleDeleteClick(user, e)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            width: '120px'
        }
    ];

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <span>Administrativo</span>
                        <span>/</span>
                        <span>Usuários</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary m-0">Gestão de Usuários</h1>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 min-h-[44px] sm:min-h-[40px] bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2" onClick={handleCreate}>
                    <Plus size={18} />
                    <span className="hidden sm:inline">Adicionar Novo Usuário</span>
                    <span className="sm:hidden">Novo Usuário</span>
                </button>
            </div>

            <FilterBar
                onSearch={(term) => {
                    setSearch(term);
                    setPage(1);
                }}
                onStatusFilter={(status) => {
                    setStatusFilter(status);
                    setPage(1);
                }}
                statusOptions={[
                    { label: 'Todos', value: 'all' },
                    { label: 'Ativo', value: 'ACTIVE' },
                    { label: 'Inativo', value: 'INACTIVE' },
                ]}
                placeholder="Buscar por nome, e-mail..."
            />

            <div className="flex-1 overflow-hidden rounded-lg bg-bg-primary">
                <DataTable
                    columns={columns}
                    data={users}
                    pagination={pagination}
                    onPageChange={setPage}
                    isLoading={loading}
                    emptyMessage="Nenhum usuário encontrado."
                    onRowClick={handleView}
                />
            </div>

            {/* Sheet para Create/Edit */}
            <Sheet
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
                size="md"
            >
                <UserForm
                    initialData={selectedUser}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    loading={isSubmitting}
                />
            </Sheet>

            {/* Sheet para View */}
            <Sheet
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="Detalhes do Usuário"
                size="md"
            >
                {selectedUser && <UserDetail user={selectedUser} />}
            </Sheet>

            {/* AlertDialog para Delete */}
            <AlertDialog
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Usuário"
                description={`Tem certeza que deseja excluir o usuário ${userToDelete?.name}? Esta ação não pode ser desfeita.`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

export default UsersPage;
