import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo } from 'lucide-react';

export const ProjectsLayout = () => {
    const location = useLocation();

    const tabs = [
        { name: 'Visão Geral (PMO)', href: '/projetos/dashboard', icon: LayoutDashboard },
        { name: 'Carteira de Projetos', href: '/projetos/lista', icon: ListTodo },
    ];

    return (
        <div className="space-y-6">
            {/* Common Header for Projects Module */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map(tab => {
                        const isActive = location.pathname === tab.href;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                to={tab.href}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200
                  ${isActive
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}
                            >
                                <Icon size={16} />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Outlet />
            </div>
        </div>
    );
};
