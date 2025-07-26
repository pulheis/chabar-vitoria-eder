#!/bin/bash

echo "🚀 Script de Deploy para Render"
echo "================================"

# Finalizar processos git problemáticos
echo "📝 Limpando git..."
pkill git 2>/dev/null || true
sleep 2

# Adicionar todas as alterações
echo "📁 Adicionando arquivos..."
git add .

# Commit das alterações
echo "💾 Fazendo commit..."
git commit -m "fix: corrigida detecção Google Sheets no Render

- Alterada lógica USE_GOOGLE_SHEETS de constante para função
- Adicionada API de debug para verificar variáveis de ambiente
- Logs de debug para monitorar detecção de storage
- Correção para forçar uso do Google Sheets em produção"

# Push para GitHub
echo "📤 Enviando para GitHub..."
git push origin main --force

echo "✅ Deploy concluído!"
echo ""
echo "🔗 Agora acesse o Render e verifique:"
echo "   1. Se o redeploy automático foi acionado"
echo "   2. Se os logs mostram 'Storage Detection: shouldUseSheets: true'"
echo "   3. Teste: https://seu-app.onrender.com/api/debug"
echo ""
echo "⚡ O Google Sheets deve estar funcionando após o redeploy!"
