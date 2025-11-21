import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import type { Column } from '../../components/DataTable/DataTable';
import DataTable from '../../components/DataTable/DataTable';
import { Sheet } from '../../components/ui/Sheet/Sheet';
import { Switch } from '../../components/ui/Switch/Switch';
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog';
import { supplierService } from '../../services/supplierService';
import type { Supplier, SupplierFilters } from '../../types';
import SupplierForm from './SupplierForm';
import SupplierDetail from './SupplierDetail';
import FilterBar from '../../components/FilterBar/FilterBar';
import './SuppliersPage.css';

const SuppliersPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<SupplierFilters>({
        page: 1,
        limit: 10,
        search: ''
    });
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Estados para Sheet e Dialogs
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [supplierStatus, setSupplierStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

    const loadSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await supplierService.list(filters);
            setSuppliers(response.data || []);
            setTotalSuppliers(response.pagination?.total || 0);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Erro ao carregar fornecedores:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadSuppliers();
    }, [loadSuppliers]);



    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleRowClick = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsViewOpen(true);
    };

    const handleCreate = async (data: any) => {
        setFormLoading(true);
        try {
            await supplierService.create(data);
            toast.success('Fornecedor criado com sucesso', {
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
            loadSuppliers();
        } catch (error) {
            console.error('Erro ao criar fornecedor:', error);
            toast.error('Erro ao criar fornecedor. Verifique os dados.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (supplier: Supplier, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSupplier(supplier);
        setSupplierStatus(supplier.status);
        setIsEditOpen(true);
    };

    const handleUpdate = async (data: any) => {
        if (!selectedSupplier) return;
        setFormLoading(true);
        try {
            await supplierService.update(selectedSupplier.id, data);
            toast.success('Fornecedor atualizado com sucesso', {
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
            loadSuppliers();
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error);
            toast.error('Erro ao atualizar fornecedor.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (supplier: Supplier, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSupplier(supplier);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSupplier) return;
        try {
            await supplierService.delete(selectedSupplier.id);
            setIsDeleteOpen(false);
            loadSuppliers();
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error);
            alert('Erro ao excluir fornecedor.');
        }
    };

    const handleView = (supplier: Supplier, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSupplier(supplier);
        setIsViewOpen(true);
    };

    const columns: Column<Supplier>[] = [
        {
            key: 'name',
            header: 'FORNECEDOR',
            render: (supplier) => (
                <div className="supplier-cell">
                    <div className="supplier-avatar">
                        {supplier.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="supplier-info">
                        <span className="supplier-name">{supplier.name}</span>
                        <span className="supplier-type">
                            {supplier.type === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'STATUS',
            render: (supplier) => (
                <span className={`status-badge ${supplier.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                    {supplier.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'email',
            header: 'CONTATO',
            render: (supplier) => (
                <div className="contact-info">
                    {supplier.email && <div>{supplier.email}</div>}
                    {supplier.phone && <div className="phone-text">{supplier.phone}</div>}
                </div>
            )
        },
        {
            key: 'document',
            header: 'DOCUMENTO',
            render: (supplier) => supplier.document || '-'
        },
        {
            key: 'city',
            header: 'CIDADE/UF',
            render: (supplier) => supplier.city ? `${supplier.city}/${supplier.state || ''}` : '-'
        },
        {
            key: 'actions',
            header: 'AÇÕES',
            render: (supplier) => (
                <div className="actions-cell">
                    <button
                        className="icon-btn"
                        title="Editar"
                        onClick={(e) => handleEdit(supplier, e)}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="icon-btn"
                        title="Visualizar"
                        onClick={(e) => handleView(supplier, e)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="icon-btn delete-btn"
                        title="Excluir"
                        onClick={(e) => handleDeleteClick(supplier, e)}
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
                        <span>Estoque</span>
                        <span>/</span>
                        <span>Fornecedores</span>
                    </div>
                    <h1>Gestão de Fornecedores</h1>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setSupplierStatus('ACTIVE');
                    setIsCreateOpen(true);
                }}>
                    <Plus size={20} />
                    Adicionar Novo Fornecedor
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
                    data={suppliers}
                    columns={columns}
                    isLoading={loading}
                    pagination={{
                        page: filters.page || 1,
                        totalPages: totalPages,
                        total: totalSuppliers,
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
                title="Novo Fornecedor"
                size="lg"
                headerRight={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Status: {supplierStatus === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                        <Switch
                            checked={supplierStatus === 'ACTIVE'}
                            onChange={(checked) => setSupplierStatus(checked ? 'ACTIVE' : 'INACTIVE')}
                        />
                    </div>
                }
            >
                <SupplierForm
                    onSubmit={handleCreate}
                    onCancel={() => setIsCreateOpen(false)}
                    loading={formLoading}
                    supplierStatus={supplierStatus}
                />
            </Sheet>

            {/* Sheet de Edição */}
            <Sheet
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Editar Fornecedor"
                size="lg"
                headerRight={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Status: {supplierStatus === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                        <Switch
                            checked={supplierStatus === 'ACTIVE'}
                            onChange={(checked) => setSupplierStatus(checked ? 'ACTIVE' : 'INACTIVE')}
                        />
                    </div>
                }
            >
                <SupplierForm
                    initialData={selectedSupplier}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditOpen(false)}
                    loading={formLoading}
                    supplierStatus={supplierStatus}
                />
            </Sheet>

            {/* Sheet de Visualização */}
            <Sheet
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="Detalhes do Fornecedor"
                size="md"
            >
                {selectedSupplier && <SupplierDetail supplier={selectedSupplier} />}
            </Sheet>

            {/* Dialog de Exclusão */}
            <AlertDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Fornecedor"
                description={`Tem certeza que deseja excluir o fornecedor "${selectedSupplier?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

export default SuppliersPage;
