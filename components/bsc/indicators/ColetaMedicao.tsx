import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Input, Label, Textarea } from '../../ui/Input';
import { Card, CardContent } from '../../ui/Card';
import { Upload, CheckCircle } from 'lucide-react';
import { Measurement } from '../../../types';

interface ColetaProps {
  onCollect: (measurement: Partial<Measurement>) => void;
}

export const ColetaMedicao: React.FC<ColetaProps> = ({ onCollect }) => {
  const [value, setValue] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCollect({
      value: Number(value),
      date: new Date().toISOString(),
      status: 'on_target', // Lógica real faria a comparação
      evidenceUrl: file ? URL.createObjectURL(file) : undefined
    });
    setValue('');
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data da Medição</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <Label>Valor Medido</Label>
              <Input 
                type="number" 
                placeholder="0.00" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Evidência (Documento/Foto)</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors cursor-pointer relative">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload de arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <p className="text-xs text-slate-500">PDF, PNG, JPG até 10MB</p>
                {file && <p className="text-sm text-emerald-600 font-medium mt-2">{file.name}</p>}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <CheckCircle size={16} className="mr-2" /> Registrar Medição
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};