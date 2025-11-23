import React, { useState, useEffect } from 'react';
import { Save, Building, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { companyService } from '../../../services/companyService';
import { MaskedInput } from '../../../components/ui/MaskedInput/MaskedInput';
import { validateCNPJ, validatePhone, validateCEP } from '../../../utils/masks';


interface CompanyFormData {
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    website: string;
    address: {
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

const CompanySettings: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [formData, setFormData] = useState<CompanyFormData>({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        website: '',
        address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
        },
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await companyService.getSettings();
            setFormData({
                name: data.name || '',
                cnpj: data.cnpj || '',
                email: data.email || '',
                phone: data.phone || '',
                website: data.website || '',
                address: {
                    street: data.street || '',
                    number: data.number || '',
                    complement: data.complement || '',
                    neighborhood: data.neighborhood || '',
                    city: data.city || '',
                    state: data.state || '',
                    zipCode: data.zipCode || '',
                },
            });
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            toast.error('Erro ao carregar configurações da empresa');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleMaskedChange = (name: string, value: string) => {
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCepBlur = async () => {
        const cep = formData.address.zipCode.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                toast.error('CEP não encontrado');
                return;
            }

            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf,
                },
            }));
            toast.success('Endereço encontrado!');
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            toast.error('Erro ao buscar CEP');
        } finally {
            setLoadingCep(false);
        }
    };

    const validateForm = (): boolean => {
        if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
            toast.error('CNPJ inválido');
            return false;
        }
        if (formData.phone && !validatePhone(formData.phone)) {
            toast.error('Telefone inválido');
            return false;
        }
        if (formData.address.zipCode && !validateCEP(formData.address.zipCode)) {
            toast.error('CEP inválido');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Converter estrutura aninhada para plana
            const payload = {
                name: formData.name,
                cnpj: formData.cnpj,
                email: formData.email,
                phone: formData.phone,
                website: formData.website,
                street: formData.address.street,
                number: formData.address.number,
                complement: formData.address.complement,
                neighborhood: formData.address.neighborhood,
                city: formData.address.city,
                state: formData.address.state,
                zipCode: formData.address.zipCode,
            };

            await companyService.updateSettings(payload);
            toast.success('Configurações salvas com sucesso!', {
                style: {
                    background: '#10B981',
                    color: '#fff',
                    fontWeight: 'bold',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#10B981',
                },
            });

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            console.error('Erro ao salvar configurações:', error);
            if (error.response?.status === 403) {
                toast.error('Você não tem permissão para alterar as configurações da empresa.');
            } else {
                toast.error('Erro ao salvar configurações');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <span>Administrativo</span>
                        <span>/</span>
                        <span>Configurações</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-text-primary m-0">Dados da Empresa</h1>
                </div>
                <button
                    className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-hover flex items-center gap-2"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="bg-bg-primary rounded-lg border border-border p-8 max-md:p-4">
                    {/* Informações Básicas */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2 pb-4 border-b border-border text-primary">
                            <Building size={20} />
                            <h2 className="text-lg font-semibold m-0 text-text-primary">Informações Básicas</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium text-text-secondary">Razão Social / Nome Fantasia</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                    placeholder="Nome da sua empresa"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <MaskedInput
                                    label="CNPJ"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={(val) => handleMaskedChange('cnpj', val)}
                                    maskType="cnpj"
                                    validate={validateCNPJ}
                                    placeholder="00.000.000/0001-00"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary">Website</label>
                                <div className="relative flex items-center">
                                    <Globe size={16} className="absolute left-3 text-text-secondary pointer-events-none" />
                                    <input
                                        type="text"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                        placeholder="www.exemplo.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border my-8 w-full" />

                    {/* Contato */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2 pb-4 border-b border-border text-primary">
                            <Phone size={20} />
                            <h2 className="text-lg font-semibold m-0 text-text-primary">Contato</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-secondary">E-mail Principal</label>
                                <div className="relative flex items-center">
                                    <Mail size={16} className="absolute left-3 text-text-secondary pointer-events-none" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                        placeholder="contato@empresa.com"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <MaskedInput
                                    label="Telefone / WhatsApp"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(val) => handleMaskedChange('phone', val)}
                                    maskType="phone"
                                    validate={validatePhone}
                                    icon={<Phone size={16} />}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border my-8 w-full" />

                    {/* Endereço */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2 pb-4 border-b border-border text-primary">
                            <MapPin size={20} />
                            <h2 className="text-lg font-semibold m-0 text-text-primary">Endereço</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <MaskedInput
                                    label="CEP"
                                    name="address.zipCode"
                                    value={formData.address.zipCode}
                                    onChange={(val) => handleMaskedChange('address.zipCode', val)}
                                    onBlur={handleCepBlur}
                                    maskType="cep"
                                    validate={validateCEP}
                                    placeholder="00000-000"
                                />
                                {loadingCep && <span className="text-sm text-blue-500 mt-1">Buscando endereço...</span>}
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-4">
                                <label className="text-sm font-medium text-text-secondary">Rua / Avenida</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                    placeholder="Nome da rua"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium text-text-secondary">Número</label>
                                <input
                                    type="text"
                                    name="address.number"
                                    value={formData.address.number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                    placeholder="123"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium text-text-secondary">Complemento</label>
                                <input
                                    type="text"
                                    name="address.complement"
                                    value={formData.address.complement}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                    placeholder="Sala, Bloco, etc."
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium text-text-secondary">Bairro</label>
                                <input
                                    type="text"
                                    name="address.neighborhood"
                                    value={formData.address.neighborhood}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                    placeholder="Bairro"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-4">
                                <label className="text-sm font-medium text-text-secondary">Cidade</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                    placeholder="Cidade"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium text-text-secondary">Estado (UF)</label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary-light outline-none"
                                    placeholder="UF"
                                    maxLength={2}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CompanySettings;
