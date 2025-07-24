# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
Este é um projeto Next.js para uma aplicação web de confirmação de presença para o Chá Bar do casal Éder e Vitória.

## Architecture
- **Frontend**: Next.js 14+ com TypeScript e Tailwind CSS
- **Backend**: Sistema de persistência local com arquivos JSON
- **APIs**: Next.js API Routes para manipulação de dados
- **Design**: Mobile-first, responsivo
- **Deployment**: Vercel ou similar

## Key Features
1. **Interface do Convidado (Mobile-First)**:
   - Formulário de confirmação de presença
   - Seleção de presentes ou direcionamento para Preçolandia
   - Campo para mensagem aos noivos
   - Página de agradecimento com links para mapas

2. **Portal Administrativo dos Noivos**:
   - Dashboard com lista de convidados
   - Gerenciamento de presentes
   - Visualização de mensagens
   - Exportação de dados
   - Acesso direto (sem necessidade de login)

3. **Sistema de Persistência Local**:
   - Dados salvos em arquivos JSON na pasta `/data`
   - Inicialização automática na primeira execução
   - Sem necessidade de configuração de banco de dados externo

## Development Guidelines
- Use TypeScript rigorosamente
- Componentes funcionais com hooks
- Tailwind CSS para estilização
- Mobile-first approach
- Acessibilidade (a11y) em mente
- SEO otimizado
- Performance otimizada

## Color Scheme
- Fundo principal: cinza claro (gray-50)
- Elementos de destaque: rosa e tons românticos
- Design moderno e clean
- Boa legibilidade em dispositivos móveis

## File Structure
- `/src/app`: App Router pages
- `/src/app/api`: API Routes para manipulação de dados
- `/src/components`: Componentes reutilizáveis
- `/src/lib`: Utilitários e sistema de persistência local
- `/src/types`: Definições TypeScript
- `/data`: Arquivos JSON para persistência (criado automaticamente)
