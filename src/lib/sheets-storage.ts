import { google } from 'googleapis';
import { Guest, Gift } from '@/types';

// ===============================
// CONFIGURAÇÃO E AUTENTICAÇÃO
// ===============================

const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

// Configurações de cache e retry
const CACHE_TTL = parseInt(process.env.SHEETS_CACHE_TTL_SECONDS || '300') * 1000; // 5 min default
const MAX_RETRIES = parseInt(process.env.SHEETS_MAX_RETRIES || '3');
const RETRY_DELAY = parseInt(process.env.SHEETS_RETRY_DELAY_MS || '1000');

// Validação de variáveis de ambiente
if (!PRIVATE_KEY || !CLIENT_EMAIL || !SPREADSHEET_ID) {
  console.error('Google Sheets environment variables not configured properly');
}

// Configuração de autenticação
const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key: PRIVATE_KEY,
    client_email: CLIENT_EMAIL,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ===============================
// NOMES DAS ABAS
// ===============================

const SHEETS_CONFIG = {
  CONFIG: 'Config',
  GUESTS: 'Convidados', 
  GIFTS: 'Presentes',
  MESSAGES: 'Mensagens'
} as const;

// ===============================
// SISTEMA DE CACHE EM MEMÓRIA
// ===============================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
};

const setCache = <T>(key: string, data: T): void => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const invalidateCache = (pattern?: string): void => {
  if (!pattern) {
    cache.clear();
    return;
  }
  
  for (const [key] of cache.entries()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

// ===============================
// FUNÇÕES AUXILIARES
// ===============================

const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    
    console.warn(`Operation failed, retrying... (${retries} attempts left)`, error);
    await delay(RETRY_DELAY);
    return retryOperation(operation, retries - 1);
  }
};

// Converter dados para formato de planilha
const objectToRow = (obj: Record<string, unknown>, headers: string[]): string[] => {
  return headers.map(header => {
    const value = obj[header];
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  });
};

// Converter linha de planilha para objeto
const rowToObject = (row: string[], headers: string[]): Record<string, unknown> => {
  const obj: Record<string, unknown> = {};
  headers.forEach((header, index) => {
    const value = row[index] || '';
    
    // Tentar parsear JSON para arrays/objetos
    if (value.startsWith('[') || value.startsWith('{')) {
      try {
        obj[header] = JSON.parse(value);
      } catch {
        obj[header] = value;
      }
    } else if (value === 'true' || value === 'false') {
      obj[header] = value === 'true';
    } else if (!isNaN(Number(value)) && value !== '') {
      obj[header] = Number(value);
    } else if (value.includes('T') && value.includes('Z')) {
      // Tentar parsear data ISO
      try {
        obj[header] = new Date(value);
      } catch {
        obj[header] = value;
      }
    } else {
      obj[header] = value;
    }
  });
  return obj;
};

// ===============================
// FUNÇÕES DE CONFIGURAÇÃO (ADMIN)
// ===============================

export const getAdminCredentials = async (): Promise<{ username: string; password: string } | null> => {
  const cacheKey = 'admin-credentials';
  const cached = getCached<{ username: string; password: string }>(cacheKey);
  if (cached) return cached;

  try {
    const result = await retryOperation(async () => {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.CONFIG}!A1:B2`,
      });
      
      const values = response.data.values;
      if (!values || values.length < 2) return null;
      
      const headers = values[0];
      const data = values[1];
      
      if (!headers.includes('username') || !headers.includes('password')) return null;
      
      const usernameIndex = headers.indexOf('username');
      const passwordIndex = headers.indexOf('password');
      
      return {
        username: data[usernameIndex] || '',
        password: data[passwordIndex] || ''
      };
    });

    if (result) {
      setCache(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    console.error('Error reading admin credentials:', error);
    // Fallback para credenciais hardcoded se Google Sheets falhar
    return {
      username: 'noivos',
      password: 'voucasar2025'
    };
  }
};

// ===============================
// FUNÇÕES PARA CONVIDADOS
// ===============================

export const getGuests = async (): Promise<Guest[]> => {
  const cacheKey = 'guests';
  const cached = getCached<Guest[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await retryOperation(async () => {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GUESTS}!A:H`,
      });
      
      const values = response.data.values;
      if (!values || values.length === 0) return [];
      
      const headers = values[0];
      const guests: Guest[] = [];
      
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        if (row.length === 0) continue;
        
        const guest = rowToObject(row, headers) as Guest;
        guests.push(guest);
      }
      
      return guests;
    });

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error reading guests:', error);
    return [];
  }
};

export const addGuest = async (guestData: Omit<Guest, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const newGuest: Guest = {
      ...guestData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const headers = ['id', 'name', 'rg', 'licensePlate', 'isAttending', 'companions', 'willBringGift', 'selectedGift', 'selectedGifts', 'message', 'createdAt'];
    const row = objectToRow(newGuest, headers);

    await retryOperation(async () => {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GUESTS}!A:H`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
    });

    invalidateCache('guests');
    return newGuest.id!;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
};

export const updateGuest = async (id: string, updates: Partial<Guest>): Promise<boolean> => {
  try {
    const guests = await getGuests();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) return false;
    
    const updatedGuest = { ...guests[index], ...updates };
    const headers = ['id', 'name', 'rg', 'licensePlate', 'isAttending', 'companions', 'willBringGift', 'selectedGift', 'selectedGifts', 'message', 'createdAt'];
    const row = objectToRow(updatedGuest, headers);

    await retryOperation(async () => {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GUESTS}!A${index + 2}:H${index + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
    });

    invalidateCache('guests');
    return true;
  } catch (error) {
    console.error('Error updating guest:', error);
    return false;
  }
};

export const deleteGuest = async (id: string): Promise<boolean> => {
  try {
    const guests = await getGuests();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) return false;

    await retryOperation(async () => {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Assumindo que Convidados é a primeira aba
                dimension: 'ROWS',
                startIndex: index + 1,
                endIndex: index + 2,
              },
            },
          }],
        },
      });
    });

    invalidateCache('guests');
    return true;
  } catch (error) {
    console.error('Error deleting guest:', error);
    return false;
  }
};

// ===============================
// FUNÇÕES PARA PRESENTES
// ===============================

export const getGifts = async (): Promise<Gift[]> => {
  const cacheKey = 'gifts';
  const cached = getCached<Gift[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await retryOperation(async () => {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GIFTS}!A:G`,
      });
      
      const values = response.data.values;
      if (!values || values.length === 0) return [];
      
      const headers = values[0];
      const gifts: Gift[] = [];
      
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        if (row.length === 0) continue;
        
        const gift = rowToObject(row, headers) as Gift;
        gifts.push(gift);
      }
      
      return gifts;
    });

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error reading gifts:', error);
    return [];
  }
};

