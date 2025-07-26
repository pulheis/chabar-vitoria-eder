import { NextRequest, NextResponse } from 'next/server';
import * as storage from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'test':
        const stats = await storage.getStats();
        return NextResponse.json({
          success: true,
          message: `Sistema funcionando! Usando: ${stats.storageType}`,
          data: stats
        });

      case 'migrate':
        const result = await storage.migrateToGoogleSheets();
        return NextResponse.json(result);

      case 'init':
        const initResult = await storage.initializeDefaultGifts();
        return NextResponse.json(initResult);

      default:
        return NextResponse.json({
          success: false,
          message: 'Ação não especificada. Use: ?action=test, ?action=migrate ou ?action=init'
        });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Erro: ${error}`,
      error: String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, username, password } = await request.json();

    if (action === 'test-login') {
      const isValid = await storage.validateLogin(username, password);
      return NextResponse.json({
        success: isValid,
        message: isValid ? 'Login válido!' : 'Credenciais inválidas'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Ação POST não reconhecida'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Erro: ${error}`
    }, { status: 500 });
  }
}
