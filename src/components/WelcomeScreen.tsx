'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';

interface WelcomeScreenProps {
  onConfirmPresence: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onConfirmPresence }) => {
  return (
    <div className="mobile-container safe-area-full min-h-screen bg-beige-texture">
      {/* Main Content */}
      <main className="px-4 pb-2" role="main">
        <div className="max-w-md mx-auto">
          {/* Imagem dos Noivos */}
          <div className="bg-beige-texture-light rounded-lg shadow-lg p-1 mb-4 sm:mb-6">
            <div className="relative w-full h-[36rem] sm:h-[48rem] md:h-[60rem] lg:h-[72rem] xl:h-[84rem] 2xl:h-[96rem] rounded-lg overflow-hidden">
              <Image
                src="/noivos.png"
                alt="Éder e Vitória - Noivos"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Botão Confirmar Presença */}
          <button
            onClick={onConfirmPresence}
            className="touch-target w-full flex items-center justify-center bg-gray-800 text-white py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium shadow-lg"
          >
            Confirmar Presença
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-2 text-gray-700 text-sm" role="contentinfo">
        <p className="flex items-center justify-center gap-1">
          Feito com <Heart size={16} className="text-gray-700" strokeWidth={1.5} fill="none" />
        </p>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
