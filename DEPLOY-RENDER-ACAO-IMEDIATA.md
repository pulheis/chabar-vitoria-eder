# ⚡ Deploy Render - Ação Imediata

## 🚨 **SITUAÇÃO ATUAL**
- ✅ Código funcionando localmente em http://localhost:3004
- ✅ Google Sheets integrado e funcionando
- ✅ APIs testadas e validadas
- ⚠️ Git com conflito (pode ser resolvido depois)

## 🚀 **DEPLOY IMEDIATO - OPÇÃO 1: Upload Manual**

### 1. **Criar ZIP do projeto**
```bash
# Na pasta do projeto
cd /Users/thamirespulheis/chabarve
zip -r chabar-projeto.zip . -x "node_modules/*" ".next/*" ".git/*" ".env.local"
```

### 2. **Upload direto no Render**
1. Acesse: https://render.com
2. New + → Web Service
3. "Deploy from Repository" → "Upload ZIP"
4. Faça upload do chabar-projeto.zip

## 🚀 **DEPLOY IMEDIATO - OPÇÃO 2: GitHub (Recomendado)**

### 1. **Resolver Git (rápido)**
```bash
# Force push (cuidado - sobrescreve o remote)
git push origin main --force
```

### 2. **Ou criar novo repositório**
```bash
# Backup do atual
mv .git .git-backup

# Novo repositório
git init
git add .
git commit -m "deploy: aplicação chabar completa"
git branch -M main
git remote add origin https://github.com/pulheis/chabar-vitoria-eder.git
git push -u origin main --force
```

## ⚙️ **CONFIGURAÇÕES NO RENDER**

### **Configurações Básicas**
```
Service Name: chabar-vitoria-eder
Environment: Node
Region: Oregon (US West)
Branch: main
Build Command: npm run build
Start Command: npm start
Node Version: 18
```

### **Variáveis de Ambiente (CRÍTICAS)**

#### **1. GOOGLE_SHEETS_PRIVATE_KEY**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5K8ZgJN6gE7ZW
[... SUA CHAVE COMPLETA AQUI ...]
-----END PRIVATE KEY-----
```

#### **2. GOOGLE_SHEETS_CLIENT_EMAIL**
```
chabar-sheets-service@chabar-vitoria-eder-433717.iam.gserviceaccount.com
```

#### **3. GOOGLE_SPREADSHEET_ID**
```
1QST7YS_OZzU9Cy9X-73Y9XI4O9fcnDISf4u4HADzAPA
```

### 📋 **Como pegar essas informações**

#### **Do seu arquivo local:**
```bash
cat .env.local
```

#### **Copiar exatamente como está**, incluindo:
- Quebras de linha na private key
- Email completo da service account
- ID da planilha (da URL)

## 🔧 **PASSO A PASSO NO RENDER**

### **1. Login e Setup**
1. https://render.com → Sign Up/Login
2. Connect GitHub account
3. New + → Web Service

### **2. Repository**
- Connect: `pulheis/chabar-vitoria-eder`
- Branch: `main`

### **3. Settings**
```
Name: chabar-vitoria-eder
Environment: Node
Build Command: npm run build
Start Command: npm start
Auto-Deploy: Yes
```

### **4. Advanced**
```
Node Version: 18
Environment Variables: [Adicionar as 3 acima]
```

### **5. Deploy**
- Click "Create Web Service"
- Wait 5-10 minutes
- Monitor logs

## ✅ **TESTES PÓS-DEPLOY**

### **URLs para testar:**
```
# App principal
https://chabar-vitoria-eder.onrender.com

# Portal admin
https://chabar-vitoria-eder.onrender.com/admin

# Test API
https://chabar-vitoria-eder.onrender.com/api/guests

# Test Sheets
https://chabar-vitoria-eder.onrender.com/api/sheets?action=test
```

### **Comandos de teste:**
```bash
# Health check
curl https://chabar-vitoria-eder.onrender.com/api/guests

# Sheets test
curl https://chabar-vitoria-eder.onrender.com/api/sheets?action=test

# Initialize
curl -X POST https://chabar-vitoria-eder.onrender.com/api/initialize
```

## 🚨 **TROUBLESHOOTING RÁPIDO**

### **Build falha:**
- Check Node version = 18
- Check build command = `npm run build`
- Check start command = `npm start`

### **App loads mas erro 500:**
- Check environment variables
- Check Render logs
- Test Google Sheets permissions

### **Google Sheets não funciona:**
- Check private key (com quebras de linha)
- Check email da service account
- Check planilha compartilhada
- Check spreadsheet ID

## ⏰ **TEMPO ESTIMADO**
- Setup Render: 5 min
- Deploy: 10 min
- Testes: 5 min
- **Total: 20 minutos**

---

## 🎯 **RESULTADO ESPERADO**

✅ **App funcionando em produção**
✅ **Google Sheets salvando dados**
✅ **Portal admin funcionando**
✅ **HTTPS automático**
✅ **Auto-deploy ativo**

**🚀 Vamos para o Render agora!**
