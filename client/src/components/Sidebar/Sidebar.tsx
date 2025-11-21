import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Package,
    ShoppingCart,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
    Building2,
    FileText,
    Truck,
    CreditCard,
    BarChart3,
    ClipboardList,
    Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import './Sidebar.css';

import { companyService } from '../../services/companyService';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const { sidebarOpen } = useLayout();
    const location = useLocation();
    const [companyName, setCompanyName] = useState('Nexus ERP');

    // Estado para o módulo selecionado (índice)
    const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCompanySettings = async () => {
            try {
                const settings = await companyService.getSettings();
                if (settings && settings.name) {
                    setCompanyName(settings.name);
                }
            } catch (error) {
                console.error('Erro ao carregar configurações da empresa:', error);
            }
        };

        fetchCompanySettings();
    }, []);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Detectar módulo ativo baseado na URL para seleção automática inicial
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/admin')) setSelectedModuleIndex(0);
        else if (path.includes('/financeiro')) setSelectedModuleIndex(1);
        else if (path.includes('/estoque')) setSelectedModuleIndex(2);
        else if (path.includes('/comercial')) setSelectedModuleIndex(3);
    }, [location.pathname]);

    type SubItem = {
        name: string;
        path: string;
        icon?: React.ComponentType<{ size: number }>;
    };

    const modules = [
        {
            name: 'Administrativo',
            icon: Building2,
            subItems: [
                { name: 'Configurações', path: '/admin/configuracoes', icon: Settings },
                { name: 'Funções e Acesso', path: '/admin/funcoes', icon: Shield },
                { name: 'Gestão de Equipe', path: '/admin/users', icon: Users },
            ] as SubItem[],
        },
        {
            name: 'Financeiro',
            icon: DollarSign,
            subItems: [
                { name: 'Dashboard', path: '/financeiro/dashboard', icon: LayoutDashboard },
                { name: 'Contas a Pagar', path: '/financeiro/contas-pagar', icon: CreditCard },
                { name: 'Contas a Receber', path: '/financeiro/contas-receber', icon: DollarSign },
                { name: 'Relatórios', path: '/financeiro/relatorios', icon: FileText },
            ] as SubItem[],
        },
        {
            name: 'Estoque',
            icon: Package,
            subItems: [
                { name: 'Dashboard', path: '/estoque/dashboard', icon: LayoutDashboard },
                { name: 'Inventário', path: '/estoque/inventario', icon: ClipboardList },
                { name: 'Movimentações', path: '/estoque/movimentacoes', icon: Truck },
                { name: 'Compras', path: '/estoque/compras', icon: ShoppingCart },
                { name: 'Fornecedores', path: '/estoque/fornecedores', icon: Truck },
                { name: 'Relatórios', path: '/estoque/relatorios', icon: FileText },
            ] as SubItem[],
        },
        {
            name: 'Comercial',
            icon: ShoppingCart,
            subItems: [
                { name: 'Dashboard', path: '/comercial/dashboard', icon: LayoutDashboard },
                { name: 'Vendas', path: '/comercial/vendas', icon: ShoppingCart },
                { name: 'Clientes', path: '/comercial/clientes', icon: Users },
                { name: 'Relatórios', path: '/comercial/relatorios', icon: BarChart3 },
            ] as SubItem[],
        },
    ];

    const currentModule = modules[selectedModuleIndex];

    const handleModuleSelect = (index: number) => {
        setSelectedModuleIndex(index);
        setIsDropdownOpen(false);
    };

    return (
        <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <LayoutDashboard size={24} />
                    </div>
                    {sidebarOpen && (
                        <div className="logo-text">
                            <h1>{companyName}</h1>
                        </div>
                    )}
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `sidebar-link main-dashboard ${isActive && location.pathname === '/' ? 'active' : ''}`}
                        end
                    >
                        <LayoutDashboard size={20} />
                        {sidebarOpen && <span>Painel Principal</span>}
                    </NavLink>
                </div>

                {sidebarOpen && (
                    <div className="module-selector-container" ref={dropdownRef}>
                        <label className="module-label">MÓDULO</label>
                        <div
                            className={`module-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="module-info">
                                <currentModule.icon size={18} />
                                <span>{currentModule.name}</span>
                            </div>
                            <ChevronDown size={16} className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`} />
                        </div>

                        {isDropdownOpen && (
                            <div className="module-dropdown-menu">
                                {modules.map((module, index) => (
                                    <div
                                        key={module.name}
                                        className={`module-option ${index === selectedModuleIndex ? 'selected' : ''}`}
                                        onClick={() => handleModuleSelect(index)}
                                    >
                                        <module.icon size={16} />
                                        <span>{module.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Se sidebar estiver fechada, mostra ícones dos módulos como atalhos rápidos ou tooltip */}
                {!sidebarOpen && (
                    <div className="collapsed-modules-divider"></div>
                )}

                <div className="sidebar-content">
                    {sidebarOpen && (
                        <h3 className="module-section-title">{currentModule.name.toUpperCase()}</h3>
                    )}

                    <div className="module-links">
                        {currentModule.subItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                                title={!sidebarOpen ? item.name : ''}
                            >
                                {item.icon && <item.icon size={20} />}
                                {sidebarOpen && <span>{item.name}</span>}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <NavLink to="/ajuda" className="sidebar-link" title={!sidebarOpen ? 'Ajuda' : ''}>
                        <HelpCircle size={20} />
                        {sidebarOpen && <span>Ajuda</span>}
                    </NavLink>

                    <button className="sidebar-link logout-btn" onClick={logout} title={!sidebarOpen ? 'Sair' : ''}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Sair</span>}
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
