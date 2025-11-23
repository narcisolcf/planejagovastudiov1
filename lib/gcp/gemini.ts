/**
 * Integração com Google Vertex AI (Gemini)
 *
 * IMPORTANTE: Este módulo deve ser executado no BACKEND (API Routes, Cloud Functions)
 * NÃO deve ser importado diretamente no frontend por questões de segurança
 * (API Keys não devem ser expostas no cliente)
 */

import type { StrategicObjective, Indicator, Project } from '../../types';

// ========================================
// TYPES
// ========================================

export interface GeminiAnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  risks?: string[];
}

export interface StrategicAnalysisInput {
  objectives: StrategicObjective[];
  indicators?: Indicator[];
  projects?: Project[];
}

// ========================================
// CONFIGURAÇÃO
// ========================================

/**
 * Inicializa o cliente Vertex AI
 * Requer variáveis de ambiente:
 * - GCP_PROJECT_ID
 * - GCP_LOCATION (padrão: us-central1)
 */
export const initVertexAI = () => {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || 'us-central1';

  if (!projectId) {
    throw new Error('GCP_PROJECT_ID não configurado');
  }

  // Exemplo de inicialização (requer @google-cloud/vertexai instalado)
  /*
  const { VertexAI } = require('@google-cloud/vertexai');

  const vertexAI = new VertexAI({
    project: projectId,
    location: location
  });

  return vertexAI;
  */

  console.warn('Vertex AI não inicializado - instale @google-cloud/vertexai');
  return null;
};

// ========================================
// FUNÇÕES DE ANÁLISE
// ========================================

/**
 * Analisa objetivos estratégicos usando Gemini
 * Identifica lacunas, redundâncias e oportunidades de melhoria
 */
export async function analyzeStrategicObjectives(
  objectives: StrategicObjective[]
): Promise<GeminiAnalysisResult> {
  // Mock implementation para desenvolvimento
  // TODO: Implementar chamada real ao Vertex AI quando configurado

  console.log('analyzeStrategicObjectives - Mock Mode');

  const prompt = `
Você é um consultor especializado em planejamento estratégico para gestão pública municipal.

Analise os seguintes objetivos estratégicos e forneça:
1. Um resumo executivo da situação atual
2. Insights sobre a coerência e alinhamento dos objetivos
3. Recomendações de melhoria
4. Riscos potenciais

Objetivos:
${objectives.map(obj => `- [${obj.code}] ${obj.title}: ${obj.description}`).join('\n')}

Formato da resposta: JSON com campos summary, insights, recommendations, risks
`;

  // Implementação real (quando configurado):
  /*
  const vertexAI = initVertexAI();
  if (!vertexAI) throw new Error('Vertex AI não configurado');

  const model = vertexAI.preview.getGenerativeModel({
    model: 'gemini-1.5-pro'
  });

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return JSON.parse(response);
  */

  // Mock response
  return {
    summary: `Análise de ${objectives.length} objetivos estratégicos. Estrutura geral adequada com cobertura das 4 perspectivas do BSC.`,
    insights: [
      'Forte foco em digitalização (PRO-01) alinhado com tendências modernas',
      'Objetivo de arrecadação (FIN-01) conectado corretamente com iniciativas operacionais',
      'Indicadores de saúde (CID-01) podem requerer mais detalhamento'
    ],
    recommendations: [
      'Considere adicionar objetivo específico para sustentabilidade ambiental',
      'Revisar meta de capacitação (APR-01) - prazo atual pode ser otimista',
      'Criar indicador de satisfação do cidadão para validar CID-01'
    ],
    risks: [
      'Dependência tecnológica alta - necessário plano de contingência',
      'Orçamento limitado pode impactar PRO-01'
    ]
  };
}

/**
 * Analisa indicadores e sugere melhorias nas metas
 */
export async function analyzeIndicators(
  indicators: Indicator[]
): Promise<GeminiAnalysisResult> {
  console.log('analyzeIndicators - Mock Mode');

  const prompt = `
Analise os seguintes indicadores de desempenho:

${indicators.map(ind => `
- ${ind.code}: ${ind.name}
  Baseline: ${ind.baseline} ${ind.unit}
  Meta: ${ind.target} ${ind.unit}
  Atual: ${ind.currentValue} ${ind.unit}
  Polaridade: ${ind.polarity}
`).join('\n')}

Verifique:
1. Se as metas são SMART (Específicas, Mensuráveis, Atingíveis, Relevantes, Temporais)
2. Se os valores baseline fazem sentido
3. Se há incoerências ou metas irrealistas
`;

  // Mock response
  return {
    summary: `${indicators.length} indicadores analisados. Maioria bem estruturada.`,
    insights: [
      'IND-01 (Digitalização): Progresso excelente - 90% já alcançado',
      'IND-02 (Tempo de Espera): Redução de 45 para 25 dias é significativa',
      'IND-03 (Arrecadação): Meta de 85% é ambiciosa mas alcançável'
    ],
    recommendations: [
      'Revisar meta de IND-01 para 2026 - considerar 100% pode não ser realista',
      'Adicionar indicador de qualidade além do tempo de espera (IND-02)',
      'Incluir fonte de dados mais específica para todos os indicadores'
    ]
  };
}

/**
 * Gera sugestões de objetivos estratégicos baseado em SWOT
 */
