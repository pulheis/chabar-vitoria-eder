'use client';

import { useState } from 'react';
import { MessageSquare, Phone, CheckCircle, XCircle, Send, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TwilioConfig {
  configured: boolean;
  whatsappConfigured: boolean;
  testResult?: any;
  variables?: {
    hasAccountSid: boolean;
    hasAuthToken: boolean;
    hasWhatsAppNumber: boolean;
    hasEderWhatsApp: boolean;
    hasVitoriaWhatsApp: boolean;
  };
}

export default function TwilioSettings() {
  const [config, setConfig] = useState<TwilioConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);

  const checkConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/twilio/test');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      toast.error('Erro ao verificar configuração');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async () => {
    setTestingNotification(true);
    try {
      const response = await fetch('/api/twilio/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'notification' })
      });
      
      const data = await response.json();
      
      if (data.result?.success) {
        toast.success('Notificação WhatsApp de teste enviada com sucesso!');
      } else {
        toast.error(`Falha no envio: ${data.result?.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      toast.error('Erro ao enviar notificação de teste');
      console.error(error);
    } finally {
      setTestingNotification(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="text-green-500" size={20} />
    ) : (
      <XCircle className="text-red-500" size={20} />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="text-green-500" size={24} />
        <h2 className="text-xl font-bold text-gray-800">Notificações WhatsApp (Twilio)</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={checkConfig}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Verificando...
              </>
            ) : (
              <>
                <Phone size={16} />
                Verificar Configuração
              </>
            )}
          </button>

          {config?.configured && config?.whatsappConfigured && (
            <button
              onClick={testNotification}
              disabled={testingNotification}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {testingNotification ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar Teste WhatsApp
                </>
              )}
            </button>
          )}
        </div>

        {config && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  {getStatusIcon(config.configured)}
                  Configuração Twilio
                </h3>
                {config.variables && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Account SID:</span>
                      {getStatusIcon(config.variables.hasAccountSid)}
                    </div>
                    <div className="flex justify-between">
                      <span>Auth Token:</span>
                      {getStatusIcon(config.variables.hasAuthToken)}
                    </div>
                    <div className="flex justify-between">
                      <span>Número WhatsApp:</span>
                      {getStatusIcon(config.variables.hasWhatsAppNumber)}
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  {getStatusIcon(config.whatsappConfigured)}
                  WhatsApp dos Noivos
                </h3>
                {config.variables && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Éder:</span>
                      {getStatusIcon(config.variables.hasEderWhatsApp)}
                    </div>
                    <div className="flex justify-between">
                      <span>Vitória:</span>
                      {getStatusIcon(config.variables.hasVitoriaWhatsApp)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <MessageSquare className="text-green-600 mt-0.5" size={20} />
                <div className="text-sm text-green-800">
                  <p className="font-semibold mb-1">📱 Exemplo de mensagem WhatsApp:</p>
                  <div className="bg-white border rounded-lg p-3 mt-2 font-mono text-xs">
                    🎉 <strong>Chá Bar Vitória + Éder</strong><br/><br/>
                    ✅ Confirmação: <strong>João Silva</strong> (+1 acompanhante)<br/>
                    🎁 Presente: Jogo de Taças de Vinho<br/>
                    💌 "Mal posso esperar para comemorar com vocês!"<br/><br/>
                    Ver detalhes: https://chabar-vitoria-eder.onrender.com/admin
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Configuração necessária:</p>
                  <p>Para receber notificações WhatsApp, configure as seguintes variáveis de ambiente:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><code>TWILIO_ACCOUNT_SID</code> - SID da conta Twilio</li>
                    <li><code>TWILIO_AUTH_TOKEN</code> - Token de autenticação</li>
                    <li><code>TWILIO_WHATSAPP_NUMBER</code> - Número WhatsApp Twilio (formato: whatsapp:+14155552345)</li>
                    <li><code>EDER_WHATSAPP</code> - WhatsApp do Éder (formato: +5511999999999)</li>
                    <li><code>VITORIA_WHATSAPP</code> - WhatsApp da Vitória (formato: +5511888888888)</li>
                  </ul>
                  <p className="mt-2 text-xs text-yellow-700">
                    <strong>Nota:</strong> O número WhatsApp do Twilio deve estar no formato <code>whatsapp:+14155552345</code> 
                    e os números dos noivos apenas com <code>+5511999999999</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
