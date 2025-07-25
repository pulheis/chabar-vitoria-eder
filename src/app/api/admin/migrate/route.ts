import { NextRequest, NextResponse } from 'next/server';
import { initializeGoogleSheets, addGuest, addGift } from '@/lib/sheets-storage';
import fs from 'fs';
import path from 'path';
import { Guest, Gift } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceType = 'local' } = body;

    // Primeiro, inicializar as planilhas do Google Sheets
    const initResult = await initializeGoogleSheets();
    if (!initResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: `Failed to initialize Google Sheets: ${initResult.message}` 
      }, { status: 500 });
    }

    let guests: Guest[] = [];
    let gifts: Gift[] = [];
    let migratedGuests = 0;
    let migratedGifts = 0;

    if (sourceType === 'local') {
      // Migrar dados dos arquivos JSON locais
      const DATA_DIR = path.join(process.cwd(), 'data');
      const GUESTS_FILE = path.join(DATA_DIR, 'guests.json');
      const GIFTS_FILE = path.join(DATA_DIR, 'gifts.json');

      // Ler convidados dos arquivos locais
      if (fs.existsSync(GUESTS_FILE)) {
        const guestsData = fs.readFileSync(GUESTS_FILE, 'utf8');
        guests = JSON.parse(guestsData) || [];
      }

      // Ler presentes dos arquivos locais
      if (fs.existsSync(GIFTS_FILE)) {
        const giftsData = fs.readFileSync(GIFTS_FILE, 'utf8');
        gifts = JSON.parse(giftsData) || [];
      }
    } else if (sourceType === 'data' && body.guests && body.gifts) {
      // Migrar dados fornecidos no body da requisição
      guests = body.guests;
      gifts = body.gifts;
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid source type or missing data' 
      }, { status: 400 });
    }

    // Migrar convidados para Google Sheets
    for (const guest of guests) {
      try {
        const guestData = {
          name: guest.name,
          rg: guest.rg,
          licensePlate: guest.licensePlate,
          isAttending: guest.isAttending,
          companions: guest.companions,
          willBringGift: guest.willBringGift,
          selectedGift: guest.selectedGift,
          selectedGifts: guest.selectedGifts || [],
          message: guest.message
        };

        await addGuest(guestData);
        migratedGuests++;
      } catch (error) {
        console.error(`Error migrating guest ${guest.name}:`, error);
      }
    }

    // Migrar presentes para Google Sheets
    for (const gift of gifts) {
      try {
        const giftData = {
          name: gift.name,
          description: gift.description,
          isAvailable: gift.isAvailable,
          selectedBy: gift.selectedBy,
          category: gift.category
        };

        await addGift(giftData);
        migratedGifts++;
      } catch (error) {
        console.error(`Error migrating gift ${gift.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed successfully!`,
      details: {
        migratedGuests,
        migratedGifts,
        totalGuests: guests.length,
        totalGifts: gifts.length
      }
    });

  } catch (error) {
    console.error('Error during migration:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Migration failed: ${error}` 
    }, { status: 500 });
  }
}