export interface Guest {
  id?: string;
  name: string;
  rg?: string;
  licensePlate?: string;
  isAttending: boolean;
  companions: number;
  willBringGift: boolean;
  selectedGift?: string; // Para compatibilidade com dados antigos
  selectedGifts: string[]; // Array de IDs dos presentes selecionados
  message?: string; // Para compatibilidade com dados antigos
  createdAt: Date;
}

export interface Gift {
  id?: string;
  name: string;
  description?: string;
  isAvailable: boolean;
  selectedBy?: string | null;
  category?: string;
  createdAt: Date;
}

export interface AdminUser {
  id?: string;
  email: string;
  name: string;
}

export interface RSVPFormData {
  name: string;
  isAttending: boolean;
  companions: number;
  willBringGift: boolean;
  selectedGift?: string;
  message?: string;
}
