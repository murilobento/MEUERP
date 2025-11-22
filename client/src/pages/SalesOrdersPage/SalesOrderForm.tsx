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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-0 max-h-[80vh] overflow-hidden">
      {/* Tabs Header */}
      <div className="flex gap-2 border-b-2 border-border pb-0 mb-4">
        <button
          type="button"
          className={`flex items-center gap-2 px-5 py-3 bg-transparent border-none border-b-2 text-text-secondary font-semibold text-sm cursor-pointer transition-all -mb-[2px] hover:text-primary hover:bg-bg-secondary ${activeTab === 'details' ? 'text-primary border-primary bg-transparent' : 'border-transparent'}`}
          onClick={() => setActiveTab('details')}
        >
          <ShoppingBag size={16} />
          Detalhes do Pedido
        </button>
        <button
          type="button"
          className={`flex items-center gap-2 px-5 py-3 bg-transparent border-none border-b-2 text-text-secondary font-semibold text-sm cursor-pointer transition-all -mb-[2px] hover:text-primary hover:bg-bg-secondary ${activeTab === 'payment' ? 'text-primary border-primary bg-transparent' : 'border-transparent'}`}
          onClick={() => setActiveTab('payment')}
        >
          <DollarSign size={16} />
          Pagamento & Totais
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' ? (
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
          {/* Header: Cliente, Data, Status */}
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 mb-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">CLIENTE</label>
              <Autocomplete
                options={customerOptions}
                value={formData.customerId ? Number(formData.customerId) : ''}
                onChange={(val) => setFormData({ ...formData, customerId: val.toString() })}
                placeholder="Buscar cliente..."
                icon={<Search size={14} />}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">DATA</label>
              <div className="relative flex items-center">
                <Calendar size={14} className="absolute left-3 text-text-tertiary pointer-events-none" />
                <input
                  type="date"
                  className="h-9 pl-9 pr-3 text-sm border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">STATUS</label>
              <select
                className="h-9 px-3 text-sm border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
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
          <div className="bg-bg-primary border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3 pb-2 border-b border-border">
              <ShoppingBag size={16} />
              <span>Itens do Pedido</span>
            </div>

            {/* Add Product Row */}
            <div className="flex gap-3 items-end mb-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">ADICIONAR PRODUTO</label>
                <Autocomplete
                  options={productOptions}
                  value={selectedProduct}
                  onChange={(val) => setSelectedProduct(val)}
                  placeholder="Buscar produto..."
                  icon={<Package size={14} />}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">PREÇO</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-text-secondary min-w-[20px]">R$</span>
                  <input
                    type="number"
                    className="h-8 px-2.5 text-xs border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light text-right flex-1"
                    min="0"
                    step="0.01"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 w-[80px]">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">QTD</label>
                <input
                  type="number"
                  className="h-8 px-2.5 text-xs border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light text-center"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-auto">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">&nbsp;</label>
                <button
                  type="button"
                  className="h-8 px-4 flex items-center gap-1.5 text-xs font-medium border-none rounded-md bg-primary text-white cursor-pointer transition-all whitespace-nowrap hover:bg-primary-dark hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="max-h-[240px] overflow-y-auto border border-border rounded-md bg-bg-secondary">
                <table className="w-full border-separate border-spacing-0 text-xs">
                  <thead>
                    <tr>
                      <th className="bg-bg-tertiary text-text-secondary font-semibold text-[11px] uppercase px-3 py-2 border-b border-border text-left sticky top-0 z-10">Produto</th>
                      <th className="bg-bg-tertiary text-text-secondary font-semibold text-[11px] uppercase px-3 py-2 border-b border-border text-right sticky top-0 z-10 w-[130px]">Preço</th>
                      <th className="bg-bg-tertiary text-text-secondary font-semibold text-[11px] uppercase px-3 py-2 border-b border-border text-center sticky top-0 z-10 w-[80px]">Qtd</th>
                      <th className="bg-bg-tertiary text-text-secondary font-semibold text-[11px] uppercase px-3 py-2 border-b border-border text-right sticky top-0 z-10 w-[110px]">Total</th>
                      <th className="bg-bg-tertiary text-text-secondary font-semibold text-[11px] uppercase px-3 py-2 border-b border-border sticky top-0 z-10 w-[40px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-bg-tertiary">
                        <td className="px-3 py-2 border-b border-border text-text-primary">{item.productName}</td>
                        <td className="px-3 py-2 border-b border-border text-text-primary text-right">
                          <span className="text-[13px]">R$ {item.price.toFixed(2)}</span>
                        </td>
                        <td className="px-3 py-2 border-b border-border text-text-primary text-center">
                          <input
                            type="number"
                            className="w-[50px] h-[26px] px-1.5 text-xs border border-border rounded bg-bg-primary text-text-primary text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-light"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemQuantity(index, Number(e.target.value))}
                          />
                        </td>
                        <td className="px-3 py-2 border-b border-border text-text-primary text-right">R$ {item.subtotal.toFixed(2)}</td>
                        <td className="px-3 py-2 border-b border-border text-text-primary">
                          <button
                            type="button"
                            className="p-1 border-none rounded bg-transparent text-text-secondary cursor-pointer transition-all flex items-center justify-center hover:bg-red-100 hover:text-danger"
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
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
          {/* Payment Section */}
          <div className="bg-bg-primary border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3 pb-2 border-b border-border">
              <CreditCard size={16} />
              <span>Pagamento</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">MÉTODO</label>
                <select
                  className="h-8 px-2.5 text-xs border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
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
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">STATUS</label>
                <select
                  className="h-8 px-2.5 text-xs border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
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
          <div className="bg-bg-primary border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3 pb-2 border-b border-border">
              <DollarSign size={16} />
              <span>Totais</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">DESCONTO</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="number"
                    className="h-8 px-2.5 text-xs border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light flex-1 text-right"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  />
                  <div className="flex border border-border rounded overflow-hidden h-8 shrink-0">
                    <button
                      type="button"
                      className={`flex-1 min-w-[36px] border-none text-xs font-semibold cursor-pointer transition-all px-2 hover:bg-bg-secondary active:bg-primary active:text-white ${discountType === 'value' ? 'bg-primary text-white' : 'bg-bg-primary text-text-secondary'}`}
                      onClick={() => setDiscountType('value')}
                    >
                      R$
                    </button>
                    <button
                      type="button"
                      className={`flex-1 min-w-[36px] border-none text-xs font-semibold cursor-pointer transition-all px-2 border-l border-border hover:bg-bg-secondary active:bg-primary active:text-white ${discountType === 'percent' ? 'bg-primary text-white' : 'bg-bg-primary text-text-secondary'}`}
                      onClick={() => setDiscountType('percent')}
                    >
                      %
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">FRETE</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-text-secondary min-w-[20px]">R$</span>
                  <input
                    type="number"
                    className="h-8 px-2.5 text-xs border border-border rounded-md bg-bg-secondary text-text-primary transition-all w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light flex-1 text-right"
                    min="0"
                    step="0.01"
                    value={freight}
                    onChange={(e) => setFreight(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-text-secondary">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-danger">
                <span>Desconto</span>
                <span>- R$ {discountValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-text-secondary">
                <span>Frete</span>
                <span>+ R$ {freight.toFixed(2)}</span>
              </div>
              <div className="mt-2 pt-3 border-t border-dashed border-border text-base font-bold text-text-primary flex justify-between items-center">
                <span>Total Final</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="bg-bg-primary border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3 pb-2 border-b border-border">
              <FileText size={16} />
              <span>Observações</span>
            </div>
            <textarea
              className="p-2.5 text-sm border border-border rounded-md bg-bg-secondary text-text-primary font-inherit resize-y transition-all w-full min-h-[60px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              rows={2}
              placeholder="Observações do pedido..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

        </div>
      )}

      {/* Actions - Always visible */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-auto">
        <button type="button" className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50" disabled={loading}>
          <Save size={16} />
          Salvar Pedido
        </button>
      </div>
    </form>
  );
};

export default SalesOrderForm;