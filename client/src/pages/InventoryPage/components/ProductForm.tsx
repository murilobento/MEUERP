import React, { useState, useEffect } from 'react';
import type { Product, Category } from '../../../types';
import { categoryService } from '../../../services/categoryService';
import { Save, Upload, Package, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import SupplierAutocomplete from './SupplierAutocomplete';
import './ProductForm.css';

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
        <div className="product-form">
            <div className="product-form-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`product-form-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="product-form-content">
                {activeTab === 'general' && (
                    <div className="product-form-section">
                        <div className="product-status-toggle">
                            <div className="status-label">ID: {initialData?.id || 'Novo'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="status-label">Ativo</span>
                                <button
                                    type="button"
                                    onClick={() => handleChange('status', formData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                    className={`toggle-switch ${formData.status === 'ACTIVE' ? 'active' : 'inactive'}`}
                                >
                                    <div className="toggle-switch-thumb" />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nome do Produto *</label>
                            <input
                                type="text"
                                required
                                className="input"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Categoria *</label>
                                <select
                                    required
                                    className="select"
                                    value={formData.categoryId || ''}
                                    onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Código de Barras (EAN)</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.barcode || ''}
                                    onChange={(e) => handleChange('barcode', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>Fornecedor Principal</label>
                                <SupplierAutocomplete
                                    value={formData.supplierId || ''}
                                    onChange={(val) => handleChange('supplierId', val === '' ? undefined : val)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Unidade</label>
                                <select
                                    className="select"
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

                        <div className="form-group">
                            <label>Descrição</label>
                            <textarea
                                className="input"
                                rows={3}
                                value={formData.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'prices' && (
                    <div className="product-form-section">
                        <h3 className="section-title">
                            <DollarSign size={20} /> Precificação
                        </h3>
                        <div className="form-grid-3">
                            <div className="form-group">
                                <label>Preço de Custo</label>
                                <div className="input-with-prefix">
                                    <span className="input-prefix">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input"
                                        value={formData.cost}
                                        onChange={(e) => handlePriceChange('cost', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Margem (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input"
                                    value={margin}
                                    onChange={(e) => handlePriceChange('margin', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Preço de Venda *</label>
                                <div className="input-with-prefix">
                                    <span className="input-prefix">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="input"
                                        value={formData.price}
                                        onChange={(e) => handlePriceChange('price', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="section-divider">
                            <h3 className="section-title">
                                <Package size={20} /> Estoque
                            </h3>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label>Estoque Atual</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.stock}
                                        onChange={(e) => handleChange('stock', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estoque Mínimo</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.minStock}
                                        onChange={(e) => handleChange('minStock', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="product-form-section">
                        <div className="form-grid-4">
                            <div className="form-group">
                                <label>Largura (cm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    value={formData.width || 0}
                                    onChange={(e) => handleChange('width', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Altura (cm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    value={formData.height || 0}
                                    onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Comprimento (cm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    value={formData.length || 0}
                                    onChange={(e) => handleChange('length', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Peso Bruto (kg)</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    className="input"
                                    value={formData.weight || 0}
                                    onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Observações Internas</label>
                            <textarea
                                className="input"
                                rows={4}
                                placeholder="Informações visíveis apenas para a equipe..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'images' && (
                    <div className="product-form-section">
                        <div className="form-group">
                            <label>URL da Imagem Principal</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.imageUrl || ''}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        {formData.imageUrl && (
                            <div className="image-preview">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}

                        <div className="upload-area">
                            <Upload size={32} />
                            <p>Arraste e solte imagens aqui ou clique para selecionar</p>
                            <p className="upload-note">(Upload de arquivos não implementado nesta demo)</p>
                        </div>
                    </div>
                )}
            </form>

            <div className="form-footer">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    form="product-form"
                    disabled={loading}
                    className="btn btn-primary"
                >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
            </div>
        </div>
    );
};

export default ProductForm;
