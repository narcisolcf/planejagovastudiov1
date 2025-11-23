# 🚀 Guia de Configuração - PlanejaGov SGEM

Este guia explica como configurar o backend do PlanejaGov usando **Supabase + Google Cloud Platform**.

## 📋 Arquitetura

```
┌─────────────────────────────────────────┐
│         SUPABASE (Backend Core)         │
├─────────────────────────────────────────┤
│ ✓ Autenticação (usuários)              │
│ ✓ Banco de dados (PostgreSQL)          │
│ ✓ Storage de arquivos (PDFs)           │
│ ✓ APIs automáticas (Row Level Security)│
└─────────────────────────────────────────┘
              ▼
┌─────────────────────────────────────────┐
│    GOOGLE CLOUD (Funcionalidades IA)    │
├─────────────────────────────────────────┤
│ ✓ Vertex AI / Gemini (análise de texto)│
│ ✓ Document AI (ler PDFs)               │
│ ✓ BigQuery (relatórios avançados)      │
└─────────────────────────────────────────┘
```

---

## 1️⃣ Configuração do Supabase (Obrigatório)

### 1.1. Criar Conta e Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Crie uma nova organização (ou use existente)
4. Clique em **"New Project"**
   - Nome: `planejagov-sgem`
   - Database Password: **Anote essa senha** (você precisará)
   - Região: Escolha a mais próxima (ex: South America - São Paulo)
5. Aguarde ~2 minutos para o projeto ser provisionado

### 1.2. Obter Credenciais

1. No dashboard do projeto, vá em **Settings** (⚙️) > **API**
2. Copie os seguintes valores:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Crie o arquivo `.env.local` na raiz do projeto:
   ```bash
   cp .env.example .env.local
   ```

4. Edite `.env.local` e substitua:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 1.3. Executar Migrations (Criar Tabelas)

**Opção A: Via Dashboard Web (Recomendado para iniciantes)**

1. No Supabase Dashboard, vá em **SQL Editor** (ícone de código)
2. Clique em **"New Query"**
3. Abra o arquivo `supabase/migrations/001_initial_schema.sql`
4. Copie TODO o conteúdo e cole no editor
5. Clique em **RUN** (▶️)
6. Repita os passos 2-5 para os arquivos:
   - `002_row_level_security.sql`
   - `003_seed_data.sql`

**Opção B: Via Supabase CLI (Recomendado para produção)**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link com seu projeto
supabase link --project-ref xxxxxxxxxxxxx

