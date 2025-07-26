import { NextRequest, NextResponse } from 'next/server';
import { getGifts, getAvailableGifts, addGift, updateGift, deleteGift } from '@/lib/storage';
import { Gift } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('available') === 'true';

    const gifts = availableOnly ? await getAvailableGifts() : await getGifts();
    // Garantir que as datas sejam serializáveis
    const serializedGifts = gifts.map(gift => ({
      ...gift,
      createdAt: gift.createdAt instanceof Date && !isNaN(gift.createdAt.getTime()) 
        ? gift.createdAt.toISOString() 
        : (typeof gift.createdAt === 'string' ? gift.createdAt : new Date().toISOString())
    }));
    return NextResponse.json(serializedGifts);
  } catch (error) {
    console.error('Error reading gifts:', error);
    return NextResponse.json({ error: 'Failed to read gifts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const giftData: Omit<Gift, 'id' | 'createdAt'> = await request.json();
    
    const giftId = await addGift(giftData);
    const gifts = await getGifts();
    const newGift = gifts.find((g: Gift) => g.id === giftId);

    // Garantir que as datas sejam serializáveis
    const serializedGift = newGift ? {
      ...newGift,
      createdAt: newGift.createdAt instanceof Date && !isNaN(newGift.createdAt.getTime()) 
        ? newGift.createdAt.toISOString() 
        : (typeof newGift.createdAt === 'string' ? newGift.createdAt : new Date().toISOString())
    } : null;

    return NextResponse.json(serializedGift, { status: 201 });
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Gift ID is required' }, { status: 400 });
    }

    const success = await updateGift(id, updates);
    
    if (!success) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    const gifts = await getGifts();
    const updatedGift = gifts.find((g: Gift) => g.id === id);

    // Garantir que as datas sejam serializáveis
    const serializedGift = updatedGift ? {
      ...updatedGift,
      createdAt: updatedGift.createdAt instanceof Date && !isNaN(updatedGift.createdAt.getTime()) 
        ? updatedGift.createdAt.toISOString() 
        : (typeof updatedGift.createdAt === 'string' ? updatedGift.createdAt : new Date().toISOString())
    } : null;

    return NextResponse.json(serializedGift);
  } catch (error) {
    console.error('Error updating gift:', error);
    return NextResponse.json({ error: 'Failed to update gift' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: 'Gift ID is required' }, { status: 400 });
    }

    const success = await deleteGift(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gift:', error);
    return NextResponse.json({ error: 'Failed to delete gift' }, { status: 500 });
  }
}
