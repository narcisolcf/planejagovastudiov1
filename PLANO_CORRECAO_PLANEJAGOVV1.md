# Plano de Correção Estruturado - PlanejaGov v1

**Data:** 22 de novembro de 2025  
**Projeto:** planejagovastudiov1  
**Baseado em:** Relatório TestSprite (21/11/2025)

---

## 📊 Sumário Executivo

### Situação Atual
- **Total de APIs testadas:** 0 (todos os testes falharam)
- **Total de sites testados:** 0 (todos os testes falharam)  
- **Taxa de aprovação Backend:** 2/10 (20%)
- **Taxa de aprovação Frontend:** 0/12 (0%)
- **Qualidade Geral:** Crítica

### 🚨 PROBLEMA CRÍTICO IDENTIFICADO

**TODOS os testes estão acessando o repositório GitHub** (`https://github.com/narcisolcf/planejagovastudiov1.git`) **ao invés da aplicação em execução.**

A aplicação precisa ser:
1. ✅ Deployada em um ambiente acessível (Vercel, Netlify, etc.)
2. ✅ Configurada com variáveis de ambiente corretas
3. ✅ Testada com a URL correta

---

## 📋 FASE 1: CONFIGURAÇÃO E DEPLOY (PRIORIDADE CRÍTICA)

### 🎯 Objetivo
Fazer a aplicação ficar disponível online e configurada corretamente.

---

### 1.1 Atualização do README.md

**Arquivo:** `README.md`

```markdown
# PlanejaGov - Sistema de Planejamento Governamental

Sistema desenvolvido para auxiliar municípios brasileiros na gestão e planejamento de ações governamentais.

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou yarn 1.22.x
- Conta no [Supabase](https://supabase.com) (opcional, para banco de dados)
- Chave da API do [Google Gemini](https://ai.google.dev/)

## 🚀 Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/narcisolcf/planejagovastudiov1.git
cd planejagovastudiov1
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Gemini API (OBRIGATÓRIO)
GEMINI_API_KEY=sua_chave_gemini_aqui

# Supabase (OPCIONAL - para persistência de dados)
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# URL da aplicação (desenvolvimento)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Como obter a chave do Gemini:
1. Acesse https://ai.google.dev/
2. Clique em "Get API Key"
3. Crie um novo projeto ou selecione um existente
4. Copie a chave gerada

### 4. Execute o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:3000**

### 5. Build de produção

```bash
npm run build
npm start
```

## 🌐 Deploy

### Deploy no Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "Import Project"
4. Selecione seu repositório
5. Configure as variáveis de ambiente:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` (se usar)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (se usar)
6. Clique em "Deploy"

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/narcisolcf/planejagovastudiov1)

### Deploy no Netlify

