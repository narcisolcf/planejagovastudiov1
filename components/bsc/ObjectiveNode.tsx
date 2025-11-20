import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface ObjectiveNodeData {
  code: string;
  title: string;
  perspective: string;
  progress: number;
  colorClass: string;
  indicatorsCount: number;
}

export const ObjectiveNode = memo(({ data }: { data: ObjectiveNodeData }) => {
  return (
    <div className={`w-64 rounded-lg shadow-lg overflow-hidden border border-slate-200 bg-white`}>
      {/* Header colored by perspective */}
      <div className={`h-2 ${data.colorClass}`} />
      
      <div className="p-3">
        <Handle type="target" position={Position.Top} className="!bg-slate-400" />
        
        <div className="flex justify-between items-center mb-1">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600`}>
            {data.code}
          </span>
          <div className="flex items-center gap-1" title="Progresso">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${data.progress >= 70 ? 'bg-emerald-500' : data.progress >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${data.progress}%` }} 
              />
            </div>
            <span className="text-[10px] text-slate-500">{data.progress}%</span>
          </div>
        </div>

        <div className="text-sm font-medium text-slate-800 leading-tight mb-2">
          {data.title}
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            {data.perspective}
          </span>
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {data.indicatorsCount} ind.
          </span>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      </div>
    </div>
  );
});