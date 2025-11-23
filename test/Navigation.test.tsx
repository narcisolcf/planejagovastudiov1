import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

// Componentes de teste simples
const DashboardMock = () => <div data-testid="dashboard-page">Dashboard</div>;
const FundamentosMock = () => <div data-testid="fundamentals-page">Fundamentos Estratégicos</div>;
const AnaliseMock = () => <div data-testid="budget-page">Análise Orçamentária</div>;
const BSCMock = () => <div data-testid="bsc-page">BSC Dashboard</div>;
const NotFoundMock = () => <div data-testid="not-found-page">Página não encontrada</div>;

// Componente de rotas simplificado para teste
const TestRoutes = () => (
    <Routes>
        <Route path="/" element={<DashboardMock />} />
        <Route path="/fundamentos" element={<FundamentosMock />} />
        <Route path="/analise" element={<AnaliseMock />} />
        <Route path="/bsc/dashboard" element={<BSCMock />} />
        <Route path="*" element={<NotFoundMock />} />
    </Routes>
);

describe('Navegação e Roteamento - Testes Básicos', () => {
    it('deve renderizar a Dashboard na rota raiz /', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <TestRoutes />
            </MemoryRouter>
        );
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('deve navegar para a página de Fundamentos Estratégicos', () => {
        render(
            <MemoryRouter initialEntries={['/fundamentos']}>
                <TestRoutes />
            </MemoryRouter>
        );
        expect(screen.getByTestId('fundamentals-page')).toBeInTheDocument();
        expect(screen.getByText('Fundamentos Estratégicos')).toBeInTheDocument();
    });

    it('deve navegar para a página de Análise Orçamentária', () => {
        render(
            <MemoryRouter initialEntries={['/analise']}>
                <TestRoutes />
            </MemoryRouter>
        );
        expect(screen.getByTestId('budget-page')).toBeInTheDocument();
        expect(screen.getByText('Análise Orçamentária')).toBeInTheDocument();
    });

    it('deve navegar para a página BSC Dashboard', () => {
        render(
            <MemoryRouter initialEntries={['/bsc/dashboard']}>
                <TestRoutes />
            </MemoryRouter>
        );
        expect(screen.getByTestId('bsc-page')).toBeInTheDocument();
        expect(screen.getByText('BSC Dashboard')).toBeInTheDocument();
    });

    it('deve exibir a página 404 para rotas desconhecidas', () => {
        render(
            <MemoryRouter initialEntries={['/rota-que-nao-existe']}>
                <TestRoutes />
            </MemoryRouter>
        );
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
        expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
    });
});
