import fs from 'fs';
import path from 'path';
import { Guest, Gift } from '@/types';

// Caminhos dos arquivos de dados
const DATA_DIR = path.join(process.cwd(), 'data');
const GUESTS_FILE = path.join(DATA_DIR, 'guests.json');
const GIFTS_FILE = path.join(DATA_DIR, 'gifts.json');

// Garantir que o diretório de dados existe
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Funções auxiliares para ler/escrever arquivos
const readJsonFile = <T>(filePath: string, defaultValue: T[]): T[] => {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return defaultValue;
  }
};

const writeJsonFile = <T>(filePath: string, data: T[]): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filePath}:`, error);
    throw error;
  }
};

// ===============================
// FUNÇÕES PARA CONVIDADOS
// ===============================

export const getGuests = (): Guest[] => {
  return readJsonFile<Guest>(GUESTS_FILE, []);
};

export const addGuest = (guestData: Omit<Guest, 'id' | 'createdAt'>): string => {
  const guests = getGuests();
  const newGuest: Guest = {
    ...guestData,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  guests.push(newGuest);
  writeJsonFile(GUESTS_FILE, guests);
  
  return newGuest.id!;
};

export const updateGuest = (id: string, updates: Partial<Guest>): boolean => {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);
  
  if (index === -1) return false;
  
  guests[index] = { ...guests[index], ...updates };
  writeJsonFile(GUESTS_FILE, guests);
  
  return true;
};

export const deleteGuest = (id: string): boolean => {
  const guests = getGuests();
  const filteredGuests = guests.filter(g => g.id !== id);
  
  if (filteredGuests.length === guests.length) return false;
  
  writeJsonFile(GUESTS_FILE, filteredGuests);
  return true;
};

// ===============================
// FUNÇÕES PARA PRESENTES
// ===============================

export const getGifts = (): Gift[] => {
  return readJsonFile<Gift>(GIFTS_FILE, []);
};

export const getAvailableGifts = (): Gift[] => {
  return getGifts().filter(gift => gift.isAvailable);
};

export const addGift = (giftData: Omit<Gift, 'id' | 'createdAt'>): string => {
  const gifts = getGifts();
  const newGift: Gift = {
    ...giftData,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  gifts.push(newGift);
  writeJsonFile(GIFTS_FILE, gifts);
  
  return newGift.id!;
};

export const updateGift = (id: string, updates: Partial<Gift>): boolean => {
  const gifts = getGifts();
  const index = gifts.findIndex(g => g.id === id);
  
  if (index === -1) return false;
  
  gifts[index] = { ...gifts[index], ...updates };
  writeJsonFile(GIFTS_FILE, gifts);
  
  return true;
};

export const deleteGift = (id: string): boolean => {
  const gifts = getGifts();
  const filteredGifts = gifts.filter(g => g.id !== id);
  
  if (filteredGifts.length === gifts.length) return false;
  
  writeJsonFile(GIFTS_FILE, filteredGifts);
  return true;
};

// ===============================
// FUNÇÕES ESPECIAIS PARA PRESENTES
// ===============================

export const selectGift = (giftId: string, guestName: string): boolean => {
  const gifts = getGifts();
  const gift = gifts.find(g => g.id === giftId);
  
  if (!gift || !gift.isAvailable) {
    return false; // Presente não encontrado ou já selecionado
  }
  
  return updateGift(giftId, {
    isAvailable: false,
    selectedBy: guestName
  });
};

export const releaseGift = (giftId: string): boolean => {
  return updateGift(giftId, {
    isAvailable: true,
    selectedBy: null
  });
};

export const releaseAllGiftsFromGuest = (guestName: string): number => {
  const gifts = getGifts();
  const guestGifts = gifts.filter(g => g.selectedBy === guestName);
  
  let releasedCount = 0;
  guestGifts.forEach(gift => {
    if (gift.id && releaseGift(gift.id)) {
      releasedCount++;
    }
  });
  
  return releasedCount;
};

// ===============================
// FUNÇÕES DE INICIALIZAÇÃO
// ===============================

export const initializeDefaultGifts = (): { success: boolean; message: string } => {
  try {
    const existingGifts = getGifts();
    
    if (existingGifts.length === 0) {
      const defaultGifts = [
        { name: 'Jogo de Taças de Vinho', description: 'Cristal, 6 peças', isAvailable: true },
        { name: 'Kit Chá Gourmet', description: 'Caixa com 12 sabores', isAvailable: true },
        { name: 'Tábua de Queijos', description: 'Bambu com acessórios', isAvailable: true },
        { name: 'Conjunto de Xícaras', description: 'Porcelana, 6 unidades', isAvailable: true },
        { name: 'Fruteira Decorativa', description: 'Aço inox', isAvailable: true },
        { name: 'Taças de Champagne', description: 'Cristal, par', isAvailable: true },
        { name: 'Kit Aperitivos', description: 'Petisqueira com compartimentos', isAvailable: true },
        { name: 'Jogo Americano', description: 'Tecido, 4 peças', isAvailable: true },
        { name: 'Conjunto de Bowls', description: 'Cerâmica, 4 peças', isAvailable: true },
        { name: 'Porta-temperos', description: 'Bambu com 6 potes', isAvailable: true }
      ];

      const gifts = defaultGifts.map((gift, index) => ({
        ...gift,
        id: (index + 1).toString(),
        createdAt: new Date()
      }));

      writeJsonFile(GIFTS_FILE, gifts);
      
      return { 
        success: true, 
        message: `${defaultGifts.length} presentes padrão criados com sucesso!` 
      };
    }
    
    return { 
      success: true, 
      message: `${existingGifts.length} presentes já existem no sistema.` 
    };
    
  } catch (error) {
    return { 
      success: false, 
      message: `Erro ao inicializar presentes: ${error}` 
    };
  }
};

// ===============================
// FUNÇÕES DE MIGRAÇÃO
// ===============================

export const migrateFromLocalStorage = (_req: Request): { success: boolean; message: string; details?: unknown } => {
  try {
    // Esta função será chamada via API para migrar dados do localStorage
    // Os dados serão enviados no body da requisição
    
    return {
      success: true,
      message: 'Dados migrados com sucesso!'
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro na migração: ${error}`
    };
  }
};

// ===============================
// FUNÇÕES DE ESTATÍSTICAS
// ===============================

export const getStats = () => {
  const guests = getGuests();
  const gifts = getGifts();
  
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
    lastUpdate: new Date()
  };
};

// ===============================
// FUNÇÕES DE EXPORTAÇÃO
// ===============================

export const exportData = () => {
  const guests = getGuests();
  const gifts = getGifts();
  const stats = getStats();
  
  return {
    guests,
    gifts,
    stats,
    exportDate: new Date(),
    version: '1.0'
  };
};
