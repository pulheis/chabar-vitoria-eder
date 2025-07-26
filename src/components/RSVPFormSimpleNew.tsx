'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Gift as GiftIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Gift } from '@/types';

interface FormData {
  name: string;
  rg: string;
  licensePlate: string;
  companions: number;
  willBringGift: boolean;
  selectedGift: string;
}

interface ValidationErrors {
  name?: string;
  rg?: string;
  licensePlate?: string;
  gift?: string;
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

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [announcement, setAnnouncement] = useState('');

  const precolandiaUrl = 'https://www.precolandia.com.br/gift-list-details/view/cha-bar-edinho-e-vi';

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      const response = await fetch('/api/gifts');
      if (response.ok) {
        const data = await response.json();
        setGifts(data.filter((gift: Gift) => gift.isAvailable));
      }
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro específico quando usuário corrigir
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGiftOptionChange = (willBring: boolean) => {
    setForm(prev => ({ 
      ...prev, 
      willBringGift: willBring,
      selectedGift: willBring ? prev.selectedGift : ''
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

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
      setAnnouncement('Por favor, corrija os erros no formulário.');
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
        body: JSON.stringify({
          name: form.name,
          rg: form.rg,
          licensePlate: form.licensePlate,
          isAttending: true, // Sempre true pois só quem preenche está confirmando
          companions: form.companions,
          willBringGift: form.willBringGift,
          selectedGift: form.selectedGift,
          createdAt: new Date()
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setAnnouncement('Confirmação enviada com sucesso!');
      } else {
        throw new Error('Erro ao salvar confirmação');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrors({ name: 'Erro ao enviar confirmação. Tente novamente.' });
      setAnnouncement('Erro ao enviar confirmação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmação Enviada!</h2>
          <p className="text-gray-600 mb-6">
            Obrigado por confirmar sua presença, {form.name}!
          </p>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold mb-2">📍 Local do Evento:</p>
              <p>Condomínio [Endereço]</p>
              <p className="text-xs mt-2">Seus dados foram enviados para liberação na portaria.</p>
            </div>
            
            <div className="flex gap-4">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                <MapPin className="inline mr-2" size={16} />
                Ver no Mapa
              </a>
              <a
                href="https://waze.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                <Navigation className="inline mr-2" size={16} />
                Abrir no Waze
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Aviso importante */}
      <div className="max-w-md mx-auto mb-6 bg-white border-l-4 border-black p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-black mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">
              O evento será em um condomínio. Precisamos do seu nome completo, RG e placa do veículo para liberar a entrada na portaria.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <span className="font-cha">Chá</span> <span className="font-cursive-bar">Bar</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Vitória + Eder
          </p>
          
          {/* Informações do Evento */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="text-gray-700 mr-2" size={20} />
              <span className="font-semibold text-gray-800">Local do Evento</span>
            </div>
            <p className="text-gray-600 text-sm">
              [Endereço do Condomínio]<br />
              [Data e Horário]
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {announcement && (
            <div 
              role="alert" 
              aria-live="polite"
              className="sr-only"
            >
              {announcement}
            </div>
          )}

          {/* Nome Completo */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Seu nome completo"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* RG */}
          <div>
            <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-2">
              RG *
            </label>
            <input
              type="text"
              id="rg"
              name="rg"
              value={form.rg}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Número do RG"
              aria-describedby={errors.rg ? "rg-error" : undefined}
            />
            {errors.rg && (
              <p id="rg-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.rg}
              </p>
            )}
          </div>

          {/* Placa do Veículo */}
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
              Placa do Veículo *
            </label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              value={form.licensePlate}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="ABC-1234"
              aria-describedby={errors.licensePlate ? "licensePlate-error" : undefined}
            />
            {errors.licensePlate && (
              <p id="licensePlate-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.licensePlate}
              </p>
            )}
          </div>

          {/* Número de Acompanhantes */}
          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Acompanhantes (opcional)
            </label>
            <select
              id="companions"
              name="companions"
              value={form.companions}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value={0}>Apenas eu</option>
              <option value={1}>Eu + 1 acompanhante</option>
              <option value={2}>Eu + 2 acompanhantes</option>
              <option value={3}>Eu + 3 acompanhantes</option>
              <option value={4}>Eu + 4 acompanhantes</option>
            </select>
          </div>

          {/* Presente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Vai levar presente pessoalmente?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGiftOptionChange(true)}
                className={`p-3 text-center rounded-lg border-2 transition-colors ${
                  form.willBringGift
                    ? 'border-gray-800 bg-gray-100 text-gray-800'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => handleGiftOptionChange(false)}
                className={`p-3 text-center rounded-lg border-2 transition-colors ${
                  !form.willBringGift
                    ? 'border-gray-800 bg-gray-100 text-gray-800'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* Lista de Presentes - Se "Sim" */}
          {form.willBringGift && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Escolha um presente da lista:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gifts.map((gift) => (
                  <label key={gift.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="selectedGift"
                      value={gift.id}
                      checked={form.selectedGift === gift.id}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{gift.name}</span>
                      {gift.description && (
                        <span className="text-gray-600 ml-2">- {gift.description}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.gift && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  {errors.gift}
                </p>
              )}
            </div>
          )}

          {/* Link Preçolândia - Se "Não" */}
          {!form.willBringGift && (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <GiftIcon className="text-gray-700 mr-2" size={24} />
                <span className="font-semibold text-gray-800">Escolha seu presente</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Acesse nossa lista na Preçolândia:
              </p>
              <a
                href={precolandiaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ver Lista de Presentes
              </a>
            </div>
          )}

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              'Enviar Confirmação'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RSVPFormSimple;
