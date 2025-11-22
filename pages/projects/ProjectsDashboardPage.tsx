
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { projectsApi } from '../../lib/supabase/client';
import { Project } from '../../types';
import { BarChart2, Clock, DollarSign, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ProjectCard } from '../../components/projects/ProjectCard';

export const ProjectsDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await projectsApi.list();
      setProjects(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // KPIs Calculation
  const totalProjects = projects.length;
  const criticalProjects = projects.filter(p => p.health === 'CRITICAL').length;
  const totalBudget = projects.reduce((acc, p) => acc + p.budget.approved, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.budget.spent, 0);
  const executionRate = totalBudget > 0 ? (totalSpent / totalBudget * 100).toFixed(1) : '0.0';
  const avgCPI = projects.length ? (projects.reduce((acc, p) => acc + (p.cpi || 1), 0) / projects.length).toFixed(2) : '0.00';

  if (isLoading) return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <p className="text-slate-600 font-medium">Carregando projetos...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Escritório de Projetos (PMO)</h1>
        <p className="text-slate-500 mt-1">Visão executiva do portfólio de projetos estratégicos (Fase 3).</p>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Projetos Ativos</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalProjects}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Activity size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Em Risco (Crítico)</p>
              <h3 className="text-2xl font-bold text-red-600">{criticalProjects}</h3>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Execução Orçamentária</p>
              <h3 className="text-2xl font-bold text-slate-900">{executionRate}%</h3>
              <p className="text-xs text-slate-400">R$ {(totalSpent/1000).toFixed(0)}k / {(totalBudget/1000).toFixed(0)}k</p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
              <DollarSign size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Eficiência de Custo (CPI)</p>
              <h3 className={`text-2xl font-bold ${Number(avgCPI) >= 1 ? 'text-emerald-600' : 'text-amber-600'}`}>{avgCPI}</h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <BarChart2 size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Projetos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
      
      {/* EVA Explanation Block */}
      <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
        <CardContent className="p-6">
          <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-blue-600" />
            Metodologia EVA (Earned Value Analysis) Ativa
          </h4>
          <p className="text-sm text-slate-600">
            O sistema calcula automaticamente o CPI (Cost Performance Index) e SPI (Schedule Performance Index) 
            baseado no avanço físico vs. financeiro reportado. Projetos com CPI &lt; 0.95 geram alertas automáticos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
