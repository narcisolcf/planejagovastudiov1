-- =====================================================
-- PlanejaGov SGEM - SETUP COMPLETO
-- =====================================================
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Clique em "New Query"
-- 4. Copie ESTE ARQUIVO INTEIRO e cole lá
-- 5. Clique em RUN
-- 6. Aguarde ~30 segundos
-- =====================================================

-- PARTE 1: SCHEMA INICIAL
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela: organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL CHECK (length(state) = 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'GESTOR', 'COLABORADOR')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: strategic_fundamentals
CREATE TABLE IF NOT EXISTS strategic_fundamentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  mission TEXT,
  vision TEXT,
  values TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- Tabela: swot_items
CREATE TABLE IF NOT EXISTS swot_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('STRENGTH', 'WEAKNESS', 'OPPORTUNITY', 'THREAT')),
  importance INTEGER CHECK (importance >= 1 AND importance <= 5),
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: perspectives
CREATE TABLE IF NOT EXISTS perspectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('FINANCIAL', 'CUSTOMER', 'PROCESSES', 'LEARNING')),
  color TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: strategic_objectives
CREATE TABLE IF NOT EXISTS strategic_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  perspective_id UUID REFERENCES perspectives(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Tabela: objective_relationships
CREATE TABLE IF NOT EXISTS objective_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES strategic_objectives(id) ON DELETE CASCADE,
  target_id UUID REFERENCES strategic_objectives(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_id, target_id)
);

-- Tabela: indicators
CREATE TABLE IF NOT EXISTS indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  objective_id UUID REFERENCES strategic_objectives(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
  baseline NUMERIC,
  target NUMERIC NOT NULL,
  current_value NUMERIC,
  polarity TEXT NOT NULL CHECK (polarity IN ('HIGHER_BETTER', 'LOWER_BETTER')),
  source TEXT,
  formula TEXT,
  last_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Tabela: measurements
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id UUID REFERENCES indicators(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  value NUMERIC NOT NULL,
  evidence_url TEXT,
  status TEXT CHECK (status IN ('above_target', 'on_target', 'below_target')),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(indicator_id, date)
);

-- Tabela: targets
CREATE TABLE IF NOT EXISTS targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id UUID REFERENCES indicators(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  period TEXT NOT NULL,
  value NUMERIC NOT NULL,
  tolerance_min NUMERIC,
  tolerance_max NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(indicator_id, year, period)
);

-- Tabela: projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  strategic_objective_id UUID REFERENCES strategic_objectives(id),
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  justification TEXT,
  manager TEXT NOT NULL,
  sponsor TEXT,
  status TEXT NOT NULL DEFAULT 'PLANNING' CHECK (
    status IN ('PLANNING', 'APPROVED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED')
  ),
  health TEXT NOT NULL DEFAULT 'HEALTHY' CHECK (
    health IN ('HEALTHY', 'ATTENTION', 'CRITICAL')
  ),
  methodology TEXT NOT NULL DEFAULT 'TRADITIONAL' CHECK (
    methodology IN ('TRADITIONAL', 'AGILE', 'HYBRID')
  ),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  end_date DATE,
  baseline_start_date DATE,
  baseline_end_date DATE,
  budget_estimated NUMERIC,
  budget_approved NUMERIC,
  budget_spent NUMERIC DEFAULT 0,
  budget_committed NUMERIC DEFAULT 0,
  cpi NUMERIC,
  spi NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Tabela: project_tasks
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')
  ),
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: legal_documents
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('PPA', 'LDO', 'LOA')),
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'analyzed', 'error')
  ),
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  metadata JSONB,
  UNIQUE(organization_id, type, year)
);

