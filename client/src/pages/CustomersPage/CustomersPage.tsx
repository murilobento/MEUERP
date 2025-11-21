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
import './CustomersPage.css';

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
                <div className="customer-cell">
                    <div className="customer-avatar">
                        {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-info">
                        <span className="customer-name">{customer.name}</span>
                        <span className="customer-type">
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
                <span className={`status-badge ${customer.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                    {customer.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'email',
            header: 'CONTATO',
            render: (customer) => (
                <div className="contact-info">
                    {customer.email && <div>{customer.email}</div>}
                    {customer.phone && <div className="phone-text">{customer.phone}</div>}
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
                <div className="actions-cell">
                    <button
                        className="icon-btn"
                        title="Editar"
                        onClick={(e) => handleEdit(customer, e)}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="icon-btn"
                        title="Visualizar"
                        onClick={(e) => handleView(customer, e)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="icon-btn delete-btn"
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
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div className="breadcrumb">
                        <span>Comercial</span>
                        <span>/</span>
                        <span>Clientes</span>
                    </div>
                    <h1>Gestão de Clientes</h1>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setCustomerStatus('ACTIVE');
                    setIsCreateOpen(true);
                }}>
                    <Plus size={20} />
                    Adicionar Novo Cliente
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

            <div className="table-container">
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
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
