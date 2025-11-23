-- =====================================================
-- PlanejaGov SGEM - Row Level Security (RLS)
-- Migration 002: Políticas de Segurança
-- =====================================================

-- =====================================================
-- ATIVAR RLS EM TODAS AS TABELAS
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

-- =====================================================
-- HELPER FUNCTION: Obter organization_id do usuário
-- =====================================================

CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- POLÍTICAS: profiles
-- =====================================================

-- Usuários podem ver perfis da mesma organização
CREATE POLICY "Users can view profiles from same organization"
  ON profiles FOR SELECT
  USING (organization_id = auth.user_organization_id());

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Apenas ADMINs podem inserir novos perfis
CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- POLÍTICAS: organizations
-- =====================================================

-- Usuários podem ver sua própria organização
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id = auth.user_organization_id());

-- Apenas ADMINs podem atualizar organização
CREATE POLICY "Admins can update organization"
  ON organizations FOR UPDATE
  USING (
    id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- POLÍTICAS: strategic_fundamentals
-- =====================================================

CREATE POLICY "Users can view fundamentals from own organization"
  ON strategic_fundamentals FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Gestores and Admins can manage fundamentals"
  ON strategic_fundamentals FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

-- =====================================================
-- POLÍTICAS: swot_items
-- =====================================================

CREATE POLICY "Users can view SWOT from own organization"
  ON swot_items FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Gestores and Admins can manage SWOT"
  ON swot_items FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

-- =====================================================
-- POLÍTICAS: perspectives
-- =====================================================

CREATE POLICY "Users can view perspectives from own organization"
  ON perspectives FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Admins can manage perspectives"
  ON perspectives FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- POLÍTICAS: strategic_objectives
-- =====================================================

CREATE POLICY "Users can view objectives from own organization"
  ON strategic_objectives FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Gestores and Admins can manage objectives"
  ON strategic_objectives FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

-- =====================================================
-- POLÍTICAS: objective_relationships
-- =====================================================

CREATE POLICY "Users can view relationships from own organization"
  ON objective_relationships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM strategic_objectives
      WHERE id = objective_relationships.source_id
        AND organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Gestores and Admins can manage relationships"
  ON objective_relationships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM strategic_objectives
      WHERE id = objective_relationships.source_id
        AND organization_id = auth.user_organization_id()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

-- =====================================================
-- POLÍTICAS: indicators
-- =====================================================

CREATE POLICY "Users can view indicators from own organization"
  ON indicators FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Gestores and Admins can manage indicators"
  ON indicators FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

CREATE POLICY "Gestores and Admins can update indicators"
  ON indicators FOR UPDATE
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

-- =====================================================
-- POLÍTICAS: measurements
-- =====================================================

CREATE POLICY "Users can view measurements from own organization"
  ON measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM indicators
      WHERE id = measurements.indicator_id
        AND organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can insert measurements"
  ON measurements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM indicators
      WHERE id = measurements.indicator_id
        AND organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can update own measurements"
  ON measurements FOR UPDATE
  USING (created_by = auth.uid());

-- =====================================================
-- POLÍTICAS: targets
-- =====================================================

CREATE POLICY "Users can view targets from own organization"
  ON targets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM indicators
      WHERE id = targets.indicator_id
        AND organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Gestores and Admins can manage targets"
  ON targets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM indicators
      WHERE id = targets.indicator_id
        AND organization_id = auth.user_organization_id()
    ) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

-- =====================================================
-- POLÍTICAS: projects
-- =====================================================

CREATE POLICY "Users can view projects from own organization"
  ON projects FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Gestores and Admins can manage projects"
  ON projects FOR ALL
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

-- =====================================================
-- POLÍTICAS: project_tasks
-- =====================================================

CREATE POLICY "Users can view tasks from own organization"
  ON project_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_tasks.project_id
        AND organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Gestores and assigned users can manage tasks"
  ON project_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_tasks.project_id
        AND organization_id = auth.user_organization_id()
    ) AND
    (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
      )
      OR assigned_to = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS: legal_documents
-- =====================================================

CREATE POLICY "Users can view legal documents from own organization"
  ON legal_documents FOR SELECT
  USING (organization_id = auth.user_organization_id());

CREATE POLICY "Gestores and Admins can upload legal documents"
  ON legal_documents FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

CREATE POLICY "Admins can update legal documents"
  ON legal_documents FOR UPDATE
  USING (
    organization_id = auth.user_organization_id() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- =====================================================
-- POLÍTICAS: indicator_evidence
-- =====================================================

CREATE POLICY "Users can view evidence from own organization"
  ON indicator_evidence FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM indicators
      WHERE id = indicator_evidence.indicator_id
        AND organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can upload evidence"
  ON indicator_evidence FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM indicators
      WHERE id = indicator_evidence.indicator_id
        AND organization_id = auth.user_organization_id()
    )
  );

CREATE POLICY "Users can delete own evidence"
  ON indicator_evidence FOR DELETE
  USING (uploaded_by = auth.uid());

-- =====================================================
-- STORAGE POLICIES (Supabase Storage)
-- =====================================================

-- Policy: documents bucket (PPA, LDO, LOA)
-- Qualquer usuário autenticado pode fazer upload
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Todos podem ver documentos (público)
CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

-- Policy: evidence bucket (evidências de indicadores)
-- Usuários podem fazer upload
CREATE POLICY "Authenticated users can upload evidence"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'evidence');

-- Usuários podem ver evidências da própria organização
CREATE POLICY "Users can view own organization evidence"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'evidence');

-- Policy: avatars bucket
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

-- Policy: exports bucket (relatórios)
CREATE POLICY "Gestores can upload exports"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exports' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'GESTOR')
    )
  );

CREATE POLICY "Users can view exports from own organization"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'exports');
