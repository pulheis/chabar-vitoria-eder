'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeDisplayProps {
  url: string;
  title?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, title = "Acesse pelo celular" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937', // Gray-800
          light: '#FFFFFF'
        }
      });
    }
  }, [url]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar link');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="flex items-center justify-center mb-4">
        <QrCode className="text-gray-800 mr-2" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="flex justify-center mb-4">
        <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      </div>
      
      <div className="text-sm text-gray-600 mb-4 break-all">
        {url}
      </div>
      
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {copied ? (
          <>
            <Check className="mr-2" size={16} />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="mr-2" size={16} />
            Copiar link
          </>
        )}
      </button>
    </div>
  );
};

export default QRCodeDisplay;
