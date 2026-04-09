const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const Link = require('../Utils/CatBox.js');

const TIMEOUT_MS = 30000;
const DEFAULT_IMAGE = 'https://files.catbox.moe/qsvl6o.jpg';

async function loadImageFromUrl(url) {
  if (!url) return null;
  
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: TIMEOUT_MS
    });
    return await loadImage(Buffer.from(response.data));
  } catch (err) {
    console.error('[loadImage]', err.message);
    return null;
  }
}

function truncateText(ctx, text, maxWidth, fontStyle) {
  ctx.font = fontStyle;
  let truncated = text;
  while (ctx.measureText(truncated).width > maxWidth && truncated.length > 3) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + (truncated.length < text.length ? '...' : '');
}

function drawStars(ctx, width, height, count) {
  ctx.fillStyle = 'rgba(0, 200, 255, 0.15)';
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2.5 + 0.5;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    if (Math.random() > 0.7) {
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() * 20 - 10), y + (Math.random() * 20 - 10));
      ctx.stroke();
    }
  }
}

function drawProgressBar(ctx, x, y, width, height, progressRatio) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(x, y, width, height);
  
  const progressGradient = ctx.createLinearGradient(0, 0, width, 0);
  progressGradient.addColorStop(0, '#00FFEA');
  progressGradient.addColorStop(1, '#FF00F5');
  ctx.fillStyle = progressGradient;
  ctx.fillRect(x, y, width * progressRatio, height);
  
  ctx.beginPath();
  ctx.arc(x + width * progressRatio, y + height / 2, height, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
}

