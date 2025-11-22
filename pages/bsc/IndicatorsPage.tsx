import React, { useState } from 'react';
import { useIndicators, useObjectives } from '../../hooks/useBSC';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Label } from '../../components/ui/Input';
import { Plus, TrendingUp, TrendingDown, Minus, BookOpen, BarChart2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Indicator, Measurement } from '../../types';
import { BibliotecaIndicadores } from '../../components/bsc/indicators/BibliotecaIndicadores';
import { MetasIndicador } from '../../components/bsc/indicators/MetasIndicador';
import { ColetaMedicao } from '../../components/bsc/indicators/ColetaMedicao';

export const IndicatorsPage: React.FC = () => {
  const { data: indicators, isLoading, createIndicator } = useIndicators();
  const { data: objectives } = useObjectives();
  
  // UI State
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [activeTab, setActiveTab] = useState<'cadastro' | 'metas' | 'coleta'>('cadastro');
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm<Partial<Indicator>>();

  const onSubmit = async (data: Partial<Indicator>) => {
    await createIndicator({
      name: data.name,
      objectiveId: data.objectiveId,
      unit: data.unit || 'un',
      baseline: Number(data.baseline),
      target: Number(data.target),
      frequency: 'MONTHLY',
      currentValue: Number(data.baseline), // Start at baseline
      polarity: 'HIGHER_BETTER',
      source: 'Manual',
      formula: data.formula
    });
    setView('list');
    reset();
  };

  const handleImport = (imported: Partial<Indicator>) => {
    setValue('name', imported.name);
    setValue('formula', imported.formula);
    setValue('unit', imported.unit);
    // Mantem o form aberto mas preenchido
  };

  const handleSelectIndicator = (ind: Indicator) => {
    setSelectedIndicator(ind);
    setView('details');
    setActiveTab('coleta');
  };

  const getTrendIcon = (ind: Indicator) => {
    if (!ind.currentValue) return <Minus className="text-slate-300" />;
    const diff = ind.currentValue - ind.baseline;
    if (diff === 0) return <Minus className="text-slate-400" />;
    
    const isPositive = ind.polarity === 'HIGHER_BETTER' ? diff > 0 : diff < 0;
    return isPositive 
      ? <TrendingUp className="text-emerald-500" /> 
      : <TrendingDown className="text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
       <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800">Indicadores de Desempenho</h2>
          {view !== 'list' && (
             <span className="text-slate-400 text-sm font-medium">/ {view === 'create' ? 'Novo' : selectedIndicator?.name}</span>
          )}
        </div>
        
        {view === 'list' ? (
          <Button onClick={() => setView('create')}>
            <Plus size={16} className="mr-2" /> Novo Indicador
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setView('list')}>Voltar para Lista</Button>
        )}
      </div>

      {/* View: CREATE */}
      {view === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <Card className="lg:col-span-2 animate-in fade-in slide-in-from-left-4">
            <CardHeader><CardTitle>Cadastro Manual</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Objetivo Vinculado</Label>
                  <select {...register('objectiveId', { required: true })} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm">
                    <option value="">Selecione...</option>
                    {objectives?.map(o => <option key={o.id} value={o.id}>{o.code} - {o.title}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label>Nome do Indicador</Label>
                  <Input {...register('name', { required: true })} placeholder="Ex: Taxa de..." />
                </div>
                <div className="md:col-span-2">
                  <Label>Fórmula de Cálculo</Label>
                  <Input {...register('formula')} placeholder="Ex: (A/B) * 100" />
                </div>
                <div>
                  <Label>Unidade</Label>
                  <Input {...register('unit')} placeholder="%, $, #..." />
                </div>
                <div>
                  <Label>Frequência</Label>
                  <select {...register('frequency')} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm">
                    <option value="MONTHLY">Mensal</option>
                    <option value="QUARTERLY">Trimestral</option>
                    <option value="ANNUAL">Anual</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 col-span-2 md:col-span-2">
                  <div>
                    <Label>Linha de Base (Valor Atual)</Label>
                    <Input type="number" {...register('baseline')} step="0.01" />
                  </div>
                  <div>
                    <Label>Meta Final (2028)</Label>
                    <Input type="number" {...register('target')} step="0.01" />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                  <Button type="submit">Salvar Indicador</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right: Library */}
          <Card className="animate-in fade-in slide-in-from-right-4 bg-blue-50/50 border-blue-100">
            <CardHeader className="flex flex-row items-center gap-2">
              <BookOpen className="text-blue-500" />
              <CardTitle className="text-blue-700">Biblioteca de Modelos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-4">Selecione um indicador padrão para preencher o formulário automaticamente.</p>
              <BibliotecaIndicadores onImport={handleImport} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* View: DETAILS (Tabs for Measurement/Targets) */}
      {view === 'details' && selectedIndicator && (
        <div className="space-y-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('coleta')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'coleta' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}>
                Coleta & Medições
              </button>
              <button onClick={() => setActiveTab('metas')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'metas' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}>
                Metas & Linha de Base
              </button>
            </nav>
          </div>

          {activeTab === 'coleta' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColetaMedicao onCollect={(m) => alert('Medição registrada! (Simulação)')} />
              <Card>
                <CardHeader><CardTitle>Histórico Recente</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-center text-slate-400 py-8 text-sm">Nenhuma medição anterior registrada.</div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'metas' && (
            <MetasIndicador baseline={selectedIndicator.baseline} onSave={(t) => alert(`${t.length} metas geradas com sucesso!`)} />
          )}
        </div>
      )}

      {/* View: LIST */}
      {view === 'list' && (
        <div className="rounded-md border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="p-4">Código</th>
                <th className="p-4">Indicador</th>
                <th className="p-4">Vinculação</th>
                <th className="p-4 text-right">Atual</th>
                <th className="p-4 text-right">Meta</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {indicators?.map(ind => {
                const obj = objectives?.find(o => o.id === ind.objectiveId);
                return (
                  <tr key={ind.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectIndicator(ind)}>
                    <td className="p-4 font-mono text-xs text-slate-500">{ind.code}</td>
                    <td className="p-4 font-medium text-slate-900">
                      {ind.name}
                      {ind.formula && <div className="text-xs text-slate-400 mt-0.5">{ind.formula}</div>}
                    </td>
                    <td className="p-4 text-slate-500 truncate max-w-[200px]" title={obj?.title}>{obj?.code}</td>
                    <td className="p-4 text-right font-bold">{ind.currentValue} {ind.unit}</td>
                    <td className="p-4 text-right text-slate-500">{ind.target} {ind.unit}</td>
                    <td className="p-4 flex justify-center">
                      {getTrendIcon(ind)}
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleSelectIndicator(ind); }}>
                        <BarChart2 size={16} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};