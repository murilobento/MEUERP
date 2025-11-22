import api from './api';
import type { User, PaginatedResponse, ApiResponse } from '../types/index';

export interface UserFilters {
    status?: string;
    role?: string;
    departmentId?: number;
    search?: string;
    page?: number;
    limit?: number;
}

export const userService = {
    async getAll(filters?: UserFilters): Promise<PaginatedResponse<User>> {
        const { data } = await api.get<PaginatedResponse<User>>('/users', { params: filters });
        return data;
    },

    async getById(id: number): Promise<User> {
        const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
        return data.data!;
    },

    async create(userData: Partial<User>): Promise<User> {
        const { data } = await api.post<ApiResponse<User>>('/users', userData);
        return data.data!;
    },

    async update(id: number, userData: Partial<User>): Promise<User> {
        const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
        return data.data!;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    },

    async updatePassword(id: number, password: string) {
        const response = await api.put(`/users/${id}/password`, { password });
        return response.data;
    },

    async search(query: string) {
        const response = await api.get('/users', { params: { search: query } });
        return response.data.data; // Assuming the API returns { data: users, ... }
    }
};
