import { NextRequest, NextResponse } from 'next/server';
import { deleteGuest, getGuests } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { guestId } = await request.json();
    
    if (!guestId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Guest ID is required' 
      }, { status: 400 });
    }

    console.log(`🧪 Teste direto: Deletando convidado ${guestId}`);
    
    // Listar convidados antes
    const guestsBefore = await getGuests();
    const guestBefore = guestsBefore.find(g => g.id === guestId);
    
    if (!guestBefore) {
      return NextResponse.json({
        success: false,
        error: 'Convidado não encontrado',
        totalGuests: guestsBefore.length,
        availableIds: guestsBefore.map(g => g.id)
      });
    }
    
    // Executar deleção
    const deleteResult = await deleteGuest(guestId);
    
    // Verificar se foi realmente deletado
    const guestsAfter = await getGuests();
    const guestAfter = guestsAfter.find(g => g.id === guestId);
    
    return NextResponse.json({
      success: deleteResult,
      guestName: guestBefore.name,
      totalBefore: guestsBefore.length,
      totalAfter: guestsAfter.length,
      actuallyDeleted: !guestAfter,
      deleteFunction: deleteResult,
      message: deleteResult && !guestAfter 
        ? 'Convidado deletado com sucesso!' 
        : 'Falha na deleção'
    });
    
  } catch (error) {
    console.error('Erro no teste de deleção:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const guests = await getGuests();
    return NextResponse.json({
      message: 'Lista atual de convidados',
      totalGuests: guests.length,
      guests: guests.map(g => ({
        id: g.id,
        name: g.name,
        isAttending: g.isAttending
      }))
    });
  } catch (error) {
    console.error('Erro ao listar convidados:', error);
    return NextResponse.json({ 
      error: 'Erro ao listar convidados',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
