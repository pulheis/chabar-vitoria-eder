'use client';

import { useState } from 'react';
import { Eye, EyeOff, Heart } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Chamar API de validação que usa Google Sheets
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      const result = await response.json();

      if (response.ok && result.valid) {
        // Salvar no localStorage para manter sessão
        localStorage.setItem('chabar_admin_auth', 'true');
        localStorage.setItem('chabar_admin_user', result.user || 'Admin');
        onLogin();
      } else {
        setError('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro na validação:', error);
      setError('Erro na validação. Tente novamente.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-beige-texture flex items-center justify-center p-4">
      <div className="bg-beige-texture-light rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Portal dos Noivos
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            Vitória + Éder 
            <Heart size={16} className="text-gray-600" strokeWidth={1.5} fill="none" />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="login-field w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              placeholder="Digite o usuário"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="login-field w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900 pr-12"
                placeholder="Digite a senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
