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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-info-light text-info flex items-center justify-center font-semibold text-sm">
                        {supplier.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-text-primary leading-tight">{supplier.name}</span>
                        <span className="text-xs text-text-secondary leading-tight">
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
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${supplier.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                    {supplier.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'email',
            header: 'CONTATO',
            render: (supplier) => (
                <div className="flex flex-col text-sm text-text-primary">
                    {supplier.email && <div>{supplier.email}</div>}
                    {supplier.phone && <div className="text-xs text-text-secondary">{supplier.phone}</div>}
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
                <div className="flex gap-2 justify-end">
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
                        title="Editar"
                        onClick={(e) => handleEdit(supplier, e)}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
                        title="Visualizar"
                        onClick={(e) => handleView(supplier, e)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-danger-light hover:text-danger"
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
        <div className="p-6 h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <span>Estoque</span>
                        <span>/</span>
                        <span>Fornecedores</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary m-0">Gestão de Fornecedores</h1>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 min-h-[44px] sm:min-h-[40px] bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2" onClick={() => {
                    setSupplierStatus('ACTIVE');
                    setIsCreateOpen(true);
                }}>
                    <Plus size={20} />
                    <span className="hidden sm:inline">Adicionar Novo Fornecedor</span>
                    <span className="sm:hidden">Novo Fornecedor</span>
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
