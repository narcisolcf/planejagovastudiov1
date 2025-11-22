# SGEM - Sistema de Gestão Estratégica Municipal

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

Plataforma integrada para gestão estratégica de municípios brasileiros baseada na metodologia BSC (Balanced Scorecard).

## 📋 Sumário

- [Características](#características)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Modo Mock vs Produção](#modo-mock-vs-produção)
- [Contribuindo](#contribuindo)

## ✨ Características

- ✅ **Fase 1**: Fundamentos Estratégicos (Missão, Visão, Valores, SWOT)
- ✅ **Fase 2**: BSC - Balanced Scorecard
  - Mapa Estratégico Visual
  - Objetivos e Perspectivas
  - Indicadores de Desempenho
  - Dashboard Executivo
- ✅ **Fase 3**: Gestão de Projetos (PMO)
  - Portfólio de Projetos
  - Métricas EVA (CPI/SPI)
  - Vinculação com Objetivos Estratégicos
- ✅ **Gestão Orçamentária**: PPA, LDO, LOA
- ✅ **Autenticação** e controle de acesso
- ✅ **Modo offline** com localStorage
- ✅ **Responsivo** e otimizado para mobile

## 🔧 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** ou **yarn**
- **Conta Supabase** (opcional, possui modo mock para desenvolvimento)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sgem.git
cd sgem

# Instale as dependências
npm install
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

> **Modo Mock**: Se você deixar os valores como `your_supabase_url`, o sistema automaticamente usará o modo MOCK para desenvolvimento local sem necessidade de banco de dados.

### 2. Configurar Supabase (Produção)

#### 2.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a Anon Key

#### 2.2 Executar Migrations

No dashboard do Supabase, vá em **SQL Editor** e execute:

```bash
# Copie o conteúdo de:
supabase/migrations/001_auth_organizations.sql
```

Ou use a CLI do Supabase:

```bash
supabase db push
```

#### 2.3 Configurar Storage

1. Vá em **Storage** no dashboard
2. Crie um bucket chamado `documents`
3. Configure as permissões:

```sql
-- Policy para upload de documentos
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Policy para leitura
CREATE POLICY "Authenticated users can read documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents');
```

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

**Credenciais padrão (modo mock)**:
- Email: qualquer email válido
- Senha: qualquer senha com 6+ caracteres

### Build para Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
sgem/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base (Button, Card, Input)
│   ├── auth/           # Componentes de autenticação
│   ├── bsc/            # Componentes do BSC
│   │   ├── dashboard/  # Dashboard BSC
│   │   ├── indicators/ # Gestão de indicadores
│   │   └── map/        # Mapa estratégico
│   └── projects/       # Componentes de projetos
├── pages/              # Páginas da aplicação
│   ├── bsc/            # Páginas do módulo BSC
│   └── projects/       # Páginas de projetos
├── lib/                # Utilitários e configurações
│   ├── supabase/       # Cliente Supabase + Mock
│   └── validation.ts   # Validações (senha, email)
├── contexts/           # Contextos React (Auth, etc)
├── hooks/              # Custom hooks
├── supabase/           # Migrations e configurações
│   └── migrations/     # SQL migrations
├── types.ts            # Definições TypeScript
├── App.tsx             # Componente raiz
├── index.tsx           # Entry point
└── index.css           # Estilos globais
```

## 🛠️ Tecnologias

### Core
- **React 19.2.0** - UI Framework
- **TypeScript 5.8.2** - Type Safety
- **Vite 6.2.0** - Build Tool
- **React Router 7.9.6** - Roteamento

### UI/UX
- **Tailwind CSS** - Estilização (via CDN)
- **Lucide React** - Ícones
- **React Flow 11.10.4** - Mapa Estratégico
- **Recharts 2.12.2** - Gráficos

### Estado e Dados
- **TanStack Query 5.90.10** - Cache e sincronização
- **React Hook Form 7.66.1** - Formulários
- **Supabase 2.83.0** - Backend (Auth + Database)

### Utilitários
- **Dagre** - Layout de grafos
- **Lodash** - Funções utilitárias

## 🎯 Funcionalidades

### Autenticação e Segurança
- ✅ Login com validação de senha forte
- ✅ Sessões persistentes
- ✅ Logout funcional
- ✅ RLS (Row Level Security) no Supabase

### Gestão Estratégica
- ✅ Definição de Missão, Visão e Valores
- ✅ Análise SWOT interativa
- ✅ 4 Perspectivas do BSC personalizáveis
- ✅ Mapa Estratégico com relações causa-efeito
- ✅ Biblioteca de indicadores
- ✅ Coleta e acompanhamento de medições

### Gestão de Projetos
- ✅ Dashboard PMO com KPIs
- ✅ Carteira de projetos filtráv el
- ✅ Cálculo automático de EVA (CPI/SPI)
- ✅ Vinculação com objetivos estratégicos
- ✅ Status de saúde do projeto

### Gestão Orçamentária
- ✅ Upload de PPA, LDO e LOA (PDFs)
- ✅ Visualização de ciclo orçamentário
- ✅ Acompanhamento de execução

## 🔄 Modo Mock vs Produção

### Modo Mock (Desenvolvimento)

O sistema detecta automaticamente quando usar o modo mock:

- Nenhuma configuração Supabase necessária
- Dados salvos em **localStorage** (persistem entre sessões)
- Autenticação simulada
- Ideal para desenvolvimento e testes

**Como ativar**: Deixe as variáveis de ambiente com valores placeholder ou não as configure.

### Modo Produção

Quando configurado com Supabase real:

- Autenticação completa
- Dados persistidos no PostgreSQL
- Storage para arquivos
- Segurança via RLS

## 📊 Dados de Exemplo

O sistema vem com dados mock pré-configurados:

- 4 Perspectivas BSC
- 4 Objetivos Estratégicos
- 2 Indicadores
- 3 Projetos de exemplo
- Análise SWOT completa

## 🐛 Troubleshooting

### Erro: "Cannot connect to Supabase"

- Verifique se as credenciais em `.env.local` estão corretas
- Confirme que o projeto Supabase está ativo
- Em desenvolvimento, use o modo mock

### Erro: "Bucket 'documents' not found"

- Crie o bucket `documents` no Supabase Storage
- Configure as permissões conforme seção de Configuração

### Dados não persistem

- **Modo Mock**: Verifique se o localStorage não está cheio
- **Modo Produção**: Verifique as policies RLS no Supabase

## 🧪 Testes

```bash
# Executar testes unitários (se configurado)
npm test

# Executar linter
npm run lint
```

## 📝 Scripts Disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Executa ESLint
npm run format    # Formata código com Prettier
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Equipe SGEM** - Desenvolvimento inicial

## 🙏 Agradecimentos

- Metodologia BSC adaptada de Kaplan & Norton
- Comunidade React e TypeScript
- Supabase pela excelente plataforma

---

**Documentação completa**: [Acesse o Wiki](https://github.com/seu-usuario/sgem/wiki)

**Reportar bugs**: [Issues](https://github.com/seu-usuario/sgem/issues)

**Suporte**: [Discussions](https://github.com/seu-usuario/sgem/discussions)
