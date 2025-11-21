import React, { useState, useEffect } from 'react';
import { X, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categoryService } from '../../../services/categoryService';
import type { Category } from '../../../types';
import { AlertDialog } from '../../../components/ui/AlertDialog/AlertDialog';
import './CategoryManager.css';

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

    if (!isOpen) return null;

    return (
        <div className="category-modal-overlay">
            <div className="category-modal">
                <div className="category-modal-header">
                    <h2 className="category-modal-title">Gerenciar Categorias</h2>
                    <button onClick={onClose} className="category-modal-close">
                        <X size={20} />
                    </button>
                </div>

                <div className="category-modal-body">
                    <form onSubmit={handleSubmit} className="category-form">
                        <input
                            type="text"
                            placeholder="Nova Categoria (ex: Bebidas)"
                            className="input"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Descrição (Opcional)"
                            className="input"
                            value={newCategoryDesc}
                            onChange={(e) => setNewCategoryDesc(e.target.value)}
                        />
                        <div className="category-form-actions">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? 'Salvando...' : (editingId ? 'Atualizar Categoria' : 'Adicionar Categoria')}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="btn btn-secondary btn-cancel"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="category-list">
                        {categories.map(category => (
                            <div key={category.id} className="category-item">
                                <div className="category-item-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className="category-item-name">{category.name}</div>
                                        {category._count && category._count.products > 0 && (
                                            <span className="badge badge-primary">
                                                {category._count.products} {category._count.products === 1 ? 'produto' : 'produtos'}
                                            </span>
                                        )}
                                    </div>
                                    {category.description && (
                                        <div className="category-item-description">{category.description}</div>
                                    )}
                                </div>
                                <div className="category-item-actions">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="category-item-action"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(category)}
                                        className="category-item-action delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="category-list-empty">
                                Nenhuma categoria cadastrada.
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
        </div>
    );
};

export default CategoryManager;
