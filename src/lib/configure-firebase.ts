import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  enableNetwork,
  disableNetwork 
} from 'firebase/firestore';
import { db } from './firebase';

// Script para configurar Firebase automaticamente
export const configureFirebase = async () => {
  try {
    console.log('🔥 Iniciando configuração automática do Firebase...');
    
    // 1. Testar conectividade
    await enableNetwork(db);
    console.log('✅ Rede habilitada');
    
    // 2. Criar presentes padrão se não existirem
    const giftsSnapshot = await getDocs(collection(db, 'gifts'));
    
    if (giftsSnapshot.empty) {
      console.log('📦 Criando presentes padrão...');
      
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
        await addDoc(collection(db, 'gifts'), {
          ...gift,
          createdAt: new Date(),
          selectedBy: null
        });
      }
      
      console.log(`✅ ${defaultGifts.length} presentes criados`);
    } else {
      console.log(`✅ ${giftsSnapshot.size} presentes já existem`);
    }

    // 3. Migrar dados do localStorage se existirem
    const localGifts = localStorage.getItem('customGifts');
    if (localGifts) {
      const customGifts = JSON.parse(localGifts);
      console.log(`📥 Migrando ${customGifts.length} presentes do localStorage...`);
      
      for (const gift of customGifts) {
        await addDoc(collection(db, 'gifts'), {
          ...gift,
          isAvailable: true,
          createdAt: new Date(),
          selectedBy: null
        });
      }
      
      console.log('✅ Presentes customizados migrados');
    }

    // 4. Migrar confirmações do localStorage
    const localConfirmations = localStorage.getItem('confirmations');
    if (localConfirmations) {
      const confirmations = JSON.parse(localConfirmations);
      console.log(`📥 Migrando ${confirmations.length} confirmações do localStorage...`);
      
      for (const confirmation of confirmations) {
        await addDoc(collection(db, 'guests'), {
          ...confirmation,
          createdAt: new Date(confirmation.createdAt || Date.now())
        });
      }
      
      console.log('✅ Confirmações migradas');
    }

    return {
      success: true,
      message: 'Firebase configurado com sucesso!',
      details: {
        gifts: giftsSnapshot.size,
        migratedGifts: localGifts ? JSON.parse(localGifts).length : 0,
        migratedConfirmations: localConfirmations ? JSON.parse(localConfirmations).length : 0
      }
    };

  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    return {
      success: false,
      message: 'Erro na configuração do Firebase',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para verificar regras de segurança
export const checkFirestoreRules = async () => {
  try {
    // Tentar ler e escrever para testar permissões
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Teste de permissões',
      timestamp: new Date()
    });
    
    await deleteDoc(doc(db, 'test', testDoc.id));
    
    return {
      success: true,
      message: 'Regras de segurança configuradas corretamente'
    };
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      return {
        success: false,
        message: 'Regras de segurança muito restritivas',
        suggestion: 'Configure as regras do Firestore para permitir leitura/escrita em modo de teste'
      };
    }
    
    return {
      success: false,
      message: 'Erro ao verificar regras de segurança',
      error: error.message
    };
  }
};

// Regras de segurança recomendadas para desenvolvimento
export const getRecommendedFirestoreRules = () => {
  return `
// Regras para desenvolvimento - NÃO usar em produção
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para guests
    match /guests/{document} {
      allow read, write: if true;
    }
    
    // Permitir leitura/escrita para gifts
    match /gifts/{document} {
      allow read, write: if true;
    }
    
    // Bloquear outros documentos
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;
};
