# 🔄 Migração para Google Sheets - Implementação Completa

## ✅ O que foi Implementado

### 📦 Dependências Adicionadas
- `googleapis` v144.0.0 - Cliente oficial do Google para Node.js

### 🗂️ Novos Arquivos Criados

#### 1. Sistema de Armazenamento
- **`src/lib/sheets-storage.ts`** - Substitui completamente `file-storage.ts`
  - Autenticação com Service Account
  - Cache em memória com TTL configurável
  - Sistema de retry automático
  - Funções idênticas às originais para compatibilidade total

#### 2. APIs de Administração
- **`src/app/api/admin/credentials/route.ts`** - Busca credenciais dinamicamente
- **`src/app/api/admin/initialize/route.ts`** - Inicializa planilhas do Google Sheets
- **`src/app/api/admin/migrate/route.ts`** - Migra dados existentes

#### 3. Configuração
- **`.env.example`** - Template com todas as variáveis necessárias
- **`GOOGLE-SHEETS-SETUP.md`** - Guia completo de configuração

### 🔄 Arquivos Modificados

#### APIs Atualizadas (todas async agora)
- `src/app/api/guests/route.ts` - Convidados via Google Sheets
- `src/app/api/gifts/route.ts` - Presentes via Google Sheets  
- `src/app/api/stats/route.ts` - Estatísticas via Google Sheets
- `src/app/api/export/route.ts` - Exportação via Google Sheets
- `src/app/api/initialize/route.ts` - Inicialização via Google Sheets

#### Componentes
- `src/components/LoginForm.tsx` - Busca credenciais dinamicamente do Google Sheets

#### Configuração
- `package.json` - Dependência googleapis adicionada

## 🏗️ Arquitetura Implementada

### 📊 Estrutura do Google Sheets

```
Planilha Principal
├── Config (aba)
│   ├── username | password
│   └── noivos   | voucasar2025
├── Convidados (aba)
│   ├── id | name | rg | licensePlate | isAttending | companions | willBringGift | selectedGift | selectedGifts | message | createdAt
├── Presentes (aba)
│   ├── id | name | description | isAvailable | selectedBy | category | createdAt
└── Mensagens (aba) - preparado para futuro uso
```

### 🔧 Sistema de Cache

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache em memória com TTL
- TTL padrão: 5 minutos
- Invalidação automática após escrita
- Chaves: 'guests', 'gifts', 'admin-credentials'
```

### 🔄 Sistema de Retry

```typescript
// Configuração padrão
MAX_RETRIES = 3
RETRY_DELAY = 1000ms
EXPONENTIAL_BACKOFF = false (delay fixo)
```

## 🔐 Segurança Implementada

### 1. **Fallback de Credenciais**
```typescript
// Se Google Sheets falhar, usa hardcoded
const fallbackCredentials = {
  username: 'noivos',
  password: 'voucasar2025'
}
```

### 2. **Validação de Environment Variables**
```typescript
if (!PRIVATE_KEY || !CLIENT_EMAIL || !SPREADSHEET_ID) {
  console.error('Google Sheets environment variables not configured');
}
```

### 3. **Error Handling Robusto**
- Try/catch em todas as operações
- Logs detalhados de erros
- Responses HTTP apropriados
- Fallback para modo local em caso de falha

## 🚀 Como Testar a Implementação

### 1. **Configuração Inicial**

```bash
# 1. Copiar template de environment
cp .env.example .env.local

# 2. Configurar credenciais do Google Sheets no .env.local
# (seguir GOOGLE-SHEETS-SETUP.md)

# 3. Instalar dependências
npm install
```

### 2. **Inicialização**

```bash
# Inicializar planilhas (criar abas e estrutura)
curl -X POST http://localhost:3000/api/admin/initialize
```

### 3. **Migração de Dados**

```bash
# Migrar dados dos arquivos JSON locais
curl -X POST http://localhost:3000/api/admin/migrate \
  -H "Content-Type: application/json" \
  -d '{"sourceType": "local"}'
