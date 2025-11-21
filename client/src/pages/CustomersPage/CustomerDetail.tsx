import React from 'react';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';
import type { Customer } from '../../types';
import { formatDocument, formatPhone, formatCEP } from '../../utils/masks';
import './CustomerDetail.css';

interface CustomerDetailProps {
    customer: Customer;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
    return (
        <div className="customer-detail">
            <div className="detail-header">
                <div className="customer-avatar-lg">
                    {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="customer-title">
                    <h2>{customer.name}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="customer-type-badge">
                            {customer.type === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                        <span className={`status-badge ${customer.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                            {customer.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>Informações de Contato</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <Mail size={16} />
                        <div className="detail-content">
                            <label>E-mail</label>
                            <span>{customer.email || '-'}</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Phone size={16} />
                        <div className="detail-content">
                            <label>Telefone</label>
                            <span>{formatPhone(customer.phone || '')}</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <FileText size={16} />
                        <div className="detail-content">
                            <label>Documento</label>
                            <span>{formatDocument(customer.document || '', customer.type)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>Endereço</h3>
                <div className="detail-grid">
                    <div className="detail-item span-2">
                        <MapPin size={16} />
                        <div className="detail-content">
                            <label>Endereço Completo</label>
                            <span>
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

            <div className="detail-section">
                <h3>Metadados</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <div className="detail-content">
                            <label>Criado em</label>
                            <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-content">
                            <label>Atualizado em</label>
                            <span>{new Date(customer.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
