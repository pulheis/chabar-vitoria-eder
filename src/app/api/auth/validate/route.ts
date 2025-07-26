import { NextRequest, NextResponse } from 'next/server';
import { validateLogin } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { valid: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Usar a função de validação que consulta Google Sheets
    const isValid = await validateLogin(username.toLowerCase(), password);

    return NextResponse.json({
      valid: isValid,
      message: isValid ? 'Login successful' : 'Invalid credentials'
    });

  } catch (error) {
    console.error('Error validating login:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
