import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials } from '../types/index';
import { authService } from '../services/authService';

interface AuthContextData {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar se há usuário armazenado
        const loadUser = async () => {
            try {
                const storedUser = authService.getStoredUser();
                const token = authService.getToken();

                if (storedUser && token) {
                    // Validar token buscando dados atualizados do usuário
                    const currentUser = await authService.me();
                    setUser(currentUser);
                }
            } catch (error) {
                // Token inválido, limpar storage
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const { user: loggedUser } = await authService.login(credentials);
        setUser(loggedUser);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
