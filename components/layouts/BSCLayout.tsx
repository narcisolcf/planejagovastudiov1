import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, List, FileBarChart } from 'lucide-react';

export const BSCLayout = () => {
    const location = useLocation();

    const tabs = [
        { name: 'Painel Executivo', href: '/bsc/dashboard', icon: LayoutDashboard },
        { name: 'Mapa Estratégico', href: '/bsc/mapa', icon: Target },
        { name: 'Objetivos', href: '/bsc/objetivos', icon: List },
        { name: 'Indicadores', href: '/bsc/indicadores', icon: FileBarChart },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Balanced Scorecard (BSC)</h1>
                <p className="text-slate-500 mt-1">Fase 2: Gestão Estratégica e Indicadores de Desempenho</p>
            </div>

            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map(tab => {
                        const isActive = tab.href === '/bsc/dashboard'
                            ? location.pathname === '/bsc/dashboard'
                            : location.pathname.startsWith(tab.href);

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
