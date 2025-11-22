import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
    Shield,
    Trello,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import { companyService } from '../../services/companyService';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const { sidebarOpen, toggleSidebar, closeSidebar } = useLayout();
    const location = useLocation();
    const navigate = useNavigate();
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

    // Fechar sidebar ao navegar em mobile
    useEffect(() => {
        // Adiciona listener apenas para fechar ao navegar se for mobile
        if (window.innerWidth < 768) {
            closeSidebar();
        }
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
                { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
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

        // Navegar para o primeiro item do módulo selecionado (geralmente o Dashboard)
        const selectedModule = modules[index];
        if (selectedModule && selectedModule.subItems.length > 0) {
            navigate(selectedModule.subItems[0].path);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 bg-bg-secondary border-r border-border
                    flex flex-col transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="min-w-[40px] h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <LayoutDashboard size={24} />
                        </div>
                        <div className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'} whitespace-nowrap`}>
                            <h1 className="text-lg font-bold text-text-primary">{companyName}</h1>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-text-secondary hover:text-text-primary"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-6 overflow-y-auto flex flex-col gap-1">
                    <div className="mb-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-2 py-1 rounded-lg transition-all duration-200 font-medium whitespace-nowrap mb-4
                                ${isActive && location.pathname === '/'
                                    ? 'bg-bg-primary text-primary font-semibold'
                                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}
                                ${!sidebarOpen ? 'justify-center px-0' : ''}
                            `}
                            end
                            title={!sidebarOpen ? 'Painel Principal' : ''}
                        >
                            <LayoutDashboard size={20} />
                            {sidebarOpen && <span>Painel Principal</span>}
                        </NavLink>

                        <NavLink
                            to="/kanban"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-2 py-1 rounded-lg transition-all duration-200 font-medium whitespace-nowrap
                                ${isActive
                                    ? 'bg-bg-primary text-primary font-semibold'
                                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}
                                ${!sidebarOpen ? 'justify-center px-0' : ''}
                            `}
                            title={!sidebarOpen ? 'Kanban' : ''}
                        >
                            <Trello size={20} />
                            {sidebarOpen && <span>Kanban</span>}
                        </NavLink>
                    </div>

                    {sidebarOpen && (
                        <div className="bg-bg-tertiary p-3 rounded-xl mb-2 relative border border-border" ref={dropdownRef}>
                            <label className="block text-[10px] font-bold uppercase text-text-secondary mb-2 tracking-wider">MÓDULO</label>
                            <div
                                className={`
                                    flex items-center justify-between p-2.5 bg-bg-secondary border border-primary rounded-lg cursor-pointer transition-all duration-200 text-text-primary
                                    ${isDropdownOpen ? 'bg-bg-primary' : ''}
                                `}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="flex items-center gap-2 font-medium text-sm">
                                    <currentModule.icon size={18} />
                                    <span>{currentModule.name}</span>
                                </div>
                                <ChevronDown size={16} className={`text-text-secondary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-[calc(100%+5px)] left-0 right-0 bg-bg-secondary border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {modules.map((module, index) => (
                                        <div
                                            key={module.name}
                                            className={`
                                                flex items-center gap-3 p-3 cursor-pointer transition-colors duration-200 text-text-secondary text-sm
                                                hover:bg-bg-tertiary hover:text-text-primary
                                                ${index === selectedModuleIndex ? 'bg-bg-primary text-primary font-medium' : ''}
                                            `}
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

                    {!sidebarOpen && (
                        <div className="h-px w-full bg-border my-4"></div>
                    )}

                    <div className="flex flex-col gap-1">
                        {sidebarOpen && (
                            <h3 className="text-xs font-bold text-text-secondary uppercase mt-4 mb-2 ml-4 tracking-wider">{currentModule.name}</h3>
                        )}

                        <div className="flex flex-col gap-1">
                            {currentModule.subItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-2 py-1 rounded-lg transition-all duration-200 font-medium whitespace-nowrap
                                        ${isActive
                                            ? 'bg-bg-primary text-primary font-semibold'
                                            : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}
                                        ${!sidebarOpen ? 'justify-center px-0' : ''}
                                    `}
                                    title={!sidebarOpen ? item.name : ''}
                                >
                                    {item.icon && <item.icon size={20} />}
                                    {sidebarOpen && <span>{item.name}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex flex-col gap-1">
                        <NavLink
                            to="/ajuda"
                            className={`
                                flex items-center gap-3 px-2 py-1 rounded-lg transition-all duration-200 font-medium whitespace-nowrap text-text-secondary hover:bg-bg-tertiary hover:text-text-primary
                                ${!sidebarOpen ? 'justify-center px-0' : ''}
                            `}
                            title={!sidebarOpen ? 'Ajuda' : ''}
                        >
                            <HelpCircle size={20} />
                            {sidebarOpen && <span>Ajuda</span>}
                        </NavLink>

                        <button
                            className={`
                                flex items-center gap-3 px-2 py-1 rounded-lg transition-all duration-200 font-medium whitespace-nowrap text-danger hover:bg-danger/10 w-full
                                ${!sidebarOpen ? 'justify-center px-0' : ''}
                            `}
                            onClick={logout}
                            title={!sidebarOpen ? 'Sair' : ''}
                        >
                            <LogOut size={20} />
                            {sidebarOpen && <span>Sair</span>}
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
