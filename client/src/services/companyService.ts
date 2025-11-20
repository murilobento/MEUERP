import api from './api';

export interface CompanySettings {
    id: number;
    name: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    website?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export const companyService = {
    getSettings: async () => {
        const response = await api.get<CompanySettings>('/company');
        return response.data;
    },

    updateSettings: async (data: Partial<CompanySettings>) => {
        const response = await api.put<CompanySettings>('/company', data);
        return response.data;
    },
};
