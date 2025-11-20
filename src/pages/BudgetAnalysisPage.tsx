
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  GitCompare, CheckCircle2, AlertTriangle, XCircle, 
  ArrowRight, Database, Download, Sparkles 
} from 'lucide-react';
import { ChatAssistant } from '../components/rag/ChatAssistant';

export const BudgetAnalysisPage: React.FC = () => {
  // Dados simulados de compatibilidade
  const compatibilityChecks = [
    {
      id: 1,
      source: "PPA 2022-2025",
      target: "LDO 2025",
      status: "compatible",
      score: 95,
      description: "Metas e Prioridades da LDO estão alinhadas aos programas do PPA."
    },
    {
      id: 2,
      source: "LDO 2025",
      target: "LOA 2025",
      status: "warning",
      score: 78,
      description: "Despesa de Pessoal prevista na LOA está próxima ao limite estabelecido na LDO."
    },
    {
      id: 3,
      source: "Plano de Governo",
      target: "PPA 2026-2029",
      status: "pending",
      score: 0,
      description: "PPA em elaboração. Aguardando definição final de programas."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compatible': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compatible': return <CheckCircle2 size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <XCircle size={20} />;
      default: return <Database size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Análise Inteligente de Dados</h1>
        <p className="text-slate-500 mt-1">
          Utilize a IA para cruzar dados do planejamento estratégico com as leis orçamentárias (RAG).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Relatórios Tradicionais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fluxo Hierárquico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hierarquia do Planejamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 relative">
                {/* Linha conectora para desktop */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />

                <div className="flex flex-col items-center bg-white p-4 z-10 border border-blue-100 rounded-xl shadow-sm w-full md:w-64">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 font-bold border-4 border-white shadow-sm">1</div>
                  <h3 className="font-bold text-slate-800">PPA</h3>
                  <p className="text-xs text-slate-500 text-center">Planejamento (4 anos)</p>
                  <div className="mt-2 text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">Diretriz Maior</div>
                </div>

                <ArrowRight className="md:hidden text-slate-300 transform rotate-90 md:rotate-0 my-2" />

                <div className="flex flex-col items-center bg-white p-4 z-10 border border-purple-100 rounded-xl shadow-sm w-full md:w-64">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3 font-bold border-4 border-white shadow-sm">2</div>
                  <h3 className="font-bold text-slate-800">LDO</h3>
                  <p className="text-xs text-slate-500 text-center">Orientação (Anual)</p>
                  <div className="mt-2 text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">Elo de Ligação</div>
                </div>

                <ArrowRight className="md:hidden text-slate-300 transform rotate-90 md:rotate-0 my-2" />

                <div className="flex flex-col items-center bg-white p-4 z-10 border border-orange-100 rounded-xl shadow-sm w-full md:w-64">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 font-bold border-4 border-white shadow-sm">3</div>
                  <h3 className="font-bold text-slate-800">LOA</h3>
                  <p className="text-xs text-slate-500 text-center">Execução (Anual)</p>
                  <div className="mt-2 text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">Orçamento Real</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matriz de Compatibilidade */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Verificação de Consistência</CardTitle>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Exportar PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compatibilityChecks.map((check) => (
                  <div 
                    key={check.id} 
                    className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center gap-4 ${getStatusColor(check.status)}`}
                  >
                    <div className="flex items-center gap-3 min-w-[200px]">
                      {getStatusIcon(check.status)}
                      <div className="font-bold text-sm">
                        {check.source} <span className="mx-2 text-slate-400">→</span> {check.target}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-sm opacity-90">
                      {check.description}
                    </div>

                    {check.status !== 'pending' && (
                      <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
                        <div className="text-xs font-semibold">Aderência:</div>
                        <div className="text-sm font-bold">{check.score}%</div>
                      </div>
                    )}
                  </div>
                ))}
                <Button className="w-full mt-2 border-dashed border-2 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100">
                  <GitCompare size={16} className="mr-2" />
                  Executar Nova Análise Cruzada
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Chat IA */}
        <div className="lg:col-span-1">
           <ChatAssistant />
           
           <Card className="mt-4 bg-indigo-50 border-indigo-100">
             <CardContent className="p-4">
               <h4 className="font-bold text-indigo-800 flex items-center gap-2 mb-2">
                 <Sparkles size={16} /> Sugestões de Análise
               </h4>
               <ul className="text-sm text-indigo-700 space-y-2 list-disc pl-4">
                 <li>"O projeto da nova escola está previsto no PPA?"</li>
                 <li>"Qual o limite de gastos com pessoal na LDO?"</li>
                 <li>"Resuma os indicadores de saúde da LOA."</li>
               </ul>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};
