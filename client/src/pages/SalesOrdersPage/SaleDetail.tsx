import React from 'react';
import { Calendar, User, CreditCard, FileText } from 'lucide-react';
import type { Sale } from '../../types';

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-warning-light text-warning';
            case 'CONFIRMED': return 'bg-success-light text-success';
            case 'CANCELLED': return 'bg-danger-light text-danger';
            default: return 'bg-bg-tertiary text-text-secondary';
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between items-start pb-4 border-b border-border">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-text-primary m-0">Pedido #{sale.number}</h2>
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(sale.status)}`}>
                        {getStatusLabel(sale.status)}
                    </span>
                </div>
                <div className="flex gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(sale.date)}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wide mb-2">
                    <User size={18} />
                    Informações do Cliente
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-text-secondary uppercase">Nome</label>
                        <span className="text-sm text-text-primary">{sale.customer.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-text-secondary uppercase">Documento</label>
                        <span className="text-sm text-text-primary">{sale.customer.document || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-text-secondary uppercase">Email</label>
                        <span className="text-sm text-text-primary">{sale.customer.email || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-text-secondary uppercase">Telefone</label>
                        <span className="text-sm text-text-primary">{sale.customer.phone || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wide mb-2">Itens do Pedido</h3>
                <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-bg-tertiary text-text-secondary font-semibold px-4 py-2 border-b border-border">Produto</th>
                                <th className="bg-bg-tertiary text-text-secondary font-semibold px-4 py-2 border-b border-border text-right">Qtd</th>
                                <th className="bg-bg-tertiary text-text-secondary font-semibold px-4 py-2 border-b border-border text-right">Preço Unit.</th>
                                <th className="bg-bg-tertiary text-text-secondary font-semibold px-4 py-2 border-b border-border text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2 border-b border-border text-text-primary">{item.product.name}</td>
                                    <td className="px-4 py-2 border-b border-border text-text-primary text-right">{item.quantity}</td>
                                    <td className="px-4 py-2 border-b border-border text-text-primary text-right">{formatCurrency(Number(item.price))}</td>
                                    <td className="px-4 py-2 border-b border-border text-text-primary text-right">{formatCurrency(Number(item.subtotal))}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-bold text-text-primary">Subtotal:</td>
                                <td className="px-4 py-2 text-right text-text-primary">{formatCurrency(Number(sale.subtotal))}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-bold text-text-primary">Desconto:</td>
                                <td className="px-4 py-2 text-right text-danger">-{formatCurrency(Number(sale.discount))}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-right font-bold text-text-primary border-t border-border">Total:</td>
                                <td className="px-4 py-2 text-right font-bold text-text-primary border-t border-border">{formatCurrency(Number(sale.total))}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wide mb-2">
                    <CreditCard size={18} />
                    Pagamento
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-text-secondary uppercase">Forma de Pagamento</label>
                        <span className="text-sm text-text-primary">{getPaymentMethodLabel(sale.paymentMethod)}</span>
                    </div>
                </div>
            </div>

            {sale.notes && (
                <div className="flex flex-col gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wide mb-2">
                        <FileText size={18} />
                        Observações
                    </h3>
                    <p className="text-sm text-text-primary bg-bg-secondary p-3 rounded-md border border-border">{sale.notes}</p>
                </div>
            )}
        </div>
    );
};

export default SaleDetail;
