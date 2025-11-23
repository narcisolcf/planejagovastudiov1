-- =====================================================
-- PlanejaGov SGEM - Dados Iniciais (Seeds)
-- Migration 003: Dados de Teste/Demonstração
-- =====================================================

-- IMPORTANTE: Este arquivo contém dados de exemplo para desenvolvimento
-- Em produção, você deve criar sua própria organização e dados

-- =====================================================
-- ORGANIZAÇÃO DE TESTE
-- =====================================================

INSERT INTO organizations (id, name, city, state)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Prefeitura Municipal de Exemplo',
  'Exemplo',
  'SP'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PERSPECTIVAS BSC PADRÃO
-- =====================================================

-- Inserir perspectivas padrão do BSC para a organização
INSERT INTO perspectives (id, organization_id, name, description, type, color, order_index) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Financeira',
    'Sustentabilidade Econômica',
    'FINANCIAL',
    'bg-blue-500',
    1
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Cidadãos e Sociedade',
    'Satisfação do Cidadão',
    'CUSTOMER',
    'bg-emerald-500',
    2
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Processos Internos',
    'Excelência Operacional',
    'PROCESSES',
    'bg-amber-500',
    3
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Aprendizado e Crescimento',
    'Capacidade Organizacional',
    'LEARNING',
    'bg-purple-500',
    4
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FUNDAMENTOS ESTRATÉGICOS DE EXEMPLO
-- =====================================================

INSERT INTO strategic_fundamentals (organization_id, mission, vision, values)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Promover a qualidade de vida e o desenvolvimento sustentável do município, através de uma gestão pública eficiente, transparente e participativa.',
  'Ser reconhecida até 2028 como a cidade referência em inovação e bem-estar social no estado.',
  ARRAY['Transparência', 'Ética', 'Inovação', 'Eficiência', 'Sustentabilidade']
) ON CONFLICT (organization_id) DO NOTHING;

-- =====================================================
-- ANÁLISE SWOT DE EXEMPLO
-- =====================================================

INSERT INTO swot_items (organization_id, text, type, importance, icon) VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Equipe técnica qualificada',
    'STRENGTH',
    5,
    'Users'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Infraestrutura tecnológica moderna',
    'STRENGTH',
    4,
    'Cpu'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Arrecadação própria baixa',
    'WEAKNESS',
    4,
    'TrendingDown'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Processos burocráticos lentos',
    'WEAKNESS',
    3,
    'Clock'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Novos editais federais disponíveis',
    'OPPORTUNITY',
    5,
    'FileText'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Tendência de digitalização de serviços',
    'OPPORTUNITY',
    4,
    'Smartphone'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Mudanças na legislação fiscal',
    'THREAT',
    3,
    'Scale'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Contenção de gastos públicos',
    'THREAT',
    4,
    'AlertTriangle'
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- OBJETIVOS ESTRATÉGICOS DE EXEMPLO
-- =====================================================

INSERT INTO strategic_objectives (id, organization_id, perspective_id, code, title, description, status, progress) VALUES
  (
    'o1000000-0000-0000-0000-000000000001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'p1000000-0000-0000-0000-000000000001',
    'FIN-01',
    'Aumentar Arrecadação Própria',
    'Otimizar a cobrança de IPTU e ISS para aumentar a receita própria do município',
    'ACTIVE',
    75
  ),
  (
    'o1000000-0000-0000-0000-000000000002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'p1000000-0000-0000-0000-000000000002',
    'CID-01',
    'Melhorar Qualidade da Saúde',
    'Reduzir filas de espera e melhorar o atendimento nas unidades de saúde',
    'ACTIVE',
    60
  ),
  (
    'o1000000-0000-0000-0000-000000000003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'p1000000-0000-0000-0000-000000000003',
    'PRO-01',
    'Digitalizar Serviços Públicos',
    'Implantar processo eletrônico e serviços online para o cidadão',
    'ACTIVE',
    90
  ),
  (
    'o1000000-0000-0000-0000-000000000004',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'p1000000-0000-0000-0000-000000000004',
    'APR-01',
    'Capacitar Servidores',
    'Programa de treinamento e capacitação contínua dos servidores',
    'ACTIVE',
    40
  )
ON CONFLICT (organization_id, code) DO NOTHING;

-- =====================================================
-- RELAÇÕES CAUSA-EFEITO
-- =====================================================

INSERT INTO objective_relationships (source_id, target_id) VALUES
  ('o1000000-0000-0000-0000-000000000003', 'o1000000-0000-0000-0000-000000000002'), -- Digitalizar -> Melhorar Saúde
  ('o1000000-0000-0000-0000-000000000003', 'o1000000-0000-0000-0000-000000000001'), -- Digitalizar -> Aumentar Arrecadação
  ('o1000000-0000-0000-0000-000000000004', 'o1000000-0000-0000-0000-000000000003')  -- Capacitar -> Digitalizar
ON CONFLICT DO NOTHING;

