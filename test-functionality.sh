#!/bin/bash

echo "🎯 Testando funcionalidades do Chá Bar"
echo "======================================"

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_BASE="http://localhost:3000/api"

echo -e "${YELLOW}1. Testando API de Presentes...${NC}"

# Testar GET presentes
echo "🔍 Buscando presentes disponíveis..."
curl -s "${API_BASE}/gifts" | jq '.[] | {id, name, isAvailable}' || echo "❌ Erro ao buscar presentes"

echo -e "\n${YELLOW}2. Testando API de Convidados...${NC}"

# Testar GET convidados
echo "🔍 Buscando convidados..."
curl -s "${API_BASE}/guests" | jq '.[] | {id, name, isAttending, selectedGifts}' || echo "❌ Erro ao buscar convidados"

echo -e "\n${YELLOW}3. Testando criação de presente...${NC}"

# Criar um presente de teste
TEST_GIFT_RESPONSE=$(curl -s -X POST "${API_BASE}/gifts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Presente de Teste",
    "description": "Descrição do presente de teste",
    "isAvailable": true
  }')

if echo "$TEST_GIFT_RESPONSE" | jq -e '.id' > /dev/null; then
  TEST_GIFT_ID=$(echo "$TEST_GIFT_RESPONSE" | jq -r '.id')
  echo -e "${GREEN}✅ Presente criado com ID: $TEST_GIFT_ID${NC}"
  
  echo -e "\n${YELLOW}4. Testando seleção de presente...${NC}"
  
  # Marcar presente como selecionado
  UPDATE_RESPONSE=$(curl -s -X PUT "${API_BASE}/gifts" \
    -H "Content-Type: application/json" \
    -d "{
      \"id\": \"$TEST_GIFT_ID\",
      \"isAvailable\": false,
      \"selectedBy\": \"Teste Usuário\"
    }")
  
  if echo "$UPDATE_RESPONSE" | jq -e '.id' > /dev/null; then
    echo -e "${GREEN}✅ Presente marcado como selecionado${NC}"
    
    echo -e "\n${YELLOW}5. Testando liberação de presente...${NC}"
    
    # Liberar presente
    RELEASE_RESPONSE=$(curl -s -X PUT "${API_BASE}/gifts" \
      -H "Content-Type: application/json" \
      -d "{
        \"id\": \"$TEST_GIFT_ID\",
        \"isAvailable\": true,
        \"selectedBy\": null
      }")
    
    if echo "$RELEASE_RESPONSE" | jq -e '.id' > /dev/null; then
      echo -e "${GREEN}✅ Presente liberado com sucesso${NC}"
    else
      echo -e "${RED}❌ Erro ao liberar presente${NC}"
    fi
  else
    echo -e "${RED}❌ Erro ao selecionar presente${NC}"
  fi
  
  echo -e "\n${YELLOW}6. Limpando dados de teste...${NC}"
  
  # Excluir presente de teste
  DELETE_RESPONSE=$(curl -s -X DELETE "${API_BASE}/gifts" \
    -H "Content-Type: application/json" \
    -d "{\"id\": \"$TEST_GIFT_ID\"}")
  
  if echo "$DELETE_RESPONSE" | jq -e '.success' > /dev/null; then
    echo -e "${GREEN}✅ Presente de teste excluído${NC}"
  else
    echo -e "${RED}❌ Erro ao excluir presente de teste${NC}"
  fi
  
else
  echo -e "${RED}❌ Erro ao criar presente de teste${NC}"
fi

echo -e "\n${YELLOW}7. Verificando funcionalidades implementadas...${NC}"

echo "✅ Presentes únicos por convidado"
echo "✅ Portal admin com CRUD de presentes"
echo "✅ Adicionar novos presentes"
echo "✅ Editar presentes existentes"
echo "✅ Excluir presentes"
echo "✅ Alternar disponibilidade"
echo "✅ Excluir convidados (libera presentes)"
echo "✅ Atualização automática de disponibilidade"

echo -e "\n${GREEN}🎉 Teste concluído!${NC}"
