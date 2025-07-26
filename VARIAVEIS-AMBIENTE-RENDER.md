# 🔑 Variáveis de Ambiente - Render (Passo a Passo Visual)

## 📍 **LOCALIZAÇÃO NO RENDER**

### **Opção 1: Durante a criação do serviço**
1. Criar Web Service
2. Configurar build/start commands
3. **Role para baixo** → "Environment Variables"
4. Adicione as 3 variáveis

### **Opção 2: Após criar o serviço**
1. Entre no seu serviço criado
2. Clique na aba **"Environment"**
3. Adicione as 3 variáveis

## ➕ **COMO ADICIONAR (Visual)**

```
┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ [Add Environment Variable] (botão)  │
├─────────────────────────────────────┤
│ Key: [campo texto]                  │
│ Value: [campo texto grande]         │
│ [Add] [Cancel]                      │
└─────────────────────────────────────┘
```

## 🔢 **AS 3 VARIÁVEIS (Copie e Cole)**

### **1ª Variável:**
```
Key: GOOGLE_SHEETS_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5K8ZgJN6gE7ZW
[... SUA CHAVE PRIVADA COMPLETA AQUI ...]
-----END PRIVATE KEY-----
```

### **2ª Variável:**
```
Key: GOOGLE_SHEETS_CLIENT_EMAIL
Value: chabar-sheets-service@chabar-vitoria-eder-433717.iam.gserviceaccount.com
```

### **3ª Variável:**
```
Key: GOOGLE_SPREADSHEET_ID
Value: 1QST7YS_OZzU9Cy9X-73Y9XI4O9fcnDISf4u4HADzAPA
```

## ✅ **RESULTADO FINAL**

Após adicionar as 3 variáveis, você verá:

```
Environment Variables:
┌──────────────────────────────────────┐
│ GOOGLE_SHEETS_PRIVATE_KEY           │
│ -----BEGIN PRIVATE KEY-----         │
│ [Edit] [Delete]                     │
├──────────────────────────────────────┤
│ GOOGLE_SHEETS_CLIENT_EMAIL          │
│ chabar-sheets-service@...           │
│ [Edit] [Delete]                     │
├──────────────────────────────────────┤
│ GOOGLE_SPREADSHEET_ID               │
│ 1QST7YS_OZzU9Cy9X-73Y9XI4O9fcn... │
│ [Edit] [Delete]                     │
└──────────────────────────────────────┘

[Add Environment Variable] (botão)
```

## ⚠️ **DICAS IMPORTANTES**

### ✅ **FAÇA:**
- Cole a chave privada COMPLETA (com BEGIN/END)
- Verifique se não há espaços extras
- Use exatamente os nomes das keys mostrados
- Adicione uma variável por vez

### ❌ **NÃO FAÇA:**
- Não crie "grupos" de variáveis
- Não remova as linhas BEGIN/END da chave
- Não adicione aspas extras nos valores
- Não deixe espaços no início/fim

## 🚀 **APÓS ADICIONAR**

1. **Save** ou **Deploy** (depende da interface)
2. **Aguarde o redeploy automático** (~3-5 min)
3. **Teste a aplicação**

---

**🎯 Total: 3 variáveis individuais na lista principal (não em grupos)**