export async function generateObjectivesFromSWOT(
  strengths: string[],
  weaknesses: string[],
  opportunities: string[],
  threats: string[]
): Promise<{ objectives: string[] }> {
  console.log('generateObjectivesFromSWOT - Mock Mode');

  const prompt = `
Com base na análise SWOT abaixo, sugira 5 objetivos estratégicos para um município:

Forças:
${strengths.map(s => `- ${s}`).join('\n')}

Fraquezas:
${weaknesses.map(w => `- ${w}`).join('\n')}

Oportunidades:
${opportunities.map(o => `- ${o}`).join('\n')}

Ameaças:
${threats.map(t => `- ${t}`).join('\n')}

Formato: Lista de objetivos específicos e mensuráveis.
`;

  // Mock response
  return {
    objectives: [
      'Implementar programa de capacitação digital para servidores públicos',
      'Criar portal de transparência com dashboards em tempo real',
      'Estabelecer parcerias com universidades para projetos de inovação',
      'Reduzir tempo médio de atendimento ao cidadão em 30%',
      'Aumentar arrecadação própria através de modernização tributária'
    ]
  };
}

/**
 * Analisa risco de portfólio de projetos
 */
export async function analyzeProjectPortfolio(
  projects: Project[]
): Promise<GeminiAnalysisResult> {
  console.log('analyzeProjectPortfolio - Mock Mode');

  const inProgress = projects.filter(p => p.status === 'IN_PROGRESS');
  const critical = projects.filter(p => p.health === 'CRITICAL');

  const prompt = `
Analise o portfólio de projetos estratégicos:

Total: ${projects.length} projetos
Em andamento: ${inProgress.length}
Status crítico: ${critical.length}

Projetos:
${projects.map(p => `
- ${p.code}: ${p.title}
  Status: ${p.status}
  Saúde: ${p.health}
  Progresso: ${p.progress}%
  CPI: ${p.cpi} | SPI: ${p.spi}
  Orçamento: R$ ${p.budget?.spent} / R$ ${p.budget?.approved}
`).join('\n')}

Avalie riscos e sugira ações corretivas.
`;

  // Mock response
  return {
    summary: `Portfólio com ${projects.length} projetos. ${critical.length} projeto(s) em situação crítica.`,
    insights: [
      'PE-2025-03 (Portal Contribuinte): Concluído no prazo e orçamento - excelente!',
      'PE-2025-01 (Prontuário): Leve atraso (SPI 0.98) mas CPI positivo (1.05)',
      'PE-2025-02 (Escola): CRÍTICO - SPI 0.70 e CPI 0.85 indicam problemas sérios'
    ],
    recommendations: [
      'PE-2025-02: Realizar reunião emergencial com stakeholders',
      'PE-2025-02: Revisar escopo ou solicitar extensão de prazo',
      'PE-2025-01: Manter monitoramento semanal para evitar degradação',
      'Considerar realocar recursos de PE-2025-03 (concluído) para PE-2025-02'
    ],
    risks: [
      'Risco alto de não concluir PE-2025-02 no prazo atual',
      'Possível estouro orçamentário em PE-2025-02',
      'Dependência de fornecedores pode atrasar PE-2025-01'
    ]
  };
}

/**
 * Gera relatório executivo completo
 */
export async function generateExecutiveReport(
  input: StrategicAnalysisInput
): Promise<string> {
  console.log('generateExecutiveReport - Mock Mode');

  const { objectives, indicators, projects } = input;

  const prompt = `
Gere um relatório executivo completo sobre a situação estratégica atual:

OBJETIVOS ESTRATÉGICOS:
${objectives?.map(obj => `- ${obj.code}: ${obj.title} (${obj.progress}%)`).join('\n')}

INDICADORES:
${indicators?.map(ind => `- ${ind.code}: ${ind.name} - Atual: ${ind.currentValue}/${ind.target} ${ind.unit}`).join('\n')}

PROJETOS:
${projects?.map(p => `- ${p.code}: ${p.title} - ${p.status} (${p.progress}%)`).join('\n')}

Formato: Relatório em markdown com seções: Sumário Executivo, Situação Atual, Riscos, Recomendações
`;

  // Mock response
  return `
# Relatório Executivo - Planejamento Estratégico Municipal

## 📊 Sumário Executivo

O município apresenta estrutura estratégica bem definida com ${objectives?.length || 0} objetivos distribuídos nas 4 perspectivas do BSC.
Destaque para o alto índice de digitalização (90%) e avanços na arrecadação própria (75%).

## 🎯 Situação Atual

### Objetivos Estratégicos
- **Progresso Médio**: ${Math.round((objectives?.reduce((sum, obj) => sum + obj.progress, 0) || 0) / (objectives?.length || 1))}%
- **Status**: ${objectives?.filter(o => o.status === 'ACTIVE').length} objetivos ativos

### Indicadores
- ${indicators?.length || 0} indicadores monitorados
- ${indicators?.filter(i => i.currentValue >= i.target).length} já atingiram a meta

### Projetos
- ${projects?.filter(p => p.status === 'COMPLETED').length} concluídos
- ${projects?.filter(p => p.status === 'IN_PROGRESS').length} em andamento
- ${projects?.filter(p => p.health === 'CRITICAL').length} em situação crítica

## ⚠️ Principais Riscos

1. Projeto "Reforma da Escola Central" com atraso significativo (SPI 0.70)
2. Dependência tecnológica alta - necessário plano de contingência
3. Orçamento limitado pode impactar novos projetos

## 💡 Recomendações

1. **Imediato**: Intervir no projeto PE-2025-02 para evitar maiores prejuízos
2. **Curto Prazo**: Revisar metas de indicadores para 2026
3. **Médio Prazo**: Implementar sistema de monitoramento contínuo
4. **Longo Prazo**: Criar programa de gestão de riscos estratégicos

---
*Relatório gerado automaticamente via Vertex AI (Gemini)*
`;
}

// ========================================
// EXPORT
// ========================================

export const geminiAI = {
  analyzeStrategicObjectives,
  analyzeIndicators,
  generateObjectivesFromSWOT,
  analyzeProjectPortfolio,
  generateExecutiveReport
};
