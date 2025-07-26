# ✅ Testes Pós-Deploy - Render

## 🌐 **URLs para Testar**

Substitua `chabar-vitoria-eder` pelo nome do seu serviço no Render:

### **App Principal**
```
https://chabar-vitoria-eder.onrender.com
```

### **Portal Admin**
```
https://chabar-vitoria-eder.onrender.com/admin
```

### **APIs para Teste**

#### **1. Health Check**
```bash
curl https://chabar-vitoria-eder.onrender.com/api/guests
```

#### **2. Google Sheets Test**
```bash
curl https://chabar-vitoria-eder.onrender.com/api/sheets?action=test
```

#### **3. Inicialização**
```bash
curl -X POST https://chabar-vitoria-eder.onrender.com/api/initialize
```

## 🔍 **O que Verificar**

### **✅ App Principal**
- [ ] Página carrega sem erro
- [ ] Formulário RSVP aparece
- [ ] Design responsivo funcionando

### **✅ Portal Admin**
- [ ] Tela de login aparece
- [ ] Login com: `noivos` / `voucasar2025`
- [ ] Dashboard carrega
- [ ] Lista de convidados aparece
- [ ] Lista de presentes aparece

### **✅ APIs**
- [ ] `/api/guests` retorna array (mesmo vazio)
- [ ] `/api/sheets?action=test` retorna success
- [ ] `/api/initialize` retorna 201

## 🎯 **Teste Completo do Fluxo**

### **1. Teste RSVP (Como Convidado)**
1. Acesse: `https://seu-app.onrender.com`
2. Preencha o formulário:
   - Nome: "João Silva"
   - Confirmação: "Sim, vou comparecer"
   - Acompanhantes: 1
   - Presente: Selecione algum
3. Envie e veja se aparece página de agradecimento

### **2. Verificar no Admin**
1. Acesse: `https://seu-app.onrender.com/admin`
2. Login: `noivos` / `voucasar2025`
3. Verifique se "João Silva" apareceu na lista

### **3. Verificar na Planilha Google**
1. Abra: https://docs.google.com/spreadsheets/d/1QST7YS_OZzU9Cy9X-73Y9XI4O9fcnDISf4u4HADzAPA
2. Aba "Convidados"
3. Veja se João Silva foi salvo

## 🚨 **Se Algo Não Funcionar**

### **Erro 500 (Server Error)**
- Check logs no Render
- Verifique variáveis de ambiente
- Teste Google Sheets API

### **App não carrega**
- Verifique se build terminou
- Check se status é "Live"
- Teste URL básica

### **Google Sheets não funciona**
- Verifique permissões da planilha
- Check se service account tem acesso
- Teste local primeiro

## 📞 **Comandos para Debug**

### **Ver logs em tempo real:**
```bash
# No Render, aba "Logs"
# Ou via API:
curl https://chabar-vitoria-eder.onrender.com/api/sheets?action=debug
```

### **Forçar redeploy:**
- No Render: "Manual Deploy" > "Deploy latest commit"

## 🎉 **Sucesso!**

Se todos os testes passarem:
- ✅ **App funcionando em produção**
- ✅ **Google Sheets salvando dados**
- ✅ **Portal admin acessível**
- ✅ **Fluxo completo funcionando**

---

**🔗 Compartilhe o link do seu app funcionando!**
