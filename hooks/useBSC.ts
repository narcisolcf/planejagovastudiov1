import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bscApi } from '../lib/supabase/client';

export function usePerspectives() {
  return useQuery({
    queryKey: ['perspectives'],
    queryFn: bscApi.getPerspectives
  });
}

export function useObjectives() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['objectives'],
    queryFn: bscApi.getObjectives
  });

  const createMutation = useMutation({
    mutationFn: bscApi.createObjective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
      alert("Objetivo criado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao criar objetivo:", error);
      alert("Falha ao criar objetivo. Verifique os dados e tente novamente.");
    }
  });

  return { ...query, createObjective: createMutation.mutateAsync };
}

export function useIndicators(objectiveId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['indicators', objectiveId],
    queryFn: () => bscApi.getIndicators(objectiveId)
  });

  const createMutation = useMutation({
    mutationFn: bscApi.createIndicator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
      alert("Indicador criado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao criar indicador:", error);
      alert("Falha ao criar indicador. Tente novamente.");
    }
  });

  return { ...query, createIndicator: createMutation.mutateAsync };
}

export function useBSCRelationships() {
  return useQuery({
    queryKey: ['bsc-relationships'],
    queryFn: bscApi.getRelationships
  });
}

// Hook composto para o Mapa
export function useStrategicMapData() {
  const perspectives = usePerspectives();
  const objectives = useObjectives();
  const relationships = useBSCRelationships();
  const indicators = useIndicators();

  return {
    perspectives,
    objectives,
    relationships,
    indicators,
    isLoading: perspectives.isLoading || objectives.isLoading || relationships.isLoading || indicators.isLoading
  };
}