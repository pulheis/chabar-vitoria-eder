# Google Sheets Integration - Guia de Configuração

Este projeto foi migrado para usar Google Sheets como sistema de persistência de dados, substituindo os arquivos JSON locais. Isso oferece maior segurança, backup automático e controle de acesso.

## 🚀 Benefícios da Migração

- **Segurança**: Dados não ficam expostos no código
- **Backup automático**: Google cuida do backup
- **Controle de acesso**: Proprietário controla quem acessa
- **Colaboração**: Noivos podem ver dados em tempo real
- **Histórico**: Rastreamento de mudanças

## 📋 Pré-requisitos

1. Conta Google
2. Google Cloud Console com Google Sheets API habilitada
3. Service Account configurado

## ⚙️ Configuração Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Library"
4. Procure por "Google Sheets API" e ative

### 2. Criar Service Account

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "Service Account"
3. Preencha os detalhes do Service Account
4. Baixe o arquivo JSON com as credenciais

### 3. Criar Planilha do Google Sheets

1. Crie uma nova planilha no Google Sheets
2. Compartilhe a planilha com o email do Service Account (com permissão de editor)
3. Copie o ID da planilha da URL (entre `/d/` e `/edit`)

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Google Sheets API Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="seu-service-account@seu-projeto.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="1abc123def456ghi789jkl0mn_exemplo"

# Configuração de Cache (opcional)
SHEETS_CACHE_TTL_SECONDS=300
SHEETS_BATCH_SIZE=100

# Configuração de Retry (opcional)
SHEETS_MAX_RETRIES=3
SHEETS_RETRY_DELAY_MS=1000
```

**Importante**: Substitua `\n` por quebras de linha reais na chave privada.

## 🔄 Migração de Dados

### Inicialização das Planilhas

Antes de usar o sistema, inicialize as planilhas:

```bash
curl -X POST http://localhost:3000/api/admin/initialize
```

Isso criará as abas necessárias:
- **Config**: Credenciais de admin
- **Convidados**: Lista de convidados
- **Presentes**: Lista de presentes

### Migração dos Dados Existentes

Para migrar dados dos arquivos JSON locais:

```bash
curl -X POST http://localhost:3000/api/admin/migrate \
  -H "Content-Type: application/json" \
  -d '{"sourceType": "local"}'
```

Para migrar dados específicos:

```bash
curl -X POST http://localhost:3000/api/admin/migrate \
  -H "Content-Type: application/json" \
  -d '{
    "sourceType": "data",
    "guests": [...],
    "gifts": [...]
  }'
```

## 📊 Estrutura das Planilhas

### Aba "Config"
| username | password |
|----------|----------|
| noivos   | voucasar2025 |

### Aba "Convidados"
| id | name | rg | licensePlate | isAttending | companions | willBringGift | selectedGift | selectedGifts | message | createdAt |
|----|------|----|--------------|-----------|-----------|--------------|--------------|--------------|---------|-----------| 

### Aba "Presentes"
| id | name | description | isAvailable | selectedBy | category | createdAt |
|----|------|-------------|-------------|------------|----------|-----------|

## 🔧 APIs Disponíveis

### Credenciais de Admin
- `GET /api/admin/credentials` - Buscar credenciais do admin

### Inicialização
- `POST /api/admin/initialize` - Inicializar planilhas
- `POST /api/admin/migrate` - Migrar dados

### Convidados
- `GET /api/guests` - Listar convidados
- `POST /api/guests` - Adicionar convidado
- `PUT /api/guests?id=X` - Atualizar convidado
- `DELETE /api/guests?id=X` - Deletar convidado

### Presentes
- `GET /api/gifts` - Listar presentes
- `GET /api/gifts?available=true` - Listar presentes disponíveis
- `POST /api/gifts` - Adicionar presente
- `PUT /api/gifts` - Atualizar presente
- `DELETE /api/gifts` - Deletar presente

### Outros
- `GET /api/stats` - Estatísticas
- `GET /api/export` - Exportar para PDF

## 🚦 Sistema de Cache

O sistema implementa cache em memória para otimizar performance:

- **TTL padrão**: 5 minutos (configurável via `SHEETS_CACHE_TTL_SECONDS`)
- **Invalidação automática**: Cache é limpo após operações de escrita
- **Fallback**: Em caso de erro, utiliza credenciais hardcoded

## 🔄 Sistema de Retry

Para lidar com possíveis falhas temporárias da API do Google Sheets:

- **Tentativas**: 3 tentativas por padrão (configurável via `SHEETS_MAX_RETRIES`)
- **Delay**: 1 segundo entre tentativas (configurável via `SHEETS_RETRY_DELAY_MS`)
- **Backoff**: Delay fixo entre tentativas

## 🛡️ Fallback e Segurança

- **Fallback de credenciais**: Se não conseguir acessar o Google Sheets, usa credenciais hardcoded
- **Validação de dados**: Sanitização de inputs antes de salvar
- **Rate limiting**: Implementado via cache para evitar excesso de requisições
- **Logs**: Operações sensíveis são registradas nos logs

## 🐛 Troubleshooting

### Erro de Autenticação
- Verifique se a chave privada está correta (incluindo quebras de linha)
- Confirme se o Service Account tem acesso à planilha
- Verifique se a Google Sheets API está habilitada

### Erro "Spreadsheet not found"
- Confirme se o `GOOGLE_SHEETS_SPREADSHEET_ID` está correto
- Verifique se a planilha está compartilhada com o Service Account

### Performance Lenta
- Ajuste `SHEETS_CACHE_TTL_SECONDS` para um valor maior
- Considere reduzir `SHEETS_BATCH_SIZE` se estiver fazendo muitas operações

### Dados não Aparecem
- Execute `POST /api/admin/initialize` para criar as abas
- Verifique se os dados foram migrados com `POST /api/admin/migrate`

## 📝 Notas de Desenvolvimento

- Todas as operações são assíncronas (`async/await`)
- Interface idêntica às funções de `file-storage.ts` para compatibilidade
- Sistema de tipos TypeScript mantido
- Testes devem usar dados mock ou planilha de teste

## 🔗 Links Úteis

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Service Account Setup Guide](https://cloud.google.com/iam/docs/creating-managing-service-accounts)