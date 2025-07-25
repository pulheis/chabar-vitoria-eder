import { NextResponse } from 'next/server';
import { getAdminCredentials } from '@/lib/sheets-storage';

export async function GET() {
  try {
    const credentials = await getAdminCredentials();
    
    if (!credentials) {
      return NextResponse.json({ error: 'Admin credentials not found' }, { status: 404 });
    }

    return NextResponse.json(credentials);
  } catch (error) {
    console.error('Error reading admin credentials:', error);
    // Fallback para credenciais hardcoded em caso de erro
    return NextResponse.json({
      username: 'noivos',
      password: 'voucasar2025'
    });
  }
}