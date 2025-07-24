'use client';

import { useState, useEffect } from 'react';
import { Guest, Gift } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import LoginForm from '@/components/LoginForm';
import { 
  Users, 
  Gift as GiftIcon, 
  Plus,
  Edit,
  Trash2,
  Download,
  LogOut,
  Heart
} from 'lucide-react';

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Dashboard data
  const [guests, setGuests] = useState<Guest[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'gifts'>('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Gift management
  const [showAddGift, setShowAddGift] = useState(false);
  const [newGift, setNewGift] = useState({ name: '', description: '' });
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('chabar_admin_auth') === 'true';
      setIsAuthenticated(isAuth);
      setAuthLoading(false);
    };
    
    checkAuth();
  }, []);

  // Load data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('chabar_admin_auth');
    setIsAuthenticated(false);
    setGuests([]);
    setGifts([]);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Carregando dados do admin...');
      
      const [guestsResponse, giftsResponse] = await Promise.all([
        fetch('/api/guests'),
        fetch('/api/gifts')
      ]);
      
      console.log('Responses:', { 
        guests: guestsResponse.status, 
        gifts: giftsResponse.status 
      });
      
      if (guestsResponse.ok && giftsResponse.ok) {
        const guestsData = await guestsResponse.json();
        const giftsData = await giftsResponse.json();
        
        console.log('Dados carregados:', { 
          guests: guestsData.length, 
          gifts: giftsData.length 
        });
        
        setGuests(guestsData);
        setGifts(giftsData);
      } else {
        console.error('Erro ao carregar dados:', {
          guests: guestsResponse.status,
          gifts: giftsResponse.status
        });
        toast.error('Erro ao carregar dados');
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGift.name.trim()) {
      toast.error('Nome do presente é obrigatório');
      return;
    }
    
    try {
      console.log('Adicionando presente:', newGift);
      
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGift.name.trim(),
          description: newGift.description.trim(),
          isAvailable: true
        }),
      });

      console.log('Resposta da API:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Presente adicionado:', result);
        
        setNewGift({ name: '', description: '' });
        setShowAddGift(false);
        await loadData();
        toast.success('Presente adicionado com sucesso!');
      } else {
        const error = await response.text();
        console.error('Erro na API:', error);
        toast.error('Erro ao adicionar presente');
      }
    } catch (error) {
      toast.error('Erro ao adicionar presente');
      console.error('Error adding gift:', error);
    }
  };

  const handleUpdateGift = async (gift: Gift) => {
    try {
      const response = await fetch('/api/gifts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: gift.id,
          name: gift.name,
          description: gift.description,
          isAvailable: gift.isAvailable
        }),
      });

      if (response.ok) {
        setEditingGift(null);
        await loadData();
        toast.success('Presente atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar presente');
      }
    } catch (error) {
      toast.error('Erro ao atualizar presente');
      console.error('Error updating gift:', error);
    }
  };

  const handleToggleGiftAvailability = async (giftId: string, isAvailable: boolean) => {
    try {
      const response = await fetch('/api/gifts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: giftId, 
          isAvailable: !isAvailable,
          selectedBy: !isAvailable ? null : undefined 
        }),
      });

      if (response.ok) {
        await loadData();
        toast.success(`Presente ${!isAvailable ? 'marcado como disponível' : 'marcado como escolhido'}!`);
      } else {
        toast.error('Erro ao atualizar presente');
      }
    } catch (error) {
      toast.error('Erro ao atualizar presente');
      console.error('Error updating gift availability:', error);
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    if (confirm('Tem certeza que deseja excluir este presente?')) {
      try {
        const response = await fetch('/api/gifts', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: giftId }),
        });

        if (response.ok) {
          await loadData();
          toast.success('Presente excluído com sucesso!');
        } else {
          toast.error('Erro ao excluir presente');
        }
      } catch (error) {
        toast.error('Erro ao excluir presente');
        console.error('Error deleting gift:', error);
      }
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (confirm('Tem certeza que deseja excluir este convidado? Os presentes selecionados por ele serão liberados.')) {
      try {
        // Primeiro, encontrar o convidado para ver quais presentes foram selecionados
        const guest = guests.find(g => g.id === guestId);
        
        // Liberar presentes selecionados pelo convidado
        if (guest && guest.selectedGifts && guest.selectedGifts.length > 0) {
          for (const giftId of guest.selectedGifts) {
            await fetch('/api/gifts', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: giftId,
                isAvailable: true,
                selectedBy: null
              })
            });
          }
        }

        // Excluir o convidado
        const response = await fetch(`/api/guests?id=${guestId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadData();
          toast.success('Convidado excluído e presentes liberados!');
        } else {
          toast.error('Erro ao excluir convidado');
        }
      } catch (error) {
        toast.error('Erro ao excluir convidado');
        console.error('Error deleting guest:', error);
      }
    }
  };

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lista-convidados-cha-bar.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Lista de convidados exportada com sucesso!');
      } else {
        toast.error('Erro ao exportar dados');
      }
    } catch (error) {
      toast.error('Erro ao exportar dados');
      console.error('Error exporting data:', error);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-beige-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const attendingGuests = guests.filter(g => g.isAttending);
  const totalCompanions = attendingGuests.reduce((sum, g) => sum + Number(g.companions || 0), 0);
  const selectedGifts = gifts.filter(g => !g.isAvailable);

  return (
    <div className="min-h-screen bg-beige-texture">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-beige-texture shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal dos Noivos</h1>
              <p className="text-gray-600 flex items-center gap-2">
                Vitória + Éder 
                <Heart size={16} className="text-gray-600" strokeWidth={1.5} fill="none" />
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Logado como admin</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-beige-texture border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Users },
              { id: 'guests', label: 'Convidados', icon: Users },
              { id: 'gifts', label: 'Presentes', icon: GiftIcon }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'dashboard' | 'guests' | 'gifts')}
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
              <div className="bg-beige-texture-light overflow-hidden shadow rounded-lg">
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

              <div className="bg-beige-texture-light overflow-hidden shadow rounded-lg">
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

              <div className="bg-beige-texture-light overflow-hidden shadow rounded-lg">
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
            </div>

            {/* Recent Activity */}
            <div className="bg-beige-texture-light shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Confirmações Recentes
                </h3>
                <div className="space-y-3">
                  {guests.slice(0, 5).map((guest, index) => (
                    <div key={guest.id || index} className="flex items-center justify-between">
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
                    <p className="text-sm text-gray-500 text-center py-4">
                      Ainda não há confirmações
                    </p>
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
                onClick={exportToPDF}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={20} className="mr-2" />
                Exportar PDF
              </button>
            </div>

            <div className="bg-beige-texture-light shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-beige-texture">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-beige-texture-light divide-y divide-gray-200">
                    {guests.map((guest, index) => (
                      <tr key={guest.id || index}>
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
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {guest.willBringGift ? (
                            guest.selectedGifts && guest.selectedGifts.length > 0 ? (
                              <div>
                                {guest.selectedGifts.map(giftId => {
                                  const gift = gifts.find(g => g.id === giftId);
                                  return gift ? (
                                    <div key={giftId} className="text-xs bg-gray-100 rounded px-2 py-1 mb-1">
                                      {gift.name}
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            ) : 'Lista externa'
                          ) : 'Não trará presente'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(guest.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => guest.id && handleDeleteGuest(guest.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Excluir convidado"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {guests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          Ainda não há convidados confirmados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gifts' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gerenciar Presentes</h2>
              <button
                onClick={() => setShowAddGift(true)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Adicionar Presente
              </button>
            </div>

            {/* Add Gift Modal */}
            {showAddGift && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-beige-texture-light rounded-lg p-6 w-full max-w-md">
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
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-beige-texture-subtle transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Gift Modal */}
            {editingGift && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-beige-texture-light rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Presente</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateGift(editingGift);
                  }}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do presente
                      </label>
                      <input
                        type="text"
                        value={editingGift.name}
                        onChange={(e) => setEditingGift({ ...editingGift, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição (opcional)
                      </label>
                      <textarea
                        value={editingGift.description || ''}
                        onChange={(e) => setEditingGift({ ...editingGift, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        rows={3}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingGift.isAvailable}
                          onChange={(e) => setEditingGift({ ...editingGift, isAvailable: e.target.checked })}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">Disponível para seleção</span>
                      </label>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingGift(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-beige-texture-subtle transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-beige-texture-light shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-beige-texture">
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
                  <tbody className="bg-beige-texture-light divide-y divide-gray-200">
                    {gifts.map((gift, index) => (
                      <tr key={gift.id || index}>
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
                            gift.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {gift.isAvailable ? 'Disponível' : 'Escolhido'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {gift.selectedBy || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => gift.id && handleToggleGiftAvailability(gift.id, gift.isAvailable)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                gift.isAvailable 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                              title={gift.isAvailable ? 'Marcar como escolhido' : 'Marcar como disponível'}
                            >
                              {gift.isAvailable ? 'Marcar Escolhido' : 'Tornar Disponível'}
                            </button>
                            <button
                              onClick={() => setEditingGift(gift)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              title="Editar presente"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => gift.id && handleDeleteGift(gift.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Excluir presente"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {gifts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          Ainda não há presentes cadastrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
