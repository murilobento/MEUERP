import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { useLayout } from '../contexts/LayoutContext';

const MainLayout: React.FC = () => {
    const { sidebarOpen } = useLayout();

    return (
        <div className="flex min-h-screen bg-bg-primary">
            <Sidebar />
            <div
                className={`
                    flex-1 flex flex-col transition-all duration-300 ease-in-out ml-0
                    ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}
                `}
            >
                <Header />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
