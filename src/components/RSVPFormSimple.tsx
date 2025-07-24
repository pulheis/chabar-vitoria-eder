'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Gift as GiftIcon, CheckCircle, AlertCircle, Heart, Wine, Sun, Instagram } from 'lucide-react';
import { Gift } from '@/types';

interface FormData {
  name: string;
  rg: string;
  licensePlate: string;
  companions: number;
  willBringGift: boolean;
  selectedGifts: string[];
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
    selectedGifts: []
  });

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [giftFilter, setGiftFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [announcement, setAnnouncement] = useState('');

  const precolandiaUrl = 'https://www.precolandia.com.br/gift-list-details/view/cha-bar-edinho-e-vi';

  const loadGifts = useCallback(async () => {
    try {
      const response = await fetch('/api/gifts');
      if (response.ok) {
        const data = await response.json();
        const availableGifts = data.filter((gift: Gift) => gift.isAvailable);
        setGifts(availableGifts);
        setFilteredGifts(availableGifts);
        
        // Verificar se algum presente selecionado não está mais disponível
        const unavailableSelected = form.selectedGifts.filter(giftId => 
          !availableGifts.some((gift: Gift) => gift.id === giftId)
        );
        
        if (unavailableSelected.length > 0) {
          setAnnouncement(`Alguns presentes selecionados não estão mais disponíveis e foram removidos da sua seleção.`);
          
          // Remover presentes selecionados que não estão mais disponíveis
          setForm(prev => ({
            ...prev,
            selectedGifts: prev.selectedGifts.filter(giftId => 
              availableGifts.some((gift: Gift) => gift.id === giftId)
            )
          }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    }
  }, []);

  useEffect(() => {
    loadGifts();
    
    // Recarregar presentes a cada 30 segundos para detectar mudanças
    const interval = setInterval(loadGifts, 30000);
    
    return () => clearInterval(interval);
  }, [loadGifts]);

  // Filtrar presentes baseado no texto de busca
  useEffect(() => {
    if (!giftFilter.trim()) {
      setFilteredGifts(gifts);
    } else {
      const filtered = gifts.filter(gift => 
        gift.name.toLowerCase().includes(giftFilter.toLowerCase()) ||
        (gift.description && gift.description.toLowerCase().includes(giftFilter.toLowerCase()))
      );
      setFilteredGifts(filtered);
    }
  }, [giftFilter, gifts]);

  const formatRG = (value: string): string => {
    // Remove tudo que não for número
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica formatação: XX.XXX.XXX-X
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8, 9)}`;
  };

  const formatLicensePlate = (value: string): string => {
    // Remove caracteres especiais e converte para maiúsculo
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Aplica formatação: ABC-1234 ou ABC1234 (Mercosul)
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length === 4) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      // Nome em maiúsculo
      setForm(prev => ({ ...prev, [name]: value.toUpperCase() }));
    }
    else if (name === 'rg') {
      // Formatar RG automaticamente
      const formattedRG = formatRG(value);
      setForm(prev => ({ ...prev, [name]: formattedRG }));
    }
    else if (name === 'licensePlate') {
      // Formatar placa automaticamente
      const formattedPlate = formatLicensePlate(value);
      setForm(prev => ({ ...prev, [name]: formattedPlate }));
    }
    else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro específico quando usuário corrigir
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGiftOptionChange = (willBring: boolean) => {
    setForm(prev => ({ 
      ...prev, 
      willBringGift: willBring,
      selectedGifts: willBring ? prev.selectedGifts : []
    }));
  };

  const handleGiftSelection = (giftId: string) => {
    setForm(prev => {
      const isSelected = prev.selectedGifts.includes(giftId);
      const newSelectedGifts = isSelected
        ? prev.selectedGifts.filter(id => id !== giftId)
        : [...prev.selectedGifts, giftId];
      
      return {
        ...prev,
        selectedGifts: newSelectedGifts
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    } else {
      // Validar se tem pelo menos dois nomes
      const nameParts = form.name.trim().split(/\s+/).filter(part => part.length > 0);
      if (nameParts.length < 2) {
        newErrors.name = 'Digite nome e sobrenome completos';
      }
    }
    
    if (!form.rg.trim()) {
      newErrors.rg = 'RG é obrigatório';
    } else {
      // Remove formatação para validar apenas números
      const rgNumbers = form.rg.replace(/\D/g, '');
      if (rgNumbers.length < 8) {
        newErrors.rg = 'RG deve ter 8 ou 9 dígitos';
      }
    }
    
    if (!form.licensePlate.trim()) {
      newErrors.licensePlate = 'Placa do veículo é obrigatória';
    } else {
      // Remove formatação para validar
      const plateClean = form.licensePlate.replace(/[^A-Za-z0-9]/g, '');
      if (plateClean.length < 7) {
        newErrors.licensePlate = 'Placa deve ter 7 caracteres (ex: ABC1234)';
      }
    }
    
    if (form.willBringGift && form.selectedGifts.length === 0) {
      newErrors.gift = 'Por favor, selecione pelo menos um presente da lista';
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
      // Primeiro, verificar se os presentes selecionados ainda estão disponíveis
      if (form.willBringGift && form.selectedGifts.length > 0) {
        const response = await fetch('/api/gifts');
        if (response.ok) {
          const currentGifts = await response.json();
          const unavailableGifts = form.selectedGifts.filter(giftId => {
            const gift = currentGifts.find((g: Gift) => g.id === giftId);
            return !gift || !gift.isAvailable;
          });

          if (unavailableGifts.length > 0) {
            setErrors({ gift: 'Alguns presentes selecionados não estão mais disponíveis. Por favor, atualize sua seleção.' });
            setAnnouncement('Alguns presentes selecionados não estão mais disponíveis. Por favor, atualize sua seleção.');
            setLoading(false);
            // Recarregar presentes disponíveis
            await loadGifts();
            return;
          }
        }
      }

      // Marcar presentes selecionados como indisponíveis
      if (form.willBringGift && form.selectedGifts.length > 0) {
        for (const giftId of form.selectedGifts) {
          try {
            await fetch('/api/gifts', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: giftId,
                isAvailable: false,
                selectedBy: form.name
              })
            });
          } catch (error) {
            console.error(`Erro ao atualizar presente ${giftId}:`, error);
          }
        }
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
          selectedGifts: form.selectedGifts,
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
      <div className="mobile-container safe-area-full min-h-screen bg-beige-texture flex items-center justify-center">
        <div className="bg-beige-texture-light rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md text-center">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Confirmação Enviada!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Obrigado por confirmar sua presença, {form.name}!
          </p>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div className="bg-beige-texture p-4 rounded-lg">
              <p className="font-semibold mb-3">💌 Recadinho dos Noivos</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wine size={16} className="text-gray-600" />
                  <span>Leve sua bebida favorita</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sun size={16} className="text-gray-600 mt-0.5" />
                  <span>E não esquece a roupa de banho… Vai ter piscina!</span>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram size={16} className="text-gray-600" />
                  <span>Siga nosso Instagram {' '}
                    <a 
                      href="https://www.instagram.com/edinhoevi?igsh=eXF1ZjVqeWp3NTlm&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                      @edinhoevi
                    </a>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-beige-texture p-4 rounded-lg">
              <p className="font-semibold mb-2">📍 Local do Evento</p>
              <p>Condomínio Green Park - Puris - Ibiúna SP</p>
              <p className="text-xs mt-2">Seus dados foram enviados para liberação na portaria.</p>
            </div>
            
            <div className="flex gap-4">
              <a
                href="https://maps.app.goo.gl/sgEQcuy56y8qnPyL9?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <MapPin className="mr-2" size={16} />
                Ver no Mapa
              </a>
              <a
                href="https://waze.com/ul/h6gy3qd0qt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <Navigation className="mr-2" size={16} />
                Abrir no Waze
              </a>
            </div>

            <div className="text-center mt-6 p-4 bg-beige-texture-light rounded-lg">
              <p className="text-base font-medium text-gray-800 mb-2">Nos vemos lá!</p>
              <p className="text-gray-700 flex items-center justify-center gap-2">
                Vitória + Éder 
                <Heart size={16} className="text-gray-700" strokeWidth={1.5} fill="none" />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container safe-area-full min-h-screen bg-beige-texture">
      {/* Aviso importante */}
      <div className="w-full max-w-md mx-auto mb-4 sm:mb-6 bg-beige-texture-light border-l-4 border-black p-3 sm:p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-black mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-800">
              O evento será em um condomínio. Precisamos dos seus dados para autorizar a entrada na portaria.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-beige-texture-light rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
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
              className="touch-target w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900 placeholder-gray-500 text-base"
              placeholder="NOME COMPLETO"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900 placeholder-gray-500"
              placeholder="12.345.678-9"
              maxLength={12}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900 placeholder-gray-500"
              placeholder="ABC-1234"
              maxLength={9}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900"
            >
              <option value={0}>Apenas eu</option>
              <option value={1}>Eu + 1 acompanhante</option>
              <option value={2}>Eu + 2 acompanhantes</option>
              <option value={3}>Eu + 3 acompanhantes</option>
              <option value={4}>Eu + 4 acompanhantes</option>
              <option value={5}>Eu + 5 acompanhantes</option>
              <option value={6}>Eu + 6 acompanhantes</option>
              <option value={7}>Eu + 7 acompanhantes</option>
              <option value={8}>Eu + 8 acompanhantes</option>
              <option value={9}>Eu + 9 acompanhantes</option>
              <option value={10}>Eu + 10 acompanhantes</option>
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
                className={`touch-target p-3 sm:p-4 text-center rounded-lg border-2 transition-colors text-base ${
                  form.willBringGift
                    ? 'border-gray-800 bg-beige-texture text-gray-800'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => handleGiftOptionChange(false)}
                className={`touch-target p-3 sm:p-4 text-center rounded-lg border-2 transition-colors text-base ${
                  !form.willBringGift
                    ? 'border-gray-800 bg-beige-texture text-gray-800'
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
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Escolha os presentes da lista:
                </label>
                <span className="text-xs text-gray-600 bg-beige-texture px-2 py-1 rounded">
                  {form.selectedGifts.length} selecionado{form.selectedGifts.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Campo de filtro */}
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="buscar presente..."
                  value={giftFilter}
                  onChange={(e) => setGiftFilter(e.target.value)}
                  className="w-full px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 normal-case"
                  style={{ textTransform: 'none' }}
                />
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredGifts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {giftFilter ? 'Nenhum presente encontrado.' : 'Nenhum presente disponível.'}
                  </p>
                ) : (
                  filteredGifts.map((gift) => gift.id ? (
                    <label key={gift.id} className="flex items-center p-1.5 sm:p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-beige-texture-subtle">
                      <div className="relative mr-2 sm:mr-3 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={form.selectedGifts.includes(gift.id)}
                          onChange={() => handleGiftSelection(gift.id!)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          form.selectedGifts.includes(gift.id)
                            ? 'bg-gray-800 border-gray-800'
                            : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}>
                          {form.selectedGifts.includes(gift.id) && (
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm sm:text-base break-words">{gift.name}</span>
                        {gift.description && (
                          <span className="text-gray-600 ml-1 sm:ml-2 text-sm break-words">- {gift.description}</span>
                        )}
                      </div>
                    </label>
                  ) : null)
                )}
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
            <div className="bg-beige-texture rounded-lg p-4 text-center">
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
                className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ver Lista de Presentes
              </a>
            </div>
          )}

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="touch-target w-full flex items-center justify-center bg-gray-800 text-white py-3 sm:py-4 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base font-medium"
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
