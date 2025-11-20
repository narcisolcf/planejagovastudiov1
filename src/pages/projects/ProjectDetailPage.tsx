
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi, tasksApi } from '../../lib/supabase/client';
import { ProjectTask } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input, Label } from '../../components/ui/Input';
import { 
  ArrowLeft, Calendar, User, CheckCircle2, Clock, 
  AlertTriangle, Plus, Save, Trash2, Circle, MoreHorizontal 
} from 'lucide-react';
import { useForm } from 'react-hook-form';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Fetch Project Details
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id
  });

  // Fetch Tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['project-tasks', id],
    queryFn: () => tasksApi.listByProject(id!),
    enabled: !!id
  });

  // Mutation for adding tasks
  const createTaskMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', id] });
      setIsAddingTask(false);
    }
  });

  // Form handling for new task
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<ProjectTask>>();

  const onSubmitTask = (data: Partial<ProjectTask>) => {
    if (!id) return;
    createTaskMutation.mutate({
      ...data,
      projectId: id,
      status: 'NOT_STARTED',
      progress: 0
    });
    reset();
  };

  if (isLoadingProject) return <div className="p-8 text-center">Carregando projeto...</div>;
  if (!project) return <div className="p-8 text-center">Projeto não encontrado.</div>;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center w-fit gap-1"><CheckCircle2 size={12} /> Concluída</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center w-fit gap-1"><Clock size={12} /> Em Andamento</span>;
      case 'DELAYED': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center w-fit gap-1"><AlertTriangle size={12} /> Atrasada</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center w-fit gap-1"><Circle size={12} /> Não Iniciada</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" onClick={() => navigate('/projetos/lista')} className="mt-1">
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{project.code}</span>
            <span className="text-xs uppercase font-semibold text-slate-500">{project.status.replace('_', ' ')}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-slate-500 text-sm mt-1 line-clamp-2">{project.description}</p>
        </div>
        <div className="text-right">
           <div className="text-sm text-slate-500 mb-1">Progresso Geral</div>
           <div className="text-2xl font-bold text-blue-600">{project.progress}%</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-50 border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <User className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Gerente</p>
              <p className="font-semibold text-slate-900">{project.manager}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
             <Calendar className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Período</p>
              <p className="font-semibold text-slate-900 text-sm">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${project.health === 'CRITICAL' ? 'bg-red-500' : project.health === 'ATTENTION' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <div>
              <p className="text-xs text-slate-500 font-medium">Saúde do Projeto</p>
              <p className="font-semibold text-slate-900">{project.health}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-blue-600" />
            Cronograma & Tarefas
          </h2>
          <Button size="sm" onClick={() => setIsAddingTask(!isAddingTask)}>
            <Plus size={16} className="mr-2" /> Adicionar Tarefa
          </Button>
        </div>

        {isAddingTask && (
          <Card className="border-l-4 border-l-blue-500 bg-blue-50/30 animate-in slide-in-from-top-2">
             <CardContent className="p-4">
               <form onSubmit={handleSubmit(onSubmitTask)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <Label className="text-xs">Título da Tarefa</Label>
                    <Input {...register('title', { required: true })} placeholder="Nova tarefa..." className="bg-white h-9" autoFocus />
                  </div>
                  <div className="md:col-span-3">
                     <Label className="text-xs">Responsável</Label>
                     <Input {...register('assignedTo')} placeholder="Nome..." className="bg-white h-9" />
                  </div>
                  <div className="md:col-span-2">
                     <Label className="text-xs">Início</Label>
                     <Input type="date" {...register('startDate', { required: true })} className="bg-white h-9" />
                  </div>
                  <div className="md:col-span-2">
                     <Label className="text-xs">Fim</Label>
                     <Input type="date" {...register('endDate', { required: true })} className="bg-white h-9" />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                     <Button type="submit" size="sm" className="h-9 w-full" isLoading={createTaskMutation.isPending}>
                       <Save size={16} />
                     </Button>
                  </div>
               </form>
             </CardContent>
          </Card>
        )}

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-32">Status</th>
                <th className="px-4 py-3">Tarefa</th>
                <th className="px-4 py-3">Responsável</th>
                <th className="px-4 py-3 text-center">Progresso</th>
                <th className="px-4 py-3 text-right">Prazo</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingTasks ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Carregando tarefas...</td></tr>
              ) : tasks?.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Nenhuma tarefa cadastrada.</td></tr>
              ) : (
                tasks?.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{task.title}</td>
                    <td className="px-4 py-3 text-slate-600 flex items-center gap-2">
                      {task.assignedTo && <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{task.assignedTo.charAt(0)}</div>}
                      {task.assignedTo || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {new Date(task.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                       <button className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                         <MoreHorizontal size={16} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
