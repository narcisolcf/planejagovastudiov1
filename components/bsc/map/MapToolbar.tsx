import React from 'react';
import { Panel } from 'reactflow';
import { Button } from '../../ui/Button';
import { Save, Layout, Download } from 'lucide-react';

interface MapToolbarProps {
  onLayout: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const MapToolbar: React.FC<MapToolbarProps> = ({ onLayout, onSave, isSaving }) => {
  return (
    <Panel position="top-right" className="flex gap-2">
      <div className="bg-white p-2 rounded-lg shadow-md border border-slate-200 flex gap-2">
        <Button variant="secondary" size="sm" onClick={onLayout} title="Organizar Automaticamente">
          <Layout size={16} className="mr-2" /> Auto Layout
        </Button>
        <Button variant="primary" size="sm" onClick={onSave} isLoading={isSaving} title="Salvar Mapa">
          <Save size={16} className="mr-2" /> Salvar
        </Button>
        <div className="w-px bg-slate-200 mx-1"></div>
        <Button variant="ghost" size="sm" className="px-2" title="Exportar Imagem">
          <Download size={16} />
        </Button>
      </div>
    </Panel>
  );
};