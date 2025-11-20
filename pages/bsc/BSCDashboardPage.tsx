import React from 'react';
import { useStrategicMapData } from '../../hooks/useBSC';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { SemaforoEstrategico } from '../../components/bsc/dashboard/SemaforoEstrategico';
import { HeatmapPerspectivas } from '../../components/bsc/dashboard/HeatmapPerspectivas';
import { Loader2, Target, TrendingUp, AlertCircle } from 'lucide-react';

export const BSCDashboardPage: React.FC = () => {
  const { perspectives, objectives, indicators, isLoading } = useStrategicMapData();

  if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  // Dados consolidados
  const totalObjectives = objectives.data?.length || 0;
  const totalIndicators = indicators.data?.length || 0;
  const avgPerformance = objectives.data?.length 
    ? Math.round(objectives.data.reduce((acc, curr) => acc + curr.progress, 0) / objectives.data.length)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Objetivos Estratégicos</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalObjectives}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Indicadores Monitorados</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalIndicators}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Desempenho Global</p>
              <h3 className="text-2xl font-bold text-slate-900">{avgPerformance}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semáforo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            Semáforo de Indicadores
          </h3>
          <SemaforoEstrategico indicators={indicators.data} />
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Alertas Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {indicators.data
                  ?.filter(i => {
                     const progress = (i.currentValue || 0) / i.target * 100;
                     return progress < 70;
                  })
                  .map(ind => (
                    <div key={ind.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-3">
                        <AlertCircle size={16} className="text-red-500" />
                        <div>
                          <p className="text-sm font-bold text-red-900">{ind.name}</p>
                          <p className="text-xs text-red-700">Meta: {ind.target} | Atual: {ind.currentValue}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded text-red-600 border border-red-200">Ação Necessária</span>
                    </div>
                  ))
                }
                {!indicators.data?.some(i => ((i.currentValue || 0) / i.target * 100) < 70) && (
                  <p className="text-sm text-slate-500 italic text-center py-2">Nenhum indicador crítico no momento.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            Performance por Perspectiva
          </h3>
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <HeatmapPerspectivas perspectives={perspectives.data} objectives={objectives.data} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};