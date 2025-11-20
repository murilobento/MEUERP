import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface LayoutContextData {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextData>({} as LayoutContextData);

interface LayoutProviderProps {
    children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
    // Inicia fechado em telas pequenas (mobile first logic pode ser aplicada aqui ou via CSS media queries)
    // Por padrão true (aberto) em desktop
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout deve ser usado dentro de um LayoutProvider');
    }
    return context;
};
