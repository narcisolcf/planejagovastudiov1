import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Label } from '../components/ui/Input';
import { fundamentalsApi } from '../lib/supabase/client';
import { StrategicFundamentals, SwotType, SwotItem } from '../types';
import { usePrompt } from '../hooks/usePrompt';
import {
  Save, Plus, Trash2, Loader2, AlertTriangle, TrendingUp, ShieldAlert, Zap,
  Users, DollarSign, TrendingDown, Scale, FileText, Building, Globe, Lock, Target, Briefcase, Lightbulb, CheckCircle
} from 'lucide-react';

// Mapeamento de ícones disponíveis para seleção
const ICON_MAP: Record<string, any> = {
  Users, DollarSign, TrendingUp, TrendingDown, Scale, FileText,
  Building, Globe, Lock, Target, Briefcase, Lightbulb, CheckCircle,
  AlertTriangle, ShieldAlert, Zap
};

export const StrategicFundamentalsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'identity' | 'swot'>('identity');

  // Fetch Data
  const { data, isLoading } = useQuery({
    queryKey: ['fundamentals'],
    queryFn: fundamentalsApi.get,
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: fundamentalsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fundamentals'] });
      alert("Fundamentos atualizados com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao salvar fundamentos:", error);
      alert("Falha ao salvar alterações. Tente novamente.");
    }
  });

  if (isLoading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Carregando planejamento estratégico...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fundamentos Estratégicos</h1>
        <p className="text-slate-500 mt-1">Definição da identidade organizacional e diagnóstico (Fase 1)</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('identity')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'identity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
            `}
          >
            Identidade (Missão/Visão/Valores)
          </button>
          <button
            onClick={() => setActiveTab('swot')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'swot'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
            `}
          >
            Matriz SWOT (Diagnóstico)
          </button>
        </nav>
      </div>

      {activeTab === 'identity' ? (
        <IdentityForm initialData={data} onSave={(newData) => mutation.mutate(newData)} isSaving={mutation.isPending} />
      ) : (
        <SwotManager initialData={data} onSave={(newData) => mutation.mutate(newData)} isSaving={mutation.isPending} />
      )}
    </div>
  );
};

// --- Subcomponents for Better Organization ---

