import api from './api';
import type { Sale, SaleFilters, PaginatedResponse } from '../types';

export const saleService = {
  list: async (filters: SaleFilters = {}): Promise<PaginatedResponse<Sale>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const response = await api.get<PaginatedResponse<Sale>>(`/sales?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Sale> => {
    const response = await api.get<Sale>(`/sales/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<Sale> => {
    const response = await api.post<Sale>('/sales', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<Sale> => {
    const response = await api.put<Sale>(`/sales/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/sales/${id}`);
  }
};

export type { Sale, SaleFilters };