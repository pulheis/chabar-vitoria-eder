# 🚀 Deploy no Render - Passo a Passo Completo

## 📋 **PASSO 1: Preparar o Repositório GitHub**

### 1.1 Verificar se o código está commitado
```bash
git status
git add .
git commit -m "feat: integração Google Sheets finalizada - pronto para deploy"
git push origin main
```

### 1.2 Verificar arquivos essenciais
- [ ] `.env.local` (NÃO deve estar no Git)
- [ ] `package.json` com scripts corretos
- [ ] `next.config.ts` configurado
- [ ] Código das APIs funcionando

## 🌐 **PASSO 2: Criar Conta no Render**

1. **Acesse**: https://render.com
2. **Clique em**: "Get Started for Free"
3. **Conecte sua conta GitHub**
4. **Autorize o Render** a acessar seus repositórios

## 🔧 **PASSO 3: Criar Web Service**

### 3.1 Novo Serviço
1. **No Dashboard do Render**, clique em "New +"
2. **Selecione**: "Web Service"
3. **Conecte seu repositório**: `chabarve`

### 3.2 Configurações Básicas
```
Name: chabar-vitoria-eder
Region: Oregon (US West)
Branch: main
Runtime: Node
Build Command: npm run build
Start Command: npm start
```

### 3.3 Configurações Avançadas
```
Node Version: 18
Environment: Node
Auto-Deploy: Yes
```

## 🔑 **PASSO 4: Configurar Variáveis de Ambiente**

### 4.1 No painel do Render:
1. **Após criar o Web Service**, você verá a página de configuração
2. **Role para baixo** até a seção "Environment Variables"
3. **OU** vá na aba "Environment" (se já criou o serviço)

### 4.2 Adicionar uma por vez (clique em "Add Environment Variable"):

⚠️ **IMPORTANTE**: Não crie grupos! Adicione as variáveis diretamente na lista principal.

#### **GOOGLE_SHEETS_PRIVATE_KEY**
```
Key: GOOGLE_SHEETS_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----
[SUA_CHAVE_PRIVADA_COMPLETA_AQUI]
-----END PRIVATE KEY-----
```
⚠️ **IMPORTANTE**: Cole a chave COMPLETA, incluindo BEGIN/END

#### **GOOGLE_SHEETS_CLIENT_EMAIL**
```
Key: GOOGLE_SHEETS_CLIENT_EMAIL
Value: chabar-sheets-service@seu-projeto.iam.gserviceaccount.com
```

#### **GOOGLE_SPREADSHEET_ID**
```
Key: GOOGLE_SPREADSHEET_ID
Value: 1QST7YS_OZzU9Cy9X-73Y9XI4O9fcnDISf4u4HADzAPA
```

### 4.3 Passo a passo visual no Render:

```
1. Na página do seu serviço:
   [Environment Variables]
   
2. Clique: "Add Environment Variable"
   
3. Preencha:
   Key: GOOGLE_SHEETS_PRIVATE_KEY
   Value: [cole a chave privada completa]
   
4. Clique: "Add"

5. Repita para as outras 2 variáveis

6. Total: 3 variáveis na lista (não em grupos)
```

### 4.4 Como pegar essas informações

Do seu arquivo `.env.local`:
```bash
cat .env.local
```

## 🔨 **PASSO 5: Deploy Automático**

### 5.1 Iniciar Deploy
1. **Clique em**: "Create Web Service"
2. **Aguarde o build** (5-10 minutos)
3. **Monitore os logs** na aba "Logs"

### 5.2 Acompanhar o Build
```
==> Building application...
==> Installing dependencies...
==> Running build command: npm run build
==> Starting application...
==> Your service is live at https://chabar-vitoria-eder.onrender.com
```

## ✅ **PASSO 6: Verificar Deploy**

### 6.1 URLs para testar
- **App Principal**: https://chabar-vitoria-eder.onrender.com
- **Admin**: https://chabar-vitoria-eder.onrender.com/admin
- **API Test**: https://chabar-vitoria-eder.onrender.com/api/sheets?action=test

### 6.2 Testes essenciais
```bash
# Teste de saúde
curl https://chabar-vitoria-eder.onrender.com/api/guests

# Teste Google Sheets
curl https://chabar-vitoria-eder.onrender.com/api/sheets?action=test

# Teste inicialização
curl -X POST https://chabar-vitoria-eder.onrender.com/api/initialize
```

## 🔍 **PASSO 7: Troubleshooting**

### 7.1 Se o build falhar:

#### **Erro de dependências**
```bash
# No terminal local, verificar package.json
npm install
npm run build
```

#### **Erro de variáveis de ambiente**
- Verificar se as 3 variáveis estão corretas
- Verificar quebras de linha na private key
- Redeployar após corrigir

### 7.2 Se o Google Sheets não funcionar:

#### **Verificar permissões da planilha**
1. Abrir: https://docs.google.com/spreadsheets/d/1QST7YS_OZzU9Cy9X-73Y9XI4O9fcnDISf4u4HADzAPA
2. Clicar em "Compartilhar"
3. Verificar se o email da service account tem permissão de "Editor"

#### **Verificar abas da planilha**
- [ ] Aba "Convidados" existe
- [ ] Aba "Presentes" existe  
- [ ] Aba "Configurações" existe
- [ ] Headers corretos em cada aba

## 🎯 **PASSO 8: Configuração DNS (Opcional)**

### 8.1 Domínio personalizado
1. **No Render**, vá em "Settings" > "Custom Domains"
2. **Adicione seu domínio**: `chabar.seudominio.com`
3. **Configure DNS** conforme instruções do Render

## 📊 **PASSO 9: Monitoramento**

### 9.1 Logs em tempo real
- **No Render**: Aba "Logs"
- **Filtros**: Error, Warning, Info

### 9.2 Métricas
- **CPU/Memory**: Aba "Metrics"
- **Uptime**: Dashboard principal

## 🔄 **PASSO 10: Auto-Deploy**

### 10.1 Configuração automática
- Qualquer push para `main` → redeploy automático
- Tempo: ~3-5 minutos
- Notificações por email

## ⚡ **Comandos Úteis**

### Verificar status local antes do deploy:
```bash
npm run build
npm start
```

### Testar variáveis de ambiente:
```bash
node -e "console.log(process.env.GOOGLE_SHEETS_CLIENT_EMAIL)"
```

### Forçar redeploy:
- No Render: "Manual Deploy" > "Deploy latest commit"

## 🎉 **Resultado Final**

Após todos os passos:
- ✅ **App funcionando**: https://chabar-vitoria-eder.onrender.com
- ✅ **Admin funcionando**: Portal dos noivos acessível
- ✅ **Google Sheets integrado**: Dados salvos na nuvem
- ✅ **Auto-deploy ativo**: Updates automáticos
- ✅ **SSL/HTTPS**: Certificado automático

---

## 📞 **Suporte**

Se algo der errado:
1. **Verificar logs** no Render
2. **Testar localmente** primeiro
3. **Verificar variáveis** de ambiente
4. **Redeployar** se necessário

**🚀 Sua aplicação estará no ar em poucos minutos!**
