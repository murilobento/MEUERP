import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse, ApiResponse, User } from '../types/index';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        if (data.data) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        return data.data!;
    },

    async register(userData: RegisterData): Promise<User> {
        const { data } = await api.post<ApiResponse<User>>('/auth/register', userData);
        return data.data!;
    },

    async me(): Promise<User> {
        const { data } = await api.get<ApiResponse<User>>('/auth/me');
        return data.data!;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
