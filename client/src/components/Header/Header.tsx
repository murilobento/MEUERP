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
import './Header.css';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { toggleSidebar } = useLayout();
    const { formattedDate, formattedTime } = useDateTime();
    const weather = useWeather();

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="header">
            <div className="header-left">
                <button className="header-icon-btn toggle-sidebar" onClick={toggleSidebar}>
                    <Menu size={20} />
                </button>


            </div>

            <div className="header-right">
                {/* Widget Data/Hora */}
                <div className="header-widget date-widget">
                    <Calendar size={16} />
                    <div className="widget-content">
                        <span className="time">{formattedTime}</span>
                        <span className="date">{formattedDate}</span>
                    </div>
                </div>

                {/* Widget Clima */}
                <div className="header-widget weather-widget">
                    <Cloud size={16} />
                    <div className="widget-content">
                        {weather.loading ? (
                            <span>...</span>
                        ) : (
                            <>
                                <span className="temp">{weather.temp}°C</span>
                                <span className="city">{weather.city}</span>
                            </>
                        )}
                    </div>

                    {/* Forecast Dropdown */}
                    {!weather.loading && weather.forecast && weather.forecast.length > 0 && (
                        <div className="weather-forecast-dropdown">
                            <div className="forecast-header">
                                <h3>Próximos 3 dias</h3>
                            </div>
                            <div className="forecast-list">
                                {weather.forecast.map((day, index) => (
                                    <div key={index} className="forecast-item">
                                        <div className="forecast-date">
                                            <span>{day.date}</span>
                                        </div>
                                        <div className="forecast-info">
                                            <span className="forecast-condition">{day.condition}</span>
                                            <div className="forecast-temps">
                                                <span className="temp-max">↑ {day.maxTemp}°</span>
                                                <span className="temp-min">↓ {day.minTemp}°</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="header-divider"></div>

                {/* Toggle Theme */}
                <button className="header-icon-btn" onClick={toggleTheme} title="Alternar tema">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Notificações */}
                <div className="header-dropdown-container">
                    <button
                        className="header-icon-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                        onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
                    >
                        <Bell size={20} />
                        <span className="header-badge"></span>
                    </button>

                    {showNotifications && (
                        <div className="header-dropdown notifications-dropdown">
                            <div className="dropdown-header">
                                <h3>Notificações</h3>
                                <span className="badge-count">3 novas</span>
                            </div>
                            <div className="dropdown-content">
                                <div className="notification-item unread">
                                    <div className="notification-icon info">
                                        <Bell size={14} />
                                    </div>
                                    <div className="notification-text">
                                        <p>Novo pedido recebido #1234</p>
                                        <span>há 5 min</span>
                                    </div>
                                </div>
                                <div className="notification-item unread">
                                    <div className="notification-icon warning">
                                        <Settings size={14} />
                                    </div>
                                    <div className="notification-text">
                                        <p>Estoque baixo: Produto X</p>
                                        <span>há 1 hora</span>
                                    </div>
                                </div>
                                <div className="notification-item">
                                    <div className="notification-icon success">
                                        <User size={14} />
                                    </div>
                                    <div className="notification-text">
                                        <p>Novo usuário cadastrado</p>
                                        <span>há 2 horas</span>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-footer">
                                <button>Ver todas</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Perfil */}
                <div className="header-dropdown-container">
                    <button
                        className="header-user-btn"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
                    >
                        <div className="header-user-avatar">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="header-user-info">
                            <span className="name">{user?.name}</span>
                            <span className="role">{user?.role}</span>
                        </div>
                    </button>

                    {showProfileMenu && (
                        <div className="header-dropdown profile-dropdown">
                            <div className="dropdown-content">
                                <button className="dropdown-item">
                                    <User size={16} />
                                    Meu Perfil
                                </button>
                                <button className="dropdown-item">
                                    <Settings size={16} />
                                    Configurações
                                </button>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item danger" onClick={logout}>
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
