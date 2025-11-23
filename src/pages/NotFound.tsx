import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="bg-orange-100 p-4 rounded-full">
                        <AlertTriangle className="w-12 h-12 text-orange-600" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Página não encontrada</h1>
                    <p className="text-slate-600">
                        Desculpe, a página que você está procurando não existe ou foi movida.
                    </p>
                </div>

                <Link to="/">
                    <Button className="w-full sm:w-auto">
                        Voltar para o Início
                    </Button>
                </Link>
            </div>
        </div>
    );
}
