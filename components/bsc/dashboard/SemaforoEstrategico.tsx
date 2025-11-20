import React from 'react';
import { Indicator } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SemaforoProps {
  indicators?: Indicator[];
}

export const SemaforoEstrategico: React.FC<SemaforoProps> = ({ indicators = [] }) => {
  // Lógica simples de cálculo baseada no mock
  // No sistema real, isso viria de uma função helper calculateStatus(indicator)
  const stats = indicators.reduce(
    (acc, curr) => {
      const progress = (curr.currentValue || 0) / curr.target * 100;
      // Lógica simplificada para fins de demonstração
      if (progress >= 100) acc.green++;
      else if (progress >= 70) acc.yellow++;
      else acc.red++;
      return acc;
    },
    { green: 0, yellow: 0, red: 0 }
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="border-t-4 border-t-emerald-500 text-center">
        <CardContent className="pt-6">
          <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <CheckCircle size={24} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.green}</div>
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mt-1">Na Meta</p>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-amber-500 text-center">
        <CardContent className="pt-6">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle size={24} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.yellow}</div>
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mt-1">Atenção</p>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-t-red-500 text-center">
        <CardContent className="pt-6">
          <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
            <XCircle size={24} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.red}</div>
          <p className="text-xs font-medium text-red-600 uppercase tracking-wide mt-1">Crítico</p>
        </CardContent>
      </Card>
    </div>
  );
};