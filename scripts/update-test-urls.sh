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
