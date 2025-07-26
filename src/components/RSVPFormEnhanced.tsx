'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Gift as GiftIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Gift } from '@/types';

interface FormData {
  name: string;
  isAttending: boolean;
  companions: number;
  willBringGift: boolean;
  selectedGift: string;
  message: string;
}

const RSVPFormEnhanced: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    isAttending: false,
    companions: 0,
    willBringGift: false,
    selectedGift: '',
    message: ''
  });
  
  const [showCompanions, setShowCompanions] = useState(false);
  const [showGiftList, setShowGiftList] = useState(false);
  const [showStoreLink, setShowStoreLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [firebaseStatus, setFirebaseStatus] = useState<'testing' | 'connected' | 'offline'>('testing');
  const [useFirebase, setUseFirebase] = useState(false);

  const precolandiaUrl = 'https://www.precolandia.com.br/lista/eder-vitoria';

  // Inicialização - carregar presentes via API
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setFirebaseStatus('testing');
        
        // Carregar presentes via API
        const response = await fetch('/api/gifts');
        if (response.ok) {
          const apiGifts = await response.json();
          setGifts(apiGifts);
          setFirebaseStatus('connected');
          setUseFirebase(true);
          console.log('Presentes carregados via API:', apiGifts);
          toast.success('Conectado ao sistema!');
        } else {
          throw new Error('Falha ao carregar presentes');
        }
      } catch (error) {
        console.error('API não disponível, usando modo offline:', error);
        setFirebaseStatus('offline');
        setUseFirebase(false);
        
        // Carregar presentes do localStorage como fallback
        loadLocalGifts();
        
        toast.error('Modo offline ativo. Dados serão salvos localmente.');
      }
    };

    initializeApp();
  }, []);

  const loadLocalGifts = () => {
    const savedGifts = localStorage.getItem('customGifts');
    const defaultGifts: Gift[] = [
      { id: '1', name: 'Jogo de Taças de Vinho', description: 'Cristal, 6 peças', isAvailable: true, createdAt: new Date() },
      { id: '2', name: 'Kit Chá Gourmet', description: 'Caixa com 12 sabores', isAvailable: true, createdAt: new Date() },
      { id: '3', name: 'Tábua de Queijos', description: 'Bambu com acessórios', isAvailable: true, createdAt: new Date() },
      { id: '4', name: 'Conjunto de Xícaras', description: 'Porcelana, 6 unidades', isAvailable: true, createdAt: new Date() },
      { id: '5', name: 'Fruteira Decorativa', description: 'Aço inox', isAvailable: true, createdAt: new Date() }
    ];

    if (savedGifts) {
      try {
        const customGifts = JSON.parse(savedGifts);
        const formattedCustomGifts: Gift[] = customGifts.map((gift: any) => ({
          ...gift,
          isAvailable: true,
          createdAt: new Date()
        }));
        setGifts([...defaultGifts, ...formattedCustomGifts]);
      } catch (error) {
        console.error('Erro ao carregar presentes customizados:', error);
        setGifts(defaultGifts);
      }
    } else {
      setGifts(defaultGifts);
    }
    
    console.log('Presentes carregados (localStorage):', defaultGifts.length + (savedGifts ? JSON.parse(savedGifts).length : 0));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!attending) {
      setShowGiftList(false);
      setShowStoreLink(false);
    }
  };

  const handleGiftOption = (willBring: boolean) => {
    setForm(prev => ({ ...prev, willBringGift: willBring }));
    setShowGiftList(willBring);
    setShowStoreLink(!willBring);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (useFirebase && firebaseStatus === 'connected') {
        // Salvar via API
        const guestResponse = await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            isAttending: form.isAttending,
            companions: form.companions,
            willBringGift: form.willBringGift,
            selectedGift: form.selectedGift,
            message: form.message
          })
        });

        if (!guestResponse.ok) {
          throw new Error('Falha ao salvar confirmação');
        }

        // Se um presente foi selecionado, marcar como indisponível
        if (form.selectedGift && form.selectedGift !== '') {
          const giftResponse = await fetch('/api/gifts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: form.selectedGift,
              isAvailable: false,
              selectedBy: form.name
            })
          });

          if (!giftResponse.ok) {
            console.error('Falha ao atualizar presente');
          }
        }

        toast.success('Confirmação enviada com sucesso!');
      } else {
        // Fallback para localStorage
        const confirmations = JSON.parse(localStorage.getItem('confirmations') || '[]');
        const newConfirmation = {
          ...form,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        confirmations.push(newConfirmation);
        localStorage.setItem('confirmations', JSON.stringify(confirmations));
        
        toast.success('Confirmação salva localmente!');
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar confirmação:', error);
      toast.error('Erro ao enviar confirmação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Obrigado pela confirmação!
        </h2>
        <p className="text-gray-600 mb-6">
          {form.isAttending 
            ? 'Sua presença foi confirmada com sucesso! Aguardamos vocês no nosso Chá Bar.' 
            : 'Obrigado por nos informar. Sentiremos sua falta!'}
        </p>
        
        {form.isAttending && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">📍 Local do Evento</h3>
              <p className="text-sm text-gray-600 mb-3">8RGC+6G Puris, Ibiúna - SP</p>
              <div className="flex space-x-2">
                <a
                  href="https://waze.com/ul?q=8RGC+6G%20Puris,%20Ibi%C3%BAna%20-%20SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  <Navigation size={16} className="mr-1" />
                  Waze
                </a>
                <a
                  href="https://maps.google.com/?q=8RGC+6G%20Puris,%20Ibi%C3%BAna%20-%20SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
                >
                  <MapPin size={16} className="mr-1" />
                  Google Maps
                </a>
              </div>
            </div>
            
            {!form.willBringGift && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🎁 Lista de Presentes</h3>
                <p className="text-sm text-gray-600 mb-3">Confira nossa lista de presentes online:</p>
                <a
                  href={precolandiaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  <GiftIcon size={16} className="mr-2" />
                  Ver Lista na Preçolândia
                </a>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-blue-600 hover:text-blue-700 underline"
        >
          Fazer nova confirmação
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Toaster position="top-center" />
      
      {/* Status do Firebase */}
      <div className="mb-4 p-3 rounded-lg flex items-center">
        {firebaseStatus === 'testing' && (
          <>
            <Loader2 className="animate-spin text-blue-500 mr-2" size={16} />
            <span className="text-sm text-blue-600">Conectando ao Firebase...</span>
          </>
        )}
        {firebaseStatus === 'connected' && (
          <>
            <CheckCircle className="text-green-500 mr-2" size={16} />
            <span className="text-sm text-green-600">Conectado - dados serão salvos permanentemente</span>
          </>
        )}
        {firebaseStatus === 'offline' && (
          <>
            <AlertCircle className="text-orange-500 mr-2" size={16} />
            <span className="text-sm text-orange-600">Modo offline - dados salvos localmente</span>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seu nome completo"
          />
        </div>

        {/* Confirmação de Presença */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Você confirmará presença? *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleAttendance(true)}
              className={`p-3 text-center rounded-lg border-2 transition-colors ${
                form.isAttending
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              ✅ Sim, estarei presente
            </button>
            <button
              type="button"
              onClick={() => handleAttendance(false)}
              className={`p-3 text-center rounded-lg border-2 transition-colors ${
                form.isAttending === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              ❌ Não poderei ir
            </button>
          </div>
        </div>

        {/* Acompanhantes */}
        {showCompanions && (
          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-gray-700 mb-2">
              Quantos acompanhantes?
            </label>
            <select
              id="companions"
              name="companions"
              value={form.companions}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Apenas eu</option>
              <option value={1}>Eu + 1 acompanhante</option>
              <option value={2}>Eu + 2 acompanhantes</option>
              <option value={3}>Eu + 3 acompanhantes</option>
              <option value={4}>Eu + 4 acompanhantes</option>
            </select>
          </div>
        )}

        {/* Presente */}
        {showCompanions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gostaria de presentear os noivos?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGiftOption(true)}
                className={`p-3 text-center rounded-lg border-2 transition-colors ${
                  form.willBringGift
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                🎁 Escolher da lista
              </button>
              <button
                type="button"
                onClick={() => handleGiftOption(false)}
                className={`p-3 text-center rounded-lg border-2 transition-colors ${
                  form.willBringGift === false
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                🛒 Ver lista externa
              </button>
            </div>
          </div>
        )}

        {/* Lista de Presentes */}
        {showGiftList && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Escolha um presente:
            </label>
            {gifts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  {firebaseStatus === 'testing' ? (
                    <>
                      <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                      Carregando presentes...
                    </>
                  ) : (
                    'Nenhum presente disponível'
                  )}
                </div>
                {firebaseStatus === 'offline' && (
                  <p className="text-sm text-orange-600">
                    Modo offline ativo. Alguns presentes podem não estar visíveis.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gifts.filter(gift => gift.isAvailable).map((gift) => (
                  <label
                    key={gift.id}
                    className={`block p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      form.selectedGift === gift.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedGift"
                      value={gift.id}
                      checked={form.selectedGift === gift.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-800">{gift.name}</div>
                    <div className="text-sm text-gray-600">{gift.description}</div>
                  </label>
                ))}
                
                {gifts.filter(gift => gift.isAvailable).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Todos os presentes já foram escolhidos! 🎁
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Link Preçolândia */}
        {showStoreLink && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">🛒 Lista de Presentes Online</h3>
            <p className="text-sm text-gray-600 mb-3">
              Confira nossa lista completa na Preçolândia e escolha o presente que desejar:
            </p>
            <a
              href={precolandiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <GiftIcon size={16} className="mr-2" />
              Acessar Lista na Preçolândia
            </a>
          </div>
        )}

        {/* Mensagem */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem para os noivos (opcional)
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deixe uma mensagem carinhosa para Éder e Vitória..."
          />
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={loading || !form.name}
          className="w-full flex items-center justify-center bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Enviando...
            </>
          ) : (
            <>
              Confirmar Presença
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RSVPFormEnhanced;
