# 🔐 Configuração do Portal Administrativo

## Credenciais Sugeridas para os Noivos:

**Email:** `eder.vitoria@chabar.com`  
**Senha:** `ChaBar2025!`

## Passos para Configuração:

### 1. Configure o Firebase:
1. Acesse https://console.firebase.google.com
2. Crie um novo projeto chamado "chabar-eder-vitoria"
3. Ative Firestore Database (modo teste)
4. Ative Authentication com Email/Password

### 2. Obtenha as credenciais:
1. Vá para Project Settings (ícone da engrenagem)
2. Na aba "General", role até "Your apps"
3. Clique em "Web" para adicionar um app web
4. Copie as credenciais do Firebase Config

### 3. Atualize o .env.local:
Substitua os valores placeholder pelas credenciais reais do Firebase

### 4. Crie o usuário administrativo:
1. No Firebase Console → Authentication → Users
2. Clique "Add user"
3. Email: eder.vitoria@chabar.com
4. Senha: ChaBar2025!

### 5. Teste o acesso:
1. Acesse http://localhost:3001/admin
2. Faça login com as credenciais criadas
3. Você verá o dashboard administrativo

## 🎯 URLs da Aplicação:

- **Página dos Convidados:** http://localhost:3001
- **Portal Administrativo:** http://localhost:3001/admin

## 🚀 Deploy (Opcional):

Para hospedar a aplicação:
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente no Vercel
3. Deploy automático

## 📞 Suporte:

Se precisar de ajuda com a configuração, documente os erros encontrados para resolução.
