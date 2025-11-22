import React from 'react';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';
import type { Customer } from '../../types';
import { formatDocument, formatPhone, formatCEP } from '../../utils/masks';

interface CustomerDetailProps {
    customer: Customer;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
    return (
        <div className="flex flex-col gap-8 py-4">
            <div className="flex items-center gap-6 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center text-3xl font-semibold">
                    {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary mb-2">{customer.name}</h2>
                    <div className="flex gap-2">
                        <span className="inline-block px-3 py-1 bg-bg-tertiary text-text-secondary rounded-full text-xs font-medium">
                            {customer.type === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${customer.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                            {customer.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-base font-semibold text-text-primary mb-4">Informações de Contato</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex gap-4 items-start">
                        <Mail size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">E-mail</label>
                            <span className="text-sm text-text-primary leading-relaxed">{customer.email || '-'}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <Phone size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Telefone</label>
                            <span className="text-sm text-text-primary leading-relaxed">{formatPhone(customer.phone || '')}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <FileText size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Documento</label>
                            <span className="text-sm text-text-primary leading-relaxed">{formatDocument(customer.document || '', customer.type)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-base font-semibold text-text-primary mb-4">Endereço</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex gap-4 items-start col-span-1 sm:col-span-2">
                        <MapPin size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Endereço Completo</label>
                            <span className="text-sm text-text-primary leading-relaxed">
                                {customer.street ? `${customer.street}, ${customer.number || 'S/N'}` : '-'}
                                {customer.complement && ` - ${customer.complement}`}
                                <br />
                                {customer.neighborhood && `${customer.neighborhood}, `}
                                {customer.city && `${customer.city} - `}
                                {customer.state}
                                {customer.zipCode && <br />}
                                {customer.zipCode && `CEP: ${formatCEP(customer.zipCode)}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-base font-semibold text-text-primary mb-4">Metadados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Criado em</label>
                            <span className="text-sm text-text-primary leading-relaxed">{new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Atualizado em</label>
                            <span className="text-sm text-text-primary leading-relaxed">{new Date(customer.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
