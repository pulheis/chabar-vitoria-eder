const admin = require('firebase-admin');

// Inicializar Firebase Admin (sem chave de serviço para desenvolvimento local)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}

async function createAdminUser() {
  try {
    // Dados do usuário administrativo
    const userData = {
      email: 'eder.vitoria@chabar.com',
      password: 'ChaBar2025!',
      displayName: 'Éder & Vitória',
      emailVerified: true
    };

    // Criar usuário
    const userRecord = await admin.auth().createUser(userData);
    
    console.log('✅ Usuário administrativo criado com sucesso!');
    console.log('📧 Email:', userData.email);
    console.log('🔑 Senha:', userData.password);
    console.log('🆔 UID:', userRecord.uid);
    console.log('\n🚀 Agora você pode fazer login em: http://localhost:3001/admin');
    
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  Usuário já existe!');
      console.log('📧 Email: eder.vitoria@chabar.com');
      console.log('🔑 Senha: ChaBar2025!');
      console.log('\n🚀 Faça login em: http://localhost:3001/admin');
    } else {
      console.error('❌ Erro ao criar usuário:', error.message);
      console.log('\n💡 Alternativa: Crie o usuário manualmente no Firebase Console:');
      console.log('1. Acesse https://console.firebase.google.com');
      console.log('2. Vá para Authentication > Users');
      console.log('3. Clique em "Add user"');
      console.log('4. Email: eder.vitoria@chabar.com');
      console.log('5. Senha: ChaBar2025!');
    }
  }
}

createAdminUser();
