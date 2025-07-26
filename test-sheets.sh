#!/bin/bash

echo "🧪 Testando integração Google Sheets..."

# Verificar se o servidor está rodando
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Servidor Next.js está rodando"
    
    echo "🔍 Testando conexão Google Sheets..."
    curl -s http://localhost:3000/api/sheets?action=test
    
    echo ""
    echo "🔐 Testando login com Eder..."
    curl -s -X POST http://localhost:3000/api/sheets \
      -H "Content-Type: application/json" \
      -d '{"action":"test-login","username":"Eder","password":"Noivo!"}'
    
    echo ""
    echo "🔐 Testando login com Vitoria..."
    curl -s -X POST http://localhost:3000/api/sheets \
      -H "Content-Type: application/json" \
      -d '{"action":"test-login","username":"Vitoria","password":"Noiva!"}'
    
    echo ""
    echo "🚀 Inicializando planilhas..."
    curl -s http://localhost:3000/api/sheets?action=init
    
else
    echo "❌ Servidor não está rodando. Execute: npm run dev"
fi

echo ""
echo "✅ Testes concluídos!"
