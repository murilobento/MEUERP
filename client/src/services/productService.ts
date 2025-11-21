import api from './api';
import type { Product, ProductFilters } from '../types';

export const productService = {
    getAll: async (filters?: ProductFilters) => {
        const response = await api.get<Product[]>('/products', { params: filters });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    create: async (data: Partial<Product>) => {
        const response = await api.post<Product>('/products', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Product>) => {
        const response = await api.put<Product>(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/products/${id}`);
    }
};
