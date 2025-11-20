
# Roadmap de Evolução - Fase 3: Execução (Projetos Estratégicos)

## Visão Geral
Esta fase implementou o módulo de **Projetos Estratégicos**, conectando o planejamento (BSC) à execução tática. O foco foi criar uma estrutura robusta para gerenciamento de portfólio, monitoramento de cronograma e controle orçamentário.

## Implementações Realizadas

### 1. Modelagem de Dados
*   **Entidade Project:** Adicionada ao `types.ts` suportando metodologia (ágil/tradicional), saúde (status report) e métricas de EVA (CPI/SPI).
*   **Mock API:** Implementada em `lib/supabase/client.ts` com dados simulados realistas (Projetos de TI, Obras e Administrativos).

### 2. Interface de Usuário (UI/UX)
*   **Navegação:** Rota `/projetos` desbloqueada e configurada com sub-navegação (Dashboard/Lista).
*   **ProjectCard:** Novo componente visual rico com:
    *   Barra de progresso animada.
    *   Indicadores de saúde (Farol de desempenho).
    *   Resumo financeiro e datas.
*   **Dashboard Executivo (PMO):**
    *   KPIs globais de portfólio.
    *   Cálculo automático de eficiência (CPI).
    *   Destaque para projetos críticos.

### 3. Integração com BSC
*   Os projetos possuem vínculo direto com Objetivos Estratégicos (`strategicObjectiveId`), permitindo futura rastreabilidade de impacto (Projeto -> Objetivo -> Perspectiva).

## Próximos Passos (Refinamento)

1.  **Gráfico de Gantt:** Implementar visualização interativa (usando biblioteca leve ou SVG customizado) para detalhar o cronograma.
2.  **Kanban de Tarefas:** Criar quadro de tarefas para metodologia ágil.
3.  **Alocação de Equipe:** Módulo para gestão de recursos humanos e horas.
4.  **Upload de Evidências:** Permitir anexar documentos comprobatórios nas medições de avanço.

## Como Testar
1.  Acesse o menu lateral e clique em **Projetos & Ações**.
2.  Visualize o **Dashboard** com os KPIs gerais.
3.  Navegue para **Carteira de Projetos** para ver a lista filtrável.
4.  Observe as cores de status (Vermelho/Amarelo/Verde) baseadas na "saúde" do projeto.
