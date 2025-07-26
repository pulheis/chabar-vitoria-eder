'use client';

import { useState, useEffect } from 'react';
import { Guest, Gift } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import LoginForm from '@/components/LoginForm';
import { 
  Users, 
  Gift as GiftIcon, 
  Download,
  LogOut,
  Heart
} from 'lucide-react';

export default function AdminSimplePage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Dashboard data
  const [guests, setGuests] = useState<Guest[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'gifts'>('dashboard');
  const [loading, setLoading] = useState(true);

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

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load guests
      const guestsResponse = await fetch('/api/guests');
      if (guestsResponse.ok) {
        const guestsData = await guestsResponse.json();
        setGuests(guestsData);
      }

      // Load gifts
      const giftsResponse = await fetch('/api/gifts');
      if (giftsResponse.ok) {
        const giftsData = await giftsResponse.json();
        setGifts(giftsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chabar_admin_auth');
    setIsAuthenticated(false);
    toast.success('Logout realizado com sucesso!');
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Failed to export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `convidados-chabar-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
        <LoginForm onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  // Stats calculations
  const totalGuests = guests.reduce((acc, guest) => acc + (guest.companions || 0) + 1, 0);
  const confirmedGuests = guests.filter(g => g.isAttending).reduce((acc, guest) => acc + (guest.companions || 0) + 1, 0);
  const availableGifts = gifts.filter(g => g.isAvailable).length;
  const selectedGifts = gifts.filter(g => !g.isAvailable).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-pink-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chá Bar - Admin Simples</h1>
                <p className="text-sm text-gray-600">Vitória & Éder</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Heart },
              { id: 'guests', label: 'Convidados', icon: Users },
              { id: 'gifts', label: 'Presentes', icon: GiftIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-pink-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total de Pessoas</dt>
                            <dd className="text-lg font-medium text-gray-900">{totalGuests}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Heart className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Confirmados</dt>
                            <dd className="text-lg font-medium text-gray-900">{confirmedGuests}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <GiftIcon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Presentes Disponíveis</dt>
                            <dd className="text-lg font-medium text-gray-900">{availableGifts}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <GiftIcon className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Presentes Escolhidos</dt>
                            <dd className="text-lg font-medium text-gray-900">{selectedGifts}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guests Tab */}
            {activeTab === 'guests' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Convidados</h2>
                
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {guests.map((guest) => (
                      <li key={guest.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${guest.isAttending ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                              <div className="text-sm text-gray-500">
                                {guest.companions ? `+ ${guest.companions} acompanhante(s)` : 'Sem acompanhantes'}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {guest.isAttending ? 'Confirmado' : 'Não vai'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Gifts Tab */}
            {activeTab === 'gifts' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Lista de Presentes</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gifts.map((gift) => (
                    <div key={gift.id} className={`bg-white overflow-hidden shadow rounded-lg border-2 ${gift.isAvailable ? 'border-green-200' : 'border-gray-200'}`}>
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{gift.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            gift.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {gift.isAvailable ? 'Disponível' : 'Escolhido'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{gift.description}</p>
                        {!gift.isAvailable && gift.selectedBy && (
                          <p className="mt-2 text-xs text-gray-400">Escolhido por: {gift.selectedBy}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
