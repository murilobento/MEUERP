import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { useLayout } from '../contexts/LayoutContext';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    const { sidebarOpen } = useLayout();

    return (
        <div className="main-layout">
            <Sidebar />
            <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
                <Header />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
