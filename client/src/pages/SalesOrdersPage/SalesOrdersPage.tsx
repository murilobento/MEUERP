import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, RefreshCw, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Column } from '../../components/DataTable/DataTable';
import DataTable from '../../components/DataTable/DataTable';
import { Sheet } from '../../components/ui/Sheet/Sheet';
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog';
import { saleService } from '../../services/saleService';
import type { Sale, SaleFilters } from '../../types';
import SalesOrderForm from './SalesOrderForm';
import SaleDetail from './SaleDetail';
import FilterBar from '../../components/FilterBar/FilterBar';

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
  const [isReversalOpen, setIsReversalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleToReverse, setSaleToReverse] = useState<Sale | null>(null);
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
      toast.success('Pedido criado com sucesso!', {
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
      loadSales();
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao criar pedido';
      toast.error(errorMessage);
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
      toast.success('Pedido atualizado com sucesso!', {
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
      loadSales();
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar pedido';
      toast.error(errorMessage);
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
      toast.success('Pedido excluído com sucesso!', {
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
      setIsDeleteOpen(false);
      loadSales();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      toast.error('Erro ao excluir pedido');
    }
  };

  const handleReversalClick = (sale: Sale, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaleToReverse(sale);
    setIsReversalOpen(true);
  };

  const handleConfirmReversal = async () => {
    if (!saleToReverse) return;
    try {
      // Assuming reversal is done by updating status to CANCELLED
      // If there is a specific endpoint for reversal, it should be used here.
      // Based on previous code: handleUpdate({ ...sale, status: 'CANCELLED' });
      // But handleUpdate uses selectedSale, so we call service directly or reuse logic.

      // Using service directly to avoid dependency on selectedSale state for this action
      await saleService.update(saleToReverse.id, { status: 'PENDING' });

      toast.success('Venda estornada com sucesso!', {
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
      setIsReversalOpen(false);
      loadSales();
    } catch (error) {
      console.error('Erro ao estornar venda:', error);
      toast.error('Erro ao estornar venda');
    }
  };

  const handleExportPDF = async () => {
    try {
      const loadingToast = toast.loading('Gerando PDF...');

      // Buscar todas as vendas com os filtros atuais
      const response = await saleService.list({
        ...filters,
        limit: 10000 // Buscar todas (ou um limite alto suficiente)
      });

      const salesToExport = response.data || [];

      if (salesToExport.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('Nenhuma venda encontrada para exportar.');
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text('Relatório de Vendas', 14, 20);

      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 28);

      const tableData = salesToExport.map(sale => [
        `#${sale.number}`,
        sale.customer.name,
        new Date(sale.date).toLocaleDateString('pt-BR'),
        sale.status === 'PENDING' ? 'Pendente' : sale.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado',
        `R$ ${Number(sale.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ]);

      autoTable(doc, {
        startY: 35,
        head: [['Pedido', 'Cliente', 'Data', 'Status', 'Total']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [63, 81, 181] }, // Cor primária aproximada
      });

      doc.save('vendas_export.pdf');

      toast.dismiss(loadingToast);
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao gerar PDF');
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
        <div className="flex items-center gap-3">
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
        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${sale.status === 'PENDING' ? 'bg-warning-light text-warning' :
          sale.status === 'CONFIRMED' ? 'bg-success-light text-success' :
            'bg-danger-light text-danger'
          }`}>
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
        <div className="flex gap-2 justify-end">
          {sale.status === 'CONFIRMED' || sale.status === 'CANCELLED' ? (
            <button
              className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
              title="Estornar Venda"
              onClick={(e) => handleReversalClick(sale, e)}
            >
              <RefreshCw size={16} style={{ color: 'orange' }} />
            </button>
          ) : (
            <>
              <button
                className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
                title="Editar"
                onClick={(e) => handleEdit(sale, e)}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-danger-light hover:text-danger"
                title="Excluir"
                onClick={(e) => handleDeleteClick(sale, e)}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          <button
            className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary"
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
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
            <span>Módulo</span>
            <span>/</span>
            <span>Vendas</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary m-0">Pedidos de Venda</h1>
          <p className="text-sm text-text-secondary mt-1">Gerencie pedidos, vendas e faturamento.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] sm:min-h-[40px] bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors flex items-center justify-center gap-2" onClick={handleExportPDF}>
            <Download size={18} />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] sm:min-h-[40px] bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus size={18} />
            <span className="hidden sm:inline">Novo Pedido</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
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

      <div className="flex-1 overflow-hidden rounded-lg border border-border bg-bg-primary">
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

      {/* Dialog de Estorno */}
      <AlertDialog
        isOpen={isReversalOpen}
        onClose={() => setIsReversalOpen(false)}
        onConfirm={handleConfirmReversal}
        title="Estornar Venda"
        description={
          saleToReverse?.status === 'CONFIRMED'
            ? `Tem certeza que deseja estornar a venda #${saleToReverse?.number}? Esta ação irá devolver os itens ao estoque e alterar o status para Pendente.`
            : `Tem certeza que deseja reabrir a venda #${saleToReverse?.number}? O status será alterado para Pendente.`
        }
        confirmText="Confirmar Estorno"
        cancelText="Cancelar"
        variant="warning"
      />
    </div>
  );
};

export default SalesOrdersPage;