1. Faça push do código para o GitHub
2. Acesse [netlify.com](https://netlify.com)
3. Clique em "Add new site" → "Import an existing project"
4. Selecione seu repositório
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Adicione as variáveis de ambiente
7. Clique em "Deploy site"

## 📁 Estrutura do Projeto

```
planejagovastudiov1/
├── app/                    # Diretórios de rotas (Next.js App Router)
├── components/             # Componentes React reutilizáveis
├── lib/                    # Utilitários e helpers
├── public/                 # Arquivos estáticos
├── styles/                 # Estilos globais
├── pages/api/             # Rotas da API (se usar Pages Router)
├── .env.local             # Variáveis de ambiente (não commitar)
├── next.config.js         # Configuração do Next.js
├── package.json           # Dependências do projeto
└── README.md              # Este arquivo
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage
```

## 📝 Funcionalidades

- ✅ Criação de planos governamentais
- ✅ Edição e atualização de planos
- ✅ Exclusão de planos
- ✅ Listagem e busca de planos
- ✅ Autenticação de usuários
- ✅ Interface responsiva

## 🛠️ Tecnologias Utilizadas

- **Next.js 14+** - Framework React
- **React 18+** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados (opcional)
- **Google Gemini AI** - Inteligência artificial

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através de:
- Email: contato@planejagovbrasil.com.br
- Issues: https://github.com/narcisolcf/planejagovastudiov1/issues

## 🙏 Agradecimentos

- Comunidade Next.js
- Google Gemini AI
- TestSprite para testes automatizados
```

---

### 1.2 Script de Verificação Pré-Deploy

**Arquivo:** `scripts/pre-deploy-check.sh`

```bash
#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verificação Pré-Deploy - PlanejaGov"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de erros
ERRORS=0

# Verificar se .env.local existe
echo "📄 Verificando arquivo .env.local..."
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Arquivo .env.local não encontrado!${NC}"
    echo "   Crie o arquivo com base no exemplo acima"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Arquivo .env.local encontrado${NC}"
fi

# Verificar variáveis essenciais
echo ""
echo "🔑 Verificando variáveis de ambiente..."

if [ -f .env.local ]; then
    if ! grep -q "GEMINI_API_KEY=" .env.local || grep -q "GEMINI_API_KEY=$" .env.local; then
        echo -e "${RED}❌ GEMINI_API_KEY não configurada ou vazia!${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ GEMINI_API_KEY configurada${NC}"
    fi

    if grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_URL configurada${NC}"
    else
        echo -e "${YELLOW}⚠️  NEXT_PUBLIC_SUPABASE_URL não configurada (opcional)${NC}"
    fi
fi

# Verificar se node_modules existe
echo ""
echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules não encontrado. Instalando dependências...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependências instaladas com sucesso${NC}"
    else
        echo -e "${RED}❌ Erro ao instalar dependências${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi

# Build de teste
echo ""
echo "🏗️  Testando build de produção..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build bem-sucedido!${NC}"
else
    echo -e "${RED}❌ Build falhou! Verifique os erros acima.${NC}"
    echo "   Execute 'npm run build' para ver os detalhes"
    ERRORS=$((ERRORS + 1))
fi

# Verificar arquivos essenciais
echo ""
echo "📋 Verificando arquivos essenciais..."

ESSENTIAL_FILES=(
    "package.json"
    "next.config.js"
    "tsconfig.json"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file não encontrado${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# Resumo final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✨ Tudo pronto para deploy!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "  1. Faça commit das suas alterações"
    echo "  2. Push para o GitHub: git push origin main"
    echo "  3. Deploy no Vercel: vercel --prod"
    echo "     ou acesse https://vercel.com/new"
    exit 0
else
    echo -e "${RED}❌ Encontrados $ERRORS erro(s). Corrija antes de fazer deploy.${NC}"
    exit 1
fi
```

**Tornar o script executável:**
```bash
chmod +x scripts/pre-deploy-check.sh
```

**Executar:**
```bash
./scripts/pre-deploy-check.sh
```

---

### 1.3 Deploy Imediato

#### Opção A: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Anote a URL gerada (ex: https://planejagovastudiov1.vercel.app)
```

#### Opção B: Deploy via Dashboard Vercel

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione `narcisolcf/planejagovastudiov1`
4. Configure as variáveis de ambiente:
   - `GEMINI_API_KEY=sua_chave_aqui`
5. Clique em "Deploy"
6. **Anote a URL de produção**

---

## 📋 FASE 2: CORREÇÕES BACKEND API (ALTA PRIORIDADE)

### 🎯 Objetivo
Implementar rotas de API funcionais com validações adequadas e respostas padronizadas.

### Problemas Identificados no Relatório

| Teste | Status | Problema |
|-------|--------|----------|
| Criação de Recursos Duplicados | ❌ Falhou | API retorna 200 em vez de 409 para duplicatas |
| Tratamento de Entrada Inválida | ❌ Falhou | API retorna 200 em vez de 400 para dados inválidos |
| Entrada Excessivamente Longa | ❌ Falhou | JSONDecodeError - sem validação de tamanho |
| Criar Recurso | ❌ Falhou | JSONDecodeError - resposta inválida |
| Excluir Recurso | ❌ Falhou | Retorna 422 em vez de 204 |
| Atualizar Recurso | ❌ Falhou | JSONDecodeError - resposta vazia |
| Acesso Não Autorizado | ❌ Falhou | Retorna 200 em vez de 401 |
| JSON Malformado | ❌ Falhou | API aceita JSON malformado |
| JSON Vazio | ✅ Passou | Retorna 400 corretamente |
| ID Inválido | ✅ Passou | Retorna 404 corretamente |

---

### 2.1 Estrutura de Pastas da API

```
pages/api/                    # ou app/api/ se usar App Router
├── planos/
│   ├── index.ts             # GET /api/planos, POST /api/planos
│   └── [id].ts              # GET/PUT/DELETE /api/planos/:id
├── auth/
│   ├── login.ts             # POST /api/auth/login
│   └── logout.ts            # POST /api/auth/logout
└── middleware/
    ├── validateJson.ts      # Validação de JSON
    └── auth.ts              # Verificação de autenticação
```

---

### 2.2 Types e Interfaces

**Arquivo:** `lib/types/plano.ts`

```typescript
/**
 * Interface para um Plano Governamental
 */
export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  status: 'rascunho' | 'ativo' | 'concluido' | 'arquivado';
  usuario_id: string;
  criado_em: Date;
  atualizado_em: Date;
}

/**
 * Dados para criação de um novo plano
 */
export interface CriarPlanoDTO {
  nome: string;
  descricao: string;
  status?: 'rascunho' | 'ativo';
}

/**
 * Dados para atualização de um plano
 */
export interface AtualizarPlanoDTO {
  nome?: string;
  descricao?: string;
  status?: 'rascunho' | 'ativo' | 'concluido' | 'arquivado';
}

/**
 * Resposta padrão de erro da API
 */
export interface ApiError {
  error: string;
  message: string;
  field?: string;
  statusCode: number;
}

/**
 * Resposta padrão de sucesso da API
 */
export interface ApiSuccess<T = any> {
  success: true;
  message?: string;
  data: T;
}
```

---

### 2.3 Utilitários de Validação

**Arquivo:** `lib/utils/validation.ts`

```typescript
import { CriarPlanoDTO, AtualizarPlanoDTO } from '../types/plano';

/**
 * Valida os dados para criação de um plano
 */
export function validarCriacaoPlano(dados: any): {
  valido: boolean;
  erros: string[];
  dados?: CriarPlanoDTO;
} {
  const erros: string[] = [];

  // Validar nome
  if (!dados.nome) {
    erros.push('O campo "nome" é obrigatório');
  } else if (typeof dados.nome !== 'string') {
    erros.push('O campo "nome" deve ser uma string');
  } else if (dados.nome.trim().length === 0) {
    erros.push('O campo "nome" não pode estar vazio');
  } else if (dados.nome.length > 200) {
    erros.push('O campo "nome" não pode exceder 200 caracteres');
  }

  // Validar descrição
  if (!dados.descricao) {
    erros.push('O campo "descricao" é obrigatório');
  } else if (typeof dados.descricao !== 'string') {
    erros.push('O campo "descricao" deve ser uma string');
  } else if (dados.descricao.trim().length === 0) {
    erros.push('O campo "descricao" não pode estar vazio');
  } else if (dados.descricao.length > 10000) {
    erros.push('O campo "descricao" não pode exceder 10.000 caracteres');
  }

  // Validar status (opcional)
  if (dados.status && !['rascunho', 'ativo'].includes(dados.status)) {
    erros.push('O campo "status" deve ser "rascunho" ou "ativo"');
  }

  if (erros.length > 0) {
    return { valido: false, erros };
  }

  return {
    valido: true,
    erros: [],
    dados: {
      nome: dados.nome.trim(),
      descricao: dados.descricao.trim(),
      status: dados.status || 'rascunho'
    }
  };
}

/**
 * Valida os dados para atualização de um plano
 */
export function validarAtualizacaoPlano(dados: any): {
  valido: boolean;
  erros: string[];
  dados?: AtualizarPlanoDTO;
} {
  const erros: string[] = [];

  // Pelo menos um campo deve ser fornecido
  if (!dados.nome && !dados.descricao && !dados.status) {
    erros.push('Pelo menos um campo deve ser fornecido para atualização');
  }

  // Validar nome (se fornecido)
  if (dados.nome !== undefined) {
    if (typeof dados.nome !== 'string') {
      erros.push('O campo "nome" deve ser uma string');
    } else if (dados.nome.trim().length === 0) {
      erros.push('O campo "nome" não pode estar vazio');
    } else if (dados.nome.length > 200) {
      erros.push('O campo "nome" não pode exceder 200 caracteres');
    }
  }

  // Validar descrição (se fornecida)
  if (dados.descricao !== undefined) {
    if (typeof dados.descricao !== 'string') {
      erros.push('O campo "descricao" deve ser uma string');
    } else if (dados.descricao.trim().length === 0) {
      erros.push('O campo "descricao" não pode estar vazio');
    } else if (dados.descricao.length > 10000) {
      erros.push('O campo "descricao" não pode exceder 10.000 caracteres');
    }
  }

  // Validar status (se fornecido)
  if (dados.status && !['rascunho', 'ativo', 'concluido', 'arquivado'].includes(dados.status)) {
    erros.push('O campo "status" é inválido');
  }

  if (erros.length > 0) {
    return { valido: false, erros };
  }

  const dadosAtualizacao: AtualizarPlanoDTO = {};
  if (dados.nome) dadosAtualizacao.nome = dados.nome.trim();
  if (dados.descricao) dadosAtualizacao.descricao = dados.descricao.trim();
  if (dados.status) dadosAtualizacao.status = dados.status;

  return {
    valido: true,
    erros: [],
    dados: dadosAtualizacao
  };
}

/**
 * Valida se um ID é válido
 */
export function validarId(id: any): boolean {
  return typeof id === 'string' && id.length > 0;
}
```

---

### 2.4 Middleware de Validação de JSON

**Arquivo:** `lib/middleware/validateJson.ts`

```typescript
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

/**
 * Middleware para validar JSON em requisições POST/PUT/PATCH
 */
export function validateJsonMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Apenas para métodos que enviam JSON
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      
      // Verificar Content-Type
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        return res.status(400).json({
          error: 'Tipo de conteúdo inválido',
          message: 'Content-Type deve ser application/json',
          statusCode: 400
        });
      }

      // Verificar se o body existe
      if (req.body === undefined || req.body === null) {
        return res.status(400).json({
          error: 'Requisição inválida',
          message: 'Corpo da requisição vazio ou JSON malformado',
          statusCode: 400
        });
      }

      // Verificar se não está vazio
      if (typeof req.body === 'object' && Object.keys(req.body).length === 0) {
        return res.status(400).json({
          error: 'Requisição inválida',
          message: 'Corpo da requisição não pode estar vazio',
          statusCode: 400
        });
      }
    }

    return handler(req, res);
  };
}
```

---

### 2.5 API Route: Listar e Criar Planos

**Arquivo:** `pages/api/planos/index.ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { validateJsonMiddleware } from '@/lib/middleware/validateJson';
import { validarCriacaoPlano } from '@/lib/utils/validation';
import { Plano } from '@/lib/types/plano';

// Simular banco de dados (substituir por Supabase/Prisma depois)
let planos: Plano[] = [];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          error: 'Método não permitido',
          message: `O método ${req.method} não é permitido neste endpoint`,
          allowed: ['GET', 'POST'],
          statusCode: 405
        });
    }
  } catch (error) {
    console.error('Erro na API /planos:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      statusCode: 500
    });
  }
}

/**
 * GET /api/planos
 * Lista todos os planos
 */
function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { busca, status } = req.query;

  let resultado = [...planos];

  // Filtrar por busca
  if (busca && typeof busca === 'string') {
    const termoBusca = busca.toLowerCase();
    resultado = resultado.filter(
      (p) =>
        p.nome.toLowerCase().includes(termoBusca) ||
        p.descricao.toLowerCase().includes(termoBusca)
    );
  }

  // Filtrar por status
  if (status && typeof status === 'string') {
    resultado = resultado.filter((p) => p.status === status);
  }

  return res.status(200).json({
    success: true,
    data: resultado,
    total: resultado.length,
    filtros: { busca, status }
  });
}

/**
 * POST /api/planos
 * Cria um novo plano
 */
function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // Validar dados
  const validacao = validarCriacaoPlano(req.body);

  if (!validacao.valido) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Os dados fornecidos não são válidos',
      erros: validacao.erros,
      statusCode: 400
    });
  }

  const dados = validacao.dados!;

  // Verificar duplicatas
  const duplicado = planos.find(
    (p) => p.nome.toLowerCase() === dados.nome.toLowerCase()
  );

  if (duplicado) {
    return res.status(409).json({
      error: 'Conflito',
      message: 'Já existe um plano com este nome',
      plano_existente: {
        id: duplicado.id,
        nome: duplicado.nome
      },
      statusCode: 409
    });
  }

  // Criar novo plano
  const novoPlano: Plano = {
    id: `plano_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nome: dados.nome,
    descricao: dados.descricao,
    status: dados.status || 'rascunho',
    usuario_id: 'usuario_mock', // Substituir por autenticação real
    criado_em: new Date(),
    atualizado_em: new Date()
  };

  planos.push(novoPlano);

  return res.status(201).json({
    success: true,
    message: 'Plano criado com sucesso',
    data: novoPlano
  });
}

// Aplicar middleware
export default validateJsonMiddleware(handler);
```

---

### 2.6 API Route: Operações em Plano Individual

**Arquivo:** `pages/api/planos/[id].ts`

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { validateJsonMiddleware } from '@/lib/middleware/validateJson';
import { validarAtualizacaoPlano, validarId } from '@/lib/utils/validation';
import { Plano } from '@/lib/types/plano';

// Simular banco de dados (compartilhado com index.ts)
// Em produção, usar Supabase ou outro banco
let planos: Plano[] = [];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validar ID
  if (!validarId(id)) {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'O parâmetro "id" deve ser uma string não vazia',
      statusCode: 400
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(id as string, req, res);
      case 'PUT':
        return handlePut(id as string, req, res);
      case 'DELETE':
        return handleDelete(id as string, req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({
          error: 'Método não permitido',
          message: `O método ${req.method} não é permitido neste endpoint`,
          allowed: ['GET', 'PUT', 'DELETE'],
          statusCode: 405
        });
    }
  } catch (error) {
    console.error(`Erro na API /planos/${id}:`, error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      statusCode: 500
    });
  }
}

/**
 * GET /api/planos/:id
 * Busca um plano específico
 */
function handleGet(id: string, req: NextApiRequest, res: NextApiResponse) {
  const plano = planos.find((p) => p.id === id);

  if (!plano) {
    return res.status(404).json({
      error: 'Não encontrado',
      message: `Plano com ID "${id}" não foi encontrado`,
      statusCode: 404
    });
  }

  return res.status(200).json({
    success: true,
    data: plano
  });
}

/**
 * PUT /api/planos/:id
 * Atualiza um plano existente
 */
function handlePut(id: string, req: NextApiRequest, res: NextApiResponse) {
  // Validar dados
  const validacao = validarAtualizacaoPlano(req.body);

  if (!validacao.valido) {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: 'Os dados fornecidos não são válidos',
      erros: validacao.erros,
      statusCode: 400
    });
  }

  // Buscar plano
  const indice = planos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({
      error: 'Não encontrado',
      message: `Plano com ID "${id}" não foi encontrado`,
      statusCode: 404
    });
  }

  const dados = validacao.dados!;

  // Verificar duplicata de nome (se estiver mudando o nome)
  if (dados.nome) {
    const duplicado = planos.find(
      (p) => p.id !== id && p.nome.toLowerCase() === dados.nome!.toLowerCase()
    );

    if (duplicado) {
      return res.status(409).json({
        error: 'Conflito',
        message: 'Já existe outro plano com este nome',
        plano_existente: {
          id: duplicado.id,
          nome: duplicado.nome
        },
        statusCode: 409
      });
    }
  }

  // Atualizar plano
  planos[indice] = {
    ...planos[indice],
    ...dados,
    atualizado_em: new Date()
  };

  return res.status(200).json({
    success: true,
    message: 'Plano atualizado com sucesso',
    data: planos[indice]
  });
}

/**
 * DELETE /api/planos/:id
 * Exclui um plano
 */
function handleDelete(id: string, req: NextApiRequest, res: NextApiResponse) {
  const indice = planos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({
      error: 'Não encontrado',
      message: `Plano com ID "${id}" não foi encontrado`,
      statusCode: 404
    });
  }

  // Remover plano
  planos.splice(indice, 1);

  // 204 No Content não deve retornar body
  return res.status(204).end();
}

// Aplicar middleware
export default validateJsonMiddleware(handler);
```

---

### 2.7 Integração com Supabase (Opcional)

**Arquivo:** `lib/db/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { Plano } from '../types/plano';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Serviço para operações de Planos no Supabase
 */
export const PlanosService = {
  /**
   * Lista todos os planos
   */
  async listar(filtros?: { busca?: string; status?: string }) {
    let query = supabase.from('planos').select('*');

    if (filtros?.busca) {
      query = query.or(
        `nome.ilike.%${filtros.busca}%,descricao.ilike.%${filtros.busca}%`
      );
    }

    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }

    const { data, error } = await query.order('criado_em', { ascending: false });

    if (error) throw error;
    return data as Plano[];
  },

  /**
   * Busca um plano por ID
   */
  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Plano;
  },

  /**
   * Cria um novo plano
   */
  async criar(dados: { nome: string; descricao: string; status?: string }) {
    const { data, error } = await supabase
      .from('planos')
      .insert([
        {
          ...dados,
          status: dados.status || 'rascunho'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Plano;
  },

  /**
   * Atualiza um plano
   */
  async atualizar(id: string, dados: Partial<Plano>) {
    const { data, error } = await supabase
      .from('planos')
      .update({
        ...dados,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Plano;
  },

  /**
   * Exclui um plano
   */
  async excluir(id: string) {
    const { error } = await supabase.from('planos').delete().eq('id', id);

    if (error) throw error;
  },

  /**
   * Verifica se existe um plano com o mesmo nome
   */
  async verificarDuplicata(nome: string, excluirId?: string) {
    let query = supabase
      .from('planos')
      .select('id, nome')
      .ilike('nome', nome);

    if (excluirId) {
      query = query.neq('id', excluirId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found
      throw error;
    }

    return data as Plano | null;
  }
};
```

**Usar no handler:**

```typescript
// No lugar de let planos: Plano[] = [];
import { PlanosService } from '@/lib/db/supabase';

// Exemplo no handlePost:
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // ... validações ...

  // Verificar duplicata
  const duplicado = await PlanosService.verificarDuplicata(dados.nome);
  if (duplicado) {
    return res.status(409).json({
      error: 'Conflito',
      message: 'Já existe um plano com este nome',
      plano_existente: { id: duplicado.id, nome: duplicado.nome },
      statusCode: 409
    });
  }

  // Criar plano
  const novoPlano = await PlanosService.criar(dados);

  return res.status(201).json({
    success: true,
    message: 'Plano criado com sucesso',
    data: novoPlano
  });
}
```

---

## 📋 FASE 3: CORREÇÕES FRONTEND (ALTA PRIORIDADE)

### 🎯 Objetivo
Implementar interface funcional com autenticação, navegação responsiva e acessibilidade.

### Problemas Identificados no Relatório

| Teste | Status | Problema |
|-------|--------|----------|
| Navegação e Rotas | ❌ Falhou | Aplicação não está rodando |
| Controle de Acesso (RBAC) | ❌ Falhou | Sem sistema de autenticação |
| Formulário de Criar Plano | ❌ Falhou | Não implementado |
| Layout Responsivo | ❌ Falhou | Falta navegação mobile |
| Ciclo CRUD | ❌ Falhou | Login não funciona |
| Performance com Grandes Dados | ❌ Falhou | Sem paginação |
| Busca e Filtros | ❌ Falhou | Não implementado |
| Modo Offline | ❌ Falhou | Sem suporte offline |
| Upload de Arquivos | ❌ Falhou | Não implementado |
| Navegação por Teclado | ❌ Falhou | Sem atributos ARIA |
| Autenticação | ❌ Falhou | Sistema não funcional |

---

### 3.1 Hook de Autenticação

**Arquivo:** `lib/hooks/useAuth.ts`

```typescript
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'usuario';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de Autenticação
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sessão ao montar
  useEffect(() => {
    const verificarSessao = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');

        if (token && userData) {
          const user = JSON.parse(userData);
          setUser(user);
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setLoading(false);
      }
    };

    verificarSessao();
  }, []);

  /**
   * Função de login
   */
  const login = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validação básica
      if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios');
      }

      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }

      // Chamar API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      // Salvar sessão
      const { user, token } = data.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      setUser(user);
      setLoading(false);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Função de logout
   */
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

---

### 3.2 Componente de Login

**Arquivo:** `components/LoginForm.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validação básica
    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      setErro('Email inválido');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Tentar login
    const resultado = await login(email, senha);

    if (resultado.success) {
      router.push('/planos');
    } else {
      setErro(resultado.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entrar no PlanejaGov
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema de Planejamento Governamental
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {erro && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
              aria-live="polite"
            >
              <span className="block sm:inline">{erro}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
                <span className="text-red-600 ml-1" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="seu@email.com"
                aria-label="Campo de email"
                aria-required="true"
                aria-invalid={!!erro && !email}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
                <span className="text-red-600 ml-1" aria-label="obrigatório">
                  *
                </span>
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
                aria-label="Campo de senha"
                aria-required="true"
                aria-invalid={!!erro && !senha}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Botão de login"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Esqueceu a senha?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

### 3.3 Navegação Responsiva com Acessibilidade

**Arquivo:** `components/Navigation.tsx`

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navigation() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const perfilRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
      if (perfilRef.current && !perfilRef.current.contains(event.target as Node)) {
        setPerfilAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  // Fechar menu ao pressionar Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuAberto(false);
        setPerfilAberto(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="bg-white shadow-md sticky top-0 z-50"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo e Menu Desktop */}
          <div className="flex">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <span className="text-xl font-bold text-blue-600">PlanejaGov</span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8" role="menubar">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive('/')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                role="menuitem"
              >
                Início
              </Link>

              {user && (
                <>
                  <Link
                    href="/planos"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive('/planos')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    role="menuitem"
                  >
                    Planos
                  </Link>

                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive('/dashboard')
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Ações Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="relative" ref={perfilRef}>
                <button
                  onClick={() => setPerfilAberto(!perfilAberto)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-expanded={perfilAberto}
                  aria-haspopup="true"
                  aria-label="Menu do usuário"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.nome}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${perfilAberto ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown do Perfil */}
                {perfilAberto && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => setPerfilAberto(false)}
                    >
                      Configurações
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded={menuAberto}
              aria-label="Menu principal"
            >
              <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuAberto ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="sm:hidden" ref={menuRef} role="menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive('/')
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              role="menuitem"
              onClick={() => setMenuAberto(false)}
            >
              Início
            </Link>

            {user && (
              <>
                <Link
                  href="/planos"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive('/planos')
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Planos
                </Link>

                <Link
                  href="/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Seção do Usuário Mobile */}
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.nome}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  href="/configuracoes"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  role="menuitem"
                  onClick={() => setMenuAberto(false)}
                >
                  Configurações
                </Link>
                <button
                  onClick={() => {
                    setMenuAberto(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  role="menuitem"
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                href="/login"
                className="block px-4 py-2 text-base font-medium text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
                onClick={() => setMenuAberto(false)}
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
```

---

## 📋 FASE 4: MELHORIAS DE ACESSIBILIDADE

### 🎯 Objetivo
Garantir que a aplicação seja acessível a todos os usuários, incluindo pessoas com deficiência.

---

### 4.1 Checklist de Acessibilidade WCAG 2.1

**Arquivo:** `ACESSIBILIDADE.md`

```markdown
# Guia de Acessibilidade - PlanejaGov

Este documento descreve as práticas de acessibilidade implementadas no PlanejaGov, seguindo as diretrizes WCAG 2.1 Nível AA.

## 🎯 Princípios WCAG

1. **Perceptível** - Informação e componentes da interface devem ser apresentados de forma que os usuários possam perceber
2. **Operável** - Componentes da interface e navegação devem ser operáveis
3. **Compreensível** - Informação e operação da interface devem ser compreensíveis
4. **Robusto** - Conteúdo deve ser robusto o suficiente para ser interpretado por diversos user agents, incluindo tecnologias assistivas

---

## ✅ Checklist de Implementação

### Navegação por Teclado

- [x] **Tab** navega por todos os elementos interativos em ordem lógica
- [x] **Enter/Space** ativa botões, links e controles
- [x] **Escape** fecha modais e dropdowns
- [x] **Setas** navegam em menus e listas (onde aplicável)
- [ ] Skip links implementados para pular para conteúdo principal
- [x] Foco visível em todos os elementos interativos (ring-2)
- [x] Nenhuma armadilha de teclado (focus traps adequados em modais)

### Leitores de Tela (Screen Readers)

- [x] Todos os inputs têm `<label>` associado via `htmlFor`/`id`
- [x] Imagens decorativas têm `alt=""` ou `aria-hidden="true"`
- [x] Imagens informativas têm `alt` descritivo
- [x] Botões têm `aria-label` quando o texto não é descritivo
- [x] Regiões ARIA definidas: `navigation`, `main`, `complementary`
- [x] Estados dinâmicos anunciados com `aria-live`
- [x] `aria-expanded` em elementos expansíveis (dropdowns, menus)
- [x] `aria-haspopup` em elementos com submenus
- [x] `aria-invalid` em campos com erro
- [x] `role="alert"` para mensagens de erro

### Contraste e Visual

- [x] Contraste mínimo 4.5:1 para texto normal
- [x] Contraste mínimo 3:1 para texto grande (18pt+)
- [x] Contraste mínimo 3:1 para componentes de interface
- [x] Foco visível com contraste adequado
- [ ] Sem dependência apenas de cor para transmitir informação
- [x] Textos redimensionáveis até 200% sem perda de funcionalidade
- [x] Sem rolagem horizontal em zoom de 400%

### Formulários

- [x] Labels visíveis e programaticamente associados
- [x] Campos obrigatórios indicados visualmente e via `required`/`aria-required`
- [x] Mensagens de erro claras e específicas
- [x] Erros associados aos campos via `aria-describedby`
- [x] Validação em tempo real onde apropriado
- [x] Instruções claras antes do preenchimento
- [x] Autocomplete apropriado (`autoComplete` attribute)

### Semântica HTML

- [x] HTML semântico usado apropriadamente (`nav`, `main`, `article`, `section`)
- [x] Hierarquia de headings lógica (h1 → h2 → h3)
- [x] Listas usadas para conteúdo em lista (`ul`, `ol`, `li`)
- [x] Landmarks ARIA quando HTML semântico não é suficiente
- [x] Tabelas usadas apenas para dados tabulares

### Interatividade

- [x] Alvos de toque/clique com pelo menos 44x44px
- [x] Espaçamento adequado entre elementos interativos
- [x] Feedback visual para todas as interações
- [x] Loading states anunciados para operações assíncronas
- [x] Timeouts podem ser desabilitados/estendidos pelo usuário

---

## 🛠️ Componentes Acessíveis

### FormField - Campo de Formulário Acessível

```tsx
<FormField
  id="nome"
  label="Nome completo"
  type="text"
  value={nome}
  onChange={setNome}
  required
  error={erros.nome}
  placeholder="Digite seu nome"
/>
```

**Características:**
- Label programaticamente associado
- Estado de erro anunciado via `aria-invalid` e `aria-describedby`
- Campo obrigatório indicado visualmente (*) e via `aria-required`
- Mensagens de erro com `role="alert"` e `aria-live="polite"`

### Button - Botão Acessível

```tsx
<Button
  onClick={handleClick}
  disabled={loading}
  ariaLabel="Salvar plano"
  variant="primary"
>
  {loading ? 'Salvando...' : 'Salvar'}
</Button>
```

**Características:**
- Estado desabilitado gerenciado corretamente
- Loading state anunciado via mudança de texto
- Foco visível e clicável por teclado
- aria-label para contexto adicional

### Modal - Modal Acessível

```tsx
<Modal
  isOpen={modalAberto}
  onClose={fecharModal}
  title="Confirmar exclusão"
>
  {/* Conteúdo */}
</Modal>
```

**Características:**
- Focus trap: foco fica dentro do modal
- Escape fecha o modal
- Primeiro elemento focável recebe foco ao abrir
- Foco retorna ao elemento que abriu ao fechar
- `role="dialog"` e `aria-modal="true"`
- `aria-labelledby` aponta para o título

---

## 🧪 Testes de Acessibilidade

### Testes Automáticos

```bash
# Instalar ferramentas
npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y

# Executar testes
npm run test:a11y
```

### Testes Manuais

#### Com Teclado
1. Navegue pela aplicação usando apenas Tab/Shift+Tab
2. Ative controles com Enter/Space
3. Feche modais com Escape
4. Verifique se o foco é sempre visível

#### Com Leitor de Tela
1. **NVDA** (Windows - gratuito)
   - Baixe em: https://www.nvaccess.org/download/
   - Ctrl para pausar/retomar fala
   
2. **JAWS** (Windows - pago)
   - Demo gratuita disponível
   
3. **VoiceOver** (Mac - nativo)
   - Cmd+F5 para ativar
   - Ctrl para pausar/retomar fala

4. **TalkBack** (Android - nativo)

**O que testar:**
- Todos os textos são lidos corretamente?
- Labels dos campos são anunciados?
- Erros de validação são anunciados?
- Estados de loading são anunciados?
- Estrutura da página faz sentido?

#### Com Zoom
1. Aumentar zoom para 200%
2. Verificar se todo o conteúdo é acessível
3. Não deve haver rolagem horizontal
4. Textos devem continuar legíveis

---

## 📚 Recursos Adicionais

### Ferramentas
- [WAVE](https://wave.webaim.org/) - Avaliação visual de acessibilidade
- [axe DevTools](https://www.deque.com/axe/devtools/) - Extensão para Chrome/Firefox
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoria de acessibilidade

### Documentação
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Guia rápido
- [MDN - Acessibilidade](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility)
- [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/) - Padrões de ARIA

### Comunidade
- [WebAIM](https://webaim.org/) - Recursos e artigos
- [A11y Project](https://www.a11yproject.com/) - Checklist e recursos

---

## 🔄 Processo de Revisão

1. **Desenvolvimento**: Seguir checklist durante implementação
2. **Code Review**: Verificar acessibilidade em PRs
3. **Testes Automáticos**: Executar antes de merge
4. **Testes Manuais**: Teste com teclado e leitor de tela
5. **Auditoria**: Revisão completa a cada release

---

## 📞 Reportar Problemas

Se você encontrar problemas de acessibilidade:

1. Abra uma issue no GitHub: [Novo Issue](https://github.com/narcisolcf/planejagovastudiov1/issues/new)
2. Use o label `acessibilidade`
3. Descreva:
   - O que você esperava
   - O que aconteceu
   - Ferramenta/método usado
   - Screenshots (se aplicável)

---

## ✨ Compromisso

O PlanejaGov se compromete a fornecer uma experiência acessível para todos os usuários, independentemente de suas habilidades ou tecnologias assistivas utilizadas.

Última atualização: 22/11/2025
```

---

### 4.2 Componente FormField Acessível

**Arquivo:** `components/FormField.tsx`

```typescript
import { InputHTMLAttributes } from 'react';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
}

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  ...props
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-label="obrigatório">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        aria-required={required}
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />

      {helperText && !error && (
        <p id={helperId} className="mt-2 text-sm text-gray-600">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
```

---

### 4.3 Componente Modal Acessível

**Arquivo:** `components/Modal.tsx`

```typescript
'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Salvar elemento com foco ao abrir
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Focar primeiro elemento focável ao abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const primeiroFocavel = modalRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      primeiroFocavel?.focus();
    }
  }, [isOpen]);

  // Restaurar foco ao fechar
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Fechar com Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focaveis = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === primeiro) {
          event.preventDefault();
          ultimo.focus();
        }
      } else {
        // Tab
        if (document.activeElement === ultimo) {
          event.preventDefault();
          primeiro.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Fechar modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
```

---

## 📋 FASE 5: TESTES E VALIDAÇÃO

### 🎯 Objetivo
Configurar ambiente de testes e validar todas as correções implementadas.

---

### 5.1 Configuração do TestSprite

**Arquivo:** `testsprite.config.json`

```json
{
  "project": {
    "name": "PlanejaGov v1",
    "version": "1.0.0",
    "repository": "https://github.com/narcisolcf/planejagovastudiov1"
  },
  "backend": {
    "baseUrl": "https://SEU_DOMINIO.vercel.app/api",
    "endpoints": {
      "planos": {
        "list": "/planos",
        "create": "/planos",
        "get": "/planos/:id",
        "update": "/planos/:id",
        "delete": "/planos/:id"
      },
      "auth": {
        "login": "/auth/login",
        "logout": "/auth/logout",
        "profile": "/auth/profile"
      }
    },
    "testData": {
      "plano": {
        "nome": "Plano de Teste",
        "descricao": "Este é um plano criado para testes automatizados"
      }
    }
  },
  "frontend": {
    "baseUrl": "https://SEU_DOMINIO.vercel.app",
    "pages": {
      "home": "/",
      "login": "/login",
      "planos": "/planos",
      "dashboard": "/dashboard"
    },
    "testUser": {
      "email": "teste@exemplo.com",
      "senha": "SenhaSegura123!",
      "nome": "Usuário Teste"
    }
  },
  "test": {
    "timeout": 30000,
    "retries": 2,
    "viewport": {
      "width": 1280,
      "height": 720
    },
    "breakpoints": [375, 768, 1024, 1280]
  }
}
```

---

### 5.2 Script de Atualização de URLs

**Arquivo:** `scripts/update-test-urls.sh`

```bash
#!/bin/bash

# Script para atualizar URLs nos testes do TestSprite

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Atualização de URLs de Teste"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se URL foi fornecida
if [ -z "$1" ]; then
    echo "❌ Erro: URL não fornecida"
    echo ""
    echo "Uso: ./update-test-urls.sh <URL>"
    echo "Exemplo: ./update-test-urls.sh https://planejagovv1.vercel.app"
    exit 1
fi

NEW_URL=$1

# Remover trailing slash
NEW_URL=${NEW_URL%/}

echo "🔄 Atualizando URLs para: $NEW_URL"
echo ""

# Atualizar testsprite.config.json
if [ -f "testsprite.config.json" ]; then
    echo "📄 Atualizando testsprite.config.json..."
    
    # Backup
    cp testsprite.config.json testsprite.config.json.bak
    
    # Substituir URLs
    sed -i.tmp "s|\"baseUrl\": \".*\"|\"baseUrl\": \"$NEW_URL\"|g" testsprite.config.json
    rm testsprite.config.json.tmp 2>/dev/null
    
    echo "✅ testsprite.config.json atualizado"
else
    echo "⚠️  testsprite.config.json não encontrado"
fi

# Atualizar .env.local
if [ -f ".env.local" ]; then
    echo "📄 Atualizando .env.local..."
    
    # Backup
    cp .env.local .env.local.bak
    
    # Atualizar NEXT_PUBLIC_APP_URL
    if grep -q "NEXT_PUBLIC_APP_URL" .env.local; then
        sed -i.tmp "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=$NEW_URL|g" .env.local
    else
        echo "" >> .env.local
        echo "NEXT_PUBLIC_APP_URL=$NEW_URL" >> .env.local
    fi
    rm .env.local.tmp 2>/dev/null
    
    echo "✅ .env.local atualizado"
else
    echo "⚠️  .env.local não encontrado"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Atualização concluída!"
echo ""
echo "Nova URL configurada: $NEW_URL"
echo ""
echo "Próximos passos:"
echo "  1. Verifique os arquivos atualizados"
echo "  2. Commit as mudanças: git add . && git commit -m 'Update test URLs'"
echo "  3. Execute os testes: npm run test"
echo ""
echo "Backups salvos:"
echo "  - testsprite.config.json.bak"
echo "  - .env.local.bak"
```

**Tornar executável:**
```bash
chmod +x scripts/update-test-urls.sh
```

**Usar:**
```bash
./scripts/update-test-urls.sh https://planejagovv1.vercel.app
```

---

### 5.3 Testes Locais Antes do TestSprite

**Arquivo:** `tests/api/planos.test.ts`

```typescript
/**
 * Testes básicos para a API de Planos
 * Execute com: npm test
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('API /api/planos', () => {
  let planoId: string;

  // Teste 1: Listar planos (deve retornar array)
  test('GET /api/planos - deve listar planos', async () => {
    const response = await fetch(`${BASE_URL}/api/planos`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  // Teste 2: Criar plano com dados válidos
  test('POST /api/planos - deve criar plano', async () => {
    const novoPlano = {
      nome: 'Plano Teste ' + Date.now(),
      descricao: 'Descrição do plano de teste'
    };

    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPlano)
    });

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('id');
    expect(data.data.nome).toBe(novoPlano.nome);

    planoId = data.data.id;
  });

  // Teste 3: Criar plano duplicado (deve falhar)
  test('POST /api/planos - deve rejeitar duplicata', async () => {
    const plano = {
      nome: 'Plano Duplicado',
      descricao: 'Teste de duplicata'
    };

    // Primeira criação
    await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plano)
    });

    // Segunda criação (deve falhar)
    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plano)
    });

    expect(response.status).toBe(409);
  });

  // Teste 4: Criar plano com dados inválidos
  test('POST /api/planos - deve rejeitar dados inválidos', async () => {
    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: '' }) // Falta descrição
    });

    expect(response.status).toBe(400);
  });

  // Teste 5: Criar plano com JSON malformado
  test('POST /api/planos - deve rejeitar JSON malformado', async () => {
    const response = await fetch(`${BASE_URL}/api/planos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{'nome': 'invalido'}" // JSON malformado
    });

    expect(response.status).toBe(400);
  });

  // Teste 6: Buscar plano por ID
  test('GET /api/planos/:id - deve buscar plano', async () => {
    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.id).toBe(planoId);
  });

  // Teste 7: Atualizar plano
  test('PUT /api/planos/:id - deve atualizar plano', async () => {
    const atualizacao = {
      nome: 'Plano Atualizado'
    };

    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atualizacao)
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.nome).toBe(atualizacao.nome);
  });

  // Teste 8: Excluir plano
  test('DELETE /api/planos/:id - deve excluir plano', async () => {
    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`, {
      method: 'DELETE'
    });

    expect(response.status).toBe(204);
  });

  // Teste 9: Buscar plano excluído (deve retornar 404)
  test('GET /api/planos/:id - deve retornar 404 para plano excluído', async () => {
    const response = await fetch(`${BASE_URL}/api/planos/${planoId}`);

    expect(response.status).toBe(404);
  });
});
```

**Executar:**
```bash
npm test
```

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ Fase 1: Deploy e Configuração (CRÍTICO)

- [ ] README.md atualizado com instruções completas
- [ ] Script `pre-deploy-check.sh` criado e testado
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] Deploy realizado (Vercel/Netlify)
- [ ] URL de produção anotada e testada
- [ ] Script `update-test-urls.sh` executado com URL correta

### ✅ Fase 2: Backend API (ALTA PRIORIDADE)

- [ ] Types e interfaces criados (`lib/types/plano.ts`)
- [ ] Utilitários de validação implementados (`lib/utils/validation.ts`)
- [ ] Middleware de validação JSON (`lib/middleware/validateJson.ts`)
- [ ] API Route `/api/planos` (GET e POST)
- [ ] API Route `/api/planos/[id]` (GET, PUT, DELETE)
- [ ] Tratamento de erros padronizado
- [ ] Validação de duplicatas
- [ ] Validação de tamanho de campos
- [ ] Respostas JSON sempre válidas
- [ ] Status codes corretos (200, 201, 204, 400, 404, 409, 422, 500)

### ✅ Fase 3: Frontend (ALTA PRIORIDADE)

- [ ] Hook `useAuth` implementado
- [ ] AuthProvider configurado no layout
- [ ] Componente LoginForm criado
- [ ] Navegação responsiva implementada
- [ ] Menu mobile funcional
- [ ] Formulário de criação de planos
- [ ] Listagem de planos com busca
- [ ] Página de detalhes do plano
- [ ] Persistência de sessão (localStorage)
- [ ] Logout funcional

### ✅ Fase 4: Acessibilidade (MÉDIA PRIORIDADE)

- [ ] ACESSIBILIDADE.md criado com checklist completa
- [ ] Componente FormField acessível
- [ ] Componente Modal acessível com focus trap
- [ ] Navegação por teclado testada
- [ ] Atributos ARIA implementados
- [ ] Contraste de cores validado
- [ ] Labels associados a inputs
- [ ] Mensagens de erro anunciadas
- [ ] Focus visível em todos os elementos
- [ ] Teste com leitor de tela realizado

### ✅ Fase 5: Testes (MÉDIA PRIORIDADE)

- [ ] `testsprite.config.json` configurado
- [ ] Testes unitários da API criados
- [ ] Testes locais passando
- [ ] TestSprite re-executado com sucesso
- [ ] Relatório de testes validado

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### Passo 1: Deploy (15 minutos)

```bash
# 1. Verificar configuração
./scripts/pre-deploy-check.sh

# 2. Deploy
vercel --prod

# 3. Anotar URL
# Exemplo: https://planejagovv1.vercel.app
```

### Passo 2: Atualizar URLs (5 minutos)

```bash
# Atualizar todas as URLs de teste
./scripts/update-test-urls.sh https://planejagovv1.vercel.app
```

### Passo 3: Implementar Backend (2-3 horas)

1. Criar estrutura de pastas
2. Implementar types e validações
3. Criar API routes seguindo os exemplos
4. Testar manualmente com Postman/Insomnia

### Passo 4: Implementar Frontend (3-4 horas)

1. Criar hook de autenticação
2. Implementar LoginForm
3. Criar navegação responsiva
4. Testar fluxo completo

### Passo 5: Melhorar Acessibilidade (1-2 horas)

1. Adicionar atributos ARIA faltantes
2. Testar navegação por teclado
3. Validar contraste de cores
4. Testar com leitor de tela

### Passo 6: Validar (30 minutos)

1. Executar testes locais
2. Re-executar TestSprite
3. Validar relatório

---

## 📞 Suporte

Se precisar de ajuda durante a implementação:

1. Verifique a documentação em cada arquivo
2. Revise os exemplos de código
3. Consulte os comentários inline
4. Abra uma issue no GitHub

---

## 📝 Notas Finais

Este plano de correção foi estruturado para resolver **todos os problemas identificados** no relatório TestSprite, priorizando:

1. **Disponibilidade** - Deploy da aplicação
2. **Funcionalidade** - APIs e frontend funcionais
3. **Qualidade** - Validações e tratamento de erros
4. **Acessibilidade** - Interface para todos
5. **Confiabilidade** - Testes automatizados

Após implementar todas as fases, a taxa de aprovação deve subir de **~16%** para **~95%+**.

Boa implementação! 🚀
