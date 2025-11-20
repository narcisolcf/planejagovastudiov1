
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Label, Textarea } from '../ui/Input';
import { Project } from '../../types';
import { projectsApi, bscApi } from '../../lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Save, X, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onCancel, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Define default values to ensure nested 'budget' fields are controlled
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Project>>({
    defaultValues: {
      title: '',
      description: '',
      manager: '',
      sponsor: '',
      methodology: 'TRADITIONAL',
      strategicObjectiveId: '',
      budget: {
        estimated: 0,
        approved: 0,
        spent: 0,
        committed: 0
      }
    }
  });

  // Buscar objetivos estratégicos para vínculo
  const { data: objectives, isLoading: isLoadingObjectives, error: objectivesError } = useQuery({
    queryKey: ['objectives'],
    queryFn: bscApi.getObjectives
  });

  const onSubmit = async (data: Partial<Project>) => {
    setIsSubmitting(true);
    try {
      // Construção do objeto Project conforme a interface
      const newProject = {
        ...data,
        status: 'PLANNING',
        health: 'HEALTHY',
        progress: 0,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date().toISOString().split('T')[0],
        // Tratamento especial para o objeto budget aninhado
        budget: {
          estimated: Number(data.budget?.estimated || 0),
          approved: 0,
          spent: 0,
          committed: 0
        }
      };

      await projectsApi.create(newProject as any);
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      alert('Erro ao criar projeto. Verifique o console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <CardTitle className="text-lg text-blue-800">Novo Projeto Estratégico</CardTitle>
          <p className="text-sm text-slate-500">Preencha os dados iniciais para criar o Termo de Abertura (TAP).</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
          <X size={18} className="text-slate-500" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Básicos */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <Label>Título do Projeto <span className="text-red-500">*</span></Label>
                <Input 
                  {...register('title', { required: 'Título é obrigatório' })} 
                  placeholder="Ex: Construção da Nova UBS Central" 
                  className="text-lg font-medium"
                  autoFocus
                />
                {errors.title && <span className="text-xs text-red-500 mt-1">{errors.title.message}</span>}
              </div>

              <div>
                <Label>Descrição Executiva <span className="text-red-500">*</span></Label>
                <Textarea 
                  {...register('description', { required: 'Descrição é obrigatória' })} 
                  placeholder="Descreva o escopo, justificativa e principais entregas..." 
                  rows={3}
                />
                {errors.description && <span className="text-xs text-red-500 mt-1">{errors.description.message}</span>}
              </div>
            </div>

            {/* Responsáveis */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b pb-1 text-sm">Responsáveis</h4>
              <div>
                <Label>Gerente de Projeto <span className="text-red-500">*</span></Label>
                <Input {...register('manager', { required: 'Gerente é obrigatório' })} placeholder="Nome do responsável" />
                {errors.manager && <span className="text-xs text-red-500 mt-1">{errors.manager.message}</span>}
              </div>
              <div>
                <Label>Patrocinador (Sponsor)</Label>
                <Input {...register('sponsor')} placeholder="Ex: Secretaria de Saúde" />
              </div>
            </div>

            {/* Classificação */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b pb-1 text-sm">Classificação</h4>
              <div>
                <Label>Metodologia de Gestão</Label>
                <select 
                  {...register('methodology')} 
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="TRADITIONAL">Tradicional (Cascata / PMBOK)</option>
                  <option value="AGILE">Ágil (Scrum / Kanban)</option>
                  <option value="HYBRID">Híbrido</option>
                </select>
              </div>

              <div>
                <Label>Alinhamento Estratégico (BSC)</Label>
                <select 
                  {...register('strategicObjectiveId')} 
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={isLoadingObjectives}
                >
                  <option value="">Selecione um Objetivo...</option>
                  {objectives?.map(obj => (
                    <option key={obj.id} value={obj.id}>{obj.code} - {obj.title}</option>
                  ))}
                </select>
                {isLoadingObjectives && <p className="text-xs text-slate-400 mt-1">Carregando objetivos...</p>}
                {objectivesError && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={12} className="mr-1"/> Erro ao carregar objetivos</p>}
              </div>
            </div>

            {/* Prazos */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b pb-1 text-sm">Prazos Estimados</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Início <span className="text-red-500">*</span></Label>
                  <Input type="date" {...register('startDate', { required: 'Data de início obrigatória' })} />
                  {errors.startDate && <span className="text-xs text-red-500 mt-1">{errors.startDate.message}</span>}
                </div>
                <div>
                  <Label>Término <span className="text-red-500">*</span></Label>
                  <Input type="date" {...register('endDate', { required: 'Data de término obrigatória' })} />
                  {errors.endDate && <span className="text-xs text-red-500 mt-1">{errors.endDate.message}</span>}
                </div>
              </div>
            </div>

            {/* Orçamento */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b pb-1 text-sm">Investimento</h4>
              <div>
                <Label>Orçamento Estimado (R$)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  {...register('budget.estimated')} 
                  placeholder="0,00" 
                />
                <p className="text-xs text-slate-500 mt-1">Valor total previsto para execução.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-lg">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="px-6">
              <Save size={16} className="mr-2" />
              Salvar Projeto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
