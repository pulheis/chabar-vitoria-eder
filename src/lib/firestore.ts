import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Guest, Gift } from '@/types';

// Operações para convidados
export const addGuest = async (guest: Omit<Guest, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'guests'), {
      ...guest,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar convidado:', error);
    throw error;
  }
};

export const getGuests = async (): Promise<Guest[]> => {
  try {
    const q = query(collection(db, 'guests'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Guest[];
  } catch (error) {
    console.error('Erro ao buscar convidados:', error);
    throw error;
  }
};

// Operações para presentes
export const addGift = async (gift: Omit<Gift, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'gifts'), {
      ...gift,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar presente:', error);
    throw error;
  }
};

export const getGifts = async (): Promise<Gift[]> => {
  try {
    const q = query(collection(db, 'gifts'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Gift[];
  } catch (error) {
    console.error('Erro ao buscar presentes:', error);
    throw error;
  }
};

export const getAvailableGifts = async (): Promise<Gift[]> => {
  try {
    const q = query(
      collection(db, 'gifts'), 
      where('isAvailable', '==', true),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Gift[];
  } catch (error) {
    console.error('Erro ao buscar presentes disponíveis:', error);
    throw error;
  }
};

export const updateGift = async (id: string, gift: Partial<Gift>) => {
  try {
    const giftRef = doc(db, 'gifts', id);
    await updateDoc(giftRef, gift);
  } catch (error) {
    console.error('Erro ao atualizar presente:', error);
    throw error;
  }
};

export const deleteGift = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'gifts', id));
  } catch (error) {
    console.error('Erro ao deletar presente:', error);
    throw error;
  }
};

// Função para testar conexão com Firebase
export const testFirebaseConnection = async () => {
  try {
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: serverTimestamp()
    });
    
    // Remove the test document
    await deleteDoc(doc(db, 'test', testDoc.id));
    
    return { success: true, message: 'Firebase conectado com sucesso!' };
  } catch (error) {
    console.error('Erro de conexão Firebase:', error);
    return { 
      success: false, 
      message: 'Erro ao conectar com Firebase. Verifique as configurações.',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para inicializar presentes padrão
export const initializeDefaultGifts = async () => {
  try {
    const gifts = await getGifts();
    if (gifts.length === 0) {
      const defaultGifts = [
        { name: 'Jogo de Taças de Vinho', description: 'Cristal, 6 peças', isAvailable: true },
        { name: 'Kit Chá Gourmet', description: 'Caixa com 12 sabores', isAvailable: true },
        { name: 'Tábua de Queijos', description: 'Bambu com acessórios', isAvailable: true },
        { name: 'Conjunto de Xícaras', description: 'Porcelana, 6 unidades', isAvailable: true },
        { name: 'Fruteira Decorativa', description: 'Aço inox', isAvailable: true },
        { name: 'Taças de Champagne', description: 'Cristal, par', isAvailable: true },
        { name: 'Kit Aperitivos', description: 'Petisqueira com compartimentos', isAvailable: true },
        { name: 'Jogo Americano', description: 'Tecido, 4 peças', isAvailable: true }
      ];

      for (const gift of defaultGifts) {
        await addGift(gift);
      }
      
      return { success: true, message: 'Presentes padrão inicializados!' };
    }
    return { success: true, message: 'Presentes já existem no banco.' };
  } catch (error) {
    console.error('Erro ao inicializar presentes:', error);
    return { 
      success: false, 
      message: 'Erro ao inicializar presentes padrão.',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};
