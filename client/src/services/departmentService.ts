import api from './api';
import type { Department, ApiResponse } from '../types/index';

export const departmentService = {
    async getAll(): Promise<Department[]> {
        const { data } = await api.get<ApiResponse<Department[]>>('/departments');
        return data.data || [];
    },

    async getById(id: number): Promise<Department> {
        const { data } = await api.get<ApiResponse<Department>>(`/departments/${id}`);
        return data.data!;
    },
};
