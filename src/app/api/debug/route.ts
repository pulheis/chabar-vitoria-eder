import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Debug das variáveis de ambiente
    const envCheck = {
      hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
      privateKeyLength: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.length || 0,
      clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.substring(0, 20) + '...',
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID?.substring(0, 20) + '...',
      nodeEnv: process.env.NODE_ENV,
      // Verificar se a lógica de detecção funciona
      useGoogleSheets: !!(process.env.GOOGLE_SHEETS_PRIVATE_KEY && 
                         process.env.GOOGLE_SHEETS_CLIENT_EMAIL && 
                         process.env.GOOGLE_SPREADSHEET_ID)
    };

    return NextResponse.json({
      message: 'Environment Debug Info',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
