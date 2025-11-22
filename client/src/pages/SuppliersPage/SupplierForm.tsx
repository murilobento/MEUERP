import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, FileText, MapPin, Building } from 'lucide-react';
import type { Supplier, SupplierType } from '../../types';
import { supplierService } from '../../services/supplierService';
import { maskCPF, maskCNPJ, maskPhone, maskCEP, validateCPF, validateCNPJ, validatePhone, validateCEP } from '../../utils/masks';

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <h3 className="text-base font-semibold text-text-primary pb-2 border-b border-border mb-4">Dados do Fornecedor</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2 col-span-full sm:col-span-2">
                        <label className="text-sm font-medium text-text-secondary">Nome Completo / Razão Social</label>
                        <div className="relative flex items-center">
                            <User size={16} className="absolute left-3 text-text-tertiary pointer-events-none z-10" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                placeholder="Nome do fornecedor"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Tipo de Fornecedor</label>
                        <div className="flex gap-4 flex-wrap">
                            <label className="flex-1 min-w-[150px] relative cursor-pointer flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="INDIVIDUAL"
                                    checked={formData.type === 'INDIVIDUAL'}
                                    onChange={handleChange}
                                    className="absolute opacity-0 w-0 h-0"
                                />
                                <span className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg bg-bg-primary transition-all w-full text-sm font-medium ${formData.type === 'INDIVIDUAL' ? 'border-primary bg-primary-light text-primary' : 'border-border text-text-secondary hover:border-primary hover:bg-bg-secondary'}`}>
                                    <User size={16} className={formData.type === 'INDIVIDUAL' ? 'text-primary' : 'text-text-tertiary'} />
                                    Pessoa Física
                                </span>
                            </label>
                            <label className="flex-1 min-w-[150px] relative cursor-pointer flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="COMPANY"
                                    checked={formData.type === 'COMPANY'}
                                    onChange={handleChange}
                                    className="absolute opacity-0 w-0 h-0"
                                />
                                <span className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg bg-bg-primary transition-all w-full text-sm font-medium ${formData.type === 'COMPANY' ? 'border-primary bg-primary-light text-primary' : 'border-border text-text-secondary hover:border-primary hover:bg-bg-secondary'}`}>
                                    <Building size={16} className={formData.type === 'COMPANY' ? 'text-primary' : 'text-text-tertiary'} />
                                    Pessoa Jurídica
                                </span>
                            </label>
                        </div>
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">{formData.type === 'INDIVIDUAL' ? 'CPF' : 'CNPJ'}</label>
                        <div className="relative flex items-center">
                            <FileText size={16} className="absolute left-3 text-text-tertiary pointer-events-none z-10" />
                            <input
                                type="text"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                onBlur={handleDocumentBlur}
                                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:ring-2 ${errors.document ? 'border-danger bg-danger/5 focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary-light'}`}
                                placeholder={formData.type === 'INDIVIDUAL' ? '000.000.000-00' : '00.000.000/0000-00'}
                            />
                        </div>
                        {errors.document && <span className="flex items-center gap-1 text-xs text-danger mt-1 animate-[slideDown_0.2s_ease]">⚠ {errors.document}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">E-mail</label>
                        <div className="relative flex items-center">
                            <Mail size={16} className="absolute left-3 text-text-tertiary pointer-events-none z-10" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                placeholder="email@exemplo.com"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Telefone</label>
                        <div className="relative flex items-center">
                            <Phone size={16} className="absolute left-3 text-text-tertiary pointer-events-none z-10" />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handlePhoneBlur}
                                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:ring-2 ${errors.phone ? 'border-danger bg-danger/5 focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary-light'}`}
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        {errors.phone && <span className="flex items-center gap-1 text-xs text-danger mt-1 animate-[slideDown_0.2s_ease]">⚠ {errors.phone}</span>}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-base font-semibold text-text-primary pb-2 border-b border-border mb-4">Endereço</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">CEP</label>
                        <div className="relative flex items-center max-w-[150px]">
                            <MapPin size={16} className="absolute left-3 text-text-tertiary pointer-events-none z-10" />
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                onBlur={handleZipCodeBlur}
                                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:ring-2 ${errors.zipCode ? 'border-danger bg-danger/5 focus:border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary-light'}`}
                                placeholder="00000-000"
                            />
                            {cepLoading && <span className="absolute right-3 text-xs text-text-secondary">...</span>}
                        </div>
                        {errors.zipCode && <span className="flex items-center gap-1 text-xs text-danger mt-1 animate-[slideDown_0.2s_ease]">⚠ {errors.zipCode}</span>}
                    </div>

                    <div className="grid grid-cols-[3fr_1fr] gap-4 col-span-full sm:col-span-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-secondary">Rua</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                placeholder="Nome da rua"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-secondary">Número</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Complemento</label>
                        <input
                            type="text"
                            name="complement"
                            value={formData.complement}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                            placeholder="Apto, Bloco"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Bairro</label>
                        <input
                            type="text"
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                            placeholder="Bairro"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Cidade</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                            placeholder="Cidade"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Estado</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                            placeholder="UF"
                            maxLength={2}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <button type="button" className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50" disabled={loading}>
                    {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Fornecedor'}
                </button>
            </div>
        </form>
    );
};

export default SupplierForm;
