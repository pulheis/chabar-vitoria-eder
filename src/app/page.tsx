'use client';

import { useState } from 'react';
import RSVPFormSimple from '@/components/RSVPFormSimple';
import WelcomeScreen from '@/components/WelcomeScreen';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const handleConfirmPresence = () => {
    setShowForm(true);
  };

  if (!showForm) {
    return (
      <>
        <Toaster position="top-center" />
        <WelcomeScreen onConfirmPresence={handleConfirmPresence} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-beige-texture">
      <Toaster position="top-center" />
      
      {/* Main Content */}
      <main className="px-4 pb-2" role="main">
        <div className="max-w-md mx-auto">
          <RSVPFormSimple />
        </div>
      </main>
    </div>
  );
}
