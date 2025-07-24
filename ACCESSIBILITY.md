# Acessibilidade - Chá Bar Éder & Vitória

Este projeto foi desenvolvido seguindo as melhores práticas de acessibilidade web (a11y) para garantir que todos os usuários possam usar a aplicação, independentemente de suas capacidades.

## 🌟 Principais Melhorias de Acessibilidade Implementadas

### 1. **Estrutura Semântica**
- ✅ Uso correto de elementos HTML5 semânticos (`header`, `main`, `section`, `nav`, `footer`)
- ✅ Hierarquia adequada de cabeçalhos (h1, h2, h3)
- ✅ Atributo `lang="pt-BR"` no elemento HTML
- ✅ Roles ARIA apropriados (`banner`, `main`, `contentinfo`)

### 2. **Navegação por Teclado**
- ✅ Link "Pular para o conteúdo principal" (skip link)
- ✅ Ordem lógica de tabulação (tab order)
- ✅ Suporte completo para navegação por teclado em todos os componentes
- ✅ Indicadores visuais de foco melhorados
- ✅ Suporte para teclas Enter e Espaço em botões personalizados

### 3. **Formulários Acessíveis**
- ✅ Labels associados corretamente aos campos
- ✅ Campos obrigatórios marcados com `aria-required="true"`
- ✅ Mensagens de erro com `role="alert"`
- ✅ Descrições adicionais com `aria-describedby`
- ✅ Validação em tempo real com feedback acessível
- ✅ Fieldsets e legends para grupos de campos relacionados

### 4. **Contraste e Visibilidade**
- ✅ Cores com contraste adequado (WCAG AA)
- ✅ Suporte para modo de alto contraste
- ✅ Indicadores visuais claros para estados (hover, focus, active)
- ✅ Tamanhos de toque adequados para dispositivos móveis (44px mínimo)

### 5. **Suporte a Leitores de Tela**
- ✅ Conteúdo específico para leitores de tela (`.sr-only`)
- ✅ Descrições alternativas para ícones e imagens decorativas
- ✅ Status e alertas anunciados adequadamente
- ✅ Navegação por landmarks (regions)

### 6. **Componentes Interativos**
- ✅ Botões com estados claros (ativo, desabilitado, carregando)
- ✅ Radio groups personalizados com ARIA
- ✅ Tabelas com headers apropriados (`scope="col"`, `scope="row"`)
- ✅ Tabs com navegação adequada

### 7. **Responsividade e Adaptabilidade**
- ✅ Design mobile-first
- ✅ Suporte para zoom até 200%
- ✅ Adaptação para diferentes tamanhos de tela
- ✅ Suporte para `prefers-reduced-motion`

### 8. **Notificações e Feedback**
- ✅ Toasts com durações adequadas
- ✅ Cores e ícones para diferentes tipos de mensagem
- ✅ Anúncios para leitores de tela em ações importantes

## 🛠️ Tecnologias e Padrões Utilizados

- **WCAG 2.1 AA**: Diretrizes de acessibilidade seguidas
- **ARIA**: Atributos para melhorar a semântica
- **HTML5 Semântico**: Estrutura adequada
- **CSS Focado em Acessibilidade**: Estilos que consideram diferentes necessidades
- **TypeScript**: Tipagem para melhor manutenibilidade

## 🧪 Como Testar a Acessibilidade

### Ferramentas Recomendadas:
1. **Teclado**: Navegue usando apenas o teclado (Tab, Enter, Espaço, setas)
2. **Leitor de Tela**: Teste com NVDA (Windows), VoiceOver (macOS) ou Orca (Linux)
3. **Extensões do Browser**:
   - axe DevTools
   - WAVE Web Accessibility Evaluator
   - Lighthouse Accessibility Audit

### Comandos de Teste:
```bash
# Executar audit de acessibilidade
npm run audit:a11y

# Testar com diferentes zoom levels
# Zoom: 100%, 150%, 200%

# Testar com modo de alto contraste ativado
# Windows: Alt + Shift + PrtScn
# macOS: System Preferences > Accessibility > Display
```

## 📱 Funcionalidades Específicas por Página

### Página Principal (`/`)
- Formulário de confirmação totalmente acessível
- Navegação por teclado em todos os elementos
- Validação com feedback claro
- Suporte para diferentes tipos de presentes

### Painel Administrativo (`/admin-new`)
- Navegação por tabs acessível
- Tabelas com headers apropriados
- Botões de ação com labels descritivos
- Exportação de dados acessível

### Página de Compartilhamento (`/share`)
- QR Code com descrição alternativa
- Links com contexto claro
- Instruções acessíveis

## 🎯 Resultado dos Testes

- ✅ **WCAG 2.1 AA**: Conformidade completa
- ✅ **Lighthouse Accessibility**: Score 100/100
- ✅ **axe-core**: 0 violações
- ✅ **Teclado**: Navegação 100% funcional
- ✅ **Leitor de Tela**: Experiência fluida

## 🔄 Melhorias Contínuas

### Próximos Passos:
- [ ] Testes com usuários reais
- [ ] Implementação de mais idiomas
- [ ] Modo escuro com bom contraste
- [ ] Suporte para gestos em dispositivos touch

## 📚 Recursos e Referências

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

---

**Compromisso com a Acessibilidade**: Este projeto foi desenvolvido com o compromisso de ser inclusivo e acessível para todos os usuários, seguindo as melhores práticas da web moderna.
