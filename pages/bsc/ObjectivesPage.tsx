import React, { useState } from 'react';
import { useObjectives, usePerspectives } from '../../hooks/useBSC';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Label } from '../../components/ui/Input';
import { Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { StrategicObjective } from '../../types';

export const ObjectivesPage: React.FC = () => {
  const { data: objectives, isLoading, createObjective } = useObjectives();
  const { data: perspectives } = usePerspectives();
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Partial<StrategicObjective>>();
  
  // SMART Validation Logic
  const watchedTitle = watch('title');
  const watchedDesc = watch('description');
  
  const smartScore = React.useMemo(() => {
    let score = 0;
    if (watchedTitle?.length > 10) score += 20; // Specific (simplified)
    if (watchedTitle?.match(/Aumentar|Reduzir|Manter|Otimizar/i)) score += 20; // Action verb
    if (watchedDesc?.length > 20) score += 20; // Measurable context
    // Relevant & Time-bound would typically need more fields or logic
    if (watchedDesc?.length > 0) score += 40;
    return score;
  }, [watchedTitle, watchedDesc]);

  const onSubmit = async (data: any) => {
    await createObjective({
      title: data.title,
      description: data.description,
      perspectiveId: data.perspectiveId,
      status: 'ACTIVE'
    });
    setIsCreating(false);
    reset();
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Objetivos Estratégicos</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus size={16} className="mr-2" /> Novo Objetivo
        </Button>
      </div>

      {isCreating && (
        <Card className="border-l-4 border-l-blue-500 animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle>Criar Objetivo (Validação SMART)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Perspectiva</Label>
                    <select 
                      {...register('perspectiveId', { required: true })}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Selecione...</option>
                      {perspectives?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Título do Objetivo</Label>
                    <Input {...register('title', { required: true })} placeholder="Ex: Aumentar eficiência..." />
                    <p className="text-xs text-slate-500 mt-1">Comece com um verbo de ação.</p>
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea {...register('description')} placeholder="Detalhe o objetivo..." />
                  </div>
                </div>

                {/* SMART Validator Feedback */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Qualidade SMART: {smartScore}%</h4>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                    <div className={`h-2.5 rounded-full ${smartScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${smartScore}%` }}></div>
                  </div>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-center gap-2">
                      {smartScore >= 20 ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-slate-300" />}
                      Específico (Verbo de Ação)
                    </li>
                    <li className="flex items-center gap-2">
                      {smartScore >= 60 ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-slate-300" />}
                      Mensurável (Contexto claro)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancelar</Button>
                <Button type="submit">Salvar Objetivo</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {objectives?.map(obj => {
          const persp = perspectives?.find(p => p.id === obj.perspectiveId);
          return (
            <Card key={obj.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded text-white ${persp?.color || 'bg-gray-500'}`}>
                    {obj.code}
                  </span>
                  <span className={`text-xs font-semibold ${obj.progress >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {obj.progress}% Concluído
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{obj.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{obj.description}</p>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {persp?.name}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};