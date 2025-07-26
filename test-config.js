console.log('🧪 Testando configuração Google Sheets...');

// Verificar se as variáveis estão definidas
const hasPrivateKey = !!process.env.GOOGLE_SHEETS_PRIVATE_KEY;
const hasClientEmail = !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const hasSpreadsheetId = !!process.env.GOOGLE_SPREADSHEET_ID;

console.log('✅ Configurações:');
console.log(`   - Private Key: ${hasPrivateKey ? '✅ Configurada' : '❌ Não encontrada'}`);
console.log(`   - Client Email: ${hasClientEmail ? '✅ Configurada' : '❌ Não encontrada'}`);
console.log(`   - Spreadsheet ID: ${hasSpreadsheetId ? '✅ Configurada' : '❌ Não encontrada'}`);

if (hasSpreadsheetId) {
  console.log(`   - ID da Planilha: ${process.env.GOOGLE_SPREADSHEET_ID}`);
}

if (hasClientEmail) {
  console.log(`   - Email: ${process.env.GOOGLE_SHEETS_CLIENT_EMAIL}`);
}

const allConfigured = hasPrivateKey && hasClientEmail && hasSpreadsheetId;
console.log('');
console.log(`🎯 Status: ${allConfigured ? '✅ GOOGLE SHEETS CONFIGURADO!' : '❌ Configuração incompleta'}`);

if (allConfigured) {
  console.log('🚀 Sistema detectará automaticamente o Google Sheets');
  console.log('📊 Dados serão salvos na planilha da nuvem');
} else {
  console.log('📁 Sistema usará arquivos locais como fallback');
}

console.log('');
console.log('🔗 Planilha: https://docs.google.com/spreadsheets/d/1QST7YS_OZzU9Cy9X-73Y9XI4O9fcnDISf4u4HADzAPA/');
console.log('✅ Teste de configuração concluído!');
