import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase/client';
import { 
  ArrowUpRight, Users, Target, ListTodo, 
  Coins, Scale, FileText, PieChart, Calendar, 
  TrendingUp, AlertCircle, CheckCircle2, Upload, FileCheck
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'budget'>('budget');
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadTypeRef = useRef<string | null>(null);

  // Dados simulados da Visão Geral
  const stats = [
    { title: "Projetos Ativos", value: "12", icon: ListTodo, change: "+2 esse mês", color: "text-blue-600" },
    { title: "Indicadores de Metas", value: "85%", icon: Target, change: "Dentro do esperado", color: "text-emerald-600" },
    { title: "Secretarias Envolvidas", value: "8", icon: Users, change: "Totalmente integradas", color: "text-purple-600" },
  ];

  // Componente da Barra de Progresso Simples
  const ProgressBar = ({ value, color = "bg-blue-600" }: { value: number, color?: string }) => (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );

  const triggerUpload = (type: string) => {
    activeUploadTypeRef.current = type;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const type = activeUploadTypeRef.current;

    if (!file || !type) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo PDF.');
      return;
    }

    try {
      setUploadingType(type);

      // Nome do arquivo: TIPO_TIMESTAMP.pdf
      const fileName = `${type}_${Date.now()}.pdf`;
      const filePath = `docs_legais/${fileName}`;

      // Upload para o Supabase Storage
      // Bucket esperado: 'documents' (precisa ser criado no dashboard do Supabase)
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) throw error;

      alert(`Arquivo da ${type} enviado com sucesso!`);
      // Aqui você salvaria a referência (URL) no banco de dados na tabela correspondente
      
    } catch (error: any) {
      console.error('Erro no upload:', error);
      // Fallback amigável para erro caso o bucket não exista ou erro de permissão
      const msg = error.message || 'Falha ao enviar arquivo. Verifique as permissões ou se o bucket "documents" existe.';
      alert(msg);
    } finally {
      setUploadingType(null);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente se necessário
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Hidden para Upload */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept=".pdf" 
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Painel de Controle</h1>
          <p className="text-slate-500 mt-1">Monitoramento estratégico e orçamentário do município.</p>
        </div>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Exercício: 2025
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
            `}
          >
            <PieChart size={16} />
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'budget' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
            `}
          >
            <Coins size={16} />
            Gestão Orçamentária
          </button>
        </nav>
      </div>

      {/* Conteúdo: Visão Geral */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Phase 1 Highlight */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Fase 1: Fundamentos em Andamento</h3>
                  <p className="text-blue-100 max-w-2xl">
                    A definição da Missão, Visão e Valores é crucial para o sucesso do BSC.
                    Complete a Matriz SWOT para destravar os Objetivos Estratégicos da Fase 2.
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg text-center min-w-[120px]">
                  <span className="block text-3xl font-bold">75%</span>
                  <span className="text-xs uppercase tracking-wider opacity-80">Concluído</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conteúdo: Orçamento */}
      {activeTab === 'budget' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Resumo Financeiro */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Receita Prevista</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">R$ 142.500.000</div>
                <div className="mt-2 text-xs text-slate-500">Exercício 2025</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Receita Arrecadada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">R$ 38.250.100</div>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar value={26.8} color="bg-emerald-500" />
                  <span className="text-xs font-medium">26.8%</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Despesa Empenhada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">R$ 41.100.900</div>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar value={28.8} color="bg-orange-500" />
                  <span className="text-xs font-medium">28.8%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2 mt-8 mb-4">
            <Scale className="text-slate-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Ciclo Orçamentário</h2>
          </div>

          {/* As Três Peças Orçamentárias */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* PPA */}
            <Card className="relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar size={64} />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mb-2 inline-block">
                    <FileText size={24} />
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">Vigente</span>
                </div>
                <CardTitle className="text-lg">PPA</CardTitle>
                <p className="text-sm text-slate-500">Plano Plurianual</p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="text-xs text-slate-500 block">Período</span>
                  <span className="font-semibold text-slate-900">2026 - 2029</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Fase Atual: Elaboração</span>
                    <span className="text-slate-900 font-bold">40%</span>
                  </div>
                  <ProgressBar value={40} />
                </div>
                <p className="text-xs text-slate-400 mt-2 flex-1">
                  Instrumento de planejamento estratégico de médio prazo. Define diretrizes, objetivos e metas.
                </p>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <Button 
                    variant={uploadingType === 'PPA' ? 'secondary' : 'outline'} 
                    size="sm" 
                    className="w-full" 
                    onClick={() => triggerUpload('PPA')}
                    isLoading={uploadingType === 'PPA'}
                    disabled={uploadingType !== null}
                  >
                    <Upload size={14} className="mr-2" />
                    {uploadingType === 'PPA' ? 'Enviando...' : 'Upload da Lei (PDF)'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => alert('Funcionalidade em desenvolvimento. Em breve você poderá detalhar os programas do PPA.')}
                  >
                    Detalhar Programas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LDO */}
            <Card className="relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={64} />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-purple-100 text-purple-700 p-2 rounded-lg mb-2 inline-block">
                    <Scale size={24} />
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">Aprovada</span>
                </div>
                <CardTitle className="text-lg">LDO</CardTitle>
                <p className="text-sm text-slate-500">Lei de Diretrizes Orçamentárias</p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="text-xs text-slate-500 block">Exercício</span>
                  <span className="font-semibold text-slate-900">2025</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Metas Fiscais</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Prioridades da Administração</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 flex-1">
                  Orienta a elaboração da LOA e define as metas e riscos fiscais para o ano seguinte.
                </p>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <Button 
                    variant={uploadingType === 'LDO' ? 'secondary' : 'outline'} 
                    size="sm" 
                    className="w-full" 
                    onClick={() => triggerUpload('LDO')}
                    isLoading={uploadingType === 'LDO'}
                    disabled={uploadingType !== null}
                  >
                    <Upload size={14} className="mr-2" />
                    {uploadingType === 'LDO' ? 'Enviando...' : 'Upload da Lei (PDF)'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => alert('Funcionalidade em desenvolvimento. Em breve você poderá visualizar as metas fiscais da LDO.')}
                  >
                    Ver Metas Fiscais
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LOA */}
            <Card className="relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Coins size={64} />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-orange-100 text-orange-700 p-2 rounded-lg mb-2 inline-block">
                    <PieChart size={24} />
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase">Em Execução</span>
                </div>
                <CardTitle className="text-lg">LOA</CardTitle>
                <p className="text-sm text-slate-500">Lei Orçamentária Anual</p>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="text-xs text-slate-500 block">Status</span>
                  <span className="font-semibold text-slate-900">Execução Q1</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Execução Global</span>
                    <span className="text-slate-900 font-bold">28%</span>
                  </div>
                  <ProgressBar value={28} color="bg-orange-500" />
                </div>
                <p className="text-xs text-slate-400 mt-2 flex-1">
                  O orçamento propriamente dito. Estima receitas e fixa despesas para o ano seguinte.
                </p>

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <Button 
                    variant={uploadingType === 'LOA' ? 'secondary' : 'outline'} 
                    size="sm" 
                    className="w-full" 
                    onClick={() => triggerUpload('LOA')}
                    isLoading={uploadingType === 'LOA'}
                    disabled={uploadingType !== null}
                  >
                    <Upload size={14} className="mr-2" />
                    {uploadingType === 'LOA' ? 'Enviando...' : 'Upload da Lei (PDF)'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => alert('Funcionalidade em desenvolvimento. Em breve você poderá acompanhar a execução orçamentária em tempo real.')}
                  >
                    Acompanhar Execução
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas de Prazo */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-amber-800">Prazos Legais (LRF)</h4>
              <p className="text-xs text-amber-700 mt-1">
                O Projeto de Lei do PPA 2026-2029 deve ser enviado à Câmara Municipal até <strong>31 de Agosto</strong>. Acompanhe o cronograma de audiências públicas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};