const IdentityForm: React.FC<{
  initialData: StrategicFundamentals;
  onSave: (data: any) => void;
  isSaving: boolean;
}> = ({ initialData, onSave, isSaving }) => {
  const { register, control, handleSubmit, formState: { isDirty } } = useForm<StrategicFundamentals>({
    defaultValues: initialData
  });

  usePrompt('Você tem alterações não salvas. Deseja realmente sair?', isDirty);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "values" as any // Type casting for simplicity in this prototype
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="grid gap-6 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Identidade Institucional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="mission">Missão</Label>
            <Textarea
              id="mission"
              rows={3}
              placeholder="Qual a razão de existir da prefeitura?"
              {...register("mission")}
            />
            <p className="text-xs text-slate-500 mt-1">Ex: Servir ao cidadão com excelência...</p>
          </div>

          <div>
            <Label htmlFor="vision">Visão de Futuro (2028)</Label>
            <Textarea
              id="vision"
              rows={3}
              placeholder="Onde queremos chegar ao fim do mandato?"
              {...register("vision")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Valores da Gestão</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={() => append("Novo Valor")}>
            <Plus size={16} className="mr-2" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`values.${index}` as any)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 justify-end">
          <Button type="submit" isLoading={isSaving}>
            <Save size={16} className="mr-2" />
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

// Componente auxiliar para seleção de ícones
const IconPicker: React.FC<{
  currentIconName?: string;
  onSelect: (iconName: string) => void;
  colorClass: string;
}> = ({ currentIconName, onSelect, colorClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const CurrentIcon = currentIconName && ICON_MAP[currentIconName] ? ICON_MAP[currentIconName] : CheckCircle;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 transition-colors ${isOpen ? 'ring-2 ring-blue-500' : ''}`}
        title="Selecionar ícone"
      >
        <CurrentIcon size={16} className={colorClass.replace('bg-', 'text-').replace('500', '600')} />
      </button>

      {isOpen && (
        <div className="absolute top-10 left-0 z-50 w-64 p-2 bg-white border border-slate-200 rounded-lg shadow-lg grid grid-cols-6 gap-1">
          {Object.keys(ICON_MAP).map((iconName) => {
            const IconComponent = ICON_MAP[iconName];
            return (
              <button
                key={iconName}
                onClick={() => {
                  onSelect(iconName);
                  setIsOpen(false);
                }}
                className={`p-2 rounded hover:bg-slate-100 flex items-center justify-center ${currentIconName === iconName ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                title={iconName}
              >
                <IconComponent size={16} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SwotManager: React.FC<{
  initialData: StrategicFundamentals;
  onSave: (data: any) => void;
  isSaving: boolean;
}> = ({ initialData, onSave, isSaving }) => {
  const { control, register, handleSubmit, formState: { isDirty } } = useForm<{ swotAnalysis: SwotItem[] }>({
    defaultValues: {
      swotAnalysis: initialData.swotAnalysis
    }
  });

  usePrompt('Você tem alterações não salvas na análise SWOT. Deseja realmente sair?', isDirty);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "swotAnalysis"
  });

  const handleAddItem = (type: SwotType) => {
    append({
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      type: type,
      importance: 3,
      icon: 'CheckCircle'
    });
  };

  const onSubmit = (data: { swotAnalysis: SwotItem[] }) => {
    // Precisamos mesclar com o initialData para não perder missão/visão
    onSave({
      ...initialData,
      swotAnalysis: data.swotAnalysis
    });
  };

  const SwotSection = ({ type, title, icon: Icon, colorClass }: { type: SwotType, title: string, icon: any, colorClass: string }) => (
    <Card className="h-full flex flex-col">
      <CardHeader className={`${colorClass} bg-opacity-10 border-b border-slate-100 pb-4`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${colorClass} text-white`}>
            <Icon size={18} />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4 space-y-3 overflow-y-auto max-h-[300px] min-h-[200px]">
        {fields.map((field, index) => {
          if (field.type !== type) return null;

          return (
            <div key={field.id} className="flex items-center gap-2 group">
              {/* Icon Picker via Controller */}
              <Controller
                control={control}
                name={`swotAnalysis.${index}.icon`}
                render={({ field: { onChange, value } }) => (
                  <IconPicker
                    currentIconName={value}
                    onSelect={onChange}
                    colorClass={colorClass}
                  />
                )}
              />

              {/* Text Input */}
              <Input
                {...register(`swotAnalysis.${index}.text`)}
                className="flex-1 h-8 text-sm"
                placeholder="Descrição..."
              />

              {/* Importance Input */}
              <div className="flex flex-col items-center" title="Importância (1-5)">
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...register(`swotAnalysis.${index}.importance`, { valueAsNumber: true, min: 1, max: 5 })}
                  className="w-14 h-8 text-sm text-center px-1"
                />
              </div>

              {/* Delete Action */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-slate-500 border-dashed border border-slate-300 mt-2"
          onClick={() => handleAddItem(type)}
        >
          <Plus size={14} className="mr-1" /> Adicionar
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <SwotSection type={SwotType.STRENGTH} title="Forças (Interno)" icon={Zap} colorClass="bg-emerald-500" />
        <SwotSection type={SwotType.WEAKNESS} title="Fraquezas (Interno)" icon={AlertTriangle} colorClass="bg-orange-500" />
        <SwotSection type={SwotType.OPPORTUNITY} title="Oportunidades (Externo)" icon={TrendingUp} colorClass="bg-blue-500" />
        <SwotSection type={SwotType.THREAT} title="Ameaças (Externo)" icon={ShieldAlert} colorClass="bg-red-500" />
      </div>

      <div className="flex justify-end bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky bottom-4">
        <Button type="submit" isLoading={isSaving}>
          <Save size={16} className="mr-2" />
          Salvar Análise SWOT
        </Button>
      </div>
    </form>
  );
};