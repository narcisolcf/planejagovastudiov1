import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  Panel
} from 'reactflow';
import dagre from 'dagre';
import { useStrategicMapData } from '../../hooks/useBSC';
import { ObjectiveNode } from '../../components/bsc/ObjectiveNode';
import { CausaEfeitoEdge } from '../../components/bsc/map/CausaEfeitoEdge';
import { MapToolbar } from '../../components/bsc/map/MapToolbar';
import { Loader2 } from 'lucide-react';

const nodeTypes = {
  objective: ObjectiveNode,
};

const edgeTypes = {
  causaEfeito: CausaEfeitoEdge
};

// Helper para layout automático com Dagre
const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 256;
  const nodeHeight = 100;

  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const StrategicMapPage: React.FC = () => {
  const { perspectives, objectives, relationships, indicators, isLoading } = useStrategicMapData();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    if (!isLoading && objectives.data && relationships.data && perspectives.data) {
      // Transform Objectives to Nodes
      const initialNodes = objectives.data.map(obj => {
        const persp = perspectives.data?.find(p => p.id === obj.perspectiveId);
        const objIndicators = indicators.data?.filter(i => i.objectiveId === obj.id) || [];
        
        return {
          id: obj.id,
          type: 'objective',
          data: { 
            code: obj.code, 
            title: obj.title, 
            perspective: persp?.name || '',
            colorClass: persp?.color || 'bg-slate-500',
            progress: obj.progress,
            indicatorsCount: objIndicators.length
          },
          position: { x: 0, y: 0 } // Calculated later
        };
      });

      // Transform Relationships to Edges
      const initialEdges = relationships.data.map(rel => ({
        id: rel.id,
        source: rel.sourceId,
        target: rel.targetId,
        type: 'causaEfeito', // Usando nossa edge customizada
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: true,
        data: { label: 'impacto', weight: 0.5 }
      }));

      // Calculate Layout Initial
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, objectives.data, relationships.data, perspectives.data, indicators.data]);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);

  const onSave = useCallback(async () => {
    setIsSaving(true);
    // Simulação de salvamento de posições
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Mapa Estratégico salvo com sucesso!');
  }, []);

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="h-[calc(100vh-200px)] border border-slate-200 rounded-lg bg-slate-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => '#e2e8f0'}
          nodeColor={(n) => '#f8fafc'}
        />
        <MapToolbar onLayout={onLayout} onSave={onSave} isSaving={isSaving} />
      </ReactFlow>
    </div>
  );
};