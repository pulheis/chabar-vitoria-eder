import { NextRequest, NextResponse } from 'next/server';
import { getGuests, addGuest, deleteGuest, updateGuest } from '@/lib/storage';
import { sendWhatsAppNotification } from '@/lib/twilio';
import { Guest } from '@/types';

export async function GET() {
  try {
    const guests = await getGuests();
    // Garantir que as datas sejam serializáveis
    const serializedGuests = guests.map(guest => ({
      ...guest,
      createdAt: guest.createdAt instanceof Date && !isNaN(guest.createdAt.getTime()) 
        ? guest.createdAt.toISOString() 
        : (typeof guest.createdAt === 'string' ? guest.createdAt : new Date().toISOString())
    }));
    return NextResponse.json(serializedGuests);
  } catch (error) {
    console.error('Error reading guests:', error);
    return NextResponse.json({ error: 'Failed to read guests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guestData: Omit<Guest, 'id' | 'createdAt'> = await request.json();
    
    const guestId = await addGuest(guestData);
    const guests = await getGuests();
    const newGuest = guests.find((g: Guest) => g.id === guestId);

    // Enviar notificação via WhatsApp Twilio (não bloquear se falhar)
    try {
      const notificationResult = await sendWhatsAppNotification({
        name: guestData.name,
        isAttending: guestData.isAttending,
        companions: guestData.companions || 0,
        willBringGift: guestData.willBringGift || false,
        selectedGift: guestData.selectedGift || '',
        message: guestData.message || ''
      });
      
      console.log('Resultado da notificação WhatsApp:', notificationResult);
    } catch (notificationError) {
      console.error('Erro ao enviar notificação WhatsApp (não crítico):', notificationError);
      // Não falhar a requisição se a notificação falhar
    }

    // Garantir que as datas sejam serializáveis
    const serializedGuest = newGuest ? {
      ...newGuest,
      createdAt: newGuest.createdAt instanceof Date && !isNaN(newGuest.createdAt.getTime()) 
        ? newGuest.createdAt.toISOString() 
        : (typeof newGuest.createdAt === 'string' ? newGuest.createdAt : new Date().toISOString())
    } : null;

    return NextResponse.json(serializedGuest, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const success = await updateGuest(id, updateData);
    
    if (!success) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Buscar e retornar o convidado atualizado
    const guests = await getGuests();
    const updatedGuest = guests.find((g: Guest) => g.id === id);

    // Garantir que as datas sejam serializáveis
    const serializedGuest = updatedGuest ? {
      ...updatedGuest,
      createdAt: updatedGuest.createdAt instanceof Date && !isNaN(updatedGuest.createdAt.getTime()) 
        ? updatedGuest.createdAt.toISOString() 
        : (typeof updatedGuest.createdAt === 'string' ? updatedGuest.createdAt : new Date().toISOString())
    } : null;

    return NextResponse.json(serializedGuest);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const success = await deleteGuest(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}
