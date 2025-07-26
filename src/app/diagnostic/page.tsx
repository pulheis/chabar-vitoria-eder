'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Database, 
  RefreshCw,
  Bug,
  Settings,
  Eye
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  testFirebaseConnection, 
  initializeDefaultGifts, 
  getGifts,
  addGift 
} from '@/lib/firestore';
import { Gift } from '@/types';

export default function DiagnosticPage() {
  const [loading, setLoading] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<'testing' | 'connected' | 'offline'>('testing');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [localGifts, setLocalGifts] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const addTestResult = (test: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setTestResults(prev => [...prev, { test, status, message, details, timestamp: new Date() }]);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setTestResults([]);
    addTestResult('Diagnóstico', 'warning', 'Iniciando diagnóstico do sistema...');

    try {
      // 1. Testar localStorage
      addTestResult('LocalStorage', 'warning', 'Verificando localStorage...');
      const savedGifts = localStorage.getItem('customGifts');
      const savedConfirmations = localStorage.getItem('confirmations');
      
      setLocalGifts(savedGifts ? JSON.parse(savedGifts) : []);
      addTestResult('LocalStorage', 'success', `Presentes locais: ${savedGifts ? JSON.parse(savedGifts).length : 0}, Confirmações: ${savedConfirmations ? JSON.parse(savedConfirmations).length : 0}`);

      // 2. Testar Firebase
      addTestResult('Firebase', 'warning', 'Testando conexão Firebase...');
      const connectionTest = await testFirebaseConnection();
      
      if (connectionTest.success) {
        setFirebaseStatus('connected');
        addTestResult('Firebase', 'success', 'Conectado ao Firebase com sucesso!');
        
        // 3. Testar Firestore
        addTestResult('Firestore', 'warning', 'Verificando dados no Firestore...');
        try {
          const firebaseGifts = await getGifts();
          setGifts(firebaseGifts);
          addTestResult('Firestore', 'success', `Presentes no Firebase: ${firebaseGifts.length}`);
          
          // 4. Inicializar presentes se necessário
          if (firebaseGifts.length === 0) {
            addTestResult('Inicialização', 'warning', 'Inicializando presentes padrão...');
            const initResult = await initializeDefaultGifts();
            if (initResult.success) {
              addTestResult('Inicialização', 'success', 'Presentes padrão criados no Firebase');
              const updatedGifts = await getGifts();
              setGifts(updatedGifts);
            } else {
              addTestResult('Inicialização', 'error', `Erro ao inicializar: ${initResult.message}`);
            }
          }
          
        } catch (error) {
          addTestResult('Firestore', 'error', `Erro ao acessar Firestore: ${error}`);
        }
        
      } else {
        setFirebaseStatus('offline');
        addTestResult('Firebase', 'error', `Falha na conexão: ${connectionTest.message}`, connectionTest.error);
      }

    } catch (error) {
      addTestResult('Sistema', 'error', `Erro geral: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const migrateLocalToFirebase = async () => {
    if (firebaseStatus !== 'connected') {
      toast.error('Firebase não está conectado!');
      return;
    }

    setLoading(true);
    addTestResult('Migração', 'warning', 'Iniciando migração de dados locais...');

    try {
      // Migrar presentes customizados
      if (localGifts.length > 0) {
        for (const gift of localGifts) {
          await addGift({
            name: gift.name,
            description: gift.description || '',
            isAvailable: true
          });
        }
        addTestResult('Migração', 'success', `${localGifts.length} presentes migrados para Firebase`);
      }

      // Atualizar lista de presentes
      const updatedGifts = await getGifts();
      setGifts(updatedGifts);
      
      toast.success('Migração concluída!');
    } catch (error) {
      addTestResult('Migração', 'error', `Erro na migração: ${error}`);
      toast.error('Erro na migração');
    } finally {
      setLoading(false);
    }
  };

  const clearLocalData = () => {
    localStorage.removeItem('customGifts');
    localStorage.removeItem('confirmations');
    setLocalGifts([]);
    addTestResult('Limpeza', 'success', 'Dados locais limpos');
    toast.success('Dados locais removidos');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Diagnóstico do Sistema</h1>
              <p className="text-gray-600 mt-2">Firebase e Dados - Chá Bar Éder & Vitória</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <RefreshCw className="mr-2" size={16} />
              )}
              {loading ? 'Executando...' : 'Executar Diagnóstico'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Resultados dos Testes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Bug className="mr-2" size={20} />
              Resultados dos Testes
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start p-3 border rounded-lg">
                  <div className="mr-3 mt-0.5">
                    {result.status === 'success' && <CheckCircle className="text-green-500" size={16} />}
                    {result.status === 'error' && <AlertCircle className="text-red-500" size={16} />}
                    {result.status === 'warning' && <Loader2 className="text-yellow-500" size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900">{result.test}</p>
                      <span className="text-xs text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    {result.details && (
                      <pre className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status e Ações */}
          <div className="space-y-6">
            
            {/* Status Firebase */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Firebase</h3>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  {firebaseStatus === 'connected' && <CheckCircle className="text-green-500 mr-3" size={24} />}
                  {firebaseStatus === 'offline' && <AlertCircle className="text-red-500 mr-3" size={24} />}
                  {firebaseStatus === 'testing' && <Loader2 className="animate-spin text-blue-500 mr-3" size={24} />}
                  
                  <div>
                    <p className="font-medium text-gray-900">
                      {firebaseStatus === 'connected' && 'Conectado'}
                      {firebaseStatus === 'offline' && 'Desconectado'}
                      {firebaseStatus === 'testing' && 'Testando...'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Presentes no Firebase: {gifts.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Locais */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Locais</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Presentes Customizados:</span>
                  <span className="font-medium">{localGifts.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confirmações:</span>
                  <span className="font-medium">
                    {localStorage.getItem('confirmations') ? JSON.parse(localStorage.getItem('confirmations')!).length : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
              
              <div className="space-y-3">
                {firebaseStatus === 'connected' && localGifts.length > 0 && (
                  <button
                    onClick={migrateLocalToFirebase}
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    <Database className="mr-2" size={16} />
                    Migrar Dados Locais para Firebase
                  </button>
                )}
                
                <button
                  onClick={clearLocalData}
                  className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <RefreshCw className="mr-2" size={16} />
                  Limpar Dados Locais
                </button>
                
                <a
                  href="/setup"
                  className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Settings className="mr-2" size={16} />
                  Ir para Configuração
                </a>
                
                <a
                  href="/"
                  className="w-full flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <Eye className="mr-2" size={16} />
                  Testar Formulário
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Presentes */}
        {gifts.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Presentes no Firebase ({gifts.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gifts.map((gift) => (
                <div key={gift.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{gift.name}</h4>
                  {gift.description && (
                    <p className="text-sm text-gray-500 mt-1">{gift.description}</p>
                  )}
                  <div className="mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      gift.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {gift.isAvailable ? 'Disponível' : 'Escolhido'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
