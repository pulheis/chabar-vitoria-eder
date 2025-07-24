import { NextRequest, NextResponse } from 'next/server';
import { getGuests, addGuest, deleteGuest, updateGuest } from '@/lib/file-storage';
import { Guest } from '@/types';

export async function GET() {
  try {
    const guests = getGuests();
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error reading guests:', error);
    return NextResponse.json({ error: 'Failed to read guests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guestData: Omit<Guest, 'id' | 'createdAt'> = await request.json();
    
    const guestId = addGuest(guestData);
    const guests = getGuests();
    const newGuest = guests.find((g: Guest) => g.id === guestId);

    return NextResponse.json(newGuest, { status: 201 });
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

    const success = updateGuest(id, updateData);
    
    if (!success) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Buscar e retornar o convidado atualizado
    const guests = getGuests();
    const updatedGuest = guests.find((g: Guest) => g.id === id);

    return NextResponse.json(updatedGuest);
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

    const success = deleteGuest(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}
