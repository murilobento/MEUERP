import React from 'react';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';
import type { Supplier } from '../../types';
import { formatDocument, formatPhone, formatCEP } from '../../utils/masks';
import './SupplierDetail.css';

interface SupplierDetailProps {
    supplier: Supplier;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier }) => {
    return (
        <div className="supplier-detail">
            <div className="detail-header">
                <div className="supplier-avatar-lg">
                    {supplier.name.charAt(0).toUpperCase()}
                </div>
                <div className="supplier-title">
                    <h2>{supplier.name}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="supplier-type-badge">
                            {supplier.type === 'INDIVIDUAL' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                        <span className={`status-badge ${supplier.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                            {supplier.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
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
                            <span>{supplier.email || '-'}</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <Phone size={16} />
                        <div className="detail-content">
                            <label>Telefone</label>
                            <span>{formatPhone(supplier.phone || '')}</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <FileText size={16} />
                        <div className="detail-content">
                            <label>Documento</label>
                            <span>{formatDocument(supplier.document || '', supplier.type)}</span>
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

            <div className="detail-section">
                <h3>Metadados</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <div className="detail-content">
                            <label>Criado em</label>
                            <span>{new Date(supplier.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-content">
                            <label>Atualizado em</label>
                            <span>{new Date(supplier.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDetail;
