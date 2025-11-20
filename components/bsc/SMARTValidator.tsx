import React from 'react';
import { CheckCircle, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface SMARTValidatorProps {
  title: string;
  description: string;
  hasIndicators: boolean;
  hasDeadline?: boolean;
}

export const SMARTValidator: React.FC<SMARTValidatorProps> = ({ 
  title = '', 
  description = '', 
  hasIndicators = false,
  hasDeadline = false
}) => {
  
  // Algoritmo de validação simplificado (conforme PDF Pág 7)
  const checks = [
    {
      id: 's',
      label: 'Específico (Specific)',
      desc: 'Usa verbo de ação e objeto claro?',
      valid: title.length > 10 && /^(Aumentar|Reduzir|Manter|Otimizar|Melhorar|Implantar|Garantir)/i.test(title),
      tip: 'Comece com verbos como: Aumentar, Reduzir, Otimizar.'
    },
    {
      id: 'm',
      label: 'Mensurável (Measurable)',
      desc: 'Possui indicadores associados?',
      valid: hasIndicators,
      tip: 'Adicione pelo menos 1 indicador de desempenho.'
    },
    {
      id: 'a',
      label: 'Atingível (Attainable)',
      desc: 'Baseado em histórico/recursos?',
      valid: description.length > 20, // Simplificação: descrição detalhada implica análise
      tip: 'Descreva como será alcançado na descrição.'
    },
    {
      id: 'r',
      label: 'Relevante (Relevant)',
      desc: 'Alinhado à Missão/Visão?',
      valid: true, // Assumido como verdadeiro por estar no mapa
      tip: 'Deve contribuir para a visão de 2028.'
    },
    {
      id: 't',
      label: 'Temporal (Time-bound)',
      desc: 'Possui prazo definido?',
      valid: hasDeadline, // Pode ser passado via props ou assumido pelo ciclo (2025-2028)
      tip: 'Defina prazos no PPA.'
    }
  ];

  const score = Math.round((checks.filter(c => c.valid).length / checks.length) * 100);
  const getColor = () => {
    if (score === 100) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Card className="border-none shadow-none bg-slate-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-slate-700 flex items-center gap-2">
            <div className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">SMART</div>
            Quality Score
          </h4>
          <span className={`text-lg font-bold px-3 py-1 rounded-full border ${getColor()}`}>
            {score}%
          </span>
        </div>

        <div className="space-y-3">
          {checks.map(check => (
            <div key={check.id} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5">
                {check.valid ? (
                  <CheckCircle size={16} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={16} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${check.valid ? 'text-slate-700' : 'text-slate-400'}`}>
                  {check.label}
                </p>
                {!check.valid && (
                  <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                    <HelpCircle size={10} /> {check.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};