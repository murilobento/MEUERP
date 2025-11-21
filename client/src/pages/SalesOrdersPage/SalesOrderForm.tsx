import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';
import type { Customer, Product, Sale, SaleItem } from '../../types';
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

  // Product selection state
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState(1);

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
        stock: item.product.stock // Note: This might be inaccurate if stock changed, but good enough for display
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

  const handleAddItem = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id.toString() === selectedProduct);
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
      newItems[existingItemIndex].subtotal = newItems[existingItemIndex].quantity * newItems[existingItemIndex].price;
      setItems(newItems);
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        quantity: itemQuantity,
        price: Number(product.price),
        subtotal: itemQuantity * Number(product.price),
        stock: product.stock
      }]);
    }

    setSelectedProduct('');
    setItemQuantity(1);
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
    const total = subtotal - formData.discount;
    return { subtotal, total };
  };

  const { subtotal, total } = calculateTotals();

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
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Cliente</label>
          <select
            className="form-control"
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            required
          >
            <option value="">Selecione um cliente...</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data</label>
          <input
            type="date"
            className="form-control"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            className="form-control"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="items-section">
        <h4>Itens do Pedido</h4>
        <div className="add-item-row">
          <div className="form-group product-select">
            <select
              className="form-control"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">Selecione um produto...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (R$ {Number(product.price).toFixed(2)}) - Est: {product.stock}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group quantity-input">
            <input
              type="number"
              className="form-control"
              min="1"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
              placeholder="Qtd"
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddItem}
            disabled={!selectedProduct}
          >
            <Plus size={20} />
            Adicionar
          </button>
        </div>

        <div className="items-table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th style={{ width: '100px' }}>Qtd</th>
                <th style={{ width: '120px' }}>Preço</th>
                <th style={{ width: '120px' }}>Total</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Nenhum item adicionado
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQuantity(index, Number(e.target.value))}
                      />
                    </td>
                    <td>R$ {item.price.toFixed(2)}</td>
                    <td>R$ {item.subtotal.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="totals-section">
        <div className="form-grid">
          <div className="form-group">
            <label>Forma de Pagamento</label>
            <select
              className="form-control"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="">Selecione...</option>
              <option value="CASH">Dinheiro</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="PIX">PIX</option>
              <option value="BOLETO">Boleto</option>
            </select>
          </div>
          <div className="form-group">
            <label>Desconto (R$)</label>
            <input
              type="number"
              className="form-control"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="totals-display">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row discount">
            <span>Desconto:</span>
            <span>- R$ {formData.discount.toFixed(2)}</span>
          </div>
          <div className="total-row final">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Observações</label>
        <textarea
          className="form-control"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : (initialData ? 'Atualizar Pedido' : 'Criar Pedido')}
        </button>
      </div>
    </form>
  );
};

export default SalesOrderForm;