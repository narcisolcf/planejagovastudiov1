/**
 * Google Cloud Platform Integrations
 *
 * Módulo centralizado para integrações com serviços do GCP
 *
 * IMPORTANTE:
 * - Estas funções devem ser executadas no BACKEND (API Routes, Cloud Functions)
 * - NÃO importe diretamente no frontend
 * - Configure as variáveis de ambiente necessárias antes de usar
 */

export * from './gemini';
export * from './document-ai';

// Re-export para facilitar imports
export { geminiAI } from './gemini';
export { documentAI } from './document-ai';

/**
 * Verifica se as integrações GCP estão configuradas
 */
export const isGCPConfigured = (): boolean => {
  return !!(
    process.env.GCP_PROJECT_ID &&
    process.env.GCP_LOCATION
  );
};

/**
 * Verifica se o Vertex AI está configurado
 */
export const isVertexAIConfigured = (): boolean => {
  return isGCPConfigured();
};

/**
 * Verifica se o Document AI está configurado
 */
export const isDocumentAIConfigured = (): boolean => {
  return !!(
    isGCPConfigured() &&
    process.env.DOCUMENT_AI_PROCESSOR_ID
  );
};

/**
 * Retorna status de todas as integrações
 */
export const getGCPStatus = () => {
  return {
    configured: isGCPConfigured(),
    services: {
      vertexAI: isVertexAIConfigured(),
      documentAI: isDocumentAIConfigured()
    },
    projectId: process.env.GCP_PROJECT_ID || null,
    location: process.env.GCP_LOCATION || null
  };
};
