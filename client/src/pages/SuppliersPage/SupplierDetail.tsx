import React from 'react';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';
import type { Supplier } from '../../types';
import { formatDocument, formatPhone, formatCEP } from '../../utils/masks';

interface SupplierDetailProps {
    supplier: Supplier;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier }) => {
    return (
        <div className="flex flex-col gap-8 py-4">
            <div className="flex items-center gap-6 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center text-3xl font-semibold">
                    {supplier.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-text-primary mb-2">{supplier.name}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="inline-block px-3 py-1 bg-bg-tertiary text-text-secondary rounded-full text-xs font-medium">
                            {supplier.type === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${supplier.status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                            {supplier.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-text-primary mb-4">Informações de Contato</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex gap-4 items-start">
                        <Mail size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">E-mail</label>
                            <span className="text-sm text-text-primary leading-relaxed">{supplier.email || '-'}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <Phone size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Telefone</label>
                            <span className="text-sm text-text-primary leading-relaxed">{formatPhone(supplier.phone || '')}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <FileText size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Documento</label>
                            <span className="text-sm text-text-primary leading-relaxed">{formatDocument(supplier.document || '', supplier.type)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-text-primary mb-4">Endereço</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex gap-4 items-start col-span-full">
                        <MapPin size={16} className="text-text-tertiary mt-1" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Endereço Completo</label>
                            <span className="text-sm text-text-primary leading-relaxed">
                                {supplier.street ? `${supplier.street}, ${supplier.number || 'S/N'}` : '-'}
                                {supplier.complement && ` - ${supplier.complement}`}
                                <br />
                                {supplier.neighborhood && `${supplier.neighborhood}, `}
                                {supplier.city && `${supplier.city} - `}
                                {supplier.state}
                                {supplier.zipCode && <br />}
                                {supplier.zipCode && `CEP: ${formatCEP(supplier.zipCode)}`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-text-primary mb-4">Metadados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Criado em</label>
                            <span className="text-sm text-text-primary leading-relaxed">{new Date(supplier.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Atualizado em</label>
                            <span className="text-sm text-text-primary leading-relaxed">{new Date(supplier.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDetail;
