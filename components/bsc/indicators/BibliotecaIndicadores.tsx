import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Plus, Search } from 'lucide-react';
import { Indicator } from '../../../types';

// Dados do PDF Pág 23
const INDICATOR_LIBRARY = {
  financial: [
    { name: 'Execução Orçamentária', formula: '(Despesa / Receita) * 100', unit: '%', polarity: 'HIGHER_BETTER' },
    { name: 'Economia em Compras', formula: 'Valor Estimado - Contratado', unit: 'R$', polarity: 'HIGHER_BETTER' }
  ],
  processes: [
    { name: 'Tempo Médio de Atendimento', formula: 'Σ Tempo / Nº Atendimentos', unit: 'min', polarity: 'LOWER_BETTER' },
    { name: 'Digitalização de Processos', formula: '(Processos Digitais / Total) * 100', unit: '%', polarity: 'HIGHER_BETTER' }
  ],
  customer: [
    { name: 'Satisfação do Cidadão (NPS)', formula: 'Pesquisa NPS', unit: 'pts', polarity: 'HIGHER_BETTER' }
  ]
};

interface BibliotecaProps {
  onImport: (ind: Partial<Indicator>) => void;
}

export const BibliotecaIndicadores: React.FC<BibliotecaProps> = ({ onImport }) => {
  const [filter, setFilter] = React.useState('');

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
        <input 
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Buscar modelos de indicadores..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(INDICATOR_LIBRARY).map(([category, items]) => (
          <div key={category} className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{category}</h4>
            <div className="space-y-2">
              {items
                .filter(i => i.name.toLowerCase().includes(filter.toLowerCase()))
                .map((item, idx) => (
                <Card key={idx} className="hover:border-blue-400 transition-colors cursor-pointer group relative">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-slate-800">{item.name}</h5>
                        <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-600 block mt-1 w-fit">
                          {item.formula}
                        </code>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600"
                        onClick={() => onImport({
                          name: item.name,
                          formula: item.formula,
                          unit: item.unit,
                          polarity: item.polarity as any
                        })}
                      >
                        <Plus size={16} /> Importar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};