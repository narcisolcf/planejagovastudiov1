
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../../lib/supabase/client';
import { Project } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectForm } from '../../components/projects/ProjectForm';
import { Plus, Search, Filter, Loader2, RefreshCw, FolderOpen } from 'lucide-react';

export const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch (error) {
      console.error("Falha ao carregar projetos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectCreated = () => {
    setIsCreating(false);
    loadProjects();
  };

  const handleCardClick = (project: Project) => {
    navigate(`/projetos/lista/${project.id}`);
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.code.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Carteira de Projetos</h1>
          <p className="text-slate-500">Gerencie todos os projetos estratégicos e suas etapas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={loadProjects} title="Atualizar lista">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button 
            onClick={() => setIsCreating(true)} 
            disabled={isCreating}
            variant={isCreating ? 'secondary' : 'primary'}
          >
            <Plus size={16} className="mr-2" /> Novo Projeto
          </Button>
        </div>
      </div>

      {/* Área de Criação (Expandível) */}
      {isCreating && (
        <div className="animate-in slide-in-from-top-4 duration-300 border border-blue-100 rounded-lg shadow-lg overflow-hidden">
          <ProjectForm 
            onCancel={() => setIsCreating(false)} 
            onSuccess={handleProjectCreated} 
          />
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Buscar por título, código ou gerente..." 
            className="pl-10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter size={16} className="mr-2" /> Filtros
        </Button>
      </div>

      {/* Listagem */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Carregando projetos...</p>
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <FolderOpen size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Nenhum projeto encontrado</h3>
              <p className="text-slate-500 mb-6 max-w-sm">Não há projetos com os filtros atuais ou a lista está vazia.</p>
              {!isCreating && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus size={16} className="mr-2" /> Criar Primeiro Projeto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(p => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  onClick={() => handleCardClick(p)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