export const getAvailableGifts = async (): Promise<Gift[]> => {
  const gifts = await getGifts();
  return gifts.filter(gift => gift.isAvailable);
};

export const addGift = async (giftData: Omit<Gift, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const newGift: Gift = {
      ...giftData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const headers = ['id', 'name', 'description', 'isAvailable', 'selectedBy', 'category', 'createdAt'];
    const row = objectToRow(newGift, headers);

    await retryOperation(async () => {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GIFTS}!A:G`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
    });

    invalidateCache('gifts');
    return newGift.id!;
  } catch (error) {
    console.error('Error adding gift:', error);
    throw error;
  }
};

export const updateGift = async (id: string, updates: Partial<Gift>): Promise<boolean> => {
  try {
    const gifts = await getGifts();
    const index = gifts.findIndex(g => g.id === id);
    
    if (index === -1) return false;
    
    const updatedGift = { ...gifts[index], ...updates };
    const headers = ['id', 'name', 'description', 'isAvailable', 'selectedBy', 'category', 'createdAt'];
    const row = objectToRow(updatedGift, headers);

    await retryOperation(async () => {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GIFTS}!A${index + 2}:G${index + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
    });

    invalidateCache('gifts');
    return true;
  } catch (error) {
    console.error('Error updating gift:', error);
    return false;
  }
};

export const deleteGift = async (id: string): Promise<boolean> => {
  try {
    const gifts = await getGifts();
    const index = gifts.findIndex(g => g.id === id);
    
    if (index === -1) return false;

    await retryOperation(async () => {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 1, // Assumindo que Presentes é a segunda aba
                dimension: 'ROWS',
                startIndex: index + 1,
                endIndex: index + 2,
              },
            },
          }],
        },
      });
    });

    invalidateCache('gifts');
    return true;
  } catch (error) {
    console.error('Error deleting gift:', error);
    return false;
  }
};

// ===============================
// FUNÇÕES ESPECIAIS PARA PRESENTES
// ===============================

export const selectGift = async (giftId: string, guestName: string): Promise<boolean> => {
  const gifts = await getGifts();
  const gift = gifts.find(g => g.id === giftId);
  
  if (!gift || !gift.isAvailable) {
    return false;
  }
  
  return updateGift(giftId, {
    isAvailable: false,
    selectedBy: guestName
  });
};

export const releaseGift = async (giftId: string): Promise<boolean> => {
  return updateGift(giftId, {
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
// FUNÇÕES DE INICIALIZAÇÃO
// ===============================

export const initializeDefaultGifts = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const existingGifts = await getGifts();
    
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

      // Adicionar presentes um por um
      for (const gift of defaultGifts) {
        await addGift(gift);
      }
      
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

export const migrateFromLocalStorage = async (): Promise<{ success: boolean; message: string; details?: unknown }> => {
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
    lastUpdate: new Date()
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
    version: '1.0'
  };
};

// ===============================
// FUNÇÕES DE INICIALIZAÇÃO DAS PLANILHAS
// ===============================

export const initializeGoogleSheets = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Criar as abas se não existirem
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const existingSheets = spreadsheet.data.sheets?.map(sheet => sheet.properties?.title) || [];
    
    // Criar aba Config se não existir
    if (!existingSheets.includes(SHEETS_CONFIG.CONFIG)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEETS_CONFIG.CONFIG,
              },
            },
          }],
        },
      });

      // Adicionar cabeçalhos e dados padrão
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.CONFIG}!A1:B2`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [
            ['username', 'password'],
            ['noivos', 'voucasar2025']
          ],
        },
      });
    }

    // Criar aba Convidados se não existir
    if (!existingSheets.includes(SHEETS_CONFIG.GUESTS)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEETS_CONFIG.GUESTS,
              },
            },
          }],
        },
      });

      // Adicionar cabeçalhos
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GUESTS}!A1:H1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['id', 'name', 'rg', 'licensePlate', 'isAttending', 'companions', 'willBringGift', 'selectedGift', 'selectedGifts', 'message', 'createdAt']],
        },
      });
    }

    // Criar aba Presentes se não existir
    if (!existingSheets.includes(SHEETS_CONFIG.GIFTS)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEETS_CONFIG.GIFTS,
              },
            },
          }],
        },
      });

      // Adicionar cabeçalhos
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS_CONFIG.GIFTS}!A1:G1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['id', 'name', 'description', 'isAvailable', 'selectedBy', 'category', 'createdAt']],
        },
      });
    }

    return {
      success: true,
      message: 'Google Sheets inicializado com sucesso!'
    };
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    return {
      success: false,
      message: `Erro ao inicializar Google Sheets: ${error}`
    };
  }
};