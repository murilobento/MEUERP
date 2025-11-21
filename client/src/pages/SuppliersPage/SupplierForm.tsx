import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, FileText, MapPin, Building } from 'lucide-react';
import type { Supplier, SupplierType } from '../../types';
import { supplierService } from '../../services/supplierService';
import { maskCPF, maskCNPJ, maskPhone, maskCEP, validateCPF, validateCNPJ, validatePhone, validateCEP } from '../../utils/masks';
import './SupplierForm.css';

interface SupplierFormProps {
    initialData?: Supplier | null;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    supplierStatus: 'ACTIVE' | 'INACTIVE';
}

const SupplierForm: React.FC<SupplierFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
    supplierStatus,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        document: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
        type: 'COMPANY' as SupplierType,
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    });

    const [cepLoading, setCepLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email || '',
                phone: initialData.phone || '',
                document: initialData.document || '',
                status: initialData.status,
                type: initialData.type,
                zipCode: initialData.zipCode || '',
                street: initialData.street || '',
                number: initialData.number || '',
                complement: initialData.complement || '',
                neighborhood: initialData.neighborhood || '',
                city: initialData.city || '',
                state: initialData.state || '',
            });
        }
    }, [initialData]);

    useEffect(() => {
        setFormData(prev => ({ ...prev, status: supplierStatus }));
    }, [supplierStatus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let maskedValue = value;

        // Apply masks based on field name
        if (name === 'document') {
            maskedValue = formData.type === 'INDIVIDUAL' ? maskCPF(value) : maskCNPJ(value);
        } else if (name === 'phone') {
            maskedValue = maskPhone(value);
        } else if (name === 'zipCode') {
            maskedValue = maskCEP(value);
        }

        setFormData((prev) => ({ ...prev, [name]: maskedValue }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDocumentBlur = () => {
        if (formData.document) {
            const isValid = formData.type === 'INDIVIDUAL'
                ? validateCPF(formData.document)
                : validateCNPJ(formData.document);

            if (!isValid) {
                setErrors(prev => ({
                    ...prev,
                    document: formData.type === 'INDIVIDUAL' ? 'CPF inválido' : 'CNPJ inválido'
                }));
            }
        }
    };

    const handlePhoneBlur = () => {
        if (formData.phone && !validatePhone(formData.phone)) {
            setErrors(prev => ({ ...prev, phone: 'Telefone inválido' }));
        }
    };

    const handleZipCodeBlur = async () => {
        const zipCode = formData.zipCode.replace(/\D/g, '');

        // Validate CEP format
        if (formData.zipCode && !validateCEP(formData.zipCode)) {
            setErrors(prev => ({ ...prev, zipCode: 'CEP inválido' }));
            return;
        }

        if (zipCode.length === 8) {
            setCepLoading(true);
            try {
                const address = await supplierService.getAddressByZipCode(zipCode);
                if (address) {
                    setFormData((prev) => ({
                        ...prev,
                        street: address.street || prev.street,
                        neighborhood: address.neighborhood || prev.neighborhood,
                        city: address.city || prev.city,
                        state: address.state || prev.state,
                        complement: address.complement || prev.complement,
                    }));
                    // Clear error if CEP was found
                    setErrors(prev => ({ ...prev, zipCode: '' }));
                } else {
                    // CEP not found
                    setErrors(prev => ({ ...prev, zipCode: 'CEP não encontrado' }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP', error);
                setErrors(prev => ({ ...prev, zipCode: 'CEP não encontrado' }));
            } finally {
                setCepLoading(false);
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate document
        if (formData.document) {
            const isValid = formData.type === 'INDIVIDUAL'
                ? validateCPF(formData.document)
                : validateCNPJ(formData.document);

            if (!isValid) {
                newErrors.document = formData.type === 'INDIVIDUAL' ? 'CPF inválido' : 'CNPJ inválido';
            }
        }

        // Validate phone
        if (formData.phone && !validatePhone(formData.phone)) {
            newErrors.phone = 'Telefone inválido';
        }

        // Validate CEP
        if (formData.zipCode && !validateCEP(formData.zipCode)) {
            newErrors.zipCode = 'CEP inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="supplier-form">
            <div className="form-section">
                <h3>Dados do Fornecedor</h3>
                <div className="form-grid">
                    <div className="form-group span-2">
                        <label>Nome Completo / Razão Social</label>
                        <div className="input-icon-wrapper">
                            <User size={16} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                placeholder="Nome do fornecedor"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tipo de Fornecedor</label>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value="INDIVIDUAL"
                                    checked={formData.type === 'INDIVIDUAL'}
                                    onChange={handleChange}
                                />
                                <span className="radio-label">
                                    <User size={16} />
                                    Pessoa Física
                                </span>
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value="COMPANY"
                                    checked={formData.type === 'COMPANY'}
                                    onChange={handleChange}
                                />
                                <span className="radio-label">
                                    <Building size={16} />
                                    Pessoa Jurídica
                                </span>
                            </label>
                        </div>
                    </div>


                    <div className="form-group">
                        <label>{formData.type === 'INDIVIDUAL' ? 'CPF' : 'CNPJ'}</label>
                        <div className="input-icon-wrapper">
                            <FileText size={16} />
                            <input
                                type="text"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                onBlur={handleDocumentBlur}
                                className={`input ${errors.document ? 'input-error' : ''}`}
                                placeholder={formData.type === 'INDIVIDUAL' ? '000.000.000-00' : '00.000.000/0000-00'}
                            />
                        </div>
                        {errors.document && <span className="error-message">{errors.document}</span>}
                    </div>

                    <div className="form-group">
                        <label>E-mail</label>
                        <div className="input-icon-wrapper">
                            <Mail size={16} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="email@exemplo.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Telefone</label>
                        <div className="input-icon-wrapper">
                            <Phone size={16} />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handlePhoneBlur}
                                className={`input ${errors.phone ? 'input-error' : ''}`}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Endereço</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>CEP</label>
                        <div className="input-icon-wrapper" style={{ maxWidth: '150px' }}>
                            <MapPin size={16} />
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                onBlur={handleZipCodeBlur}
                                className={`input ${errors.zipCode ? 'input-error' : ''}`}
                                placeholder="00000-000"
                            />
                            {cepLoading && <span className="loading-indicator">...</span>}
                        </div>
                        {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label>Rua</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className="input"
                                placeholder="Nome da rua"
                            />
                        </div>
                        <div className="form-group">
                            <label>Número</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className="input"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Complemento</label>
                        <input
                            type="text"
                            name="complement"
                            value={formData.complement}
                            onChange={handleChange}
                            className="input"
                            placeholder="Apto, Bloco"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bairro</label>
                        <input
                            type="text"
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleChange}
                            className="input"
                            placeholder="Bairro"
                        />
                    </div>

                    <div className="form-group">
                        <label>Cidade</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="input"
                            placeholder="Cidade"
                        />
                    </div>

                    <div className="form-group">
                        <label>Estado</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="input"
                            placeholder="UF"
                            maxLength={2}
                        />
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Fornecedor'}
                </button>
            </div>
        </form>
    );
};

export default SupplierForm;
