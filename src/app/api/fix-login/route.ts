import { NextResponse } from 'next/server';
import googleSheetsService from '@/lib/google-sheets';

export async function POST() {
  try {
    // Reinicializar Google Sheets com configurações corretas
    const result = await googleSheetsService.initializeSheets();
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      note: 'Usuários configurados: eder/Noivo!, vitoria/Noiva!, noivos/voucasar2025'
    });
  } catch (error) {
    console.error('Error fixing config:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fix config',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Testar as credenciais atuais
    const testResults = [];
    
    const credentials = [
      { username: 'eder', password: 'Noivo!' },
      { username: 'vitoria', password: 'Noiva!' },
      { username: 'noivos', password: 'voucasar2025' }
    ];
    
    for (const cred of credentials) {
      try {
        const isValid = await googleSheetsService.validateLogin(cred.username, cred.password);
        testResults.push({
          username: cred.username,
          valid: isValid,
          status: isValid ? 'OK' : 'FAIL'
        });
      } catch (error) {
        testResults.push({
          username: cred.username,
          valid: false,
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      message: 'Test results for login credentials',
      results: testResults
    });
  } catch (error) {
    console.error('Error testing config:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to test config',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
