
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/Dashboard';
import { StrategicFundamentalsPage } from './pages/StrategicFundamentals';
import { BudgetAnalysisPage } from './pages/BudgetAnalysis';
import { StrategicMapPage } from './pages/bsc/StrategicMapPage';
import { ObjectivesPage } from './pages/bsc/ObjectivesPage';
import { IndicatorsPage } from './pages/bsc/IndicatorsPage';
import { BSCDashboardPage } from './pages/bsc/BSCDashboardPage';
import { ProjectsDashboardPage } from './pages/projects/ProjectsDashboardPage';
import { ProjectsListPage } from './pages/projects/ProjectsListPage';
import { ProjectDetailPage } from './pages/projects/ProjectDetailPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Target, FileBarChart, List, LayoutDashboard, Briefcase, ListTodo } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Configuração do TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

// Layout auxiliar para sub-rotas do BSC
const BSCLayout = () => {
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

// Layout auxiliar para Projetos
const ProjectsLayout = () => {
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
            // Check if active, allowing for sub-routes (e.g., details page belongs to 'lista')
            const isActive = location.pathname.startsWith(tab.href);
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

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Componente para rota de login
const LoginRoute = () => {
  const { session, loading } = useAuth();

  if (loading) return null;
  
  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">S</div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">SGEM</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Sistema de Gestão Estratégica Municipal</p>
      </div>
      <LoginForm />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/fundamentos" element={
              <ProtectedRoute>
                <StrategicFundamentalsPage />
              </ProtectedRoute>
            } />

            <Route path="/analise" element={
              <ProtectedRoute>
                <BudgetAnalysisPage />
              </ProtectedRoute>
            } />
            
            {/* BSC Routes */}
            <Route path="/bsc" element={
              <ProtectedRoute>
                <BSCLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<BSCDashboardPage />} />
              <Route path="mapa" element={<StrategicMapPage />} />
              <Route path="objetivos" element={<ObjectivesPage />} />
              <Route path="indicadores" element={<IndicatorsPage />} />
            </Route>
            
            {/* Projects Routes (Phase 3) */}
            <Route path="/projetos" element={
              <ProtectedRoute>
                <ProjectsLayout />
              </ProtectedRoute>
            }>
               <Route index element={<Navigate to="dashboard" replace />} />
               <Route path="dashboard" element={<ProjectsDashboardPage />} />
               <Route path="lista" element={<ProjectsListPage />} />
               <Route path="lista/:id" element={<ProjectDetailPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
