import React, { useState, useEffect } from 'react';
import { Save, Building, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { companyService } from '../../../services/companyService';
import './CompanySettings.css';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            toast.error('Erro ao salvar configurações');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <div className="breadcrumb">
                        <span>Administrativo</span>
                        <span>/</span>
                        <span>Configurações</span>
                    </div>
                    <h1>Dados da Empresa</h1>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
                {/* Informações Básicas */}
                <div className="card settings-section">
                    <div className="section-header">
                        <Building size={20} />
                        <h2>Informações Básicas</h2>
                    </div>
                    <div className="form-grid">
                        <div className="form-group span-2">
                            <label>Razão Social / Nome Fantasia</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                placeholder="Nome da sua empresa"
                            />
                        </div>
                        <div className="form-group">
                            <label>CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                className="input"
                                placeholder="00.000.000/0001-00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Website</label>
                            <div className="input-icon-wrapper">
                                <Globe size={16} />
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="www.exemplo.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contato */}
                <div className="card settings-section">
                    <div className="section-header">
                        <Phone size={20} />
                        <h2>Contato</h2>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>E-mail Principal</label>
                            <div className="input-icon-wrapper">
                                <Mail size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="contato@empresa.com"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Telefone / WhatsApp</label>
                            <div className="input-icon-wrapper">
                                <Phone size={16} />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Endereço */}
                <div className="card settings-section">
                    <div className="section-header">
                        <MapPin size={20} />
                        <h2>Endereço</h2>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>CEP</label>
                            <input
                                type="text"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                                className="input"
                                placeholder="00000-000"
                            />
                        </div>
                        <div className="form-group span-2">
                            <label>Rua / Avenida</label>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                className="input"
                                placeholder="Nome da rua"
                            />
                        </div>
                        <div className="form-group">
                            <label>Número</label>
                            <input
                                type="text"
                                name="address.number"
                                value={formData.address.number}
                                onChange={handleChange}
                                className="input"
                                placeholder="123"
                            />
                        </div>
                        <div className="form-group">
                            <label>Complemento</label>
                            <input
                                type="text"
                                name="address.complement"
                                value={formData.address.complement}
                                onChange={handleChange}
                                className="input"
                                placeholder="Sala, Bloco, etc."
                            />
                        </div>
                        <div className="form-group">
                            <label>Bairro</label>
                            <input
                                type="text"
                                name="address.neighborhood"
                                value={formData.address.neighborhood}
                                onChange={handleChange}
                                className="input"
                                placeholder="Bairro"
                            />
                        </div>
                        <div className="form-group">
                            <label>Cidade</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                className="input"
                                placeholder="Cidade"
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado (UF)</label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                className="input"
                                placeholder="UF"
                                maxLength={2}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default CompanySettings;
