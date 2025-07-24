#!/bin/bash

echo "🚀 Script de Deploy Automático - Chá Bar Vitória + Éder"
echo "=================================================="

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI não encontrado. Instale com: brew install gh"
    echo "   Ou siga o guia manual em GUIA-DEPLOY.md"
    exit 1
fi

# Login no GitHub (se necessário)
echo "🔐 Verificando autenticação GitHub..."
if ! gh auth status &> /dev/null; then
    echo "🔑 Fazendo login no GitHub..."
    gh auth login
fi

# Criar repositório no GitHub
echo "📁 Criando repositório no GitHub..."
gh repo create chabar-vitoria-eder \
    --description "Aplicação web para confirmação de presença no Chá Bar de Vitória e Éder" \
    --public \
    --source=. \
    --remote=origin \
    --push

echo "✅ Repositório criado e código enviado!"
echo ""
echo "🌐 Próximos passos:"
echo "1. Acesse: https://render.com"
echo "2. Conecte o repositório: chabar-vitoria-eder"
echo "3. Configure conforme GUIA-DEPLOY.md"
echo ""
echo "📋 Seu repositório: $(gh repo view --web --json url -q .url)"
