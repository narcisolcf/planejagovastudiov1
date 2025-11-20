
import React from 'react';
import { Project } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Calendar, User, BarChart2, AlertCircle, DollarSign } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
      case 'PAUSED': return 'bg-amber-100 text-amber-700';
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'HEALTHY': return 'text-emerald-500';
      case 'ATTENTION': return 'text-amber-500';
      case 'CRITICAL': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  // Mock formatting for currency
  const formatMoney = (val: number) => `R$ ${(val/1000).toFixed(1)}k`;

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer border-l-4 overflow-hidden group"
      style={{ borderLeftColor: project.health === 'CRITICAL' ? '#ef4444' : project.health === 'ATTENTION' ? '#f59e0b' : '#10b981' }}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
             <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{project.code}</span>
             <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
               {project.status.replace('_', ' ')}
             </span>
          </div>
          <div title={`Saúde: ${project.health}`}>
            <AlertCircle size={16} className={getHealthColor(project.health)} />
          </div>
        </div>

        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{project.title}</h3>
        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{project.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Progresso Físico</span>
            <span className="font-bold text-slate-700">{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
              style={{ width: `${project.progress}%` }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <User size={14} className="text-slate-400" />
            <span className="truncate" title={project.manager}>{project.manager.split(' ')[0]}...</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 justify-end">
            <Calendar size={14} className="text-slate-400" />
            <span>{new Date(project.endDate).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <DollarSign size={14} className="text-slate-400" />
            <span>{formatMoney(project.budget.spent)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 justify-end" title="CPI (Índice de Desempenho de Custo)">
            <BarChart2 size={14} className="text-slate-400" />
            <span className={project.cpi && project.cpi < 1 ? 'text-red-500 font-bold' : 'text-emerald-600'}>
              CPI: {project.cpi}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};