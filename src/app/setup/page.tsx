'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const createAdminUser = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        'eder.vitoria@chabar.com', 
        'ChaBar2025!'
      );
      
      setCreated(true);
      toast.success('Usuário administrativo criado com sucesso!');
      console.log('Usuário criado:', userCredential.user);
      
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        toast.success('Usuário já existe! Pode fazer login.');
        setCreated(true);
      } else {
        toast.error(`Erro: ${error.message}`);
        console.error('Erro ao criar usuário:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <Toaster position="top-center" />
      
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Configuração Inicial
          </h1>
          <p className="text-gray-600">Chá Bar - Éder & Vitória</p>
        </div>

        {!created ? (
          <div>
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                Clique no botão abaixo para criar o usuário administrativo para os noivos.
              </p>
            </div>

            <button
              onClick={createAdminUser}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <UserPlus className="mr-2" size={20} />
              {loading ? 'Criando usuário...' : 'Criar Usuário Admin'}
            </button>

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Email:</strong> eder.vitoria@chabar.com</p>
              <p><strong>Senha:</strong> ChaBar2025!</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">✅ Usuário criado com sucesso!</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> eder.vitoria@chabar.com<br/>
                  <strong>Senha:</strong> ChaBar2025!
                </p>
              </div>

              <a
                href="/admin"
                className="w-full inline-block px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                Acessar Portal Admin
              </a>

              <a
                href="/"
                className="w-full inline-block px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Ver Página dos Convidados
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
