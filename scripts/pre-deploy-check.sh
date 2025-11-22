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
