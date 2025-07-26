import { Guest, Gift } from '@/types';
import googleSheetsService from './google-sheets';
import * as fileStorage from './file-storage';

// Configuração para escolher o método de persistência
const USE_GOOGLE_SHEETS = process.env.GOOGLE_SHEETS_PRIVATE_KEY && 
                          process.env.GOOGLE_SHEETS_CLIENT_EMAIL && 
                          process.env.GOOGLE_SPREADSHEET_ID;

// ===============================
// FUNÇÕES PARA CONVIDADOS
// ===============================

export const getGuests = async (): Promise<Guest[]> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.getGuests();
  }
  return fileStorage.getGuests();
};

export const addGuest = async (guestData: Omit<Guest, 'id' | 'createdAt'>): Promise<string> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.addGuest(guestData);
  }
  return fileStorage.addGuest(guestData);
};

export const updateGuest = async (id: string, updates: Partial<Guest>): Promise<boolean> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.updateGuest(id, updates);
  }
  return fileStorage.updateGuest(id, updates);
};

export const deleteGuest = async (id: string): Promise<boolean> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.deleteGuest(id);
  }
  return fileStorage.deleteGuest(id);
};

// ===============================
// FUNÇÕES PARA PRESENTES
// ===============================

export const getGifts = async (): Promise<Gift[]> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.getGifts();
  }
  return fileStorage.getGifts();
};

export const getAvailableGifts = async (): Promise<Gift[]> => {
  const gifts = await getGifts();
  return gifts.filter(gift => gift.isAvailable);
};

export const addGift = async (giftData: Omit<Gift, 'id' | 'createdAt'>): Promise<string> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.addGift(giftData);
  }
  return fileStorage.addGift(giftData);
};

export const updateGift = async (id: string, updates: Partial<Gift>): Promise<boolean> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.updateGift(id, updates);
  }
  return fileStorage.updateGift(id, updates);
};

export const deleteGift = async (id: string): Promise<boolean> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.deleteGift(id);
  }
  return fileStorage.deleteGift(id);
};

// ===============================
// FUNÇÕES ESPECIAIS PARA PRESENTES
// ===============================

export const selectGift = async (giftId: string, guestName: string): Promise<boolean> => {
  return await updateGift(giftId, {
    isAvailable: false,
    selectedBy: guestName
  });
};

export const releaseGift = async (giftId: string): Promise<boolean> => {
  return await updateGift(giftId, {
    isAvailable: true,
    selectedBy: null
  });
};

export const releaseAllGiftsFromGuest = async (guestName: string): Promise<number> => {
  const gifts = await getGifts();
  const guestGifts = gifts.filter(g => g.selectedBy === guestName);
  
  let releasedCount = 0;
  for (const gift of guestGifts) {
    if (gift.id && await releaseGift(gift.id)) {
      releasedCount++;
    }
  }
  
  return releasedCount;
};

// ===============================
// FUNÇÕES DE AUTENTICAÇÃO
// ===============================

export const validateLogin = async (username: string, password: string): Promise<boolean> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.validateLogin(username, password);
  }
  
  // Fallback para validação local
  return username.toLowerCase() === 'noivos' && password === 'voucasar2025';
};

// ===============================
// FUNÇÕES DE INICIALIZAÇÃO
// ===============================

export const initializeDefaultGifts = async (): Promise<{ success: boolean; message: string }> => {
  if (USE_GOOGLE_SHEETS) {
    return await googleSheetsService.initializeSheets();
  }
  return fileStorage.initializeDefaultGifts();
};

// ===============================
// FUNÇÕES DE ESTATÍSTICAS
// ===============================

export const getStats = async () => {
  const guests = await getGuests();
  const gifts = await getGifts();
  
  const attendingGuests = guests.filter(g => g.isAttending);
  const totalCompanions = attendingGuests.reduce((sum, g) => sum + (g.companions || 0), 0);
  const selectedGifts = gifts.filter(g => !g.isAvailable);
  const guestsWithMessages = guests.filter(g => g.message && g.message.trim() !== '');
  
  return {
    totalGuests: guests.length,
    attendingGuests: attendingGuests.length,
    totalPeople: attendingGuests.length + totalCompanions,
    totalGifts: gifts.length,
    availableGifts: gifts.filter(g => g.isAvailable).length,
    selectedGifts: selectedGifts.length,
    messagesCount: guestsWithMessages.length,
    lastUpdate: new Date(),
    storageType: USE_GOOGLE_SHEETS ? 'Google Sheets' : 'Local Files'
  };
};

// ===============================
// FUNÇÕES DE EXPORTAÇÃO
// ===============================

export const exportData = async () => {
  const guests = await getGuests();
  const gifts = await getGifts();
  const stats = await getStats();
  
  return {
    guests,
    gifts,
    stats,
    exportDate: new Date(),
    version: '2.0',
    storageType: USE_GOOGLE_SHEETS ? 'Google Sheets' : 'Local Files'
  };
};

// ===============================
// FUNÇÕES DE MIGRAÇÃO
// ===============================

export const migrateToGoogleSheets = async (): Promise<{ success: boolean; message: string }> => {
  try {
    if (!USE_GOOGLE_SHEETS) {
      return {
        success: false,
        message: 'Google Sheets não configurado. Configure as variáveis de ambiente primeiro.'
      };
    }

    // Obter dados do sistema de arquivos
    const localGuests = fileStorage.getGuests();
    const localGifts = fileStorage.getGifts();

    // Inicializar Google Sheets
    await googleSheetsService.initializeSheets();

    // Migrar convidados
    for (const guest of localGuests) {
      await googleSheetsService.addGuest(guest);
    }

    // Migrar presentes (substituir os padrão)
    for (const gift of localGifts) {
      await googleSheetsService.addGift(gift);
    }

    return {
      success: true,
      message: `Migração concluída! ${localGuests.length} convidados e ${localGifts.length} presentes migrados.`
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro na migração: ${error}`
    };
  }
};