```

### 4. **Testar APIs**

```bash
# Buscar credenciais de admin
curl http://localhost:3000/api/admin/credentials

# Listar convidados
curl http://localhost:3000/api/guests

# Listar presentes
curl http://localhost:3000/api/gifts

# Estatísticas
curl http://localhost:3000/api/stats

# Adicionar convidado
curl -X POST http://localhost:3000/api/guests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "isAttending": true,
    "companions": 1,
    "willBringGift": true,
    "selectedGifts": []
  }'
```

### 5. **Testar Interface**

```bash
# Iniciar servidor
npm run dev

# Testar login (deve buscar credenciais do Google Sheets)
# Acessar: http://localhost:3000/admin
```

## 🔍 Verificações de Funcionamento

### ✅ Checklist de Teste

- [ ] **Autenticação**: Login funciona com credenciais do Google Sheets
- [ ] **CRUD Convidados**: Criar, ler, atualizar, deletar convidados
- [ ] **CRUD Presentes**: Criar, ler, atualizar, deletar presentes
- [ ] **Cache**: Verificar performance com cache ativo
- [ ] **Fallback**: Testar com credenciais inválidas (deve usar fallback)
- [ ] **Retry**: Simular falha temporária da API
- [ ] **Migração**: Verificar se dados locais são migrados corretamente
- [ ] **Interface**: Login e portal admin funcionam normalmente

### 🔧 Debug de Problemas

```bash
# Verificar logs do servidor
npm run dev

# Verificar autenticação
curl -v http://localhost:3000/api/admin/credentials

# Verificar se planilhas foram criadas
# (acessar Google Sheets manualmente)

# Verificar cache
# (observar logs no terminal - cache hits/misses)
```

## 📈 Performance Esperada

### Sem Cache (primeira chamada)
- **Latência**: 200-500ms por operação
- **Rate Limits**: 300 requests/min (Google Sheets API)

### Com Cache (chamadas subsequentes)
- **Latência**: 1-5ms por operação
- **TTL**: 5 minutos (configurável)

### Batch Operations
- **Tamanho**: 100 operações por batch (configurável)
- **Otimização**: Reduz calls da API para operações múltiplas

## 🔗 Endpoints Implementados

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| GET | `/api/admin/credentials` | Credenciais admin | ✅ |
| POST | `/api/admin/initialize` | Inicializar planilhas | ✅ |
| POST | `/api/admin/migrate` | Migrar dados | ✅ |
| GET | `/api/guests` | Listar convidados | ✅ |
| POST | `/api/guests` | Criar convidado | ✅ |
| PUT | `/api/guests?id=X` | Atualizar convidado | ✅ |
| DELETE | `/api/guests?id=X` | Deletar convidado | ✅ |
| GET | `/api/gifts` | Listar presentes | ✅ |
| GET | `/api/gifts?available=true` | Presentes disponíveis | ✅ |
| POST | `/api/gifts` | Criar presente | ✅ |
| PUT | `/api/gifts` | Atualizar presente | ✅ |
| DELETE | `/api/gifts` | Deletar presente | ✅ |
| GET | `/api/stats` | Estatísticas | ✅ |
| GET | `/api/export` | Exportar PDF | ✅ |

## 🎯 Próximos Passos

### Para Produção
1. **Configurar variáveis de ambiente** no serviço de hosting
2. **Criar Service Account** no Google Cloud
3. **Executar migração** dos dados existentes
4. **Testar todas as funcionalidades** em produção
5. **Monitorar performance** e ajustar cache se necessário

### Melhorias Futuras
- [ ] Implementar webhook para sync em tempo real
- [ ] Adicionar compressão de dados para performance
- [ ] Implementar audit log das operações
- [ ] Adicionar backup automático dos dados
- [ ] Dashboard de métricas de uso da API