import { google } from 'googleapis';
import { Guest, Gift } from '@/types';

// Configuração das credenciais do Google Sheets
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Nomes das abas na planilha
const SHEETS = {
  GUESTS: 'Convidados',
  GIFTS: 'Presentes',
  CONFIG: 'Configurações'
};

// Headers das planilhas
const GUEST_HEADERS = ['id', 'name', 'rg', 'licensePlate', 'isAttending', 'companions', 'willBringGift', 'selectedGift', 'selectedGifts', 'message', 'createdAt'];
const GIFT_HEADERS = ['id', 'name', 'description', 'isAvailable', 'selectedBy', 'category', 'createdAt'];
const CONFIG_HEADERS = ['username', 'password', 'lastUpdate'];

class GoogleSheetsService {
  private sheets: any = null;
  private auth: any = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    if (!GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SPREADSHEET_ID) {
      console.error('Google Sheets credentials not configured');
      return;
    }

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: GOOGLE_SHEETS_PRIVATE_KEY,
        client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  // ===============================
  // FUNÇÕES AUXILIARES
  // ===============================

  private async readSheet(sheetName: string): Promise<string[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
      });
      
      return response.data.values || [];
    } catch (error) {
      console.error(`Erro ao ler planilha ${sheetName}:`, error);
      return [];
    }
  }

  private async writeSheet(sheetName: string, values: string[][]): Promise<boolean> {
    try {
      // Primeiro limpar a planilha
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
      });

      // Depois escrever os novos dados
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
      
      console.log(`✅ Planilha ${sheetName} atualizada com ${values.length} linhas`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao escrever planilha ${sheetName}:`, error);
      return false;
    }
  }

  private async appendToSheet(sheetName: string, values: (string | undefined)[]): Promise<boolean> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });
      return true;
    } catch (error) {
      console.error(`Erro ao adicionar linha à planilha ${sheetName}:`, error);
      return false;
    }
  }

  // ===============================
  // FUNÇÕES PARA CONVIDADOS
  // ===============================

  async getGuests(): Promise<Guest[]> {
    const rows = await this.readSheet(SHEETS.GUESTS);
    if (rows.length <= 1) return []; // Apenas header ou vazio

    return rows.slice(1).map(row => ({
      id: row[0] || '',
      name: row[1] || '',
      rg: row[2] || '',
      licensePlate: row[3] || '',
      isAttending: row[4] === 'true',
      companions: parseInt(row[5]) || 0,
      willBringGift: row[6] === 'true',
      selectedGift: row[7] || '',
      selectedGifts: row[8] ? JSON.parse(row[8]) : [],
      message: row[9] || '',
      createdAt: new Date(row[10] || Date.now())
    }));
  }

  async addGuest(guestData: Omit<Guest, 'id' | 'createdAt'>): Promise<string> {
    const newId = Date.now().toString();
    const newGuest: Guest = {
      ...guestData,
      id: newId,
      createdAt: new Date()
    };

    const values = [
      newGuest.id,
      newGuest.name,
      newGuest.rg || '',
      newGuest.licensePlate || '',
      newGuest.isAttending.toString(),
      newGuest.companions?.toString() || '0',
      newGuest.willBringGift.toString(),
      newGuest.selectedGift || '',
      JSON.stringify(newGuest.selectedGifts || []),
      newGuest.message || '',
      newGuest.createdAt.toISOString()
    ];

    const success = await this.appendToSheet(SHEETS.GUESTS, values);
    return success ? newId : '';
  }

  async updateGuest(id: string, updates: Partial<Guest>): Promise<boolean> {
    const guests = await this.getGuests();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) return false;

    guests[index] = { ...guests[index], ...updates };
    
    const rows: string[][] = [GUEST_HEADERS, ...guests.map(guest => [
      guest.id ?? '',
      guest.name ?? '',
      guest.rg ?? '',
      guest.licensePlate ?? '',
      guest.isAttending.toString(),
      guest.companions?.toString() ?? '0',
      guest.willBringGift.toString(),
      guest.selectedGift ?? '',
      JSON.stringify(guest.selectedGifts ?? []),
      guest.message ?? '',
      guest.createdAt.toISOString()
    ])];

    return await this.writeSheet(SHEETS.GUESTS, rows);
  }

  async deleteGuest(id: string): Promise<boolean> {
    try {
      console.log(`�️ Deletando convidado com ID: ${id}`);
      
      const guests = await this.getGuests();
      const initialCount = guests.length;
      
      const filteredGuests = guests.filter(g => g.id !== id);
      
      if (filteredGuests.length === initialCount) {
        console.log(`❌ Convidado com ID ${id} não encontrado`);
        return false;
      }

      // Reescrever a planilha completa sem o convidado deletado
      const rows: string[][] = [GUEST_HEADERS, ...filteredGuests.map(guest => [
        guest.id ?? '',
        guest.name ?? '',
        guest.rg ?? '',
        guest.licensePlate ?? '',
        guest.isAttending.toString(),
        guest.companions?.toString() ?? '0',
        guest.willBringGift.toString(),
        guest.selectedGift ?? '',
        JSON.stringify(guest.selectedGifts ?? []),
        guest.message ?? '',
        guest.createdAt.toISOString()
      ])];

      const success = await this.writeSheet(SHEETS.GUESTS, rows);
      
      if (success) {
        console.log(`✅ Convidado deletado! Total: ${initialCount} → ${filteredGuests.length}`);
      } else {
        console.log(`❌ Falha ao deletar convidado do Google Sheets`);
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao deletar convidado:', error);
      return false;
    }
  }

  // ===============================
  // FUNÇÕES PARA PRESENTES
  // ===============================

  async getGifts(): Promise<Gift[]> {
    const rows = await this.readSheet(SHEETS.GIFTS);
    if (rows.length <= 1) return [];

    return rows.slice(1).map(row => ({
      id: row[0] || '',
      name: row[1] || '',
      description: row[2] || '',
      isAvailable: row[3] !== 'false',
      selectedBy: row[4] || null,
      createdAt: new Date(row[5] || Date.now())
    }));
  }

  async addGift(giftData: Omit<Gift, 'id' | 'createdAt'>): Promise<string> {
    const newId = Date.now().toString();
    const newGift: Gift = {
      ...giftData,
      id: newId,
      createdAt: new Date()
    };

    const values = [
      newGift.id,
      newGift.name,
      newGift.description,
      newGift.isAvailable.toString(),
      newGift.selectedBy || '',
      newGift.createdAt.toISOString()
    ];

    const success = await this.appendToSheet(SHEETS.GIFTS, values);
    return success ? newId : '';
  }

  async updateGift(id: string, updates: Partial<Gift>): Promise<boolean> {
    const gifts = await this.getGifts();
    const index = gifts.findIndex(g => g.id === id);
    
    if (index === -1) return false;

    gifts[index] = { ...gifts[index], ...updates };
    
    const rows: string[][] = [GIFT_HEADERS, ...gifts.map(gift => [
      gift.id ?? '',
      gift.name ?? '',
      gift.description ?? '',
      gift.isAvailable.toString(),
      gift.selectedBy ?? '',
      gift.createdAt.toISOString()
    ])];

    return await this.writeSheet(SHEETS.GIFTS, rows);
  }

  async deleteGift(id: string): Promise<boolean> {
    const gifts = await this.getGifts();
    const filteredGifts = gifts.filter(g => g.id !== id);
    
    if (filteredGifts.length === gifts.length) return false;

    const rows: string[][] = [GIFT_HEADERS, ...filteredGifts.map(gift => [
      gift.id ?? '',
      gift.name ?? '',
      gift.description ?? '',
      gift.isAvailable.toString(),
      gift.selectedBy ?? '',
      gift.createdAt.toISOString()
    ])];

    return await this.writeSheet(SHEETS.GIFTS, rows);
  }

  // ===============================
  // FUNÇÕES DE AUTENTICAÇÃO
  // ===============================

  async validateLogin(username: string, password: string): Promise<{ valid: boolean; user?: string }> {
    const rows = await this.readSheet(SHEETS.CONFIG);
    if (rows.length <= 1) return { valid: false };

    // Fazer busca case-insensitive
    const configRow = rows.find(row => row[0]?.toLowerCase() === username.toLowerCase());
    if (configRow && configRow[1] === password) {
      // Retornar o nome formatado baseado no username
      const userDisplayName = username.toLowerCase() === 'eder' ? 'Éder' : 
                             username.toLowerCase() === 'vitoria' ? 'Vitória' : 
                             'Admin';
      return { valid: true, user: userDisplayName };
    }
    return { valid: false };
  }

  // ===============================
  // FUNÇÕES DE INICIALIZAÇÃO
  // ===============================

  async initializeSheets(): Promise<{ success: boolean; message: string }> {
    try {
      // Inicializar aba de Convidados
      await this.writeSheet(SHEETS.GUESTS, [GUEST_HEADERS]);
      
      // Inicializar aba de Presentes com dados padrão
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

      const giftRows = [
        GIFT_HEADERS,
        ...defaultGifts.map((gift, index) => [
          (index + 1).toString(),
          gift.name,
          gift.description,
          gift.isAvailable.toString(),
          '',
          new Date().toISOString()
        ])
      ];

      await this.writeSheet(SHEETS.GIFTS, giftRows);
      
      // Inicializar aba de Configurações com os dois usuários
      const configRows = [
        CONFIG_HEADERS,
        ['eder', 'Noivo!', new Date().toISOString()],
        ['vitoria', 'Noiva!', new Date().toISOString()],
        ['noivos', 'voucasar2025', new Date().toISOString()]
      ];
      
      await this.writeSheet(SHEETS.CONFIG, configRows);

      return {
        success: true,
        message: 'Google Sheets inicializado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao inicializar Google Sheets: ${error}`
      };
    }
  }
}

// Instância singleton
const googleSheetsService = new GoogleSheetsService();

export default googleSheetsService;
