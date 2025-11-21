import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import type { Column } from '../../components/DataTable/DataTable';
import DataTable from '../../components/DataTable/DataTable';
import { Sheet } from '../../components/ui/Sheet/Sheet';
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog';
import { saleService } from '../../services/saleService';
import type { Sale, SaleFilters } from '../../types';
import SalesOrderForm from './SalesOrderForm';
import SaleDetail from './SaleDetail';
import FilterBar from '../../components/FilterBar/FilterBar';
import './SalesOrdersPage.css';

const SalesOrdersPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SaleFilters>({
    page: 1,
    limit: 10,
    search: ''
  });
  const [totalSales, setTotalSales] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog/Sheet states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadSales = useCallback(async () => {
    setLoading(true);
    try {
      const response = await saleService.list(filters);
      setSales(response.data || []);
      setTotalSales(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos de venda');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleRowClick = async (sale: Sale) => {
    try {
      const fullSale = await saleService.getById(sale.id);
      setSelectedSale(fullSale);
      setIsViewOpen(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      toast.error('Erro ao carregar detalhes do pedido');
    }
  };

  const handleCreate = async (data: any) => {
    setFormLoading(true);
    try {
      await saleService.create(data);
      toast.success('Pedido criado com sucesso!');
      setIsCreateOpen(false);
      loadSales();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao criar pedido');
    } finally {
      setFormLoading(false);
    }
  };


  const handleEdit = async (sale: Sale, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const fullSale = await saleService.getById(sale.id);
      setSelectedSale(fullSale);
      setIsEditOpen(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      toast.error('Erro ao carregar detalhes do pedido');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedSale) return;
    setFormLoading(true);
    try {
      await saleService.update(selectedSale.id, data);
      toast.success('Pedido atualizado com sucesso!');
      setIsEditOpen(false);
      loadSales();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      toast.error('Erro ao atualizar pedido');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (sale: Sale, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSale(sale);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSale) return;
    try {
      await saleService.delete(selectedSale.id);
      toast.success('Pedido excluído com sucesso!');
      setIsDeleteOpen(false);
      loadSales();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      toast.error('Erro ao excluir pedido');
    }
  };

  const handleView = async (sale: Sale, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const fullSale = await saleService.getById(sale.id);
      setSelectedSale(fullSale);
      setIsViewOpen(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      toast.error('Erro ao carregar detalhes do pedido');
    }
  };

  const columns: Column<Sale>[] = [
    {
      key: 'number',
      header: 'PEDIDO',
      render: (sale) => (
        <span className="font-medium">#{sale.number}</span>
      )
    },
    {
      key: 'customer',
      header: 'CLIENTE',
      render: (sale) => (
        <div className="customer-cell">
          <span>{sale.customer.name}</span>
        </div>
      )
    },
    {
      key: 'date',
      header: 'DATA',
      render: (sale) => new Date(sale.date).toLocaleDateString('pt-BR')
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (sale) => (
        <span className={`status-badge ${sale.status.toLowerCase()}`}>
          {sale.status === 'PENDING' ? 'Pendente' : sale.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}
        </span>
      )
    },
    {
      key: 'total',
      header: 'TOTAL',
      render: (sale) => `R$ ${Number(sale.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    {
      key: 'actions',
      header: 'AÇÕES',
      render: (sale) => (
        <div className="actions-cell">
          {sale.status === 'CONFIRMED' ? (
            <button
              className="icon-btn"
              title="Estornar Venda"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Deseja realmente estornar esta venda? O estoque será devolvido.')) {
                  handleUpdate({ ...sale, status: 'CANCELLED' });
                }
              }}
            >
              <Trash2 size={16} style={{ color: 'orange' }} />
            </button>
          ) : (
            <>
              <button
                className="icon-btn"
                title="Editar"
                onClick={(e) => handleEdit(sale, e)}
                disabled={sale.status === 'CANCELLED'}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="icon-btn delete-btn"
                title="Excluir"
                onClick={(e) => handleDeleteClick(sale, e)}
                disabled={sale.status === 'CANCELLED'}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          <button
            className="icon-btn"
            title="Visualizar"
            onClick={(e) => handleView(sale, e)}
          >
            <Eye size={16} />
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
            <span>Vendas</span>
          </div>
          <h1>Gestão de Pedidos de Venda</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={20} />
          Novo Pedido
        </button>
      </div>

      <FilterBar
        onSearch={(term) => {
          setFilters(prev => ({ ...prev, search: term, page: 1 }));
        }}
        onStatusFilter={(status) => {
          setFilters(prev => ({ ...prev, status: status === 'all' ? undefined : status as any, page: 1 }));
        }}
        onDateFilter={(range) => {
          const today = new Date();
          let startDate: string | undefined;
          let endDate: string | undefined;

          if (range.startsWith('custom_start:')) {
            const date = range.split(':')[1];
            setFilters(prev => ({ ...prev, startDate: date, page: 1 }));
            return;
          }
          if (range.startsWith('custom_end:')) {
            const date = range.split(':')[1];
            setFilters(prev => ({ ...prev, endDate: date, page: 1 }));
            return;
          }

          switch (range) {
            case 'today':
              startDate = today.toISOString().split('T')[0];
              endDate = startDate;
              break;
            case 'yesterday':
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              startDate = yesterday.toISOString().split('T')[0];
              endDate = startDate;
              break;
            case 'thisMonth':
              startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
              endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
              break;
            case 'lastMonth':
              startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
              endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
              break;
            case 'custom':
              // Just switch mode, don't filter yet
              return;
            default:
              startDate = undefined;
              endDate = undefined;
          }
          setFilters(prev => ({ ...prev, startDate, endDate, page: 1 }));
        }}
        statusOptions={[
          { label: 'Todos', value: 'all' },
          { label: 'Pendente', value: 'PENDING' },
          { label: 'Confirmado', value: 'CONFIRMED' },
          { label: 'Cancelado', value: 'CANCELLED' },
        ]}
        placeholder="Buscar por número ou cliente..."
      />

      <div className="table-container">
        <DataTable
          data={sales}
          columns={columns}
          isLoading={loading}
          pagination={{
            page: filters.page || 1,
            totalPages: totalPages,
            total: totalSales,
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
        title="Novo Pedido de Venda"
        size="lg"
      >
        <SalesOrderForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          loading={formLoading}
        />
      </Sheet>

      {/* Sheet de Edição */}
      <Sheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Editar Pedido #${selectedSale?.number}`}
        size="lg"
      >
        <SalesOrderForm
          initialData={selectedSale}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditOpen(false)}
          loading={formLoading}
        />
      </Sheet>

      {/* Sheet de Visualização */}
      <Sheet
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detalhes do Pedido"
        size="lg"
      >
        {selectedSale && <SaleDetail sale={selectedSale} />}
      </Sheet>

      {/* Dialog de Exclusão */}
      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Pedido"
        description={`Tem certeza que deseja excluir o pedido #${selectedSale?.number}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default SalesOrdersPage;