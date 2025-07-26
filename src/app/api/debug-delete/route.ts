import { NextRequest, NextResponse } from 'next/server';
import { getGuests, deleteGuest } from '@/lib/storage';

export async function GET() {
  try {
    const guests = await getGuests();
    return NextResponse.json({
      message: 'Debugging guest deletion',
      totalGuests: guests.length,
      guestsWithIds: guests.map(g => ({ id: g.id, name: g.name, hasId: !!g.id })),
      sampleGuest: guests[0] || null
    });
  } catch (error) {
    console.error('Error getting guests for debug:', error);
    return NextResponse.json({ 
      error: 'Failed to get guests',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { guestId } = await request.json();
    
    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    console.log('🔍 Debug Delete - Guest ID:', guestId);
    
    // Primeiro, verificar se o convidado existe
    const guests = await getGuests();
    const guestExists = guests.find(g => g.id === guestId);
    
    console.log('🔍 Debug Delete - Guest exists:', !!guestExists);
    console.log('🔍 Debug Delete - All guest IDs:', guests.map(g => g.id));
    
    if (!guestExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'Guest not found',
        availableIds: guests.map(g => g.id),
        searchedId: guestId
      });
    }
    
    // Tentar deletar
    const success = await deleteGuest(guestId);
    
    console.log('🔍 Debug Delete - Delete result:', success);
    
    // Verificar se foi realmente deletado
    const guestsAfter = await getGuests();
    const stillExists = guestsAfter.find(g => g.id === guestId);
    
    return NextResponse.json({
      success,
      guestFoundBefore: !!guestExists,
      deleteResult: success,
      stillExistsAfter: !!stillExists,
      totalGuestsBefore: guests.length,
      totalGuestsAfter: guestsAfter.length,
      message: success ? 'Delete operation completed' : 'Delete operation failed'
    });
    
  } catch (error) {
    console.error('Error in debug delete:', error);
    return NextResponse.json({ 
      error: 'Failed to debug delete',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
