# 🔐 Sistema de Login Atualizado - Portal dos Noivos

## ✅ Implementação Concluída

O sistema de autenticação foi **completamente migrado** para usar **Google Sheets** como fonte de dados, removendo credenciais hardcoded e permitindo múltiplos usuários.

## 👥 Novos Usuários

| **Usuário** | **Senha** | **Descrição** |
|-------------|-----------|---------------|
| `Eder`      | `Noivo!`  | Acesso do noivo |
| `Vitoria`   | `Noiva!`  | Acesso da noiva |

## 🔧 Como Funciona

### 1. **Autenticação via Google Sheets**
- **Aba:** "Configurações" na planilha
- **Consulta:** Username/password em tempo real
- **Vantagens:** Dados centralizados, editáveis pelos noivos

### 2. **Fallback Local**
- Se Google Sheets não estiver disponível
- Usa as mesmas credenciais (`Eder/Noivo!` e `Vitoria/Noiva!`)
- Garante funcionamento offline

### 3. **Case-Insensitive**
- Aceita `eder`, `Eder`, `EDER`
- Aceita `vitoria`, `Vitoria`, `VITORIA`
- Senhas são case-sensitive: `Noivo!` e `Noiva!`

## 📋 Estrutura da Planilha

### Aba "Configurações"
```
A1: username | B1: password | C1: created_at
A2: Eder     | B2: Noivo!   | C2: [timestamp]
A3: Vitoria  | B3: Noiva!   | C3: [timestamp]
```

## 🛠️ Implementação Técnica

### API de Validação
- **Endpoint:** `/api/auth/validate`
- **Método:** POST
- **Body:** `{"username": "Eder", "password": "Noivo!"}`
- **Response:** `{"valid": true, "message": "Login successful"}`

### Fluxo de Autenticação
1. LoginForm envia dados para `/api/auth/validate`
2. API consulta Google Sheets (aba "Configurações")
3. Se Google Sheets falhar, usa fallback local
4. Retorna resultado da validação
5. Se válido, salva sessão no localStorage

## 🧪 Testando

### Via Interface
1. Acesse: `http://localhost:3000/admin`
2. Teste: `Eder` / `Noivo!`
3. Teste: `Vitoria` / `Noiva!`

### Via Script
```bash
./test-sheets.sh
```

### Via cURL
```bash
# Testar Eder
curl -X POST http://localhost:3000/api/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"username":"Eder","password":"Noivo!"}'

# Testar Vitoria
curl -X POST http://localhost:3000/api/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"username":"Vitoria","password":"Noiva!"}'
```

## ✅ Melhorias Implementadas

### Antes
- ❌ Usuário único: `noivos`
- ❌ Senha hardcoded no código
- ❌ Não personalizável

### Depois
- ✅ Dois usuários: `Eder` e `Vitoria`
- ✅ Senhas na planilha Google Sheets
- ✅ Editável pelos noivos
- ✅ Fallback para funcionamento offline
- ✅ Case-insensitive para usernames
```

## Como Funciona
- O método `.toLowerCase()` converte o texto digitado para minúsculas antes da comparação
- Isso permite que qualquer combinação funcione:
  - ✅ `admin` (original)
  - ✅ `ADMIN` (maiúsculas)
  - ✅ `Admin` (primeira letra maiúscula)
  - ✅ `AdMiN` (misturado)

## Credenciais Válidas
Agora aceitam todas essas variações:

| Usuário | Senha | Status |
|---------|-------|--------|
| admin | voucasar2025! | ✅ |
| ADMIN | voucasar2025! | ✅ |
| Admin | voucasar2025! | ✅ |
| AdMiN | voucasar2025! | ✅ |

**Importante:** A senha continua case-sensitive (deve ser exatamente `voucasar2025!`)

## Teste
1. Acesse: http://localhost:3001/admin
2. Teste com diferentes variações:
   - Usuário: `ADMIN` / Senha: `voucasar2025!`
   - Usuário: `Admin` / Senha: `voucasar2025!`
   - Usuário: `admin` / Senha: `voucasar2025!`

## Benefícios
- ✅ Mais flexibilidade para o usuário
- ✅ Reduz erros de digitação relacionados ao Caps Lock
- ✅ Experiência de usuário melhorada
- ✅ Mantém segurança (senha continua case-sensitive)

## Data da Implementação
24 de julho de 2025 - 17:45
