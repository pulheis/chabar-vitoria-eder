# Chá Bar - Éder & Vitória

Aplicação web para confirmação de presença do Chá Bar do casal Éder e Vitória, desenvolvida com Next.js 14, TypeScript, Tailwind CSS e persistência em arquivos locais.

## ✨ Principais Características

- 🎯 **Mobile-First**: Design responsivo otimizado para dispositivos móveis
- ♿ **Totalmente Acessível**: Seguindo padrões WCAG 2.1 AA
- 🏠 **Persistência Local**: Dados armazenados em arquivos JSON (sem necessidade de banco de dados)
- ⚡ **Performance**: Aplicação rápida e otimizada
- 🎨 **Design Elegante**: Interface moderna com cores românticas

## 🌟 Acessibilidade

Este projeto foi desenvolvido com foco em acessibilidade, incluindo:

- ✅ **Navegação por Teclado**: Suporte completo para navegação sem mouse
- ✅ **Leitores de Tela**: Compatível com NVDA, VoiceOver e Orca
- ✅ **Alto Contraste**: Suporte para modo de alto contraste
- ✅ **Validação Acessível**: Mensagens de erro claras e anunciadas
- ✅ **Semântica HTML**: Estrutura correta com roles ARIA
- ✅ **Foco Visível**: Indicadores claros de foco para navegação por teclado

📖 **[Ver documentação completa de acessibilidade](ACCESSIBILITY.md)**

## 🚀 Funcionalidades

### Interface do Convidado (Mobile-First)
- ✅ Formulário de confirmação de presença
- ✅ Seleção de número de acompanhantes
- ✅ Escolha de presentes da lista personalizada
- ✅ Link e QR Code para lista da Preçolandia
- ✅ Campo para mensagem aos noivos
- ✅ Página de agradecimento com localização e mapas

### Portal Administrativo dos Noivos
- ✅ Dashboard com estatísticas gerais
- ✅ Lista completa de convidados confirmados
- ✅ Gerenciamento de presentes (adicionar, editar, excluir)
- ✅ Visualização de mensagens dos convidados
- ✅ Exportação de dados em CSV

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Persistência**: Arquivos JSON locais
- **APIs**: Next.js API Routes
- **Icons**: Lucide React
- **QR Code**: qrcode.js
- **Notifications**: React Hot Toast
- **Acessibilidade**: WCAG 2.1 AA, ARIA, Semantic HTML

## 📋 Pré-requisitos

- Node.js 18+ instalado

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd chabarve
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute a aplicação
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🗂️ Estrutura de Dados

Os dados são automaticamente armazenados em arquivos JSON na pasta `/data`:

- `guests.json`: Confirmações de presença dos convidados
- `gifts.json`: Lista de presentes disponíveis

### Inicialização Automática
- Na primeira execução, uma lista padrão de presentes será criada automaticamente
- Não é necessário configurar banco de dados ou serviços externos
- Os dados são salvos localmente em arquivos JSON

### 4. Execute o projeto
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📱 Como usar

### Para os Convidados
1. Acesse a URL principal
2. Preencha o formulário de confirmação
3. Escolha se vai levar presente pessoalmente ou comprar da lista externa
4. Deixe uma mensagem (opcional)
5. Confirme e receba as informações do evento

### Para os Noivos
1. Acesse `/admin`
2. Visualize o dashboard com estatísticas
3. Gerencie a lista de presentes
4. Veja confirmações e mensagens dos convidados
5. Exporte dados quando necessário

## 🎨 Personalização

### Cores do tema
O projeto usa uma paleta elegante com fundo cinza claro e detalhes em rosa. Para alterar:
- Edite as classes Tailwind em `src/app/page.tsx` e componentes
- As cores principais são: `gray-50`, `pink-500`, `pink-600`, `rose-100`

### Informações do evento
Para atualizar data, horário e local:
- Edite `src/app/page.tsx` (seção header)
- Edite `src/components/RSVPFormSimple.tsx` (página de agradecimento)

### Link da Preçolandia
Atualize a variável `precolandiaUrl` em `src/components/RSVPFormSimple.tsx`

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Deploy automático a cada commit
3. A pasta `/data` será criada automaticamente no primeiro uso

### Outros provedores
- Netlify
- Railway
- Qualquer provedor que suporte Node.js

**Nota**: Certifique-se de que o provedor permite escrita de arquivos para persistência dos dados.

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── admin/           # Portal administrativo
│   ├── api/             # Rotas de API para manipulação de dados
│   ├── share/           # Página de compartilhamento com QR Code
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página inicial (convidados)
├── components/
│   ├── RSVPFormSimple.tsx  # Formulário de confirmação
│   ├── QRCodeDisplay.tsx   # Componente de QR Code
│   └── LoadingSpinner.tsx  # Componente de loading
├── lib/
│   └── file-storage.ts  # Sistema de persistência local
├── types/
│   └── index.ts         # Tipos TypeScript
└── data/
    ├── guests.json      # Dados dos convidados (criado automaticamente)
    └── gifts.json       # Lista de presentes (criado automaticamente)
```

## 💾 Estrutura dos dados

### Arquivo: `data/guests.json`
```json
{
  "name": "string",
  "isAttending": "boolean",
  "companions": "number",
  "willBuyFromStore": "boolean",
  "willlBringGift": "boolean",
  "selectedGift": "string",
  "message": "string",
  "createdAt": "string"
}
```

### Arquivo: `data/gifts.json`
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "isAvailable": "boolean",
  "selectedBy": "string",
  "createdAt": "string"
}
```

## 🎯 Data do evento

**23 de agosto de 2025, às 13h**  
**Local**: 8RGC+6G Puris, Ibiúna - SP

## 💙 Feito com amor para Éder & Vitória

---

Para dúvidas ou suporte, entre em contato com os desenvolvedores.
