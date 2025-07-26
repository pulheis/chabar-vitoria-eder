import twilio from 'twilio';

// Configuração do Twilio para WhatsApp
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// Para WhatsApp, o formato é: whatsapp:+14155552345
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

// Números dos noivos para receber notificações WhatsApp
const NOIVOS_WHATSAPP = {
  eder: process.env.EDER_WHATSAPP || '',
  vitoria: process.env.VITORIA_WHATSAPP || ''
};

// Verificar se o Twilio WhatsApp está configurado
const isTwilioConfigured = () => {
  return !!(accountSid && authToken && twilioWhatsAppNumber);
};

// Verificar se há números WhatsApp dos noivos configurados
const hasNoivosWhatsApp = () => {
  return !!(NOIVOS_WHATSAPP.eder || NOIVOS_WHATSAPP.vitoria);
};

// Criar cliente Twilio apenas se configurado
let client: twilio.Twilio | null = null;
if (isTwilioConfigured()) {
  client = twilio(accountSid, authToken);
}

interface GuestNotificationData {
  name: string;
  isAttending: boolean;
  companions: number;
  willBringGift: boolean;
  selectedGift: string;
  message: string;
}

// Função para formatar a mensagem de notificação WhatsApp
const formatWhatsAppMessage = (guest: GuestNotificationData): string => {
  const status = guest.isAttending ? '✅ Confirmação' : '❌ Não virá';
  const companions = guest.companions > 0 ? ` (+${guest.companions} acompanhante${guest.companions > 1 ? 's' : ''})` : '';
  const gift = guest.willBringGift && guest.selectedGift ? `\n🎁 Presente: ${guest.selectedGift}` : '';
  const messageText = guest.message ? `\n💌 "${guest.message}"` : '';
  
  return `🎉 *Chá Bar Vitória + Éder*

${status}: *${guest.name}*${companions}${gift}${messageText}

Ver detalhes: https://chabar-vitoria-eder.onrender.com/admin`;
};

// Função para enviar notificação via WhatsApp
export const sendWhatsAppNotification = async (guestData: GuestNotificationData): Promise<{ success: boolean; message: string }> => {
  try {
    if (!isTwilioConfigured()) {
      console.log('Twilio WhatsApp não configurado - notificação não enviada');
      return {
        success: false,
        message: 'Twilio WhatsApp não configurado'
      };
    }

    if (!hasNoivosWhatsApp()) {
      console.log('Números WhatsApp dos noivos não configurados - notificação não enviada');
      return {
        success: false,
        message: 'Números WhatsApp dos noivos não configurados'
      };
    }

    if (!client) {
      return {
        success: false,
        message: 'Cliente Twilio não inicializado'
      };
    }

    const message = formatWhatsAppMessage(guestData);
    const results = [];

    // Enviar para Éder via WhatsApp (se configurado)
    if (NOIVOS_WHATSAPP.eder) {
      try {
        const messageResponse = await client.messages.create({
          body: message,
          from: twilioWhatsAppNumber,
          to: `whatsapp:${NOIVOS_WHATSAPP.eder}`
        });
        results.push({ to: 'Éder', success: true, sid: messageResponse.sid });
      } catch (error) {
        console.error('Erro ao enviar WhatsApp para Éder:', error);
        results.push({ to: 'Éder', success: false, error: error });
      }
    }

    // Enviar para Vitória via WhatsApp (se configurado)
    if (NOIVOS_WHATSAPP.vitoria) {
      try {
        const messageResponse = await client.messages.create({
          body: message,
          from: twilioWhatsAppNumber,
          to: `whatsapp:${NOIVOS_WHATSAPP.vitoria}`
        });
        results.push({ to: 'Vitória', success: true, sid: messageResponse.sid });
      } catch (error) {
        console.error('Erro ao enviar WhatsApp para Vitória:', error);
        results.push({ to: 'Vitória', success: false, error: error });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return {
      success: successCount > 0,
      message: `WhatsApp enviado para ${successCount}/${totalCount} noivos`
    };

  } catch (error) {
    console.error('Erro geral ao enviar notificação WhatsApp:', error);
    return {
      success: false,
      message: `Erro ao enviar WhatsApp: ${error}`
    };
  }
};

// Função para testar a configuração do Twilio WhatsApp
export const testTwilioConfig = async (): Promise<{ configured: boolean; whatsappConfigured: boolean; testResult?: any }> => {
  const configured = isTwilioConfigured();
  const whatsappConfigured = hasNoivosWhatsApp();
  
  if (!configured || !whatsappConfigured) {
    return {
      configured,
      whatsappConfigured,
      testResult: 'Configuração incompleta'
    };
  }

  try {
    if (client && accountSid) {
      const account = await client.api.accounts(accountSid).fetch();
      return {
        configured: true,
        whatsappConfigured: true,
        testResult: {
          accountName: account.friendlyName,
          status: account.status
        }
      };
    }
  } catch (error) {
    return {
      configured: true,
      whatsappConfigured: true,
      testResult: { error: error }
    };
  }

  return {
    configured: false,
    whatsappConfigured: false
  };
};

export default {
  sendWhatsAppNotification,
  testTwilioConfig,
  isTwilioConfigured,
  hasNoivosWhatsApp
};
