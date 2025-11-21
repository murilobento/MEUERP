import api from './api';
import type { Category } from '../types';

export const categoryService = {
    getAll: async () => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    create: async (data: Partial<Category>) => {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Category>) => {
        const response = await api.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/categories/${id}`);
    }
};
