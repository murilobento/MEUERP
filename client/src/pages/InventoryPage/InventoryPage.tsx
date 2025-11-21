import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, List } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '../../services/productService';
import type { Product, ProductFilters } from '../../types';
import FilterBar from '../../components/FilterBar/FilterBar';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import { Sheet } from '../../components/ui/Sheet/Sheet';
import { AlertDialog } from '../../components/ui/AlertDialog/AlertDialog';
import { ProductForm, CategoryManager } from './components';
import './InventoryPage.css';

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

    const handleEdit = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setIsProductModalOpen(true);
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
                <div className="product-image-cell">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="product-thumb" />
                    ) : (
                        <div className="product-thumb-placeholder">
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
                <div className="product-info-cell">
                    <span className="product-name">{product.name}</span>
                    <span className="product-code">{product.barcode || product.code || '-'}</span>
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
                <div className="stock-cell">
                    <div className="stock-bar-container">
                        <div
                            className={`stock-bar ${product.stock <= product.minStock ? 'low' : 'good'}`}
                            style={{ width: `${Math.min((product.stock / (product.minStock * 3 || 10)) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="stock-value">{product.stock} {product.unit}</span>
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
                <span className={`status-badge ${product.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                    {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'AÇÕES',
            render: (product) => (
                <div className="actions-cell">
                    <button className="icon-btn" title="Editar" onClick={(e) => handleEdit(product, e)}>
                        <Edit2 size={16} />
                    </button>
                    <button className="icon-btn delete-btn" title="Excluir" onClick={(e) => handleDeleteClick(product, e)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            width: '100px'
        }
    ];

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div className="breadcrumb">
                        <span>Módulo</span>
                        <span>/</span>
                        <span>Estoque</span>
                    </div>
                    <h1>Gestão de Estoque</h1>
                    <p className="page-subtitle">Gerencie catálogo de produtos e níveis de estoque.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => setIsCategoryModalOpen(true)}>
                        <List size={18} />
                        Categorias
                    </button>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <Plus size={18} />
                        Novo Produto
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

            <DataTable
                columns={columns}
                data={products}
                pagination={pagination}
                onPageChange={setPage}
                isLoading={loading}
                emptyMessage="Nenhum produto encontrado."
                onRowClick={(product) => handleEdit(product, {} as any)}
            />

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
