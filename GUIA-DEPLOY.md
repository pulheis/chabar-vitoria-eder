# 🚀 Guia de Deploy - Chá Bar Vitória + Éder

## Passo 1: Criar Repositório no GitHub

1. **Acesse**: https://github.com/new
2. **Nome do repositório**: `chabar-vitoria-eder` 
3. **Descrição**: "Aplicação web para confirmação de presença no Chá Bar de Vitória e Éder"
4. **Visibilidade**: Público (para usar o Render gratuito)
5. **NÃO inicialize** com README, .gitignore ou license (já temos)
6. **Clique em "Create repository"**

## Passo 2: Conectar o Repositório Local ao GitHub

Execute estes comandos no terminal:

```bash
# Adicionar o repositório remoto (substitua USERNAME pelo seu usuário GitHub)
git remote add origin https://github.com/USERNAME/chabar-vitoria-eder.git

# Enviar código para o GitHub
git branch -M main
git push -u origin main
```

## Passo 3: Deploy no Render

1. **Acesse**: https://render.com
2. **Faça login** ou crie conta gratuita
3. **Clique em "New +"** > **"Web Service"**
4. **Conecte seu GitHub** e selecione o repositório `chabar-vitoria-eder`

### Configurações do Render:

- **Name**: `chabar-vitoria-eder`
- **Environment**: `Node`
- **Region**: `Ohio (US East)` ou mais próximo
- **Branch**: `main`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free` (suficiente para o projeto)

### Variáveis de Ambiente (se necessário):

- `NODE_ENV=production`

## Passo 4: Finalizar Deploy

1. **Clique em "Create Web Service"**
2. **Aguarde o build** (5-10 minutos)
3. **Acesse a URL** fornecida pelo Render
4. **Teste todas as funcionalidades**

## 📋 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] Web Service criado no Render
- [ ] Build concluído com sucesso
- [ ] Aplicação acessível na internet
- [ ] Formulário de confirmação funcionando
- [ ] Portal administrativo acessível
- [ ] Exportação PDF funcionando
- [ ] Dados sendo persistidos

## 🔗 URLs Importantes

- **GitHub**: https://github.com/USERNAME/chabar-vitoria-eder
- **Render Dashboard**: https://dashboard.render.com
- **App URL**: https://chabar-vitoria-eder.onrender.com (será fornecida)

## 🆘 Resolução de Problemas

### Build Falha
- Verifique se todas as dependências estão no package.json
- Confirme que não há erros de TypeScript

### Aplicação não carrega
- Verifique os logs no Render Dashboard
- Confirme que o comando start está correto

### Persistência de dados
- No Render, dados em `/data` são temporários
- Para produção, considere usar banco de dados externo

---

**🎉 Após o deploy, sua aplicação estará disponível 24/7 na internet!**
