# 🔐 Configuração Google Sheets - Passo a Passo

## 📋 **PASSO 1: Criar Projeto no Google Cloud**

1. **Acesse**: https://console.cloud.google.com/
2. **Clique em "Criar Projeto"**
3. **Nome do projeto**: `chabar-vitoria-eder`
4. **Clique em "Criar"**

## 📊 **PASSO 2: Ativar APIs Necessárias**

1. **No Console, vá em**: "APIs e Serviços" > "Biblioteca"
2. **Procure e ative**:
   - Google Sheets API
   - Google Drive API (opcional, para compartilhamento)

## 🔑 **PASSO 3: Criar Credenciais de Serviço**

1. **Vá em**: "APIs e Serviços" > "Credenciais"
2. **Clique em**: "Criar Credenciais" > "Conta de Serviço"
3. **Preencha**:
   - Nome: `chabar-sheets-service`
   - Descrição: `Serviço para acessar planilhas do Chá Bar`
4. **Clique em "Criar e Continuar"**
5. **Papel**: "Editor" (ou específico do Sheets)
6. **Clique em "Concluir"**

## 📄 **PASSO 4: Baixar Chave JSON**

1. **Na lista de contas de serviço**, clique na que criou
2. **Aba "Chaves"** > "Adicionar Chave" > "Criar Nova Chave"
3. **Tipo**: JSON
4. **Baixe o arquivo** e guarde com segurança

## 📈 **PASSO 5: Criar Planilha Google Sheets**

1. **Acesse**: https://sheets.google.com/
2. **Crie nova planilha**
3. **Nome**: "Chá Bar - Vitória e Éder"
4. **Crie 3 abas**:
   - `Convidados`
   - `Presentes` 
   - `Configurações`

## 🔗 **PASSO 6: Compartilhar Planilha**

1. **Na planilha, clique em "Compartilhar"**
2. **Adicione o email** da conta de serviço (do arquivo JSON)
3. **Permissão**: "Editor"
4. **Copie o ID da planilha** (da URL)

## ⚙️ **PASSO 7: Configurar Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[SUA_CHAVE_PRIVADA_AQUI]\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="chabar-sheets-service@seu-projeto.iam.gserviceaccount.com"
GOOGLE_SPREADSHEET_ID="1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P"
```

### 📝 **Como extrair as informações do JSON:**

Do arquivo JSON baixado, extraia:
- `private_key` → GOOGLE_SHEETS_PRIVATE_KEY
- `client_email` → GOOGLE_SHEETS_CLIENT_EMAIL
- Da URL da planilha → GOOGLE_SPREADSHEET_ID

## 🧪 **PASSO 8: Testar a Integração**

### Localmente:
```bash
# Instalar dependências
npm install

# Testar conexão
curl http://localhost:3000/api/sheets?action=test

# Inicializar planilhas
curl http://localhost:3000/api/sheets?action=init

# Testar login
curl -X POST http://localhost:3000/api/sheets \
  -H "Content-Type: application/json" \
  -d '{"action":"test-login","username":"noivos","password":"voucasar2025"}'
```

## 🚀 **PASSO 9: Deploy no Render**

1. **No Render Dashboard**, vá em seu serviço
2. **Environment** > "Add Environment Variable"
3. **Adicione as 3 variáveis**:
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEETS_CLIENT_EMAIL` 
   - `GOOGLE_SPREADSHEET_ID`
4. **Deploy automático** será acionado

## ✅ **PASSO 10: Validar Funcionamento**

Acesse sua aplicação e verifique:
- [ ] Portal admin carrega
- [ ] Login funciona
- [ ] Dados aparecem na planilha
- [ ] Formulário RSVP salva no Sheets

## 📊 **Estrutura das Planilhas**

### Aba "Convidados":
```
id | name | rg | licensePlate | isAttending | companions | willBringGift | selectedGift | selectedGifts | message | createdAt
```

### Aba "Presentes":
```
id | name | description | isAvailable | selectedBy | category | createdAt
```

### Aba "Configurações":
```
username | password | lastUpdate
noivos   | voucasar2025 | 2025-07-25T...
```

## 🔒 **Vantagens da Migração**

- ✅ **Segurança**: Dados protegidos pelo Google
- ✅ **Backup**: Automático na nuvem
- ✅ **Acesso direto**: Visualizar dados no Google Sheets
- ✅ **Relatórios**: Criar gráficos e análises
- ✅ **Colaboração**: Múltiplos acessos
- ✅ **Histórico**: Controle de versões

## ❓ **Problemas Comuns**

### "Cannot find module 'googleapis'"
```bash
npm install googleapis
```

### "Authentication failed"
- Verifique se as variáveis de ambiente estão corretas
- Confirme se a planilha foi compartilhada com a conta de serviço

### "Spreadsheet not found"
- Verifique o ID da planilha na URL
- Confirme se a planilha existe e está compartilhada

---

**🎉 Após seguir todos os passos, sua aplicação usará Google Sheets automaticamente!**
