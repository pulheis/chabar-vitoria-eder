'use client';

import { useState, useEffect } from 'react';

export default function AdminDebugPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-beige-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-texture p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Portal Admin - Debug</h1>
        <div className="bg-beige-texture-light rounded-lg p-6">
          <p>Se você está vendo esta página, o componente está funcionando.</p>
          <p>Credenciais: admin / voucasar2025!</p>
        </div>
      </div>
    </div>
  );
}
