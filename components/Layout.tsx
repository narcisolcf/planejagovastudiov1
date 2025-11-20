import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  Briefcase, 
  Menu, 
  X, 
  LogOut, 
  Building2,
  GitCompare
} from 'lucide-react';
import { Button } from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation: { name: string; href: string; icon: React.ElementType; phase: string; locked?: boolean }[] = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, phase: 'Todos' },
    { name: 'Fundamentos', href: '/fundamentos', icon: FileText, phase: 'Fase 1' },
    { name: 'Análise de Dados', href: '/analise', icon: GitCompare, phase: 'Fase 2' },
    { name: 'Mapa Estratégico (BSC)', href: '/bsc', icon: Target, phase: 'Fase 2' },
    { name: 'Projetos & Ações', href: '/projetos', icon: Briefcase, phase: 'Fase 3' }, // Unlocked
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">S</div>
              <span>SGEM</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = item.href === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.href);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.locked ? '#' : item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                      ${item.locked ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !item.locked && setIsSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.name}</span>
                    {item.locked && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Em Breve</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin Municipal</p>
                <p className="text-xs text-slate-500 truncate">Pref. Municipal</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300">
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 size={18} />
              <span className="text-sm font-medium hidden sm:inline-block">Prefeitura Municipal de Exemplo - Gestão 2025-2028</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};