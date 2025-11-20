import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { TrendingUp, Calculator, Save } from 'lucide-react';
import { Target } from '../../../types';
import _ from 'lodash';

interface MetasProps {
  baseline: number;
  onSave: (targets: Target[]) => void;
}

export const MetasIndicador: React.FC<MetasProps> = ({ baseline, onSave }) => {
  const [growthRate, setGrowthRate] = useState(5); // 5% growth
  const [generatedTargets, setGeneratedTargets] = useState<Target[]>([]);

  const generateTargets = () => {
    const years = 4; // Ciclo de gestão
    const targets: Target[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 1; i <= years; i++) {
      const targetVal = baseline * Math.pow(1 + (growthRate / 100), i);
      targets.push({
        year: currentYear + i,
        period: 'ANUAL',
        value: Math.round(targetVal * 100) / 100,
        toleranceMin: Math.round(targetVal * 0.95 * 100) / 100,
        toleranceMax: Math.round(targetVal * 1.05 * 100) / 100
      });
    }
    setGeneratedTargets(targets);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Linha de Base</label>
          <div className="text-lg font-bold text-slate-900">{baseline}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Taxa de Melhoria Anual (%)</label>
          <input 
            type="number" 
            value={growthRate} 
            onChange={(e) => setGrowthRate(Number(e.target.value))}
            className="flex h-10 w-32 rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <Button onClick={generateTargets} className="mb-0.5">
          <Calculator size={16} className="mr-2" /> Calcular
        </Button>
      </div>

      {generatedTargets.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-4 gap-4">
            {generatedTargets.map(t => (
              <Card key={t.year} className="text-center bg-white">
                <CardContent className="pt-6">
                  <div className="text-sm text-slate-500 font-medium">{t.year}</div>
                  <div className="text-xl font-bold text-blue-600 my-2">{t.value}</div>
                  <div className="text-xs text-slate-400">
                    {t.toleranceMin} - {t.toleranceMax}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={() => onSave(generatedTargets)} className="w-full" variant="secondary">
            <Save size={16} className="mr-2" /> Confirmar Metas
          </Button>
        </div>
      )}
    </div>
  );
};