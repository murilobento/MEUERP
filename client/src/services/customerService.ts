import api from './api';
import type { Customer, CustomerFilters, PaginatedResponse } from '../types';

export const customerService = {
    list: async (filters: CustomerFilters = {}): Promise<PaginatedResponse<Customer>> => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<PaginatedResponse<Customer>>(`/customers?${params.toString()}`);
        return response.data;
    },

    getById: async (id: number): Promise<Customer> => {
        const response = await api.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    create: async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
        const response = await api.post<Customer>('/customers', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
        const response = await api.put<Customer>(`/customers/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/customers/${id}`);
    },

    // ViaCEP
    getAddressByZipCode: async (zipCode: string): Promise<any> => {
        // Remover caracteres não numéricos
        const cleanZip = zipCode.replace(/\D/g, '');
        if (cleanZip.length !== 8) return null;

        const response = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
        const data = await response.json();

        if (data.erro) return null;

        return {
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            complement: data.complemento
        };
    }
};
