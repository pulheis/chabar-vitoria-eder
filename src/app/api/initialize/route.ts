import { NextResponse } from 'next/server';
import { initializeDefaultGifts } from '@/lib/sheets-storage';

export async function POST() {
  try {
    const result = await initializeDefaultGifts();
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error initializing gifts:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to initialize gifts' 
    }, { status: 500 });
  }
}
