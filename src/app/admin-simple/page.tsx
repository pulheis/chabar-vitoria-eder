'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Gift as GiftIcon, Users, MessageCircle, Download, Heart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Gift {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  selectedBy?: string;
}

interface Guest {
  id: number;
  name: string;
  isAttending: boolean;
  companions: number;
  willBringGift: boolean;
  selectedGift: string;
  message: string;
  createdAt: string;
}

export default function AdminSimplePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'gifts' | 'messages'>('dashboard');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showAddGift, setShowAddGift] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [newGift, setNewGift] = useState({ name: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Carregar presentes customizados
    const savedGifts = localStorage.getItem('customGifts');
    if (savedGifts) {
      const customGifts = JSON.parse(savedGifts);
      setGifts([
        ...customGifts.map((gift: any) => ({ ...gift, isAvailable: true })),
        { id: '1', name: 'Jogo de Taças de Vinho', description: 'Cristal, 6 peças', isAvailable: true },
        { id: '2', name: 'Kit Chá Gourmet', description: 'Caixa com 12 sabores', isAvailable: true },
        { id: '3', name: 'Tábua de Queijos', description: 'Bambu com acessórios', isAvailable: true },
        { id: '4', name: 'Conjunto de Xícaras', description: 'Porcelana, 6 unidades', isAvailable: true },
        { id: '5', name: 'Fruteira Decorativa', description: 'Aço inox', isAvailable: true }
      ]);
    } else {
      setGifts([
        { id: '1', name: 'Jogo de Taças de Vinho', description: 'Cristal, 6 peças', isAvailable: true },
        { id: '2', name: 'Kit Chá Gourmet', description: 'Caixa com 12 sabores', isAvailable: true },
        { id: '3', name: 'Tábua de Queijos', description: 'Bambu com acessórios', isAvailable: true },
        { id: '4', name: 'Conjunto de Xícaras', description: 'Porcelana, 6 unidades', isAvailable: true },
        { id: '5', name: 'Fruteira Decorativa', description: 'Aço inox', isAvailable: true }
      ]);
    }

    // Carregar confirmações
    const savedConfirmations = localStorage.getItem('confirmations');
    if (savedConfirmations) {
      setGuests(JSON.parse(savedConfirmations));
    }
  };

  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    const newGiftItem = {
      id: Date.now().toString(),
      name: newGift.name,
      description: newGift.description
    };

    const currentCustomGifts = JSON.parse(localStorage.getItem('customGifts') || '[]');
    const updatedCustomGifts = [...currentCustomGifts, newGiftItem];
    localStorage.setItem('customGifts', JSON.stringify(updatedCustomGifts));

    setNewGift({ name: '', description: '' });
    setShowAddGift(false);
    loadData();
    toast.success('Presente adicionado com sucesso!');
  };

  const handleDeleteGift = (giftId: string) => {
    if (confirm('Tem certeza que deseja excluir este presente?')) {
      const currentCustomGifts = JSON.parse(localStorage.getItem('customGifts') || '[]');
      const updatedCustomGifts = currentCustomGifts.filter((gift: any) => gift.id !== giftId);
      localStorage.setItem('customGifts', JSON.stringify(updatedCustomGifts));
      loadData();
      toast.success('Presente excluído com sucesso!');
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Confirmou', 'Acompanhantes', 'Presente', 'Mensagem', 'Data'];
    const csvContent = [
      headers.join(','),
      ...guests.map(guest => [
        guest.name,
        guest.isAttending ? 'Sim' : 'Não',
        guest.companions,
        guest.selectedGift || 'Lista externa',
        guest.message || '',
        new Date(guest.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'convidados-cha-bar.csv';
    a.click();
  };

  const attendingGuests = guests.filter(g => g.isAttending);
  const totalCompanions = attendingGuests.reduce((sum, g) => sum + g.companions, 0);
  const selectedGifts = guests.filter(g => g.selectedGift && g.selectedGift !== '');
  const guestsWithMessages = guests.filter(g => g.message && g.message.trim() !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal dos Noivos (Demo)</h1>
              <p className="text-gray-600 flex items-center gap-2">
                Vitória + Éder 
                <Heart size={16} className="text-gray-600" strokeWidth={1.5} fill="none" />
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Ver Site dos Convidados
            </a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Users },
              { id: 'guests', label: 'Convidados', icon: Users },
              { id: 'gifts', label: 'Presentes', icon: GiftIcon },
              { id: 'messages', label: 'Mensagens', icon: MessageCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={20} className="mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Confirmados
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {attendingGuests.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total de Pessoas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {attendingGuests.length + totalCompanions}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <GiftIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Presentes Escolhidos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {selectedGifts.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Mensagens
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {guestsWithMessages.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Confirmações Recentes
                </h3>
                <div className="space-y-3">
                  {guests.slice(0, 5).map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                        <p className="text-sm text-gray-500">
                          {guest.isAttending ? 'Confirmou presença' : 'Não vai comparecer'}
                          {guest.companions > 0 && ` • ${guest.companions} acompanhante(s)`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(guest.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {guests.length === 0 && (
                    <p className="text-gray-500 text-sm">Nenhuma confirmação ainda.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Lista de Convidados</h2>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={20} className="mr-2" />
                Exportar CSV
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acompanhantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guests.map((guest) => (
                    <tr key={guest.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guest.isAttending 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {guest.isAttending ? 'Confirmado' : 'Não vai'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.companions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {guest.selectedGift || 'Lista externa'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(guest.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {guests.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum convidado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ainda não há confirmações de presença.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gifts' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gerenciar Presentes</h2>
              <button
                onClick={() => setShowAddGift(true)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                <Plus size={20} className="mr-2" />
                Adicionar Presente
              </button>
            </div>

            {/* Add Gift Modal */}
            {showAddGift && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar Presente</h3>
                  <form onSubmit={handleAddGift}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do presente
                      </label>
                      <input
                        type="text"
                        value={newGift.name}
                        onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição (opcional)
                      </label>
                      <textarea
                        value={newGift.description}
                        onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddGift(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                      >
                        Adicionar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Escolhido por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gifts.map((gift) => {
                    const selectedByGuest = guests.find(g => g.selectedGift === gift.name);
                    return (
                      <tr key={gift.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{gift.name}</div>
                            {gift.description && (
                              <div className="text-sm text-gray-500">{gift.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedByGuest 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedByGuest ? 'Escolhido' : 'Disponível'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {selectedByGuest?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* Só permite deletar presentes customizados (não os padrão) */}
                            {!['1', '2', '3', '4', '5'].includes(gift.id) && (
                              <button
                                onClick={() => handleDeleteGift(gift.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mensagens dos Convidados</h2>
            
            <div className="space-y-4">
              {guestsWithMessages.map((guest) => (
                <div key={guest.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{guest.name}</h3>
                      <p className="mt-2 text-gray-700">{guest.message}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(guest.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {guestsWithMessages.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma mensagem</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ainda não há mensagens dos convidados.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
