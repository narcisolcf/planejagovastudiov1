import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Perspective, StrategicObjective } from '../../../types';

interface HeatmapProps {
  perspectives?: Perspective[];
  objectives?: StrategicObjective[];
}

export const HeatmapPerspectivas: React.FC<HeatmapProps> = ({ perspectives = [], objectives = [] }) => {
  // Preparar dados para o gráfico
  const data = perspectives.map(p => {
    const perspectiveObjectives = objectives.filter(o => o.perspectiveId === p.id);
    const avgProgress = perspectiveObjectives.length 
      ? perspectiveObjectives.reduce((acc, curr) => acc + curr.progress, 0) / perspectiveObjectives.length
      : 0;

    return {
      name: p.name.split(' ')[0], // Nome curto
      fullName: p.name,
      value: Math.round(avgProgress),
      color: p.color.replace('bg-', 'text-').replace('500', '600') // Conversão rudimentar de classes tw para hex teria que ser feita, usaremos cores fixas por simplicidade no Recharts
    };
  });

  const getBarColor = (value: number) => {
    if (value >= 80) return '#10b981'; // Emerald 500
    if (value >= 50) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}} />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-2 border border-slate-200 shadow-lg rounded text-sm">
                    <p className="font-bold text-slate-800">{d.fullName}</p>
                    <p className="text-slate-600">Desempenho Médio: <span className="font-bold">{d.value}%</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};