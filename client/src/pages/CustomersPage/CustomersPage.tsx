import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import type { Column } from '../../components/DataTable/DataTable';
import DataTable from '../../components/DataTable/DataTable';
import { Sheet } from '../../components/ui/Sheet/Sheet';
import { Switch } from '../../components/ui/Switch/Switch';
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog';
import { customerService } from '../../services/customerService';
import type { Customer, CustomerFilters } from '../../types';
import CustomerForm from './CustomerForm';
import CustomerDetail from './CustomerDetail';
import FilterBar from '../../components/FilterBar/FilterBar';

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<CustomerFilters>({
        page: 1,
        limit: 10,
        search: ''
    });
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Estados para Sheet e Dialogs
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [customerStatus, setCustomerStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

    const loadCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await customerService.list(filters);
            setCustomers(response.data || []);
            setTotalCustomers(response.pagination?.total || 0);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleRowClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewOpen(true);
    };

    const handleCreate = async (data: any) => {
        setFormLoading(true);
        try {
            await customerService.create(data);
            toast.success('Cliente criado com sucesso', {
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
            setIsCreateOpen(false);
            loadCustomers();
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            toast.error('Erro ao criar cliente. Verifique os dados.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (customer: Customer, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCustomer(customer);
        setCustomerStatus(customer.status);
        setIsEditOpen(true);
    };

    const handleUpdate = async (data: any) => {
        if (!selectedCustomer) return;
        setFormLoading(true);
        try {
            await customerService.update(selectedCustomer.id, data);
            toast.success('Cliente atualizado com sucesso', {
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
            setIsEditOpen(false);
            loadCustomers();
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            toast.error('Erro ao atualizar cliente.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (customer: Customer, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCustomer(customer);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCustomer) return;
        try {
            await customerService.delete(selectedCustomer.id);
            setIsDeleteOpen(false);
            loadCustomers();
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert('Erro ao excluir cliente.');
        }
    };

    const handleView = (customer: Customer, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCustomer(customer);
        setIsViewOpen(true);
    };

    const columns: Column<Customer>[] = [
        {
            key: 'name',
            header: 'CLIENTE',
            render: (customer) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-info-light text-info flex items-center justify-center font-semibold text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-text-primary leading-tight">{customer.name}</span>
                        <span className="text-xs text-text-secondary leading-tight">
                            {customer.type === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'STATUS',
            render: (customer) => (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${customer.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                    {customer.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'email',
            header: 'CONTATO',
            render: (customer) => (
                <div className="flex flex-col text-sm text-text-primary">
                    {customer.email && <div>{customer.email}</div>}
                    {customer.phone && <div className="text-xs text-text-secondary">{customer.phone}</div>}
                </div>
            )
        },
        {
            key: 'document',
            header: 'DOCUMENTO',
            render: (customer) => customer.document || '-'
        },
        {
            key: 'city',
            header: 'CIDADE/UF',
            render: (customer) => customer.city ? `${customer.city}/${customer.state || ''}` : '-'
        },
        {
            key: 'actions',
            header: 'AÇÕES',
            render: (customer) => (
                <div className="flex gap-2 justify-end">
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
                        title="Editar"
                        onClick={(e) => handleEdit(customer, e)}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
                        title="Visualizar"
                        onClick={(e) => handleView(customer, e)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-danger-light hover:text-danger"
                        title="Excluir"
                        onClick={(e) => handleDeleteClick(customer, e)}
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
                        <span>Comercial</span>
                        <span>/</span>
                        <span>Clientes</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary m-0">Gestão de Clientes</h1>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 min-h-[44px] sm:min-h-[40px] bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2" onClick={() => {
                    setCustomerStatus('ACTIVE');
                    setIsCreateOpen(true);
                }}>
                    <Plus size={20} />
                    <span className="hidden sm:inline">Adicionar Novo Cliente</span>
                    <span className="sm:hidden">Novo Cliente</span>
                </button>
            </div>

            <FilterBar
                onSearch={(term) => {
                    setFilters(prev => ({ ...prev, search: term, page: 1 }));
                }}
                onStatusFilter={(status) => {
                    setFilters(prev => ({ ...prev, status: status === 'all' ? undefined : status as 'ACTIVE' | 'INACTIVE', page: 1 }));
                }}
                statusOptions={[
                    { label: 'Todos', value: 'all' },
                    { label: 'Ativo', value: 'ACTIVE' },
                    { label: 'Inativo', value: 'INACTIVE' },
                ]}
                placeholder="Buscar por nome, documento ou email..."
            />

            <div className="flex-1 overflow-hidden rounded-lg bg-bg-primary">
                <DataTable
                    data={customers}
                    columns={columns}
                    isLoading={loading}
                    pagination={{
                        page: filters.page || 1,
                        totalPages: totalPages,
                        total: totalCustomers,
                        limit: filters.limit || 10,
                    }}
                    onPageChange={handlePageChange}
                    onRowClick={handleRowClick}
                />
            </div>

            {/* Sheet de Criação */}
            <Sheet
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Novo Cliente"
                size="lg"
                headerRight={
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-text-secondary">
                            Status: {customerStatus === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                        <Switch
                            checked={customerStatus === 'ACTIVE'}
                            onChange={(checked) => setCustomerStatus(checked ? 'ACTIVE' : 'INACTIVE')}
                        />
                    </div>
                }
            >
                <CustomerForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateOpen(false)}
                    loading={formLoading}
                    customerStatus={customerStatus}
                />
            </Sheet>

            {/* Sheet de Edição */}
            <Sheet
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Editar Cliente"
                size="lg"
                headerRight={
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-text-secondary">
                            Status: {customerStatus === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                        <Switch
                            checked={customerStatus === 'ACTIVE'}
                            onChange={(checked) => setCustomerStatus(checked ? 'ACTIVE' : 'INACTIVE')}
                        />
                    </div>
                }
            >
                <CustomerForm
                    initialData={selectedCustomer}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditOpen(false)}
                    loading={formLoading}
                    customerStatus={customerStatus}
                />
            </Sheet>

            {/* Sheet de Visualização */}
            <Sheet
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="Detalhes do Cliente"
                size="md"
            >
                {selectedCustomer && <CustomerDetail customer={selectedCustomer} />}
            </Sheet>

            {/* Dialog de Exclusão */}
            <AlertDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Cliente"
                description={`Tem certeza que deseja excluir o cliente "${selectedCustomer?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

export default CustomersPage;
