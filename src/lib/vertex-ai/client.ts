
import { ChatMessage, Citation } from '../../types';

// Simula a resposta da API Vertex AI RAG
// Em produção, isso chamaria uma Cloud Function que usa @google-cloud/vertexai
export const ragApi = {
  sendMessage: async (history: ChatMessage[], userMessage: string): Promise<ChatMessage> => {
    // Simula latência de rede e processamento da IA
    await new Promise(resolve => setTimeout(resolve, 1500));

    let responseContent = "";
    let citations: Citation[] = [];

    // Lógica simples de Mock baseada em palavras-chave para demonstração
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('ppa') || lowerMsg.includes('plano')) {
      responseContent = "Com base no **PPA 2026-2029**, o programa de 'Modernização da Gestão' prevê a digitalização de 100% dos processos administrativos até o final de 2027. O objetivo estratégico vinculado é o PRO-01.";
      citations = [
        {
          id: 'cit1',
          title: 'PPA 2026-2029 (Lei Mun. 1234/25)',
          uri: '#',
          snippet: 'Meta 4.2: Implantar sistema de processo eletrônico em todas as secretarias.'
        }
      ];
    } else if (lowerMsg.includes('saúde') || lowerMsg.includes('ubs') || lowerMsg.includes('orçamento')) {
      responseContent = "A **LOA 2025** alocou R$ 4.5 milhões para a construção e reforma de Unidades Básicas de Saúde (UBS). Há uma restrição na LDO que limita o aumento de despesas de pessoal nesta área a 5% acima da inflação.";
      citations = [
        {
          id: 'cit2',
          title: 'LOA 2025 - Quadro de Detalhamento de Despesa',
          uri: '#',
          snippet: 'Dotação 10.301.0045.1001 - Construção de Unidades de Saúde: R$ 4.500.000,00'
        },
        {
          id: 'cit3',
          title: 'LDO 2025 - Art. 15',
          uri: '#',
          snippet: 'Fica limitado a 5% o crescimento real da folha de pagamento da saúde.'
        }
      ];
    } else {
      responseContent = "Analisei os documentos orçamentários disponíveis (PPA, LDO, LOA). Posso responder perguntas sobre metas físicas, limites fiscais ou alocação de recursos. Tente perguntar sobre 'Saúde' ou 'PPA'.";
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      role: 'model',
      content: responseContent,
      timestamp: new Date(),
      citations
    };
  }
};
