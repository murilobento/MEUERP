import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, List, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '../../services/productService';
import type { Product, ProductFilters } from '../../types';
import FilterBar from '../../components/FilterBar/FilterBar';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import { Sheet } from '../../components/ui/Sheet/Sheet';
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog';
import { ProductForm, CategoryManager } from './components';
import ProductDetail from './components/ProductDetail';

const InventoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
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
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const filters: ProductFilters = {};
            if (search) filters.search = search;
            if (statusFilter !== 'all') filters.status = statusFilter as 'ACTIVE' | 'INACTIVE';

            // Note: Pagination is not yet implemented in the service/backend for products, 
            // but we should prepare for it. For now, we might get all products.
            // If the backend returns all products, we can paginate client-side or update backend.
            // Based on UserService, backend might support pagination. 
            // My ProductService implementation didn't explicitly handle pagination (skip/take), 
            // so it returns all. I'll assume all for now.

            const data = await productService.getAll(filters);
            setProducts(data);
            setPagination({
                page: 1,
                limit: data.length,
                total: data.length,
                totalPages: 1
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            toast.error('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [page, search, statusFilter]);

    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEdit = (product: Product, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleView = (product: Product, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setDetailProduct(product);
        setIsDetailOpen(true);
    };
    const handleDeleteClick = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        setProductToDelete(product);
        setIsDeleteAlertOpen(true);
    };


    const handleDelete = async (id: number) => {
        try {
            await productService.delete(id);
            toast.success('Produto excluído com sucesso', {
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
            loadProducts();
        } catch (error) {
            toast.error('Erro ao excluir produto');
        }
    };

    const handleConfirmDelete = async () => {
        if (productToDelete) {
            await handleDelete(productToDelete.id);
            setProductToDelete(null);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (selectedProduct) {
                await productService.update(selectedProduct.id, data);
                toast.success('Produto atualizado com sucesso', {
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
                await productService.create(data);
                toast.success('Produto criado com sucesso', {
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
            setIsProductModalOpen(false);
            loadProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao salvar produto');
        } finally {
            setIsSubmitting(false);
        }
    };


    const columns: Column<Product>[] = [
        {
            key: 'imageUrl',
            header: 'IMG',
            render: (product) => (
                <div className="flex items-center justify-center">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-bg-secondary" />
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-bg-secondary text-text-secondary flex items-center justify-center font-semibold text-lg">
                            {product.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            ),
            width: '60px'
        },
        {
            key: 'name',
            header: 'PRODUTO',
            render: (product) => (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary">{product.name}</span>
                    <span className="text-xs text-text-secondary">{product.barcode || product.code || '-'}</span>
                </div>
            )
        },
        {
            key: 'category',
            header: 'CATEGORIA',
            render: (product) => product.category?.name || '-'
        },
        {
            key: 'stock',
            header: 'ESTOQUE',
            render: (product) => (
                <div className="flex items-center gap-4">
                    <div className="w-16 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${product.stock <= product.minStock ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${Math.min((product.stock / (product.minStock * 3 || 10)) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="text-sm text-text-secondary min-w-[40px]">{product.stock} {product.unit}</span>
                </div>
            )
        },
        {
            key: 'price',
            header: 'VENDA',
            render: (product) => `R$ ${Number(product.price).toFixed(2)}`
        },
        {
            key: 'status',
            header: 'STATUS',
            render: (product) => (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${product.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-bg-tertiary text-text-secondary'}`}>
                    {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'AÇÕES',
            render: (product) => (
                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary" title="Visualizar" onClick={(e) => handleView(product, e)}>
                        <Eye size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-bg-secondary hover:text-text-primary" title="Editar" onClick={(e) => handleEdit(product, e)}>
                        <Edit2 size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-md cursor-pointer transition-all hover:bg-danger-light hover:text-danger" title="Excluir" onClick={(e) => handleDeleteClick(product, e)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            width: '100px'
        }
    ];

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <span>Módulo</span>
                        <span>/</span>
                        <span>Estoque</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary m-0">Gestão de Estoque</h1>
                    <p className="text-sm text-text-secondary mt-1">Gerencie catálogo de produtos e níveis de estoque.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] sm:min-h-[40px] bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors flex items-center justify-center gap-2" onClick={() => setIsCategoryModalOpen(true)}>
                        <List size={18} />
                        Categorias
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] sm:min-h-[40px] bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center justify-center gap-2" onClick={handleCreate}>
                        <Plus size={18} />
                        <span className="hidden sm:inline">Novo Produto</span>
                        <span className="sm:hidden">Novo</span>
                    </button>
                </div>
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
                placeholder="Buscar por nome, EAN ou categoria..."
            />

            <div className="flex-1 overflow-hidden rounded-lg border border-border bg-bg-primary">
                <DataTable
                    columns={columns}
                    data={products}
                    pagination={pagination}
                    onPageChange={setPage}
                    isLoading={loading}
                    emptyMessage="Nenhum produto encontrado."
                    onRowClick={(product) => handleView(product)}
                />
            </div>

            <Sheet
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                title={selectedProduct ? 'Editar Produto' : 'Adicionar Produto'}
                size="lg"
            >
                <ProductForm
                    initialData={selectedProduct}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsProductModalOpen(false)}
                    loading={isSubmitting}
                />
            </Sheet>
            {/* Detail view sheet */}
            <Sheet
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title="Detalhes do Produto"
                size="lg"
            >
                {detailProduct && (
                    <ProductDetail
                        product={detailProduct}
                        onClose={() => setIsDetailOpen(false)}
                    />
                )}
            </Sheet>

            <CategoryManager
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />

            <AlertDialog
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Produto"
                description={`Tem certeza que deseja excluir o produto ${productToDelete?.name}?`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

export default InventoryPage;
