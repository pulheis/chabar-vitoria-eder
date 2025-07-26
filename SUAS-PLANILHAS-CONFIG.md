# 🔧 Configuração Específica das suas Planilhas

## 📋 **SUAS INFORMAÇÕES**

### 🔑 **Conta de Serviço:**
```
chabar-sheets-service@fleet-passkey-318115.iam.gserviceaccount.com
```

### 📊 **Planilhas Criadas:**
1. **Planilha 1**: `1NIzFo31lU8lytEa2icotR5L4G9_j7GEvStu-sPoQ0RI` ← **PRINCIPAL**
2. **Planilha 2**: `1u_kHNAUVJkhv4K53YD5kIg1d5pXsjWYwrbJ3cbTotxM`
3. **Planilha 3**: `1QST7YS_OZzU9Cy9X-73Y9XI4O9fcnDISf4u4HADzAPA`

## ⚙️ **CONFIGURAÇÃO ATUAL**

O arquivo `.env.local` foi configurado para usar a **Planilha 1** como principal.

### 📝 **Próximo Passo:**

Você precisa **adicionar a chave privada** do arquivo JSON que baixou do Google Cloud.

1. **Abra o arquivo JSON** que você baixou
2. **Encontre a chave** `"private_key"`
3. **Copie o valor completo** (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)
4. **Substitua** `[COLE_SUA_CHAVE_PRIVADA_AQUI_DO_ARQUIVO_JSON]` no `.env.local`

### 🔍 **Exemplo da chave no JSON:**
```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "chabar-sheets-service@fleet-passkey-318115.iam.gserviceaccount.com"
}
```

## 📊 **CONFIGURAR AS ABAS DA PLANILHA**

Na **Planilha Principal** (1NIzFo31lU8lytEa2icotR5L4G9_j7GEvStu-sPoQ0RI):

### 1. **Criar/Renomear Abas:**
- Aba 1: `Convidados`
- Aba 2: `Presentes`
- Aba 3: `Configurações`

### 2. **Configurar Headers:**

#### **Aba "Convidados" (A1:K1):**
```
id | name | rg | licensePlate | isAttending | companions | willBringGift | selectedGift | selectedGifts | message | createdAt
```

#### **Aba "Presentes" (A1:G1):**
```
id | name | description | isAvailable | selectedBy | category | createdAt
```

#### **Aba "Configurações" (A1:C2):**
```
username | password | lastUpdate
noivos   | voucasar2025 | 2025-07-25T12:00:00.000Z
```

## 🔐 **PERMISSÕES**

Certifique-se de que a planilha foi **compartilhada** com:
```
chabar-sheets-service@fleet-passkey-318115.iam.gserviceaccount.com
```

**Permissão**: Editor

## 🧪 **TESTAR A CONFIGURAÇÃO**

Após configurar a chave privada:

```bash
# 1. Instalar dependências
npm install

# 2. Testar conexão
npm run dev
# Em outro terminal:
curl http://localhost:3000/api/sheets?action=test

# 3. Inicializar planilhas (cria headers e dados padrão)
curl http://localhost:3000/api/sheets?action=init

# 4. Testar login
curl -X POST http://localhost:3000/api/sheets \
  -H "Content-Type: application/json" \
  -d '{"action":"test-login","username":"noivos","password":"voucasar2025"}'
```

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [ ] Arquivo JSON baixado do Google Cloud
- [ ] Chave privada copiada para `.env.local`
- [ ] Planilha compartilhada com a conta de serviço
- [ ] 3 abas criadas na planilha (Convidados, Presentes, Configurações)
- [ ] Headers configurados em cada aba
- [ ] Teste de conexão executado
- [ ] Inicialização executada

## 🚀 **APÓS CONFIGURAÇÃO**

Quando tudo estiver funcionando:

1. **Aplicação detecta automaticamente** o Google Sheets
2. **Dados novos** são salvos no Google Sheets
3. **Portal admin** mostra dados do Sheets
4. **Formulário RSVP** salva no Sheets

## ❗ **IMPORTANTE**

- Use apenas a **Planilha 1** como principal
- As outras planilhas podem ser **backup** ou **testes**
- Mantenha o arquivo `.env.local` **seguro** (nunca commit no Git)

---

**📞 Precisa de ajuda? Me avise quando completar estes passos!**
