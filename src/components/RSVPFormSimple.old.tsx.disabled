'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Gift as GiftIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

interface FormData {
  name: string;
  rg: string;
  licensePlate: string;
  companions: number;
  willBringGift: boolean;
  selectedGift: string;
}

interface Gift {
  id: string;
  name: string;
  description?: string;
  isAvailable: boolean;
}

const RSVPFormSimple: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    rg: '',
    licensePlate: '',
    companions: 0,
    willBringGift: false,
    selectedGift: ''
  });
  
  const [showCompanions, setShowCompanions] = useState(false);
  const [showGiftList, setShowGiftList] = useState(false);
  const [showStoreLink, setShowStoreLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [availableGifts, setAvailableGifts] = useState<Gift[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Carregar presentes disponíveis da API
  useEffect(() => {
    const loadGifts = async () => {
      try {
        const response = await fetch('/api/gifts?available=true');
        if (response.ok) {
          const gifts = await response.json();
          setAvailableGifts(gifts);
        } else {
          // Fallback: inicializar presentes padrão
          await fetch('/api/initialize', { method: 'POST' });
          const retryResponse = await fetch('/api/gifts?available=true');
          if (retryResponse.ok) {
            const gifts = await retryResponse.json();
            setAvailableGifts(gifts);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar presentes:', error);
        toast.error('Erro ao carregar lista de presentes');
      }
    };

    loadGifts();
  }, []);

  const precolandiaUrl = 'https://www.precolandia.com.br/lista/eder-vitoria';

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

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    }
    
    if (!form.rg.trim()) {
      newErrors.rg = 'RG é obrigatório';
    }
    
    if (!form.licensePlate.trim()) {
      newErrors.licensePlate = 'Placa do veículo é obrigatória';
    }
    
    if (form.willBringGift && !form.selectedGift) {
      newErrors.gift = 'Por favor, selecione um presente da lista';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Anunciar erros para leitores de tela
      const errorMessages = Object.values(errors).join('. ');
      toast.error(`Erro no formulário: ${errorMessages}`);
      return;
    }
    
    setLoading(true);
    
    try {
      // Marcar presente como selecionado se foi escolhido
      if (form.willBringGift && form.selectedGift) {
        await fetch(`/api/gifts?id=${form.selectedGift}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isAvailable: false,
            selectedBy: form.name
          })
        });
      }

      // Salvar confirmação do convidado
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar confirmação');
      }
      
      setSubmitted(true);
      toast.success('Confirmação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar confirmação:', error);
      toast.error('Erro ao enviar confirmação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center" role="alert" aria-live="polite">
        <div className="text-4xl mb-4" role="img" aria-label="Comemoração">🎉</div>
        <h2 className="text-2xl font-bold text-black mb-4">
          Obrigado por confirmar sua presença!
        </h2>
        <p className="text-gray-700 mb-4">
          Estamos muito felizes em te receber no nosso <span className="font-cha text-black">CHÁ</span> <span className="font-cursive-bar text-black">Bar</span>!
        </p>
        
        <section className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200" aria-labelledby="event-info">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="text-black mr-2" size={20} aria-hidden="true" />
            <h3 id="event-info" className="font-semibold text-gray-800">Informações do Evento</h3>
          </div>
          <p className="text-gray-700 mb-1">
            <span className="sr-only">Data do evento:</span>
            📅 Data: 23 de agosto de 2025, às 13h
          </p>
          <p className="text-gray-700 mb-3">
            <span className="sr-only">Endereço do evento:</span>
            📍 Endereço: 8RGC+6G Puris, Ibiúna - SP
          </p>
          
          <nav aria-label="Links de navegação para o local do evento">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="https://waze.com/ul?ll=-23.6545,-47.2222" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="Abrir localização no aplicativo Waze (abre em nova aba)"
              >
                <Navigation className="mr-2" size={16} aria-hidden="true" />
                Abrir no Waze
              </a>
              <a 
                href="https://maps.google.com/?q=8RGC+6G+Puris+Ibiúna+SP" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                aria-label="Abrir localização no Google Maps (abre em nova aba)"
              >
                <MapPin className="mr-2" size={16} aria-hidden="true" />
                Google Maps
              </a>
            </div>
          </nav>
        </section>
        
        <p className="text-lg font-medium text-gray-800 mt-4">Nos vemos lá! 💙</p>
        <p className="text-black font-semibold">— Vitória + Éder</p>
      </div>
    );
  }

  return (
    <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit} noValidate>
      <h1 className="text-xl font-bold text-black mb-4 text-center">
        Confirme sua presença no <span className="font-cha">CHÁ</span> <span className="font-cursive-bar">Bar</span>
      </h1>
      
      <div className="mb-4">
        <label htmlFor="guest-name" className="block mb-2 font-medium text-gray-700">
          Nome do convidado <span className="text-red-500" aria-label="campo obrigatório">*</span>
        </label>
        <input
          id="guest-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby="name-help name-error"
          aria-invalid={errors.name ? 'true' : 'false'}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Seu nome completo"
        />
        <div id="name-help" className="sr-only">
          Digite seu nome completo para confirmar sua presença no evento
        </div>
        {errors.name && (
          <div id="name-error" role="alert" className="text-red-600 text-sm mt-1">
            {errors.name}
          </div>
        )}
        {errors.name && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <fieldset className="mb-4">
        <legend className="block mb-3 font-medium text-gray-700">
          Confirma presença? <span className="text-red-500" aria-label="campo obrigatório">*</span>
        </legend>
        <div className="flex gap-3" role="radiogroup" aria-required="true" aria-describedby="attendance-help attendance-error">
          <button
            type="button"
            role="radio"
            aria-checked={form.isAttending}
            aria-describedby="attendance-help"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAttendance(true);
              }
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
              form.isAttending 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleAttendance(true)}
          >
            <span aria-hidden="true">✅</span> Sim, estarei presente
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={!form.isAttending && form.name !== ''}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAttendance(false);
              }
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
              !form.isAttending && form.name !== '' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleAttendance(false)}
          >
            <span aria-hidden="true">❌</span> Não poderei comparecer
          </button>
        </div>
        <div id="attendance-help" className="sr-only">
          Selecione se você confirmará ou não sua presença no evento
        </div>
        {errors.attendance && (
          <div id="attendance-error" role="alert" className="text-red-600 text-sm mt-1">
            {errors.attendance}
          </div>
        )}
        {errors.attendance && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.attendance}
          </p>
        )}
      </fieldset>

      {showCompanions && (
        <div className="mb-4">
          <label htmlFor="companions-count" className="block mb-2 font-medium text-gray-700">
            Número de acompanhantes
          </label>
          <input
            id="companions-count"
            type="number"
            name="companions"
            min={0}
            max={10}
            value={form.companions}
            onChange={handleChange}
            aria-describedby="companions-help"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="0"
          />
          <div id="companions-help" className="text-sm text-gray-600 mt-1">
            Informe quantas pessoas virão com você (máximo 10)
          </div>
        </div>
      )}

      {form.isAttending && (
        <fieldset className="mb-4">
          <legend className="block mb-3 font-medium text-gray-700">
            Vai levar o presente pessoalmente?
          </legend>
          <div className="flex gap-3" role="radiogroup">
            <button
              type="button"
              role="radio"
              aria-checked={form.willBringGift}
              aria-describedby="gift-help"
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                form.willBringGift 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleGiftOption(true)}
            >
              <span aria-hidden="true">🎁</span> Sim, levarei presente
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!form.willBringGift && (showGiftList || showStoreLink)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                !form.willBringGift && (showGiftList || showStoreLink)
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleGiftOption(false)}
            >
              <span aria-hidden="true">🛒</span> Comprarei da lista
            </button>
          </div>
          <div id="gift-help" className="sr-only">
            Escolha se você levará um presente pessoalmente ou comprará da nossa lista online
          </div>
        </fieldset>
      )}

      {showGiftList && (
        <fieldset className="mb-4">
          <legend className="block mb-3 font-medium text-gray-700">
            Selecione o presente que você trará
          </legend>
          <div className="space-y-2 max-h-40 overflow-y-auto" role="radiogroup" aria-describedby="gift-list-help">
            {availableGifts.map((gift) => (
              <label 
                key={gift.id} 
                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 focus-within:bg-gray-50 focus-within:ring-2 focus-within:ring-gray-400 transition-colors"
              >
                <input
                  type="radio"
                  name="selectedGift"
                  value={gift.id}
                  checked={form.selectedGift === gift.id}
                  onChange={handleChange}
                  className="mr-3 text-black focus:ring-black"
                  aria-describedby={`gift-${gift.id}-description`}
                />
                <div>
                  <div className="font-medium text-gray-800">{gift.name}</div>
                  <div id={`gift-${gift.id}-description`} className="text-sm text-gray-600">{gift.description}</div>
                </div>
              </label>
            ))}
          </div>
          <div id="gift-list-help" className="text-sm text-gray-600 mt-2">
            Escolha um presente da lista para trazer pessoalmente ao evento
          </div>
          {errors.gift && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.gift}
            </p>
          )}
        </fieldset>
      )}
      
      {showStoreLink && (
        <section className="mb-4" aria-labelledby="store-section">
          <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
            <div className="flex items-center justify-center mb-3">
              <GiftIcon className="text-black mr-2" size={24} aria-hidden="true" />
              <h3 id="store-section" className="font-semibold text-gray-800">Lista de Presentes Online</h3>
            </div>
            
            <a
              href={precolandiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 focus:bg-gray-900 transition-colors mb-3 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Ver lista completa de presentes na Preçolandia (abre em nova aba)"
            >
              <span aria-hidden="true">🛍️</span> Ver lista na Preçolandia
            </a>
            
            <p className="text-sm text-gray-600">
              Clique no link acima para acessar nossa lista completa de presentes e fazer sua escolha online
            </p>
          </div>
        </section>
      )}

      <div className="mb-6">
        <label htmlFor="message-text" className="block mb-2 font-medium text-gray-700">
          Mensagem aos noivos (opcional)
        </label>
        <textarea
          id="message-text"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          aria-describedby="message-help"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Deixe uma mensagem carinhosa, divertida ou personalizada para os noivos..."
        />
        <div id="message-help" className="text-sm text-gray-600 mt-1">
          Compartilhe seus desejos e sentimentos para o casal neste momento especial
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !form.name}
        aria-describedby="submit-help"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-blue-700 focus:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
            <span>Enviando confirmação...</span>
            <span className="sr-only">Por favor aguarde</span>
          </span>
        ) : (
          <>
            Enviar confirmação
          </>
        )}
      </button>
      <div id="submit-help" className="sr-only">
        Clique para enviar sua confirmação de presença no Chá Bar
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
        containerStyle={{
          zIndex: 9999,
        }}
        containerClassName="accessibility-toaster"
      />
    </form>
  );
};

export default RSVPFormSimple;
