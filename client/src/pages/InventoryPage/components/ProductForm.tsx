import React, { useState, useEffect } from 'react';
import type { Product, Category } from '../../../types';
import { categoryService } from '../../../services/categoryService';
import { Save, Upload, Package, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import SupplierAutocomplete from './SupplierAutocomplete';

interface ProductFormProps {
    initialData: Product | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    loading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
    const [activeTab, setActiveTab] = useState<'general' | 'prices' | 'details' | 'images'>('general');
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        code: '',
        barcode: '',
        categoryId: undefined,
        supplierId: undefined,
        unit: 'UN',
        description: '',
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 0,
        width: 0,
        height: 0,
        length: 0,
        weight: 0,
        status: 'ACTIVE',
        imageUrl: ''
    });

    const [margin, setMargin] = useState(0);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                categoryId: initialData.categoryId || undefined,
                supplierId: initialData.supplierId || undefined
            });
            if (initialData.cost && initialData.price) {
                const m = ((initialData.price - initialData.cost) / initialData.cost) * 100;
                setMargin(parseFloat(m.toFixed(2)));
            }
        }
        loadCategories();
    }, [initialData]);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias');
        }
    };

    const handleChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePriceChange = (field: 'cost' | 'price' | 'margin', value: number) => {
        if (field === 'cost') {
            const newCost = value;
            const newPrice = newCost * (1 + margin / 100);
            setFormData(prev => ({ ...prev, cost: newCost, price: parseFloat(newPrice.toFixed(2)) }));
        } else if (field === 'margin') {
            const newMargin = value;
            setMargin(newMargin);
            const newPrice = (formData.cost || 0) * (1 + newMargin / 100);
            setFormData(prev => ({ ...prev, price: parseFloat(newPrice.toFixed(2)) }));
        } else if (field === 'price') {
            const newPrice = value;
            setFormData(prev => ({ ...prev, price: newPrice }));
            if (formData.cost && formData.cost > 0) {
                const newMargin = ((newPrice - formData.cost) / formData.cost) * 100;
                setMargin(parseFloat(newMargin.toFixed(2)));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const tabs = [
        { id: 'general', label: 'Geral', icon: Package },
        { id: 'prices', label: 'Preços', icon: DollarSign },
        { id: 'details', label: 'Detalhes', icon: FileText },
        { id: 'images', label: 'Imagens', icon: ImageIcon },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex border-b border-border mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium bg-transparent border-b-2 cursor-pointer transition-colors hover:text-text-primary ${activeTab === tab.id ? 'text-primary border-primary' : 'border-transparent text-text-secondary'}`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-1">
                {activeTab === 'general' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-text-secondary">ID: {initialData?.id || 'Novo'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="text-sm text-text-secondary">Ativo</span>
                                <button
                                    type="button"
                                    onClick={() => handleChange('status', formData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors border-none ${formData.status === 'ACTIVE' ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${formData.status === 'ACTIVE' ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-primary">Nome do Produto *</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Categoria *</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={formData.categoryId || ''}
                                    onChange={(e) => handleChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Código de Barras (EAN)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={formData.barcode || ''}
                                    onChange={(e) => handleChange('barcode', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Fornecedor Principal</label>
                                <SupplierAutocomplete
                                    value={formData.supplierId || ''}
                                    onChange={(val) => handleChange('supplierId', val === '' ? undefined : val)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Unidade</label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={formData.unit || 'UN'}
                                    onChange={(e) => handleChange('unit', e.target.value)}
                                >
                                    <option value="UN">Unidade (UN)</option>
                                    <option value="KG">Quilograma (KG)</option>
                                    <option value="L">Litro (L)</option>
                                    <option value="M">Metro (M)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-primary">Descrição</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                rows={3}
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'prices' && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-medium text-text-primary flex items-center gap-2 mb-4">
                            <DollarSign size={20} /> Precificação
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Preço de Custo</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                        value={formData.cost}
                                        onChange={(e) => handlePriceChange('cost', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Margem (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={margin}
                                    onChange={(e) => handlePriceChange('margin', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Preço de Venda *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                        value={formData.price}
                                        onChange={(e) => handlePriceChange('price', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6 mt-6">
                            <h3 className="text-lg font-medium text-text-primary flex items-center gap-2 mb-4">
                                <Package size={20} /> Estoque
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-text-primary">Estoque Atual</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                        value={formData.stock}
                                        onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-text-primary">Estoque Mínimo</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                        value={formData.minStock}
                                        onChange={(e) => handleChange('minStock', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Largura (cm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={formData.width || 0}
                                    onChange={(e) => handleChange('width', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Altura (cm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={formData.height || 0}
                                    onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Comprimento (cm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={formData.length || 0}
                                    onChange={(e) => handleChange('length', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">Peso Bruto (kg)</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                    value={formData.weight || 0}
                                    onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-primary">Observações Internas</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                rows={4}
                                placeholder="Informações visíveis apenas para a equipe..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'images' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-primary">URL da Imagem Principal</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                value={formData.imageUrl || ''}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        {formData.imageUrl && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="max-h-64 rounded-lg border border-border"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}

                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-text-secondary hover:bg-bg-secondary transition-colors cursor-pointer">
                            <Upload size={32} className="mx-auto mb-2" />
                            <p className="my-1">Arraste e solte imagens aqui ou clique para selecionar</p>
                            <p className="text-xs mt-1">(Upload de arquivos não implementado nesta demo)</p>
                        </div>
                    </div>
                )}
            </form>

            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-auto">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    form="product-form"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2"
                >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
            </div>
        </div>
    );
};

export default ProductForm;
