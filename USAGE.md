# Guia de Uso - Chá Bar Éder & Vitória

## 🎯 Para os Convidados

### Confirmando Presença

1. **Acesse o link do convite**: Abra a URL fornecida pelos noivos
2. **Preencha o formulário**:
   - Digite seu nome completo
   - Confirme se estará presente
   - Informe o número de acompanhantes (se houver)
   - Escolha se trará presente ou comprará da lista
   - Deixe uma mensagem carinhosa (opcional)
3. **Envie a confirmação**: Clique no botão "Enviar confirmação"
4. **Receba confirmação**: Você verá uma página de agradecimento com informações do evento

### Navegação Acessível

- **Teclado**: Use Tab para navegar entre campos, Enter/Espaço para botões
- **Leitor de Tela**: Todas as informações são anunciadas corretamente
- **Mobile**: Interface otimizada para toque em dispositivos móveis

## 👰🤵 Para os Noivos

### Acessando o Painel Administrativo

1. **Acesse**: `http://localhost:3000/admin`
2. **Navegue pelas abas**:
   - **Dashboard**: Visão geral com estatísticas
   - **Convidados**: Lista de confirmações
   - **Presentes**: Gerenciamento da lista
   - **Mensagens**: Mensagens dos convidados

### Dashboard
- Visualize estatísticas em tempo real:
  - Total de convidados confirmados
  - Número de pessoas (incluindo acompanhantes)
  - Presentes selecionados
  - Mensagens recebidas

### Gerenciando Convidados
- Veja lista completa de confirmações
- Exporte dados em CSV
- Remova confirmações se necessário

### Gerenciando Presentes
- **Adicionar**: Clique em "Adicionar Presente" e preencha nome/descrição
- **Visualizar**: Veja status (disponível/selecionado)
- **Remover**: Use o ícone de lixeira para excluir

### Visualizando Mensagens
- Leia todas as mensagens carinhosas dos convidados
- Veja data de envio de cada mensagem

## 🔄 Fluxo de Dados

### Como os Dados são Salvos
1. Confirmações são salvas em `/data/guests.json`
2. Presentes são salvos em `/data/gifts.json`
3. Não há necessidade de banco de dados externo

### Backup dos Dados
```bash
# Copie a pasta data para backup
cp -r data backup-$(date +%Y%m%d)

# Ou exporte via painel administrativo (CSV)
```

## 📱 Compartilhamento

### Para Compartilhar o Convite

1. **Link Direto**: Compartilhe `http://localhost:3000`
2. **QR Code**: Acesse `http://localhost:3000/share` para gerar QR Code
3. **Redes Sociais**: Use o link direto em WhatsApp, Instagram, etc.

## 🛠️ Comandos Úteis

```bash
# Executar aplicação
npm run dev

# Construir para produção
npm run build

# Executar em produção
npm start

# Resetar dados (apaga tudo)
rm -rf data/

# Ver logs em tempo real
tail -f .next/server.log
```

## 🆘 Solução de Problemas

### Problema: Dados não estão salvando
**Solução**: Verifique se a pasta `data` tem permissões de escrita

### Problema: Erro ao carregar presentes
**Solução**: Acesse `/api/initialize` via POST para recriar lista padrão

### Problema: Layout quebrado no mobile
**Solução**: Limpe cache do navegador (Ctrl+F5)

### Problema: QR Code não carrega
**Solução**: Verifique se todas as dependências estão instaladas (`npm install`)

## 💡 Dicas

### Para Melhor Experiência:
- **Mobile**: Teste sempre em dispositivos móveis reais
- **Acessibilidade**: Teste com Tab e leitores de tela
- **Performance**: Use `npm run build` para versão otimizada
- **Backup**: Faça backup da pasta `data` regularmente

### Personalização:
- Cores: Edite `src/app/globals.css`
- Textos: Modifique os componentes em `src/components/`
- Presentes padrão: Edite `src/lib/file-storage.ts`

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no terminal
2. Consulte a documentação de acessibilidade
3. Teste em navegador diferente
4. Reinicie a aplicação (`Ctrl+C` e `npm run dev`)

---

**Aproveitem o Chá Bar! 🎉**
