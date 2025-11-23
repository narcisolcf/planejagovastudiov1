/**
 * Integração com Google Document AI
 *
 * Extrai dados estruturados de documentos legais (PPA, LDO, LOA)
 * usando OCR avançado e processamento de linguagem natural
 *
 * IMPORTANTE: Este módulo deve ser executado no BACKEND
 */

// ========================================
// TYPES
// ========================================

export interface DocumentAIResult {
  text: string;
  entities: DocumentEntity[];
  tables: DocumentTable[];
  metadata: DocumentMetadata;
}

export interface DocumentEntity {
  type: string;
  mentionText: string;
  confidence: number;
  pageNumber?: number;
}

export interface DocumentTable {
  headerRows: string[][];
  bodyRows: string[][];
  pageNumber: number;
}

export interface DocumentMetadata {
  pageCount: number;
  language: string;
  mimeType: string;
  processingTime: number;
}

export interface PPAExtractedData {
  periodo: { inicio: number; fim: number };
  programas: Array<{
    codigo: string;
    nome: string;
    objetivo: string;
    valor?: number;
  }>;
  diretrizes: string[];
  metas: string[];
}

export interface LDOExtractedData {
  exercicio: number;
  metasFiscais: {
    receitaTotal?: number;
    despesaTotal?: number;
    resultadoPrimario?: number;
    resultadoNominal?: number;
  };
  prioridades: string[];
  riscosFiscais: string[];
}

export interface LOAExtractedData {
  exercicio: number;
  receitaPrevista: number;
  despesaFixada: number;
  categorias: Array<{
    nome: string;
    valor: number;
    percentual: number;
  }>;
}

// ========================================
// CONFIGURAÇÃO
// ========================================

/**
 * Inicializa o cliente Document AI
 * Requer variáveis de ambiente:
 * - GCP_PROJECT_ID
 * - GCP_LOCATION
 * - DOCUMENT_AI_PROCESSOR_ID
 */
export const initDocumentAI = () => {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || 'us-central1';
  const processorId = process.env.DOCUMENT_AI_PROCESSOR_ID;

  if (!projectId || !processorId) {
    throw new Error('Configuração do Document AI incompleta');
  }

  // Exemplo de inicialização (requer @google-cloud/documentai instalado)
  /*
  const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');

  const client = new DocumentProcessorServiceClient();
  const processorName = client.processorPath(projectId, location, processorId);

  return { client, processorName };
  */

  console.warn('Document AI não inicializado - instale @google-cloud/documentai');
  return null;
};

// ========================================
// FUNÇÕES DE PROCESSAMENTO
// ========================================

/**
 * Processa um documento PDF genérico
 * @param fileUrl URL pública do arquivo no Supabase Storage
 */
export async function processDocument(
  fileUrl: string
): Promise<DocumentAIResult> {
  console.log('processDocument - Mock Mode', fileUrl);

  // Implementação real (quando configurado):
  /*
  const config = initDocumentAI();
  if (!config) throw new Error('Document AI não configurado');

  const { client, processorName } = config;

  // Baixar arquivo
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const content = Buffer.from(arrayBuffer).toString('base64');

  // Processar documento
  const request = {
    name: processorName,
    rawDocument: {
      content: content,
      mimeType: 'application/pdf'
    }
  };

  const [result] = await client.processDocument(request);
  const { document } = result;

  // Extrair entidades
  const entities = document.entities?.map(entity => ({
    type: entity.type || '',
    mentionText: entity.mentionText || '',
    confidence: entity.confidence || 0,
    pageNumber: entity.pageAnchor?.pageRefs?.[0]?.page
  })) || [];

  // Extrair tabelas
  const tables = document.pages?.flatMap((page, pageIndex) =>
    page.tables?.map(table => ({
      headerRows: table.headerRows?.map(row =>
        row.cells?.map(cell => cell.layout?.textAnchor?.content || '') || []
      ) || [],
      bodyRows: table.bodyRows?.map(row =>
        row.cells?.map(cell => cell.layout?.textAnchor?.content || '') || []
      ) || [],
      pageNumber: pageIndex + 1
    })) || []
  ) || [];

  return {
    text: document.text || '',
    entities,
    tables,
    metadata: {
      pageCount: document.pages?.length || 0,
      language: document.language || 'pt-BR',
      mimeType: 'application/pdf',
      processingTime: Date.now()
    }
  };
  */

  // Mock response
  return {
    text: 'Conteúdo extraído do PDF...',
    entities: [
      { type: 'VALOR', mentionText: 'R$ 142.500.000', confidence: 0.95, pageNumber: 1 },
      { type: 'DATA', mentionText: '2026-2029', confidence: 0.92, pageNumber: 1 }
    ],
    tables: [],
    metadata: {
      pageCount: 10,
      language: 'pt-BR',
      mimeType: 'application/pdf',
      processingTime: Date.now()
    }
  };
}

/**
 * Extrai dados estruturados de um PPA
 */
