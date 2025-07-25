import { NextResponse } from 'next/server';
import { initializeGoogleSheets } from '@/lib/sheets-storage';

export async function POST() {
  try {
    const result = await initializeGoogleSheets();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Failed to initialize Google Sheets: ${error}` 
    }, { status: 500 });
  }
}