# Executar migrations
supabase db push
```

### 1.4. Criar Buckets de Storage

1. No Supabase Dashboard, vá em **Storage** (ícone de pasta)
2. Clique em **"Create a new bucket"**
3. Crie os seguintes buckets:

| Nome | Público | Allowed MIME types |
|------|---------|-------------------|
| **documents** | ✅ Sim | `application/pdf` |
| **evidence** | ❌ Não | `application/pdf`, `image/*`, `application/vnd.ms-excel` |
| **avatars** | ✅ Sim | `image/*` |
| **exports** | ❌ Não | `application/pdf`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |

4. Para cada bucket, clique em **Policies** e verifique se as políticas RLS foram criadas (foram definidas em `002_row_level_security.sql`)

### 1.5. Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Em **Email**, configure:
   - ✅ **Enable Email provider**
   - ✅ **Confirm email**: Desabilite para desenvolvimento (ou configure SMTP)
   - **Minimum password length**: 8 caracteres

3. (Opcional) Configure provedores sociais:
   - Google OAuth
   - GitHub OAuth

### 1.6. Criar Primeiro Usuário

**Via Dashboard:**
1. Vá em **Authentication** > **Users**
2. Clique em **"Add user"** > **"Create new user"**
3. Preencha:
   - Email: `admin@exemplo.com.br`
   - Password: `Admin@123` (mínimo 8 caracteres)
   - ✅ **Auto Confirm User**
4. Clique em **"Create user"**

**Depois, crie o perfil no SQL Editor:**
```sql
-- Substitua 'USER_ID_AQUI' pelo ID do usuário criado
INSERT INTO profiles (id, organization_id, name, role)
VALUES (
  'USER_ID_AQUI',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Organization de exemplo
  'Administrador',
  'ADMIN'
);
```

---

## 2️⃣ Configuração do Google Cloud Platform (Opcional)

### 2.1. Criar Projeto GCP

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique em **"Select a project"** > **"NEW PROJECT"**
   - Nome: `planejagov-sgem`
   - Organization: Sua organização (ou "No organization")
3. Clique em **"CREATE"**
4. Anote o **Project ID** (ex: `planejagov-sgem-123456`)

### 2.2. Ativar APIs Necessárias

Execute no [Cloud Shell](https://shell.cloud.google.com) ou localmente (requer `gcloud` CLI):

```bash
# Configurar projeto
gcloud config set project planejagov-sgem-123456

# Ativar APIs
gcloud services enable vertexai.googleapis.com
gcloud services enable documentai.googleapis.com
gcloud services enable storage-api.googleapis.com
gcloud services enable bigquery.googleapis.com
```

**Ou via Console Web:**
1. Vá em **APIs & Services** > **Library**
2. Pesquise e ative:
   - ✅ Vertex AI API
   - ✅ Document AI API
   - ✅ Cloud Storage API
   - ✅ BigQuery API

### 2.3. Criar Service Account

```bash
# Criar service account
gcloud iam service-accounts create planejagov-sa \
  --display-name="PlanejaGov Service Account"

# Conceder permissões
gcloud projects add-iam-policy-binding planejagov-sgem-123456 \
  --member="serviceAccount:planejagov-sa@planejagov-sgem-123456.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding planejagov-sgem-123456 \
  --member="serviceAccount:planejagov-sa@planejagov-sgem-123456.iam.gserviceaccount.com" \
  --role="roles/documentai.apiUser"

gcloud projects add-iam-policy-binding planejagov-sgem-123456 \
  --member="serviceAccount:planejagov-sa@planejagov-sgem-123456.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Baixar chave JSON
gcloud iam service-accounts keys create gcp-service-account.json \
  --iam-account=planejagov-sa@planejagov-sgem-123456.iam.gserviceaccount.com
```

**⚠️ IMPORTANTE:** O arquivo `gcp-service-account.json` contém credenciais sensíveis. **NUNCA** faça commit dele no git!

### 2.4. Criar Processor do Document AI

1. Acesse [console.cloud.google.com/ai/document-ai](https://console.cloud.google.com/ai/document-ai)
2. Clique em **"CREATE PROCESSOR"**
3. Selecione **"Document OCR"**
4. Nome: `planejagov-ocr`
5. Região: `us` (Document AI disponível apenas em algumas regiões)
6. Clique em **"CREATE"**
7. Anote o **Processor ID** (ex: `abc123def456`)

### 2.5. Configurar Variáveis de Ambiente

Edite `.env.local` e adicione:

```env
# Google Cloud Platform
GCP_PROJECT_ID=planejagov-sgem-123456
GCP_LOCATION=us-central1
DOCUMENT_AI_PROCESSOR_ID=abc123def456
GCP_SERVICE_ACCOUNT_KEY=./gcp-service-account.json
```

### 2.6. Instalar Dependências GCP (Quando for usar)

```bash
npm install @google-cloud/vertexai @google-cloud/documentai @google-cloud/storage @google-cloud/bigquery
```

---

## 3️⃣ Verificar Instalação

### 3.1. Rodar Aplicação Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 3.2. Testar Autenticação

1. Vá para a página de login
2. Use as credenciais criadas:
   - Email: `admin@exemplo.com.br`
   - Senha: `Admin@123`
3. Deve redirecionar para o Dashboard

### 3.3. Testar Upload de Arquivo

1. No Dashboard, vá para a aba **"Gestão Orçamentária"**
2. Clique em **"Upload da Lei (PDF)"** em qualquer card (PPA/LDO/LOA)
3. Selecione um PDF de teste
4. Deve aparecer mensagem de sucesso em verde

### 3.4. Verificar Banco de Dados

No Supabase Dashboard:
1. Vá em **Table Editor**
2. Selecione a tabela `legal_documents`
3. Deve aparecer o registro do arquivo enviado

---

## 4️⃣ Deploy em Produção (Vercel)

### 4.1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New..."** > **"Project"**
3. Importe seu repositório do GitHub
4. Framework Preset: **Vite**
5. Clique em **"Deploy"**

### 4.2. Configurar Variáveis de Ambiente

Na Vercel Dashboard:
1. Vá em **Settings** > **Environment Variables**
2. Adicione:

```
VITE_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Para GCP (BACKEND apenas):**
```
GCP_PROJECT_ID = planejagov-sgem-123456
GCP_LOCATION = us-central1
DOCUMENT_AI_PROCESSOR_ID = abc123def456
```

⚠️ **NÃO** exponha `GCP_SERVICE_ACCOUNT_KEY` como variável de ambiente na Vercel!

Para usar GCP em produção, considere:
- Usar Vercel Edge Functions com autenticação via workload identity
- Ou criar API Routes no backend que use as credenciais de forma segura

### 4.3. Redeploy

1. Vá em **Deployments**
2. Clique nos **"..."** do último deployment
3. Clique em **"Redeploy"**

---

## 5️⃣ Solução de Problemas

### ❌ Erro: "Invalid API key"
- Verifique se copiou a `anon` key correta (não a `service_role`)
- Confira se não há espaços extras no `.env.local`

### ❌ Erro: "Bucket not found"
- Certifique-se de criar os buckets no Supabase Storage
- Verifique se os nomes estão exatamente: `documents`, `evidence`, `avatars`, `exports`

### ❌ Erro: "Row Level Security policy violation"
- Execute o arquivo `002_row_level_security.sql` no SQL Editor
- Verifique se o usuário tem um perfil na tabela `profiles`

### ❌ Upload funciona mas não salva no banco
- Abra o console do navegador (F12) e verifique erros
- Verifique se a tabela `legal_documents` foi criada
- Confirme que o usuário está autenticado (`user?.id` não é null)

### ❌ GCP: "Permission denied"
- Verifique se as APIs foram ativadas
- Confirme que o service account tem as roles corretas
- Teste executando: `gcloud auth application-default login`

---

## 6️⃣ Próximos Passos

Após configurar tudo:

1. ✅ Customize os dados de exemplo em `003_seed_data.sql`
2. ✅ Configure SMTP no Supabase para confirmação de email
3. ✅ Implemente Cloud Functions para processamento de PDFs com Document AI
4. ✅ Configure BigQuery para analytics avançados
5. ✅ Adicione mais usuários e comece a usar!

---

## 📚 Documentação Adicional

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Vertex AI (Gemini)](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview)
- [Document AI](https://cloud.google.com/document-ai/docs)

---

## 🆘 Suporte

Encontrou algum problema? Abra uma issue no GitHub ou entre em contato.

**Bom planejamento estratégico! 🎯📊**
