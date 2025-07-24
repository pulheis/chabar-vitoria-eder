'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Gift as GiftIcon, Users, MessageCircle, Download, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Gift {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  selectedBy?: string;
}

interface Guest {
  id: string;
  name: string;
  isAttending: boolean;
  companions: number;
  willBringGift: boolean;
  se                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'tedGift: string;
  message: string;
  createdAt: Date;
}

interface Stats {
  totalGuests: number;
  attendingGuests: number;
  totalPeople: number;
  totalGifts: number;
  availableGifts: number;
  selectedGifts: number;
  messagesCount: number;
}

export default function AdminSimplePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'gifts' | 'messages'>('dashboard');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalGuests: 0,
    attendingGuests: 0,
    totalPeople: 0,
    totalGifts: 0,
    availableGifts: 0,
    selectedGifts: 0,
    messagesCount: 0
  });
  const [showAddGift, setShowAddGift] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [newGift, setNewGift] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar dados das APIs
      const [guestsRes, giftsRes, statsRes] = await Promise.all([
        fetch('/api/guests'),
        fetch('/api/gifts'),
        fetch('/api/stats')
      ]);

      if (guestsRes.ok) {
        const guestsData = await guestsRes.json();
        setGuests(guestsData);
      }

      if (giftsRes.ok) {
        const giftsData = await giftsRes.json();
        setGifts(giftsData);
      } else {
        // Inicializar presentes padrão se não existirem
        await fetch('/api/initialize', { method: 'POST' });
        const retryGiftsRes = await fetch('/api/gifts');
        if (retryGiftsRes.ok) {
          const giftsData = await retryGiftsRes.json();
          setGifts(giftsData);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do painel');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGift.name,
          description: newGift.description,
          isAvailable: true
        })
      });

      if (response.ok) {
        setNewGift({ name: '', description: '' });
        setShowAddGift(false);
        await loadData();
        toast.success('Presente adicionado com sucesso!');
      } else {
        throw new Error('Erro ao adicionar presente');
      }
    } catch (error) {
      console.error('Erro ao adicionar presente:', error);
      toast.error('Erro ao adicionar presente');
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    if (confirm('Tem certeza que deseja excluir este presente?')) {
      try {
        const response = await fetch(`/api/gifts?id=${giftId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadData();
          toast.success('Presente excluído com sucesso!');
        } else {
          throw new Error('Erro ao excluir presente');
        }
      } catch (error) {
        console.error('Erro ao excluir presente:', error);
        toast.error('Erro ao excluir presente');
      }
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (confirm('Tem certeza que deseja excluir esta confirmação?')) {
      try {
        const response = await fetch(`/api/guests?id=${guestId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadData();
          toast.success('Confirmação excluída com sucesso!');
        } else {
          throw new Error('Erro ao excluir confirmação');
        }
      } catch (error) {
        console.error('Erro ao excluir confirmação:', error);
        toast.error('Erro ao excluir confirmação');
      }
    }
  };

  const exportToCSV = () => {
    // Criar link para download via API
    const link = document.createElement('a');
    link.href = '/api/export';
    link.download = 'confirmacoes-cha-bar.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exportação iniciada!');
  };

  const getDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Convidados</p>
                <p className="text-2xl font-bold text-gray-700">{stats.totalGuests}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Confirmaram Presença</p>
                <p className="text-2xl font-bold text-blue-700">{stats.attendingGuests}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-slate-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total de Pessoas</p>
                <p className="text-2xl font-bold text-slate-700">{stats.totalPeople}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <GiftIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Presentes Selecionados</p>
                <p className="text-2xl font-bold text-blue-700">{stats.selectedGifts}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-indigo-600">Mensagens</p>
                <p className="text-2xl font-bold text-indigo-700">{stats.messagesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
            <div className="flex items-center">
              <GiftIcon className="h-8 w-8 text-gray-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Presentes Disponíveis</p>
                <p className="text-2xl font-bold text-gray-700">{stats.availableGifts}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const getGuestsTab = () => (
    <section className="space-y-4" aria-labelledby="guests-heading">
      <div className="flex items-center justify-between">
        <h2 id="guests-heading" className="text-2xl font-bold text-gray-800">Confirmações de Presença</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          aria-label="Exportar lista de confirmações para arquivo CSV"
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg" role="table" aria-label="Lista de confirmações de presença">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome do Convidado</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Confirmou Presença</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acompanhantes</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Presente</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data da Confirmação</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {guests.map((guest) => (
              <tr key={guest.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{guest.name}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    guest.isAttending ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`} role="status" aria-label={guest.isAttending ? 'Confirmou presença' : 'Não confirmou presença'}>
                    {guest.isAttending ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">{guest.companions || 0}</td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {guest.willBringGift ? (guest.selectedGift ? 'Presente selecionado' : 'Comprará da lista') : 'Não trará presente'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {new Date(guest.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleDeleteGuest(guest.id)}
                    className="text-red-600 hover:text-red-800 focus:text-red-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Excluir confirmação de ${guest.name}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Nenhuma confirmação de presença ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const getGiftsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Presentes</h2>
        <button
          onClick={() => setShowAddGift(true)}
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Presente
        </button>
      </div>

      {showAddGift && (
        <div className="bg-white p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Adicionar Novo Presente</h3>
          <form onSubmit={handleAddGift}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={newGift.name}
                  onChange={(e) => setNewGift({...newGift, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={newGift.description}
                  onChange={(e) => setNewGift({...newGift, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowAddGift(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifts.map((gift) => (
          <div key={gift.id} className={`border rounded-lg p-4 ${gift.isAvailable ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{gift.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{gift.description}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    gift.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {gift.isAvailable ? 'Disponível' : `Selecionado ${gift.selectedBy ? `por ${gift.selectedBy}` : ''}`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteGift(gift.id)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getMessagesTab = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Mensagens dos Convidados</h2>
      <div className="space-y-4">
        {guests
          .filter(guest => guest.message && guest.message.trim() !== '')
          .map((guest) => (
            <div key={guest.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{guest.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(guest.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-gray-700">{guest.message}</p>
            </div>
          ))
        }
        {guests.filter(guest => guest.message && guest.message.trim() !== '').length === 0 && (
          <p className="text-gray-500 text-center py-8">Nenhuma mensagem ainda.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo - Chá Bar Éder & Vitória
          </h1>
          <p className="text-gray-600">Gerencie confirmações e presentes do seu evento</p>
        </header>

        <main className="bg-white rounded-lg shadow-sm border" role="main">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" role="tablist" aria-label="Seções do painel administrativo">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Users },
                { id: 'guests', label: 'Convidados', icon: Users },
                { id: 'gifts', label: 'Presentes', icon: GiftIcon },
                { id: 'messages', label: 'Mensagens', icon: MessageCircle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  aria-controls={`${id}-panel`}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 ${
                    activeTab === id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div
              id="dashboard-panel"
              role="tabpanel"
              aria-labelledby="dashboard-tab"
              hidden={activeTab !== 'dashboard'}
            >
              {activeTab === 'dashboard' && getDashboard()}
            </div>
            <div
              id="guests-panel"
              role="tabpanel"
              aria-labelledby="guests-tab"
              hidden={activeTab !== 'guests'}
            >
              {activeTab === 'guests' && getGuestsTab()}
            </div>
            <div
              id="gifts-panel"
              role="tabpanel"
              aria-labelledby="gifts-tab"
              hidden={activeTab !== 'gifts'}
            >
              {activeTab === 'gifts' && getGiftsTab()}
            </div>
            <div
              id="messages-panel"
              role="tabpanel"
              aria-labelledby="messages-tab"
              hidden={activeTab !== 'messages'}
            >
              {activeTab === 'messages' && getMessagesTab()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