async function MusicCardSimples(titulo, artista, views, tempo, imagem) {
  const opcoes = {
    title: titulo || 'Indefinido',
    artist: artista || 'Indefinido',
    likes: views || '0',
    duration: tempo || '00:00',
    imageUrl: imagem || DEFAULT_IMAGE
  };
  
  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0A0A1A');
  bgGradient.addColorStop(1, '#141428');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  drawStars(ctx, width, height, 80);
  
  const imageBuffer = await loadImageFromUrl(opcoes.imageUrl);
  if (imageBuffer) {
    const imgX = 150;
    const imgY = height / 2;
    const imgSize = 220;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(imgX, imgY, imgSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(imageBuffer, imgX - imgSize / 2, imgY - imgSize / 2, imgSize, imgSize);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }
  
  const textStartX = 320;
  const maxTitleWidth = width - textStartX - 50;
  
  ctx.font = 'bold 36px Arial';
  ctx.fillStyle = '#FFFFFF';
  const title = truncateText(ctx, opcoes.title, maxTitleWidth, 'bold 36px Arial');
  ctx.fillText(title, textStartX, 80);
  
  ctx.font = '24px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(`@${opcoes.artist}`, textStartX, 120);
  
  ctx.font = '20px Arial';
  ctx.fillStyle = '#FF2D6B';
  ctx.fillText(`❤ ${opcoes.likes}`, textStartX, 160);
  
  const progressY = height - 60;
  const progressWidth = 430;
  const progressRatio = 0.45;
  
  drawProgressBar(ctx, textStartX, progressY, progressWidth, 6, progressRatio);
  
  ctx.font = '18px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('00:00', textStartX, progressY - 10);
  ctx.fillText(opcoes.duration, textStartX + progressWidth - 40, progressY - 10);
  
  const buffer = canvas.toBuffer('image/png');
  const url = await Link(buffer);
  
  return { modelo: 'Musica', url };
}

async function CardStalkInsta(username, followers, following, posts, imagem) {
  const width = 720;
  const height = 500;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 250; i++) {
    ctx.globalAlpha = Math.random() * 0.5 + 0.2;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  const avatarSize = 190;
  const centerX = width / 2;
  const avatarY = 60;
  
  const avatarBuffer = await loadImageFromUrl(imagem);
  if (avatarBuffer) {
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 19;
    ctx.beginPath();
    ctx.arc(centerX, avatarY + avatarSize / 2, avatarSize / 2 + 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.25)';
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarBuffer, centerX - avatarSize / 2, avatarY, avatarSize, avatarSize);
    ctx.restore();
    
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.font = 'bold 35px Orbitron, sans-serif';
  const gradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
  gradient.addColorStop(0, '#00FFFF');
  gradient.addColorStop(1, '#FF00FF');
  ctx.fillStyle = gradient;
  ctx.textAlign = 'center';
  ctx.fillText(username, centerX, avatarY + avatarSize + 70);
  
  const statsY = avatarY + avatarSize + 120;
  const statSpacing = width / 3;
  
  const drawStat = (x, value, label) => {
    ctx.font = 'bold 29px Orbitron, sans-serif';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'center';
    ctx.fillText(String(value), x, statsY);
    ctx.font = '18px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(label, x, statsY + 30);
  };
  
  drawStat(statSpacing * 0.5, followers, 'Seguidores');
  drawStat(statSpacing * 1.5, following, 'Seguindo');
  drawStat(statSpacing * 2.5, posts, 'Posts');
  
  const buffer = canvas.toBuffer('image/png');
  const url = await Link(buffer);
  
  return { modelo: 'Instagram', url };
}

async function MusicCardPersonalizado(titulo, artista, views, tempo, imagem) {
  const opcoes = {
    title: titulo || 'Indefinido',
    artist: artista || 'Indefinido',
    likes: views || '0',
    duration: tempo || '00:00',
    imageUrl: imagem || DEFAULT_IMAGE
  };
  
  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0A0A1A');
  bgGradient.addColorStop(0.5, '#0F0F2D');
  bgGradient.addColorStop(1, '#141428');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = 'rgba(0, 200, 255, 0.15)';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2.5 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.strokeStyle = 'rgba(0, 180, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, width - 10, height - 10);
  
  const imageBuffer = await loadImageFromUrl(opcoes.imageUrl);
  if (imageBuffer) {
    const imgX = 150;
    const imgY = height / 2;
    const imgSize = 220;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(imgX, imgY, imgSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(imageBuffer, imgX - imgSize / 2, imgY - imgSize / 2, imgSize, imgSize);
    
    const borderGradient = ctx.createLinearGradient(imgX - imgSize / 2, imgY - imgSize / 2, imgX + imgSize / 2, imgY + imgSize / 2);
    borderGradient.addColorStop(0, '#00FFEA');
    borderGradient.addColorStop(1, '#FF00F5');
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
  }
  
  const textStartX = 320;
  const maxTitleWidth = width - textStartX - 50;
  
  ctx.font = 'bold 38px Poppins, Arial';
  ctx.fillStyle = '#FFFFFF';
  const title = truncateText(ctx, opcoes.title, maxTitleWidth, 'bold 38px Poppins, Arial');
  ctx.fillText(title, textStartX, 85);
  
  ctx.font = '26px Poppins, Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(`@${opcoes.artist}`, textStartX, 125);
  
  ctx.font = '22px Poppins, Arial';
  ctx.fillStyle = '#FF2D6B';
  ctx.fillText(`♥ ${opcoes.likes}`, textStartX, 165);
  
  const progressY = height - 60;
  const progressWidth = 430;
  const progressRatio = 0.45;
  
  drawProgressBar(ctx, textStartX, progressY, progressWidth, 8, progressRatio);
  
  ctx.font = '18px Poppins, Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('00:00', textStartX, progressY - 10);
  ctx.fillText(opcoes.duration, textStartX + progressWidth - 40, progressY - 10);
  
  const buffer = canvas.toBuffer('image/png');
  const url = await Link(buffer);
  
  return { modelo: 'Music 2', criador: 'DevCrician', url };
}

async function MusicCardColorido(titulo, artista, views, tempo, imagem) {
  const opcoes = {
    title: titulo || 'Indefinido',
    artist: artista || 'Indefinido',
    likes: views || '0',
    duration: tempo || '00:00',
    imageUrl: imagem || DEFAULT_IMAGE
  };
  
  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  const colors = ['#FFD700', '#FF4500', '#1E90FF', '#32CD32', '#FFFFFF', '#FF6347'];
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 25 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    ctx.fillStyle = color + '15';
    ctx.globalAlpha = 0.3;
    
    if (Math.random() > 0.5) {
      ctx.fillRect(x, y, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  const imageBuffer = await loadImageFromUrl(opcoes.imageUrl);
  if (imageBuffer) {
    const imgSize = 200;
    const imgX = 50;
    const imgY = (height - imgSize) / 2;
    
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(imgX - 5, imgY - 5, imgSize + 10, imgSize + 10);
    ctx.fillStyle = '#000000';
    ctx.fillRect(imgX, imgY, imgSize, imgSize);
    ctx.drawImage(imageBuffer, imgX, imgY, imgSize, imgSize);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(imgX, imgY, imgSize, imgSize);
  }
  
  const textStartX = 280;
  const maxTitleWidth = width - textStartX - 50;
  
  const titleGradient = ctx.createLinearGradient(textStartX, 60, textStartX + 400, 60);
  titleGradient.addColorStop(0, '#FF4500');
  titleGradient.addColorStop(0.5, '#FFD700');
  titleGradient.addColorStop(1, '#32CD32');
  
  ctx.font = 'bold 36px Arial';
  ctx.fillStyle = titleGradient;
  const title = truncateText(ctx, opcoes.title, maxTitleWidth, 'bold 36px Arial');
  ctx.fillText(title, textStartX, 80);
  
  ctx.font = '26px Arial';
  ctx.fillStyle = '#1E90FF';
  ctx.fillText(`@${opcoes.artist}`, textStartX, 120);
  
  ctx.font = '22px Arial';
  ctx.fillStyle = '#FF6347';
  ctx.fillText(`♥ ${opcoes.likes}`, textStartX, 160);
  
  const progressY = height - 60;
  const progressWidth = 430;
  const progressRatio = 0.45;
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(textStartX, progressY, progressWidth, 12);
  
  const progressGradient = ctx.createLinearGradient(textStartX, 0, textStartX + progressWidth, 0);
  progressGradient.addColorStop(0, '#FF4500');
  progressGradient.addColorStop(0.3, '#FFD700');
  progressGradient.addColorStop(0.6, '#32CD32');
  progressGradient.addColorStop(1, '#1E90FF');
  ctx.fillStyle = progressGradient;
  ctx.fillRect(textStartX, progressY, progressWidth * progressRatio, 12);
  
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < progressWidth; i += 20) {
    ctx.fillRect(textStartX + i, progressY, 2, 12);
  }
  
  ctx.font = '18px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('00:00', textStartX, progressY - 10);
  ctx.fillText(opcoes.duration, textStartX + progressWidth - 40, progressY - 10);
  
  const buffer = canvas.toBuffer('image/png');
  const url = await Link(buffer);
  
  return { modelo: 'Music 3', criador: 'DevCrician', url };
}

module.exports = {
  MusicCardSimples,
  CardStalkInsta,
  MusicCardPersonalizado,
  MusicCardColorido
};