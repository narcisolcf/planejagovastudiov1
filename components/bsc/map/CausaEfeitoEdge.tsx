import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

export function CausaEfeitoEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const weight = data?.weight || 0.5;
  const strokeWidth = 1 + (weight * 3); // 1-4px baseado no peso da relação

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth, stroke: '#64748b' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <text>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
}