-- Tabela: indicator_evidence
CREATE TABLE IF NOT EXISTS indicator_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id UUID REFERENCES indicators(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  period TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_swot_organization ON swot_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_perspectives_organization ON perspectives(organization_id);
CREATE INDEX IF NOT EXISTS idx_objectives_organization ON strategic_objectives(organization_id);
CREATE INDEX IF NOT EXISTS idx_objectives_perspective ON strategic_objectives(perspective_id);
CREATE INDEX IF NOT EXISTS idx_indicators_organization ON indicators(organization_id);
CREATE INDEX IF NOT EXISTS idx_indicators_objective ON indicators(objective_id);
CREATE INDEX IF NOT EXISTS idx_measurements_indicator ON measurements(indicator_id);
CREATE INDEX IF NOT EXISTS idx_measurements_date ON measurements(date);
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_objective ON projects(strategic_objective_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_legal_docs_org_type_year ON legal_documents(organization_id, type, year);
CREATE INDEX IF NOT EXISTS idx_evidence_indicator ON indicator_evidence(indicator_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fundamentals_updated_at ON strategic_fundamentals;
CREATE TRIGGER update_fundamentals_updated_at BEFORE UPDATE ON strategic_fundamentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_swot_updated_at ON swot_items;
CREATE TRIGGER update_swot_updated_at BEFORE UPDATE ON swot_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_perspectives_updated_at ON perspectives;
CREATE TRIGGER update_perspectives_updated_at BEFORE UPDATE ON perspectives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_objectives_updated_at ON strategic_objectives;
CREATE TRIGGER update_objectives_updated_at BEFORE UPDATE ON strategic_objectives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_indicators_updated_at ON indicators;
CREATE TRIGGER update_indicators_updated_at BEFORE UPDATE ON indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_measurements_updated_at ON measurements;
CREATE TRIGGER update_measurements_updated_at BEFORE UPDATE ON measurements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_targets_updated_at ON targets;
CREATE TRIGGER update_targets_updated_at BEFORE UPDATE ON targets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON project_tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON project_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PARTE 2: ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_fundamentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE swot_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE perspectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE objective_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicator_evidence ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Policies (simplificadas para setup inicial)
DROP POLICY IF EXISTS "Users can view profiles from same organization" ON profiles;
CREATE POLICY "Users can view profiles from same organization"
  ON profiles FOR SELECT
  USING (organization_id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can view fundamentals from own organization" ON strategic_fundamentals;
CREATE POLICY "Users can view fundamentals from own organization"
  ON strategic_fundamentals FOR ALL
  USING (organization_id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can manage SWOT from own organization" ON swot_items;
CREATE POLICY "Users can manage SWOT from own organization"
  ON swot_items FOR ALL
  USING (organization_id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can view perspectives" ON perspectives;
CREATE POLICY "Users can view perspectives"
  ON perspectives FOR ALL
  USING (organization_id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can manage objectives" ON strategic_objectives;
CREATE POLICY "Users can manage objectives"
  ON strategic_objectives FOR ALL
  USING (organization_id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can manage indicators" ON indicators;
CREATE POLICY "Users can manage indicators"
  ON indicators FOR ALL
  USING (organization_id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can manage projects" ON projects;
CREATE POLICY "Users can manage projects"
  ON projects FOR ALL
  USING (organization_id = auth.user_organization_id());

DROP POLICY IF EXISTS "Users can view legal documents" ON legal_documents;
CREATE POLICY "Users can view legal documents"
  ON legal_documents FOR ALL
  USING (organization_id = auth.user_organization_id());

-- PARTE 3: DADOS DE EXEMPLO
-- =====================================================

INSERT INTO organizations (id, name, city, state)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Prefeitura Municipal de Exemplo',
  'Exemplo',
  'SP'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO perspectives (id, organization_id, name, description, type, color, order_index) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Financeira', 'Sustentabilidade Econômica', 'FINANCIAL', 'bg-blue-500', 1),
  ('p1000000-0000-0000-0000-000000000002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cidadãos e Sociedade', 'Satisfação do Cidadão', 'CUSTOMER', 'bg-emerald-500', 2),
  ('p1000000-0000-0000-0000-000000000003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Processos Internos', 'Excelência Operacional', 'PROCESSES', 'bg-amber-500', 3),
  ('p1000000-0000-0000-0000-000000000004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Aprendizado e Crescimento', 'Capacidade Organizacional', 'LEARNING', 'bg-purple-500', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO strategic_fundamentals (organization_id, mission, vision, values)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Promover a qualidade de vida e o desenvolvimento sustentável do município.',
  'Ser reconhecida até 2028 como a cidade referência em inovação.',
  ARRAY['Transparência', 'Ética', 'Inovação', 'Eficiência', 'Sustentabilidade']
) ON CONFLICT (organization_id) DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ SETUP COMPLETO! Tabelas criadas, segurança configurada e dados de exemplo inseridos.';
  RAISE NOTICE '📋 Próximo passo: Criar buckets de storage (documents, evidence, avatars, exports)';
END $$;
