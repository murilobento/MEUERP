import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Calendar,
  ShoppingBag,
  DollarSign,
  CreditCard,
  FileText,
  Save,
  Package,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';
import type { Customer, Product, Sale } from '../../types';
import Autocomplete from '../../components/ui/Autocomplete/Autocomplete';
import './SalesOrdersPage.css';

interface SalesOrderFormProps {
  initialData?: Sale | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

interface FormItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  stock: number;
}

const SalesOrderForm: React.FC<SalesOrderFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'payment'>('details');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<FormItem[]>([]);

  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    paymentMethod: '',
    discount: 0,
    notes: ''
  });

  const [freight, setFreight] = useState(0);
  const [discountType, setDiscountType] = useState<'value' | 'percent'>('value');
  const [selectedProduct, setSelectedProduct] = useState<string | number>('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  useEffect(() => {
    loadData();
    if (initialData) {
      setFormData({
        customerId: initialData.customerId.toString(),
        date: new Date(initialData.date).toISOString().split('T')[0],
        status: initialData.status,
        paymentMethod: initialData.paymentMethod || '',
        discount: Number(initialData.discount),
        notes: initialData.notes || ''
      });

      const formattedItems = initialData.items.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
        stock: item.product.stock
      }));
      setItems(formattedItems);
    }
  }, [initialData]);

  const loadData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        customerService.list({ limit: 100, status: 'ACTIVE' }),
        productService.getAll({ status: 'ACTIVE' })
      ]);
      setCustomers(customersRes.data || []);
      setProducts(productsRes || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar clientes ou produtos');
    }
  };

  // Update price when product changes
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find(p => p.id === Number(selectedProduct));
      if (product) {
        setItemPrice(Number(product.price));
      }
    } else {
      setItemPrice(0);
    }
  }, [selectedProduct, products]);

  const handleAddItem = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === Number(selectedProduct));
    if (!product) return;

    const existingItemIndex = items.findIndex(item => item.productId === product.id);
    let currentQuantity = itemQuantity;

    if (existingItemIndex >= 0) {
      currentQuantity += items[existingItemIndex].quantity;
    }

    if (currentQuantity > product.stock) {
      toast.error(`Atenção: Quantidade solicitada (${currentQuantity}) maior que o estoque disponível (${product.stock})`);
    }

    if (existingItemIndex >= 0) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += itemQuantity;
      newItems[existingItemIndex].price = itemPrice; // Update price
      newItems[existingItemIndex].subtotal = newItems[existingItemIndex].quantity * itemPrice;
      setItems(newItems);
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        quantity: itemQuantity,
        price: itemPrice, // Use custom price
        subtotal: itemQuantity * itemPrice,
        stock: product.stock
      }]);
    }

    setSelectedProduct('');
    setItemQuantity(1);
    setItemPrice(0);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    newItems[index].subtotal = newQuantity * newItems[index].price;
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    let discountValue = 0;
    if (discountType === 'value') {
      discountValue = formData.discount;
    } else {
      discountValue = subtotal * (formData.discount / 100);
    }

    const total = subtotal - discountValue + freight;
    return { subtotal, total, discountValue };
  };

  const { subtotal, total, discountValue } = calculateTotals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerId) {
      toast.error('Selecione um cliente');
      return;
    }
    if (items.length === 0) {
      toast.error('Adicione pelo menos um item ao pedido');
      return;
    }

    const payload = {
      ...formData,
      customerId: Number(formData.customerId),
      subtotal,
      total,
      discount: discountValue,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    onSubmit(payload);
  };

  const customerOptions = customers.map(c => ({
    value: c.id,
    label: c.name,
    subLabel: c.document
  }));

  const productOptions = products.map(p => ({
    value: p.id,
    label: p.name,
    subLabel: `R$ ${Number(p.price).toFixed(2)} | Est: ${p.stock}`
  }));

  return (
    <form onSubmit={handleSubmit} className="sales-form">
      {/* Tabs Header */}
      <div className="sales-tabs-header">
        <button
          type="button"
          className={`sales-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <ShoppingBag size={16} />
          Detalhes do Pedido
        </button>
        <button
          type="button"
          className={`sales-tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          <DollarSign size={16} />
          Pagamento & Totais
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' ? (
        <div className="sales-tab-content">
          {/* Header: Cliente, Data, Status */}
          <div className="sales-form-header">
            <div className="form-field">
              <label className="form-label">CLIENTE</label>
              <Autocomplete
                options={customerOptions}
                value={formData.customerId ? Number(formData.customerId) : ''}
                onChange={(val) => setFormData({ ...formData, customerId: val.toString() })}
                placeholder="Buscar cliente..."
                icon={<Search size={14} />}
              />
            </div>
            <div className="form-field">
              <label className="form-label">DATA</label>
              <div className="input-with-icon">
                <Calendar size={14} className="input-icon" />
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">STATUS</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Items Section */}
          <div className="sales-section">
            <div className="section-title">
              <ShoppingBag size={16} />
              <span>Itens do Pedido</span>
            </div>

            {/* Add Product Row */}
            <div className="add-product-row">
              <div className="form-field flex-1">
                <label className="form-label-sm">ADICIONAR PRODUTO</label>
                <Autocomplete
                  options={productOptions}
                  value={selectedProduct}
                  onChange={(val) => setSelectedProduct(val)}
                  placeholder="Buscar produto..."
                  icon={<Package size={14} />}
                />
              </div>
              <div className="form-field" style={{ width: '140px' }}>
                <label className="form-label-sm">PREÇO</label>
                <div className="input-group-inline">
                  <span className="input-prefix">R$</span>
                  <input
                    type="number"
                    className="form-input-sm"
                    min="0"
                    step="0.01"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    style={{ flex: 1, textAlign: 'right' }}
                  />
                </div>
              </div>
              <div className="form-field" style={{ width: '80px' }}>
                <label className="form-label-sm">QTD</label>
                <input
                  type="number"
                  className="form-input-sm"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(Number(e.target.value))}
                  style={{ textAlign: 'center' }}
                />
              </div>
              <div className="form-field" style={{ width: 'auto' }}>
                <label className="form-label-sm">&nbsp;</label>
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={handleAddItem}
                  disabled={!selectedProduct}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
              <div className="items-list">
                <table className="items-table-compact">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th style={{ width: '130px', textAlign: 'right' }}>Preço</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Qtd</th>
                      <th style={{ width: '110px', textAlign: 'right' }}>Total</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.8125rem' }}>R$ {item.price.toFixed(2)}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="number"
                            className="qty-input"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemQuantity(index, Number(e.target.value))}
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>R$ {item.subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-remove-item"
                            onClick={() => handleRemoveItem(index)}
                            title="Remover item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="sales-tab-content">
          {/* Payment Section */}
          <div className="sales-section">
            <div className="section-title">
              <CreditCard size={16} />
              <span>Pagamento</span>
            </div>
            <div className="payment-grid">
              <div className="form-field">
                <label className="form-label-sm">MÉTODO</label>
                <select
                  className="form-select-sm"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="CREDIT_CARD">Cartão de Crédito</option>
                  <option value="DEBIT_CARD">Cartão de Débito</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="BOLETO">Boleto</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label-sm">STATUS</label>
                <select
                  className="form-select-sm"
                  disabled
                  value={formData.status === 'CONFIRMED' ? 'PAID' : 'PENDING'}
                >
                  <option value="PENDING">Pendente</option>
                  <option value="PAID">Pago</option>
                </select>
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="sales-section">
            <div className="section-title">
              <DollarSign size={16} />
              <span>Totais</span>
            </div>
            <div className="totals-grid">
              <div className="form-field">
                <label className="form-label-sm">DESCONTO</label>
                <div className="discount-input-group">
                  <input
                    type="number"
                    className="form-input-sm"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    style={{ flex: 1, textAlign: 'right' }}
                  />
                  <div className="type-toggle">
                    <button
                      type="button"
                      className={`toggle-option ${discountType === 'value' ? 'active' : ''}`}
                      onClick={() => setDiscountType('value')}
                    >
                      R$
                    </button>
                    <button
                      type="button"
                      className={`toggle-option ${discountType === 'percent' ? 'active' : ''}`}
                      onClick={() => setDiscountType('percent')}
                    >
                      %
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label-sm">FRETE</label>
                <div className="input-group-inline">
                  <span className="input-prefix">R$</span>
                  <input
                    type="number"
                    className="form-input-sm"
                    min="0"
                    step="0.01"
                    value={freight}
                    onChange={(e) => setFreight(Number(e.target.value))}
                    style={{ flex: 1, textAlign: 'right' }}
                  />
                </div>
              </div>
            </div>
            <div className="totals-summary">
              <div className="total-line">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line discount-line">
                <span>Desconto</span>
                <span>- R$ {discountValue.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Frete</span>
                <span>+ R$ {freight.toFixed(2)}</span>
              </div>
              <div className="total-line final-total">
                <span>Total Final</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="sales-section">
            <div className="section-title">
              <FileText size={16} />
              <span>Observações</span>
            </div>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Observações do pedido..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

        </div>
      )}

      {/* Actions - Always visible */}
      <div className="sales-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Save size={16} />
          Salvar Pedido
        </button>
      </div>
    </form>
  );
};

export default SalesOrderForm;