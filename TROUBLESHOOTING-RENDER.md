# 🔧 Troubleshooting - Deploy no Render

## Problemas Comuns e Soluções

### ❌ "Module not found: Can't resolve 'firebase/auth'"

**Causa**: Arquivos não utilizados importando dependências Firebase não instaladas

**Solução Aplicada:**
```bash
# Arquivos removidos:
- src/app/setup/
- src/app/configure/  
- src/app/diagnostic/
- src/lib/firebase.ts
- src/lib/firestore.ts
- src/lib/configure-firebase.ts
- src/components/RSVPFormEnhanced.tsx
```

**Status**: ✅ **RESOLVIDO** - Build funcionando!

#### 1. Remoção de Dependências Problemáticas
```bash
npm uninstall canvas qrcode.js
```
- `canvas`: Biblioteca nativa que não funciona no Render
- `qrcode.js`: Conflito com `qrcode`

#### 2. Configuração do Next.js Otimizada
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['jspdf'],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  }
};
```

#### 3. Configurações Recomendadas no Render

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```
NODE_ENV=production
```

### 🚀 Passos para Re-deploy

1. **Atualizar Código:**
```bash
git add .
git commit -m "Fix: Remove problematic dependencies and optimize for Render"
git push origin main
```

2. **Forçar Re-deploy no Render:**
   - Acesse o dashboard do Render
   - Clique em "Manual Deploy"
   - Ou faça um novo commit

### 📋 Checklist de Debug

- [ ] Dependências canvas/qrcode.js removidas
- [ ] next.config.ts atualizado
- [ ] Build local funcionando
- [ ] Código commitado e enviado
- [ ] Re-deploy iniciado no Render

### 🆘 Se Ainda Não Funcionar

1. **Verificar Logs Detalhados:**
   - No Render Dashboard → Logs
   - Procurar por erros específicos

2. **Teste Local:**
```bash
# Simular ambiente de produção
npm run build
npm start
```

3. **Alternativas:**
   - Usar Vercel (mais compatível com Next.js)
   - Usar Netlify
   - Railway

### 📞 Suporte

Se o problema persistir:
1. Copie os logs completos do Render
2. Verifique a documentação: https://render.com/docs/troubleshooting-deploys
3. Considere usar Vercel como alternativa

---

**🎯 Meta: Aplicação funcionando em produção!**