-- =====================================================
-- INDICADORES DE EXEMPLO
-- =====================================================

INSERT INTO indicators (
  id,
  organization_id,
  objective_id,
  code,
  name,
  unit,
  frequency,
  baseline,
  target,
  current_value,
  polarity,
  source
) VALUES
  (
    'i1000000-0000-0000-0000-000000000001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'o1000000-0000-0000-0000-000000000003',
    'IND-01',
    'Índice de Digitalização',
    '%',
    'MONTHLY',
    20,
    100,
    90,
    'HIGHER_BETTER',
    'Secretaria de TI'
  ),
  (
    'i1000000-0000-0000-0000-000000000002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'o1000000-0000-0000-0000-000000000002',
    'IND-02',
    'Tempo Médio de Espera (Saúde)',
    'Dias',
    'MONTHLY',
    45,
    15,
    25,
    'LOWER_BETTER',
    'Secretaria de Saúde'
  ),
  (
    'i1000000-0000-0000-0000-000000000003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'o1000000-0000-0000-0000-000000000001',
    'IND-03',
    'Taxa de Arrecadação IPTU',
    '%',
    'MONTHLY',
    65,
    85,
    75,
    'HIGHER_BETTER',
    'Secretaria de Finanças'
  )
ON CONFLICT (organization_id, code) DO NOTHING;

-- =====================================================
-- PROJETOS DE EXEMPLO
-- =====================================================

INSERT INTO projects (
  id,
  organization_id,
  strategic_objective_id,
  code,
  title,
  description,
  manager,
  sponsor,
  status,
  health,
  methodology,
  progress,
  start_date,
  end_date,
  baseline_start_date,
  baseline_end_date,
  budget_estimated,
  budget_approved,
  budget_spent,
  budget_committed,
  cpi,
  spi
) VALUES
  (
    'proj0000-0000-0000-0000-000000000001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'o1000000-0000-0000-0000-000000000003',
    'PE-2025-01',
    'Implantação do Prontuário Eletrônico',
    'Digitalização completa dos registros de pacientes na rede municipal',
    'Dr. Roberto Silva',
    'Secretaria de Saúde',
    'IN_PROGRESS',
    'HEALTHY',
    'HYBRID',
    45,
    '2025-01-15',
    '2025-12-20',
    '2025-01-15',
    '2025-11-30',
    500000,
    480000,
    210000,
    300000,
    1.05,
    0.98
  ),
  (
    'proj0000-0000-0000-0000-000000000002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'o1000000-0000-0000-0000-000000000002',
    'PE-2025-02',
    'Reforma da Escola Central',
    'Ampliação de salas e modernização elétrica',
    'Eng. Ana Costa',
    'Secretaria de Educação',
    'PAUSED',
    'CRITICAL',
    'TRADITIONAL',
    30,
    '2025-02-01',
    '2025-08-30',
    '2025-02-01',
    '2025-08-30',
    800000,
    800000,
    400000,
    400000,
    0.85,
    0.70
  ),
  (
    'proj0000-0000-0000-0000-000000000003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'o1000000-0000-0000-0000-000000000001',
    'PE-2025-03',
    'Novo Portal do Contribuinte',
    'Sistema web para emissão de guias e certidões online',
    'Carlos Dev',
    'Secretaria de Finanças',
    'COMPLETED',
    'HEALTHY',
    'AGILE',
    100,
    '2025-01-10',
    '2025-04-30',
    '2025-01-10',
    '2025-04-30',
    150000,
    150000,
    145000,
    150000,
    1.03,
    1.0
  )
ON CONFLICT (organization_id, code) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE organizations IS 'Organizações/Municípios cadastrados no sistema';
COMMENT ON TABLE profiles IS 'Perfis de usuários (estende auth.users do Supabase)';
COMMENT ON TABLE strategic_fundamentals IS 'Fase 1: Missão, Visão e Valores';
COMMENT ON TABLE swot_items IS 'Fase 1: Análise SWOT';
COMMENT ON TABLE perspectives IS 'Fase 2: Perspectivas do Balanced Scorecard';
COMMENT ON TABLE strategic_objectives IS 'Fase 2: Objetivos Estratégicos do BSC';
COMMENT ON TABLE objective_relationships IS 'Fase 2: Relações causa-efeito entre objetivos';
COMMENT ON TABLE indicators IS 'Fase 2: Indicadores de desempenho (KPIs)';
COMMENT ON TABLE measurements IS 'Fase 2: Medições periódicas dos indicadores';
COMMENT ON TABLE targets IS 'Fase 2: Metas definidas por período';
COMMENT ON TABLE projects IS 'Fase 3: Projetos estratégicos';
COMMENT ON TABLE project_tasks IS 'Fase 3: Tarefas dos projetos';
COMMENT ON TABLE legal_documents IS 'Documentos legais orçamentários (PPA, LDO, LOA)';
COMMENT ON TABLE indicator_evidence IS 'Evidências/comprovantes das medições de indicadores';
