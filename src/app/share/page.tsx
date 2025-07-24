'use client';

import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Share2, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SharePage() {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get the current URL but replace /share with nothing
    const baseUrl = window.location.origin;
    setCurrentUrl(baseUrl);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Compartilhar Convite
          </h1>
        </div>
        
        <div className="text-xl md:text-2xl font-semibold text-black mb-2">
          <span className="font-cha">CHÁ</span> <span className="font-cursive-bar">Bar</span> - Éder & Vitória
        </div>
        
        <p className="text-gray-600">
          Compartilhe este link com seus convidados
        </p>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* QR Code */}
          {currentUrl && (
            <QRCodeDisplay 
              url={currentUrl} 
              title="Escaneie para acessar no celular"
            />
          )}

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-4">
              <Share2 className="text-gray-800 mr-2" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Como compartilhar</h3>
            </div>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                <div>
                  <p className="font-medium text-gray-800">WhatsApp</p>
                  <p>Copie o link e cole no grupo ou chat dos convidados</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                <div>
                  <p className="font-medium text-gray-800">QR Code</p>
                  <p>Imprima ou salve a imagem do QR Code para enviar aos convidados</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                <div>
                  <p className="font-medium text-gray-800">Redes Sociais</p>
                  <p>Compartilhe o link no Instagram, Facebook ou outras redes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/"
              className="flex items-center justify-center bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Users className="mr-2" size={16} />
              Ver Convite
            </a>
            <a
              href="/admin"
              className="flex items-center justify-center bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ⚙️ Administrar
            </a>
          </div>

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">Feito com 💙 para Éder & Vitória</p>
          </div>
        </div>
      </main>
    </div>
  );
}
