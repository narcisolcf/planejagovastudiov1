import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase/client';
import { Button } from '../ui/Button';
import { Input, Label } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Info } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) throw error;

      // O redirecionamento ocorre automaticamente pelo AuthContext
    } catch (error: any) {
      console.error('Erro no login:', error);
      // Tratamento amigável para erro de fetch (caso o mock falhe ou configuração misturada)
      const msg = error.message === 'Failed to fetch'
        ? 'Erro de conexão. Verifique sua internet ou a configuração do Supabase.'
        : (error.message || 'Falha ao realizar login.');
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg border-t-4 border-t-blue-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-bold text-slate-900">Acesso SGEM</CardTitle>
        <p className="text-center text-sm text-slate-500">Gestão Estratégica Municipal</p>
      </CardHeader>
      <CardContent>
        {/* Aviso de Modo Demonstração */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 flex items-start gap-3">
          <Info className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Modo de Demonstração</p>
            <p>Utilize qualquer e-mail válido para entrar.</p>
            <p className="mt-1 text-xs opacity-80">Ex: admin@prefeitura.gov.br / 123456</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail Institucional</Label>
            <Input
              id="email"
              {...register('email', {
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Endereço de e-mail inválido"
                }
              })}
              type="email"
              placeholder="nome@prefeitura.gov.br"
              disabled={loading}
              className="bg-white"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: { value: 6, message: 'Mínimo de 6 caracteres' }
              })}
              type="password"
              placeholder="••••••"
              disabled={loading}
              className="bg-white"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md flex items-center gap-2">
              <span className="font-bold">Erro:</span> {authError}
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-base" isLoading={loading}>
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Sistema seguro e compatível com LGPD.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}