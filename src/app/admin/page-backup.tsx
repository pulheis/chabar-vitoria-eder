'use client';

import { useState, useEffect } from 'react';
import { Guest, Gift } from '@/types';
import { Users, Gift as GiftIcon, Download } from 'lucide-react';

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [guestsResponse, giftsResponse] = await Promise.all([
        fetch('/api/guests'),
        fetch('/api/gifts')
      ]);
      
      if (guestsResponse.ok && giftsResponse.ok) {
        const guestsData = await guestsResponse.json();
        const giftsData = await giftsResponse.json();
        setGuests(guestsData);
        setGifts(giftsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      guests,
      gifts,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chabar-dados-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const attendingGuests = guests.filter(g => g.isAttending);
  const totalPeople = attendingGuests.reduce((sum, g) => sum + 1 + (g.companions || 0), 0);
  const selectedGifts = gifts.filter(g => !g.isAvailable).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Portal Administrativo
              </h1>
              <p className="text-gray-600">
                Chá Bar - Vitória + Eder
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <Download className="mr-2" size={16} />
              Exportar Dados
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-gray-700 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmações</p>
                <p className="text-2xl font-bold text-gray-800">{attendingGuests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-gray-700 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pessoas</p>
                <p className="text-2xl font-bold text-gray-800">{totalPeople}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <GiftIcon className="h-8 w-8 text-gray-700 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Presentes Selecionados</p>
                <p className="text-2xl font-bold text-gray-800">{selectedGifts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmações de Presença</h2>
          
          {attendingGuests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma confirmação ainda</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-800">Nome</th>
                    <th className="px-4 py-3 font-medium text-gray-800">RG</th>
                    <th className="px-4 py-3 font-medium text-gray-800">Placa</th>
                    <th className="px-4 py-3 font-medium text-gray-800">Acompanhantes</th>
                    <th className="px-4 py-3 font-medium text-gray-800">Presente</th>
                    <th className="px-4 py-3 font-medium text-gray-800">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendingGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{guest.name}</td>
                      <td className="px-4 py-3 text-gray-600">{guest.rg || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{guest.licensePlate || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{guest.companions || 0}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {guest.willBringGift ? (guest.selectedGift ? 'Presente selecionado' : 'Comprará da lista') : 'Não trará presente'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(guest.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Gifts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Presentes</h2>
          
          {gifts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum presente cadastrado</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gifts.map((gift) => (
                <div 
                  key={gift.id} 
                  className={`p-4 rounded-lg border-2 ${
                    gift.isAvailable 
                      ? 'border-gray-200 bg-white' 
                      : 'border-gray-400 bg-gray-100'
                  }`}
                >
                  <h3 className="font-medium text-gray-800">{gift.name}</h3>
                  {gift.description && (
                    <p className="text-sm text-gray-600 mt-1">{gift.description}</p>
                  )}
                  <p className={`text-sm mt-2 ${
                    gift.isAvailable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gift.isAvailable ? 'Disponível' : `Selecionado por: ${gift.selectedBy}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
