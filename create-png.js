const { createCanvas } = require('canvas');
const fs = require('fs');

// Criar canvas 200x200
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');

// Fundo com gradiente azul para verde
const gradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
gradient.addColorStop(0, '#87CEEB'); // Azul claro
gradient.addColorStop(1, '#228B22'); // Verde floresta

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 200, 200);

// Criar máscara circular
ctx.globalCompositeOperation = 'destination-in';
ctx.beginPath();
ctx.arc(100, 100, 100, 0, Math.PI * 2);
ctx.fill();

ctx.globalCompositeOperation = 'source-over';

// Folhagem decorativa
ctx.fillStyle = '#228B22';
ctx.globalAlpha = 0.7;
ctx.beginPath();
ctx.ellipse(30, 60, 10, 5, 0, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#32CD32';
ctx.globalAlpha = 0.8;
ctx.beginPath();
ctx.ellipse(170, 40, 10, 5, 0, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#228B22';
ctx.globalAlpha = 0.6;
ctx.beginPath();
ctx.ellipse(40, 140, 10, 5, 0, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#32CD32';
ctx.globalAlpha = 0.7;
ctx.beginPath();
ctx.ellipse(160, 160, 10, 5, 0, 0, Math.PI * 2);
ctx.fill();

ctx.globalAlpha = 1.0;

// Noiva (esquerda)
ctx.save();
ctx.translate(75, 90);

// Véu
ctx.fillStyle = '#FFFFFF';
ctx.globalAlpha = 0.8;
ctx.beginPath();
ctx.ellipse(5, -25, 10, 8, -0.3, 0, Math.PI * 2);
ctx.fill();
ctx.globalAlpha = 1.0;

// Cabeça
ctx.fillStyle = '#F4A460';
ctx.beginPath();
ctx.arc(0, -20, 12, 0, Math.PI * 2);
ctx.fill();

// Cabelo
ctx.fillStyle = '#8B4513';
ctx.beginPath();
ctx.ellipse(0, -25, 10, 8, 0, 0, Math.PI * 2);
ctx.fill();

// Óculos
ctx.strokeStyle = '#000';
ctx.lineWidth = 1;
ctx.strokeRect(-8, -23, 16, 6);

// Vestido
ctx.fillStyle = '#F0F8FF';
ctx.beginPath();
ctx.moveTo(-12, 0);
ctx.quadraticCurveTo(0, -5, 12, 0);
ctx.lineTo(10, 25);
ctx.lineTo(-10, 25);
ctx.closePath();
ctx.fill();

// Cinto
ctx.fillStyle = '#4B0082';
ctx.fillRect(-10, 0, 20, 3);

// Braços
ctx.fillStyle = '#F4A460';
ctx.beginPath();
ctx.arc(-15, 5, 4, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(15, 5, 4, 0, Math.PI * 2);
ctx.fill();

ctx.restore();

// Noivo (direita)
ctx.save();
ctx.translate(125, 90);

// Cabeça
ctx.fillStyle = '#F4A460';
ctx.beginPath();
ctx.arc(0, -20, 12, 0, Math.PI * 2);
ctx.fill();

// Cabelo/barba
ctx.fillStyle = '#2F4F4F';
ctx.beginPath();
ctx.ellipse(0, -25, 10, 8, 0, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.ellipse(0, -12, 8, 6, 0, 0, Math.PI * 2);
ctx.fill();

// Óculos
ctx.fillStyle = '#FFD700';
ctx.globalAlpha = 0.8;
ctx.fillRect(-8, -23, 16, 6);
ctx.globalAlpha = 1.0;

// Camisa
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(-12, 0, 24, 25);

// Listras
ctx.fillStyle = '#000';
for (let i = 2; i <= 22; i += 4) {
  ctx.fillRect(-12, i, 24, 2);
}

// Blazer
ctx.fillStyle = '#2F4F4F';
ctx.fillRect(-15, 0, 3, 25);
ctx.fillRect(12, 0, 3, 25);

// Braços
ctx.fillStyle = '#F4A460';
ctx.beginPath();
ctx.arc(-18, 5, 4, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(18, 5, 4, 0, Math.PI * 2);
ctx.fill();

ctx.restore();

// Salvar como PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/noivos-placeholder.png', buffer);

console.log('PNG criado com sucesso: ./public/noivos-placeholder.png');
