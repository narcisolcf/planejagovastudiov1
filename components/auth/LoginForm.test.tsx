import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import React from 'react';

// Mock Supabase client
vi.mock('../../lib/supabase/client', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
        },
    },
}));

// Import the mocked instance to assert on it
import { supabase } from '../../lib/supabase/client';

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders email and password fields', () => {
        render(<LoginForm />);
        expect(screen.getByLabelText(/e-mail institucional/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar no sistema/i })).toBeInTheDocument();
    });

    it('displays validation errors for empty fields', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        const submitButton = screen.getByRole('button', { name: /entrar no sistema/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
            expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
        });
    });

    it('displays error for invalid email format', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/e-mail institucional/i);
        await user.type(emailInput, 'invalid-email');

        const submitButton = screen.getByRole('button', { name: /entrar no sistema/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/endereço de e-mail inválido/i)).toBeInTheDocument();
        });
    });

    it('calls supabase signInWithPassword on valid submission', async () => {
        const user = userEvent.setup();
        // Mock successful response
        (supabase.auth.signInWithPassword as any).mockResolvedValue({
            data: { user: { id: '123' }, session: {} },
            error: null,
        });

        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/e-mail institucional/i);
        const passwordInput = screen.getByLabelText(/senha/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /entrar no sistema/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('displays error message on login failure', async () => {
        const user = userEvent.setup();
        // Mock error response
        (supabase.auth.signInWithPassword as any).mockResolvedValue({
            data: { user: null, session: null },
            error: { message: 'Invalid login credentials' },
        });

        render(<LoginForm />);

        const emailInput = screen.getByLabelText(/e-mail institucional/i);
        const passwordInput = screen.getByLabelText(/senha/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');

        const submitButton = screen.getByRole('button', { name: /entrar no sistema/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
        });
    });
});
