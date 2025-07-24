'use client';

import { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Copy,
  ExternalLink,
  Database,
  Shield,
  Code
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { configureFirebase, checkFirestoreRules, getRecommendedFirestoreRules } from '@/lib/configure-firebase';

export default function ConfigureFirebasePage() {
  const [configuring, setConfiguring] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showRules, setShowRules] = useState(false);

  const runConfiguration = async () => {
    setConfiguring(true);
    setResults(null);
    
    try {
      // 1. Verificar regras de segurança
      toast.loading('Verificando regras de segurança...');
      const rulesCheck = await checkFirestoreRules();
      
      if (!rulesCheck.success) {
        setResults({
          success: false,
          message: 'Regras de segurança precisam ser configuradas',
          rulesError: rulesCheck
        });
        setShowRules(true);
        toast.error('Configure as regras do Firestore primeiro');
        return;
      }

      // 2. Configurar Firebase
      toast.loading('Configurando Firebase...');
      const configResult = await configureFirebase();
      
      setResults(configResult);
      
      if (configResult.success) {
        setConfigured(true);
        toast.success('Firebase configurado com sucesso!');
      } else {
        toast.error('Erro na configuração');
      }
      
    } catch (error) {
      setResults({
        success: false,
        message: 'Erro inesperado na configuração',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      toast.error('Erro inesperado');
    } finally {
      setConfiguring(false);
    }
  };

  const copyRules = () => {
    navigator.clipboard.writeText(getRecommendedFirestoreRules());
    toast.success('Regras copiadas para a área de transferência!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Configuração Automática do Firebase</h1>
            <p className="text-gray-600 mt-2">Configure o Firebase em poucos cliques</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!configured && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pré-requisitos</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">1. Ativar Firestore Database</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Acesse o Firebase Console e ative o Firestore Database em modo de teste.
                </p>
                <a
                  href="https://console.firebase.google.com/project/chabarve/firestore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  Abrir Firestore Console <ExternalLink size={12} className="ml-1" />
                </a>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-2">2. Ativar Authentication</h3>
                <p className="text-purple-800 text-sm mb-3">
                  Configure o Authentication com método Email/Password.
                </p>
                <a
                  href="https://console.firebase.google.com/project/chabarve/authentication"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm"
                >
                  Abrir Authentication Console <ExternalLink size={12} className="ml-1" />
                </a>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-900 mb-2">3. Configurar Regras de Segurança</h3>
                <p className="text-orange-800 text-sm mb-3">
                  Configure as regras do Firestore para permitir acesso durante o desenvolvimento.
                </p>
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="text-orange-600 hover:text-orange-700 text-sm underline"
                >
                  {showRules ? 'Ocultar' : 'Ver'} regras recomendadas
                </button>
              </div>
            </div>

            {showRules && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Regras de Firestore (Desenvolvimento)</h4>
                  <button
                    onClick={copyRules}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Copy size={14} className="mr-1" />
                    Copiar
                  </button>
                </div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
{getRecommendedFirestoreRules()}
                </pre>
                <p className="text-xs text-gray-600 mt-2">
                  ⚠️ Estas regras são para desenvolvimento. Configure regras adequadas para produção.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botão de Configuração */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {configured ? 'Configuração Concluída!' : 'Executar Configuração Automática'}
            </h2>
            
            {!configured ? (
              <button
                onClick={runConfiguration}
                disabled={configuring}
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {configuring ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  <Play className="mr-2" size={20} />
                )}
                {configuring ? 'Configurando...' : 'Iniciar Configuração'}
              </button>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="mx-auto text-green-500" size={48} />
                <p className="text-green-600">Firebase configurado e pronto para uso!</p>
                
                <div className="flex justify-center space-x-4">
                  <a
                    href="/"
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Testar Formulário
                  </a>
                  <a
                    href="/admin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Acessar Admin
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              {results.success ? (
                <CheckCircle className="text-green-500 mr-2" size={20} />
              ) : (
                <AlertCircle className="text-red-500 mr-2" size={20} />
              )}
              Resultado da Configuração
            </h3>
            
            <div className={`p-4 rounded-lg ${
              results.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${results.success ? 'text-green-900' : 'text-red-900'}`}>
                {results.message}
              </p>
              
              {results.details && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>• Presentes existentes: {results.details.gifts}</p>
                  <p>• Presentes migrados: {results.details.migratedGifts}</p>
                  <p>• Confirmações migradas: {results.details.migratedConfirmations}</p>
                </div>
              )}
              
              {results.error && (
                <p className="mt-2 text-sm text-red-600">
                  Erro: {results.error}
                </p>
              )}
              
              {results.rulesError && (
                <div className="mt-3">
                  <p className="text-red-600 text-sm">{results.rulesError.message}</p>
                  {results.rulesError.suggestion && (
                    <p className="text-orange-600 text-sm mt-1">
                      💡 {results.rulesError.suggestion}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informações das Credenciais */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Projeto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Credenciais Firebase</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Project ID:</span>
                  <button 
                    onClick={() => copyToClipboard('chabarve')}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    chabarve <Copy size={12} className="ml-1" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API Key:</span>
                  <button 
                    onClick={() => copyToClipboard('AIzaSyC3bO6bhkvqlpZfy31x81migzDNNMuo6-0')}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    AIzaSyC... <Copy size={12} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Links Úteis</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="https://console.firebase.google.com/project/chabarve"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  Firebase Console <ExternalLink size={12} className="ml-1" />
                </a>
                <a
                  href="/diagnostic"
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  Diagnóstico do Sistema <Database size={12} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
