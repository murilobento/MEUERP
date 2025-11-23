import React, { useState, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categoryService } from '../../../services/categoryService';
import type { Category } from '../../../types';
import { AlertDialog } from '../../../components/ui/AlertDialog/AlertDialog';
import { Sheet } from '../../../components/ui/Sheet/Sheet';

interface CategoryManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            toast.error('Erro ao carregar categorias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            if (editingId) {
                await categoryService.update(editingId, { name: newCategoryName, description: newCategoryDesc });
                toast.success('Categoria atualizada', {
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
                setEditingId(null);
            } else {
                await categoryService.create({ name: newCategoryName, description: newCategoryDesc });
                toast.success('Categoria criada', {
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
            setNewCategoryName('');
            setNewCategoryDesc('');
            loadCategories();
        } catch (error) {
            toast.error('Erro ao salvar categoria');
        }
    };

    const handleEdit = (category: Category) => {
        setNewCategoryName(category.name);
        setNewCategoryDesc(category.description || '');
        setEditingId(category.id);
    };

    const handleDeleteClick = (category: Category) => {
        const productCount = category._count?.products || 0;

        if (productCount > 0) {
            toast.error(`Não é possível excluir. Esta categoria possui ${productCount} produto(s) vinculado(s).`);
            return;
        }

        setCategoryToDelete(category);
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await categoryService.delete(categoryToDelete.id);
            toast.success('Categoria excluída', {
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
            setCategoryToDelete(null);
            loadCategories();
        } catch (error) {
            toast.error('Erro ao excluir categoria');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewCategoryName('');
        setNewCategoryDesc('');
    };

    return (
        <>
            <Sheet isOpen={isOpen} onClose={onClose} title="Gerenciar Categorias" size="md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Nova Categoria (ex: Bebidas)"
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Descrição (Opcional)"
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                        value={newCategoryDesc}
                        onChange={(e) => setNewCategoryDesc(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : (editingId ? 'Atualizar Categoria' : 'Adicionar Categoria')}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                <div className="flex flex-col gap-2">
                    {categories.map(category => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg hover:bg-bg-tertiary transition-colors group">
                            <div className="flex-1">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div className="font-medium text-text-primary">{category.name}</div>
                                    {category._count && category._count.products > 0 && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-light text-primary">
                                            {category._count.products} {category._count.products === 1 ? 'produto' : 'produtos'}
                                        </span>
                                    )}
                                </div>
                                {category.description && (
                                    <div className="text-xs text-text-secondary mt-0.5">{category.description}</div>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-1 text-text-secondary hover:text-primary transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(category)}
                                    className="p-1 text-text-secondary hover:text-danger transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="text-center text-text-secondary py-4">
                            Nenhuma categoria cadastrada.
                        </div>
                    )}
                </div>
            </Sheet>

            <AlertDialog
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Categoria"
                description={`Tem certeza que deseja excluir a categoria "${categoryToDelete?.name}"?`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </>
    );
};

export default CategoryManager;