export async function extractPPAData(fileUrl: string): Promise<PPAExtractedData> {
  console.log('extractPPAData - Mock Mode', fileUrl);

  const document = await processDocument(fileUrl);

  // Usar Gemini para análise semântica do texto extraído
  // e estruturar os dados no formato esperado

  // Mock response
  return {
    periodo: { inicio: 2026, fim: 2029 },
    programas: [
      {
        codigo: 'PROG-01',
        nome: 'Saúde Para Todos',
        objetivo: 'Ampliar cobertura e qualidade dos serviços de saúde',
        valor: 50000000
      },
      {
        codigo: 'PROG-02',
        nome: 'Educação de Qualidade',
        objetivo: 'Melhorar infraestrutura escolar e capacitação docente',
        valor: 40000000
      },
      {
        codigo: 'PROG-03',
        nome: 'Cidade Conectada',
        objetivo: 'Digitalização de serviços públicos',
        valor: 15000000
      }
    ],
    diretrizes: [
      'Promover desenvolvimento sustentável',
      'Garantir transparência na gestão pública',
      'Incentivar participação cidadã'
    ],
    metas: [
      'Reduzir tempo de espera na saúde em 50%',
      'Atingir 95% de aprovação escolar',
      'Digitalizar 100% dos serviços até 2028'
    ]
  };
}

/**
 * Extrai dados estruturados de uma LDO
 */
export async function extractLDOData(fileUrl: string): Promise<LDOExtractedData> {
  console.log('extractLDOData - Mock Mode', fileUrl);

  const document = await processDocument(fileUrl);

  // Mock response
  return {
    exercicio: 2025,
    metasFiscais: {
      receitaTotal: 142500000,
      despesaTotal: 142500000,
      resultadoPrimario: 5000000,
      resultadoNominal: 3000000
    },
    prioridades: [
      'Conclusão da Reforma da Escola Central',
      'Implantação do Prontuário Eletrônico',
      'Pavimentação de vias urbanas'
    ],
    riscosFiscais: [
      'Queda na arrecadação de ICMS devido a cenário econômico',
      'Aumento de despesas obrigatórias (pessoal)',
      'Necessidade de obras emergenciais'
    ]
  };
}

/**
 * Extrai dados estruturados de uma LOA
 */
export async function extractLOAData(fileUrl: string): Promise<LOAExtractedData> {
  console.log('extractLOAData - Mock Mode', fileUrl);

  const document = await processDocument(fileUrl);

  // Mock response
  return {
    exercicio: 2025,
    receitaPrevista: 142500000,
    despesaFixada: 142500000,
    categorias: [
      { nome: 'Saúde', valor: 42750000, percentual: 30 },
      { nome: 'Educação', valor: 35625000, percentual: 25 },
      { nome: 'Infraestrutura', valor: 28500000, percentual: 20 },
      { nome: 'Administração', valor: 21375000, percentual: 15 },
      { nome: 'Outros', valor: 14250000, percentual: 10 }
    ]
  };
}

/**
 * Processa documento e salva resultado no banco
 */
export async function processAndSaveLegalDocument(
  documentId: string,
  fileUrl: string,
  documentType: 'PPA' | 'LDO' | 'LOA'
): Promise<void> {
  console.log(`processAndSaveLegalDocument - ${documentType}`, documentId);

  try {
    let extractedData;

    switch (documentType) {
      case 'PPA':
        extractedData = await extractPPAData(fileUrl);
        break;
      case 'LDO':
        extractedData = await extractLDOData(fileUrl);
        break;
      case 'LOA':
        extractedData = await extractLOAData(fileUrl);
        break;
    }

    // Salvar no banco de dados
    // await supabase
    //   .from('legal_documents')
    //   .update({
    //     status: 'analyzed',
    //     processed_at: new Date().toISOString(),
    //     metadata: extractedData
    //   })
    //   .eq('id', documentId);

    console.log('Dados extraídos:', extractedData);
  } catch (error) {
    console.error('Erro ao processar documento:', error);

    // Atualizar status para erro
    // await supabase
    //   .from('legal_documents')
    //   .update({ status: 'error' })
    //   .eq('id', documentId);

    throw error;
  }
}

/**
 * Compara dois documentos e identifica diferenças
 */
export async function compareDocuments(
  fileUrl1: string,
  fileUrl2: string
): Promise<{ differences: string[]; similarity: number }> {
  console.log('compareDocuments - Mock Mode');

  const doc1 = await processDocument(fileUrl1);
  const doc2 = await processDocument(fileUrl2);

  // Usar Gemini para análise comparativa semântica

  // Mock response
  return {
    differences: [
      'Orçamento para Saúde aumentou 15%',
      'Nova categoria "Meio Ambiente" adicionada',
      'Meta de digitalização revisada para baixo'
    ],
    similarity: 0.87 // 87% similar
  };
}

// ========================================
// EXPORT
// ========================================

export const documentAI = {
  processDocument,
  extractPPAData,
  extractLDOData,
  extractLOAData,
  processAndSaveLegalDocument,
  compareDocuments
};
