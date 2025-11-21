export interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    status: 'ACTIVE' | 'INACTIVE';
    role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
    departmentId?: number;
    department?: Department;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}

export interface Department {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: string;
    departmentId?: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

export interface Customer {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    document?: string;
    status: 'ACTIVE' | 'INACTIVE';
    type: CustomerType;
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerFilters {
    search?: string;
    page?: number;
    limit?: number;
}
