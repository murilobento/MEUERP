import React from 'react';
import { Calendar, User, CreditCard, FileText } from 'lucide-react';
import type { Sale } from '../../types';
import './SalesOrdersPage.css';

interface SaleDetailProps {
    sale: Sale;
}

const SaleDetail: React.FC<SaleDetailProps> = ({ sale }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'CONFIRMED': return 'Confirmado';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    const getPaymentMethodLabel = (method?: string) => {
        switch (method) {
            case 'DEBIT_CARD': return 'Cartão de Débito';
            case 'CREDIT_CARD': return 'Cartão de Crédito';
            case 'CASH': return 'Dinheiro';
            case 'PIX': return 'PIX';
            case 'BOLETO': return 'Boleto';
            default: return method || '-';
        }
    };

    return (
        <div className="sale-detail">
            <div className="detail-header">
                <div className="detail-title">
                    <h2>Pedido #{sale.number}</h2>
                    <span className={`status-badge ${sale.status.toLowerCase()}`}>
                        {getStatusLabel(sale.status)}
                    </span>
                </div>
                <div className="detail-meta">
                    <div className="meta-item">
                        <Calendar size={16} />
                        <span>{formatDate(sale.date)}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>
                    <User size={18} />
                    Informações do Cliente
                </h3>
                <div className="info-grid">
                    <div className="info-item">
                        <label>Nome</label>
                        <span>{sale.customer.name}</span>
                    </div>
                    <div className="info-item">
                        <label>Documento</label>
                        <span>{sale.customer.document || '-'}</span>
                    </div>
                    <div className="info-item">
                        <label>Email</label>
                        <span>{sale.customer.email || '-'}</span>
                    </div>
                    <div className="info-item">
                        <label>Telefone</label>
                        <span>{sale.customer.phone || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>Itens do Pedido</h3>
                <div className="items-table-container">
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th className="text-right">Qtd</th>
                                <th className="text-right">Preço Unit.</th>
                                <th className="text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.product.name}</td>
                                    <td className="text-right">{item.quantity}</td>
                                    <td className="text-right">{formatCurrency(Number(item.price))}</td>
                                    <td className="text-right">{formatCurrency(Number(item.subtotal))}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} className="text-right font-bold">Subtotal:</td>
                                <td className="text-right">{formatCurrency(Number(sale.subtotal))}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="text-right font-bold">Desconto:</td>
                                <td className="text-right text-danger">-{formatCurrency(Number(sale.discount))}</td>
                            </tr>
                            <tr className="total-row">
                                <td colSpan={3} className="text-right font-bold">Total:</td>
                                <td className="text-right font-bold">{formatCurrency(Number(sale.total))}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="detail-section">
                <h3>
                    <CreditCard size={18} />
                    Pagamento
                </h3>
                <div className="info-grid">
                    <div className="info-item">
                        <label>Forma de Pagamento</label>
                        <span>{getPaymentMethodLabel(sale.paymentMethod)}</span>
                    </div>
                </div>
            </div>

            {sale.notes && (
                <div className="detail-section">
                    <h3>
                        <FileText size={18} />
                        Observações
                    </h3>
                    <p className="notes-text">{sale.notes}</p>
                </div>
            )}
        </div>
    );
};

export default SaleDetail;
