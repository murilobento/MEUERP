import api from './api';
import type { Supplier, SupplierFilters, PaginatedResponse } from '../types';

export const supplierService = {
    list: async (filters: SupplierFilters = {}): Promise<PaginatedResponse<Supplier>> => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<PaginatedResponse<Supplier>>(`/suppliers?${params.toString()}`);
        return response.data;
    },

    getById: async (id: number): Promise<Supplier> => {
        const response = await api.get<Supplier>(`/suppliers/${id}`);
        return response.data;
    },

    create: async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> => {
        const response = await api.post<Supplier>('/suppliers', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Supplier>): Promise<Supplier> => {
        const response = await api.put<Supplier>(`/suppliers/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/suppliers/${id}`);
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
