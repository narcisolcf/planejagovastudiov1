import React from 'react';
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  Link
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { BSCLayout } from './components/layouts/BSCLayout';
import { ProjectsLayout } from './components/layouts/ProjectsLayout';
import { DashboardPage } from './pages/Dashboard';
import { StrategicFundamentalsPage } from './pages/StrategicFundamentals';
import { BudgetAnalysisPage } from './pages/BudgetAnalysis';
import { StrategicMapPage } from './pages/bsc/StrategicMapPage';
import { ObjectivesPage } from './pages/bsc/ObjectivesPage';
import { IndicatorsPage } from './pages/bsc/IndicatorsPage';
import { BSCDashboardPage } from './pages/bsc/BSCDashboardPage';
import { ProjectsDashboardPage } from './pages/projects/ProjectsDashboardPage';
import { ProjectsListPage } from './pages/projects/ProjectsListPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';

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

const router = createHashRouter(
  createRoutesFromElements(
    <>
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
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
