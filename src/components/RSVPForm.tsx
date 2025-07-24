import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RSVPFormData, Gift } from '@/types';
import { addGuest, getAvailableGifts, updateGift } from '@/lib/firestore';
import toast from 'react-hot-toast';
import * as QRCode from 'qrcode';
import { Gift as GiftIcon, MapPin, Navigation, Heart } from 'lucide-react';

const RSVPForm: React.FC = () => {
  const [form, setForm] = useState<RSVPFormData & { willBuyFromStore: boolean; willlBringGift: boolean }>({
    name: '',
    isAttending: false,
    companions: 0,
    willBringGift: false,
    willlBringGift: false,
    willBuyFromStore: false,
    selectedGift: '',
    message: ''
  });
  const [showCompanions, setShowCompanions] = useState(false);
  const [showGiftList, setShowGiftList] = useState(false);
  const [showStoreLink, setShowStoreLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [availableGifts, setAvailableGifts] = useState<Gift[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const precolandiaUrl = 'https://www.precolandia.com.br/gift-list-details/view/cha-bar-edinho-e-vi';

  useEffect(() => {
    loadAvailableGifts();
    generateQRCode();
  }, []);

  const loadAvailableGifts = async () => {
    try {
      const gifts = await getAvailableGifts();
      setAvailableGifts(gifts);
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    }
  };

  const generateQRCode = async () => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(precolandiaUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937', // Gray-800
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if ('checked' in e.target) {
      checked = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAttendance = (attending: boolean) => {
    setForm(prev => ({ ...prev, isAttending: attending }));
    setShowCompanions(attending);
  };

  const handleGiftOption = (willBring: boolean) => {
    setForm(prev => ({ ...prev, willBringGift: willBring, willlBringGift: willBring, willBuyFromStore: !willBring }));
    setShowGiftList(willBring);
    setShowStoreLink(!willBring);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Se escolheu um presente, marcar como indisponível
      if (form.selectedGift && form.willBringGift) {
        const selectedGiftObj = availableGifts.find(gift => gift.name === form.selectedGift);
        if (selectedGiftObj && selectedGiftObj.id) {
          await updateGift(selectedGiftObj.id, {
            isAvailable: false,
            selectedBy: form.name
          });
        }
      }

      await addGuest({
        name: form.name,
        isAttending: form.isAttending,
        companions: form.companions,
        willBuyFromStore: form.willBuyFromStore,
        willlBringGift: form.willlBringGift,
        selectedGift: form.selectedGift,
        message: form.message
      });
      setSubmitted(true);
      toast.success('Confirmação enviada!');
    } catch (error) {
      toast.error('Erro ao enviar confirmação.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Obrigado por confirmar sua presença!
        </h2>
        <p className="text-gray-700 mb-4">
          Estamos muito felizes em te receber no nosso Chá Bar!
        </p>
        
        {/* Informações do Evento */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <MapPin className="text-blue-500 mr-2" size={20} />
            <span className="font-semibold">Local do Evento</span>
          </div>
          <p className="text-gray-700 mb-1">📅 Data: 23 de agosto de 2025, às 13h</p>
          <p className="text-gray-700 mb-3">📍 Endereço: 8RGC+6G Puris, Ibiúna - SP</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="https://waze.com/ul?ll=-23.6545,-47.2222" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Navigation className="mr-2" size={16} />
              Abrir no Waze
            </a>
            <a 
              href="https://maps.google.com/?q=8RGC+6G+Puris+Ibiúna+SP" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MapPin className="mr-2" size={16} />
              Google Maps
            </a>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <Image 
            src={qrCodeUrl} 
            alt="QR Code para lista da Preçolandia" 
            width={128}
            height={128}
            className="mx-auto mb-4"
          />
          <p className="text-sm text-gray-600 mb-2">Ou escaneie o QR Code:</p>
        </div>
        
        <p className="text-gray-800 font-semibold">— Vitória + Éder</p>
      </div>

      {/* Formulário de Confirmação */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirme sua presença</h2>
        
        <label className="block mb-2 font-medium">Nome do convidado</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
          placeholder="Seu nome"
        />
        <label className="block mb-2 font-medium">Você virá?</label>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${form.isAttending ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            onClick={() => handleAttendance(true)}
          >Sim, estarei lá!</button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${!form.isAttending ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            onClick={() => handleAttendance(false)}
          >Não poderei ir</button>
        </div>
        {showCompanions && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Número de acompanhantes</label>
            <input
              type="number"
              name="companions"
              min={0}
              value={form.companions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {form.isAttending && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Trará presente?</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleGiftOption(true)}
                className={`px-4 py-2 rounded ${form.willBringGift ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => handleGiftOption(false)}
                className={`px-4 py-2 rounded ${!form.willBringGift ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
              >
                Não
              </button>
            </div>
          </div>
        )}
        {showGiftList && (
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Selecione o presente</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableGifts.map((gift) => (
                <label key={gift.id} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="selectedGift"
                    value={gift.name}
                    checked={form.selectedGift === gift.name}
                    onChange={handleChange}
                    className="mr-3 text-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{gift.name}</div>
                    {gift.description && (
                      <div className="text-sm text-gray-600">{gift.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {availableGifts.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">
                Nenhum presente disponível no momento. Você pode escolher algo da lista da Preçolandia.
              </p>
            )}
          </div>
        )}
        
        {/* Link para Preçolândia */}
        {showStoreLink && (
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <GiftIcon className="text-blue-500 mr-2" size={24} />
              <span className="font-semibold">Escolha seu presente</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Acesse nossa lista na Preçolândia e escolha o presente que desejar:
            </p>
            <a
              href={precolandiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors mb-3"
            >
              Ver Lista de Presentes
            </a>
            {qrCodeUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Ou escaneie o QR Code:</p>
                <Image 
                  src={qrCodeUrl} 
                  alt="QR Code para lista da Preçolandia" 
                  width={128}
                  height={128}
                  className="mx-auto"
                />
              </div>
            )}
          </div>
        )}
        <label className="block mb-2 font-medium">Mensagem aos noivos (opcional)</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded mb-4"
          placeholder="Deixe uma mensagem carinhosa, divertida ou personalizada"
        />
        <button
          type="submit"
          disabled={loading || !form.name}
          className="w-full bg-gray-800 text-white py-2 rounded font-bold"
        >
          {loading ? 'Enviando...' : 'Confirmar Presença'}
        </button>
      </div>
    );
  }

  return (
    <form className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Confirme sua presença</h2>
      <label className="block mb-2 font-medium">Nome do convidado</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-4"
        placeholder="Seu nome"
      />
      <label className="block mb-2 font-medium">Você virá?</label>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded ${form.isAttending ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          onClick={() => handleAttendance(true)}
        >Sim, estarei lá!</button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${!form.isAttending ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          onClick={() => handleAttendance(false)}
        >Não poderei ir</button>
      </div>
      {showCompanions && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Número de acompanhantes</label>
          <input
            type="number"
            name="companions"
            min={0}
            value={form.companions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      {form.isAttending && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Trará presente?</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleGiftOption(true)}
              className={`px-4 py-2 rounded ${form.willBringGift ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => handleGiftOption(false)}
              className={`px-4 py-2 rounded ${!form.willBringGift ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              Não
            </button>
          </div>
        </div>
      )}
      {showGiftList && (
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Selecione o presente</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableGifts.map((gift) => (
              <label key={gift.id} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="selectedGift"
                  value={gift.name}
                  checked={form.selectedGift === gift.name}
                  onChange={handleChange}
                  className="mr-3 text-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">{gift.name}</div>
                  {gift.description && (
                    <div className="text-sm text-gray-600">{gift.description}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
          {availableGifts.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Nenhum presente disponível no momento. Você pode escolher algo da lista da Preçolandia.
            </p>
          )}
        </div>
      )}
      
      {/* Link para Preçolândia */}
      {showStoreLink && (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <GiftIcon className="text-blue-500 mr-2" size={24} />
            <span className="font-semibold">Escolha seu presente</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Acesse nossa lista na Preçolândia e escolha o presente que desejar:
          </p>
          <a
            href={precolandiaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors mb-3"
          >
            Ver Lista de Presentes
          </a>
          {qrCodeUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Ou escaneie o QR Code:</p>
              <Image 
                src={qrCodeUrl} 
                alt="QR Code para lista da Preçolandia" 
                width={128}
                height={128}
                className="mx-auto"
              />
            </div>
          )}
        </div>
      )}
      <label className="block mb-2 font-medium">Mensagem aos noivos (opcional)</label>
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        rows={3}
        className="w-full p-2 border rounded mb-4"
        placeholder="Deixe uma mensagem carinhosa, divertida ou personalizada"
      />
      <button
        type="submit"
        disabled={loading || !form.name}
        className="w-full bg-gray-800 text-white py-2 rounded font-bold"
      >
        {loading ? 'Enviando...' : 'Confirmar Presença'}
      </button>
    </form>
  );
};

export default RSVPForm;
