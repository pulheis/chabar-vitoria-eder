# 🔒 Integração com Google Sheets - Guia Completo

## 🎯 Objetivo
Migrar o sistema de persistência local (arquivos JSON) para Google Sheets para maior segurança, backup automático e acesso centralizado.

## 📋 Pré-requisitos

### 1. Criar Projeto no Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Clique em "Criar Projeto" ou selecione um existente
3. Nomeie o projeto: `chabar-vitoria-eder`

### 2. Ativar Google Sheets API
1. No Console, vá em "APIs e Serviços" > "Biblioteca"
2. Procure por "Google Sheets API"
3. Clique em "Ativar"

### 3. Criar Credenciais de Serviço
1. Vá em "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "Conta de Serviço"
3. Nome: `chabar-sheets-service`
4. Baixe o arquivo JSON das credenciais

## 📊 Estrutura das Planilhas

### Planilha 1: "Convidados"
```
A1: id | B1: nome | C1: email | D1: isAttending | E1: companions | F1: selectedGifts | G1: message | H1: createdAt
```

### Planilha 2: "Presentes"
```
A1: id | B1: name | C1: description | D1: isAvailable | E1: selectedBy | F1: createdAt
```

### Planilha 3: "Configurações"
```
A1: username | B1: password | C1: lastUpdate
A2: noivos   | B2: voucasar2025 | C2: [timestamp]
```

## 🔧 Implementação

### 1. Instalar Dependências
```bash
npm install googleapis
npm install @types/google-auth-library --save-dev
```

### 2. Configurar Variáveis de Ambiente
```env
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="chabar-sheets-service@project-id.iam.gserviceaccount.com"
GOOGLE_SPREADSHEET_ID="1234567890abcdef..."
```

### 3. Criar Serviço Google Sheets
Arquivo: `src/lib/google-sheets.ts`

## 🚀 Passos de Migração

1. **Criar planilha Google Sheets**
2. **Configurar credenciais**
3. **Implementar serviço de conexão**
4. **Migrar dados existentes**
5. **Atualizar APIs**
6. **Testar funcionamento**
7. **Deploy com novas variáveis**

## 🔒 Vantagens da Migração

- ✅ **Segurança**: Dados protegidos pelo Google
- ✅ **Backup**: Automático e versionado
- ✅ **Acesso**: Os noivos podem ver dados diretamente no Sheets
- ✅ **Colaboração**: Múltiplos acessos simultâneos
- ✅ **Histórico**: Controle de versões automático
- ✅ **Escalabilidade**: Suporta mais dados
- ✅ **Relatórios**: Fácil criação de gráficos e relatórios

## ⚠️ Considerações

- Requer conexão com internet
- Limite de requisições da API (100 req/100s por usuário)
- Configuração inicial mais complexa
- Dependência de serviços Google

---

**Próximo passo:** Você quer que eu implemente essa integração?
