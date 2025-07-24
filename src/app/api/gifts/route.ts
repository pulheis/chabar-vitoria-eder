import { NextRequest, NextResponse } from 'next/server';
import { getGifts, getAvailableGifts, addGift, updateGift, deleteGift } from '@/lib/file-storage';
import { Gift } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('available') === 'true';

    const gifts = availableOnly ? getAvailableGifts() : getGifts();
    return NextResponse.json(gifts);
  } catch (error) {
    console.error('Error reading gifts:', error);
    return NextResponse.json({ error: 'Failed to read gifts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const giftData: Omit<Gift, 'id' | 'createdAt'> = await request.json();
    
    const giftId = addGift(giftData);
    const gifts = getGifts();
    const newGift = gifts.find((g: Gift) => g.id === giftId);

    return NextResponse.json(newGift, { status: 201 });
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

    const success = updateGift(id, updates);
    
    if (!success) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    const gifts = getGifts();
    const updatedGift = gifts.find((g: Gift) => g.id === id);

    return NextResponse.json(updatedGift);
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

    const success = deleteGift(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gift:', error);
    return NextResponse.json({ error: 'Failed to delete gift' }, { status: 500 });
  }
}
