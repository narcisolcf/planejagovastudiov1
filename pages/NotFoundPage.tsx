import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[150px] font-bold text-slate-900">404</span>
          </div>
          <div className="relative z-10 flex justify-center">
            <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Página não encontrada
          </h1>
          <p className="text-lg text-slate-600">
            Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido movida ou não existir.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home size={18} />
              Ir para o Início
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </button>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-slate-400">
        SGEM - Sistema de Gestão Estratégica Municipal
      </div>
    </div>
  );
};
