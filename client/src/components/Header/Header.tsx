import React, { useState } from 'react';
import {
    Bell,
    Sun,
    Moon,
    User,
    Menu,
    LogOut,
    Settings,
    Cloud,
    Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLayout } from '../../contexts/LayoutContext';
import { useDateTime } from '../../hooks/useDateTime';
import { useWeather } from '../../hooks/useWeather';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { toggleSidebar } = useLayout();
    const { formattedDate, formattedTime } = useDateTime();
    const weather = useWeather();

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
                <button
                    className="w-10 h-10 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-lg cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:text-primary"
                    onClick={toggleSidebar}
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Widget Data/Hora - Hidden on Mobile */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-bg-tertiary rounded-lg text-text-secondary">
                    <Calendar size={16} />
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-text-primary">{formattedTime}</span>
                        <span className="text-xs">{formattedDate}</span>
                    </div>
                </div>

                {/* Widget Clima - Hidden on Mobile */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-bg-tertiary rounded-lg text-text-secondary relative group cursor-default">
                    <Cloud size={16} />
                    <div className="flex flex-col leading-tight">
                        {weather.loading ? (
                            <span>...</span>
                        ) : (
                            <>
                                <span className="text-sm font-semibold text-text-primary">{weather.temp}°C</span>
                                <span className="text-xs">{weather.city}</span>
                            </>
                        )}
                    </div>

                    {/* Forecast Dropdown */}
                    {!weather.loading && weather.forecast && weather.forecast.length > 0 && (
                        <div className="absolute top-full right-0 mt-2 bg-bg-secondary border border-border rounded-xl shadow-xl w-72 p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                            <div className="mb-3 pb-2 border-b border-border">
                                <h3 className="text-sm font-semibold text-text-primary m-0">Próximos 3 dias</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                {weather.forecast.map((day, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <div className="font-medium text-text-primary capitalize min-w-[80px]">
                                            <span>{day.date}</span>
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-xs text-text-secondary">{day.condition}</span>
                                            <div className="flex gap-2 font-medium">
                                                <span className="text-danger">↑ {day.maxTemp}°</span>
                                                <span className="text-primary">↓ {day.minTemp}°</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden md:block w-px h-6 bg-border mx-2"></div>

                {/* Toggle Theme */}
                <button
                    className="w-10 h-10 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-lg cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:text-primary"
                    onClick={toggleTheme}
                    title="Alternar tema"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Notificações */}
                <div className="relative">
                    <button
                        className="w-10 h-10 flex items-center justify-center border-none bg-transparent text-text-secondary rounded-lg cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:text-primary relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                        onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
                    >
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-bg-secondary"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute top-[120%] right-0 w-72 bg-bg-secondary border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-border flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-text-primary m-0">Notificações</h3>
                                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">3 novas</span>
                            </div>
                            <div className="p-2">
                                <div className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-bg-tertiary bg-bg-tertiary">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-info/20 text-info">
                                        <Bell size={14} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="m-0 text-sm text-text-primary leading-snug">Novo pedido recebido #1234</p>
                                        <span className="text-xs text-text-secondary">há 5 min</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-bg-tertiary bg-bg-tertiary">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-warning/20 text-warning">
                                        <Settings size={14} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="m-0 text-sm text-text-primary leading-snug">Estoque baixo: Produto X</p>
                                        <span className="text-xs text-text-secondary">há 1 hora</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-bg-tertiary">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-success/20 text-success">
                                        <User size={14} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="m-0 text-sm text-text-primary leading-snug">Novo usuário cadastrado</p>
                                        <span className="text-xs text-text-secondary">há 2 horas</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t border-border text-center">
                                <button className="bg-none border-none text-primary text-sm font-medium cursor-pointer hover:underline">Ver todas</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Perfil - Hidden info on mobile */}
                <div className="relative">
                    <button
                        className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-1 rounded-lg transition-all duration-200 hover:bg-bg-tertiary"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
                    >
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="hidden md:flex flex-col items-start text-left">
                            <span className="text-sm font-semibold text-text-primary">{user?.name}</span>
                            <span className="text-xs text-text-secondary">{user?.role}</span>
                        </div>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute top-[120%] right-0 w-52 bg-bg-secondary border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2">
                                <button className="flex items-center gap-3 w-full p-3 border-none bg-transparent text-text-primary cursor-pointer rounded-lg transition-all duration-200 text-sm hover:bg-bg-tertiary">
                                    <User size={16} />
                                    Meu Perfil
                                </button>
                                <button className="flex items-center gap-3 w-full p-3 border-none bg-transparent text-text-primary cursor-pointer rounded-lg transition-all duration-200 text-sm hover:bg-bg-tertiary">
                                    <Settings size={16} />
                                    Configurações
                                </button>
                                <div className="h-px bg-border my-2"></div>
                                <button
                                    className="flex items-center gap-3 w-full p-3 border-none bg-transparent text-danger cursor-pointer rounded-lg transition-all duration-200 text-sm hover:bg-danger/10"
                                    onClick={logout}
                                >
                                    <LogOut size={16} />
                                    Sair
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
