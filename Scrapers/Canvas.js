const axios = require('axios')
const { createCanvas, loadImage } = require('canvas');
const Link = require('../Utils/CatBox.js');

async function MusicCardSimples(titulo, artista, views, tempo, imagem) {
    const opcoes = {
        title: titulo || 'Indefinido',
        artist: artista || 'Indefinido',
        likes: views || '0',
        currentTime: '00:00',
        duration: tempo || '00:00',
        imageUrl: imagem || 'https://files.catbox.moe/qsvl6o.jpg'
    };

    const width = 800;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    function truncateText(text, maxWidth) {
        let truncated = text;
        while (ctx.measureText(truncated).width > maxWidth && truncated.length > 3) {
            truncated = truncated.slice(0, -1);
        }
        return truncated + (truncated.length < text.length ? '...' : '');
    };

    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0A0A1A');
    bgGradient.addColorStop(1, '#141428');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.15)';

    for (let i = 0; i < 80; i++) {
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
    };

    ctx.strokeStyle = 'rgba(0, 180, 255, 0.05)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    };

    if (opcoes.imageUrl) {
        try {
            const response = await axios.get(opcoes.imageUrl, { responseType: 'arraybuffer' });
            const image = await loadImage(Buffer.from(response.data));

            const imgX = 150;
            const imgY = height / 2;
            const imgSize = 220;

            ctx.save();
            ctx.beginPath();
            ctx.arc(imgX, imgY, imgSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(image, imgX - imgSize / 2, imgY - imgSize / 2, imgSize, imgSize);

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.restore();
        } catch (err) {
            console.error('erro na imagem:', err);
        }
    };

    const textStartX = 320;
    const maxTitleWidth = width - textStartX - 50;

    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 200, 255, 0.3)';
    ctx.shadowBlur = 5;

    const title = truncateText(opcoes.title, maxTitleWidth);
    ctx.fillText(title, textStartX, 80);
    ctx.shadowBlur = 0;

    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`@${opcoes.artist}`, textStartX, 120);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#FF2D6B';
    ctx.fillText(`❤ ${opcoes.likes}`, textStartX, 160);

    const progressWidth = 430;
    const progressY = height - 60;
    const currentTime = opcoes.currentTime;
    const duration = opcoes.duration;
    const currentSec = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
    const durationSec = parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]);
    let progressRatio = Math.min(currentSec / durationSec, 1);

    if (currentTime === '00:00') {
        progressRatio = 0.45;
    };

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(textStartX, progressY, progressWidth, 6);

    const progressGradient = ctx.createLinearGradient(0, 0, progressWidth, 0);
    progressGradient.addColorStop(0, '#00FFEA');
    progressGradient.addColorStop(1, '#FF00F5');
    ctx.fillStyle = progressGradient;
    ctx.fillRect(textStartX, progressY, progressWidth * progressRatio, 6);

    ctx.font = '18px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(currentTime, textStartX, progressY - 10);
    ctx.fillText(duration, textStartX + progressWidth - 40, progressY - 10);

    const resultc = await canvas.toBuffer('image/png');
    const saida = await Link(resultc)
    return {
        modelo: 'Musica',
        url: saida
    };
};

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
        ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 1.8,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    const avatarSize = 190;
    const centerX = width / 2;
    const avatarY = 60;

    try {
        const response = await axios.get(imagem, {
            responseType: 'arraybuffer',
            timeout: 7000
        });
        const avatar = await loadImage(Buffer.from(response.data));

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
        ctx.drawImage(avatar, centerX - avatarSize / 2, avatarY, avatarSize, avatarSize);
        ctx.restore();

        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.stroke();

    } catch (err) {
        console.error('Erro ao carregar avatar:', err);

        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(centerX, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.font = 'bold 35px "Orbitron", sans-serif';
    const gradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
    gradient.addColorStop(0, '#00FFFF');
    gradient.addColorStop(1, '#FF00FF');
    ctx.fillStyle = gradient;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText(username, centerX, avatarY + avatarSize + 70);
    ctx.shadowBlur = 0;

    const statsY = avatarY + avatarSize + 120;
    const statSpacing = width / 3;

    const drawStat = (x, value, label) => {
        ctx.font = 'bold 29px "Orbitron", sans-serif';
        ctx.fillStyle = '#00FFFF';
        ctx.textAlign = 'center';
        ctx.fillText(value, x, statsY);

        ctx.font = '18px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(label, x, statsY + 30);
    };

    drawStat(statSpacing * 0.5, followers, 'Seguidores');
    drawStat(statSpacing * 1.5, following, 'Seguindo');
    drawStat(statSpacing * 2.5, posts, 'Posts');

    const resultc = await canvas.toBuffer('image/png');
    const saida = await Link(resultc)
    return {
        modelo: 'Instagram',
        url: saida
    };
};

async function MusicCardPersonalizado(titulo, artista, views, tempo, imagem) {
    const opcoes = {
        title: titulo || 'Indefinido',
        artist: artista || 'Indefinido',
        likes: views || '0',
        currentTime: '00:00',
        duration: tempo || '00:00',
        imageUrl: imagem || 'https://files.catbox.moe/qsvl6o.jpg'
    };

    const width = 800;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    function truncateText(text, maxWidth, fontStyle) {
        ctx.font = fontStyle;
        let truncated = text;
        while (ctx.measureText(truncated).width > maxWidth && truncated.length > 3) {
            truncated = truncated.slice(0, -1);
        }
        return truncated + (truncated.length < text.length ? '...' : '');
    }

    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0A0A1A');
    bgGradient.addColorStop(0.5, '#0F0F2D');
    bgGradient.addColorStop(1, '#141428');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1.5;
        ctx.fillRect(x, y, size, size);
    }

    ctx.fillStyle = 'rgba(0, 200, 255, 0.15)';
    for (let i = 0; i < 100; i++) {
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

    ctx.strokeStyle = 'rgba(0, 180, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = -height; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 180, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, width - 10, height - 10);

    const cornerSize = 15;
    ctx.strokeStyle = 'rgba(0, 220, 255, 0.6)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.lineTo(10, 10);
    ctx.lineTo(20, 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 20, 10);
    ctx.lineTo(width - 10, 10);
    ctx.lineTo(width - 10, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(10, height - 20);
    ctx.lineTo(10, height - 10);
    ctx.lineTo(20, height - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 20, height - 10);
    ctx.lineTo(width - 10, height - 10);
    ctx.lineTo(width - 10, height - 20);
    ctx.stroke();

    if (opcoes.imageUrl) {
        try {
            const response = await axios.get(opcoes.imageUrl, { responseType: 'arraybuffer' });
            const image = await loadImage(Buffer.from(response.data));

            const imgX = 150;
            const imgY = height / 2;
            const imgSize = 220;

            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 5;

            ctx.save();
            ctx.beginPath();
            ctx.arc(imgX, imgY, imgSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(image, imgX - imgSize / 2, imgY - imgSize / 2, imgSize, imgSize);

            const borderGradient = ctx.createLinearGradient(
                imgX - imgSize / 2, imgY - imgSize / 2,
                imgX + imgSize / 2, imgY + imgSize / 2
            );
            borderGradient.addColorStop(0, '#00FFEA');
            borderGradient.addColorStop(1, '#FF00F5');

            ctx.strokeStyle = borderGradient;
            ctx.lineWidth = 6;
            ctx.shadowColor = 'rgba(0, 200, 255, 0.7)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.stroke();
            ctx.restore();

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        } catch (err) {
            console.error('erro na imagem:', err);
        }
    }

    const textStartX = 320;
    const maxTitleWidth = width - textStartX - 50;

    ctx.font = 'bold 38px Poppins, Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 200, 255, 0.8)';
    ctx.shadowBlur = 10;

    const title = truncateText(opcoes.title, maxTitleWidth, 'bold 38px Poppins, Arial');
    ctx.fillText(title, textStartX, 85);

    ctx.font = '26px Poppins, Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = 5;
    ctx.fillText(`@${opcoes.artist}`, textStartX, 125);

    ctx.font = '22px Poppins, Arial';
    ctx.fillStyle = '#FF2D6B';
    ctx.shadowColor = 'rgba(255, 45, 107, 0.5)';
    ctx.shadowBlur = 8;

    ctx.fillText('♥ ' + opcoes.likes, textStartX, 165);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    const progressWidth = 430;
    const progressY = height - 60;
    const currentTime = opcoes.currentTime;
    const duration = opcoes.duration;
    const currentSec = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
    const durationSec = parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]);
    let progressRatio = Math.min(currentSec / durationSec, 1);

    if (currentTime === '00:00') {
        progressRatio = 0.45;
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(textStartX, progressY, progressWidth, 8, 4);
    ctx.fill();

    const progressGradient = ctx.createLinearGradient(0, 0, progressWidth, 0);
    progressGradient.addColorStop(0, '#00FFEA');
    progressGradient.addColorStop(0.5, '#9D50FF');
    progressGradient.addColorStop(1, '#FF00F5');

    ctx.fillStyle = progressGradient;
    ctx.beginPath();
    ctx.roundRect(textStartX, progressY, progressWidth * progressRatio, 8, 4);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(textStartX + progressWidth * progressRatio, progressY + 4, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.shadowColor = 'rgba(0, 200, 255, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    ctx.font = '18px Poppins, Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(currentTime, textStartX, progressY - 10);
    ctx.fillText(duration, textStartX + progressWidth - 40, progressY - 10);

    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText('Criado por DevCrician • Music Personalizado', width - 300, height - 15);

    const resultc = canvas.toBuffer('image/png');
    const saida = await Link(resultc);

    return {
        modelo: 'Music 2',
        criador: 'DevCrician',
        url: saida
    };
}

async function MusicCardColorido(titulo, artista, views, tempo, imagem) {
    const opcoes = {
        title: titulo || 'Indefinido',
        artist: artista || 'Indefinido',
        likes: views || '0',
        currentTime: '00:00',
        duration: tempo || '00:00',
        imageUrl: imagem || 'https://files.catbox.moe/qsvl6o.jpg'
    };

    const width = 800;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    function truncateText(text, maxWidth, fontStyle) {
        ctx.font = fontStyle;
        let truncated = text;
        while (ctx.measureText(truncated).width > maxWidth && truncated.length > 3) {
            truncated = truncated.slice(0, -1);
        }
        return truncated + (truncated.length < text.length ? '...' : '');
    }

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

    ctx.strokeStyle = '#1E90FF';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(15, 15, width - 30, height - 30);
    ctx.setLineDash([]);

    if (opcoes.imageUrl) {
        try {
            const response = await axios.get(opcoes.imageUrl, { responseType: 'arraybuffer' });
            const image = await loadImage(Buffer.from(response.data));

            const imgSize = 200;
            const imgX = 50;
            const imgY = (height - imgSize) / 2;

            ctx.fillStyle = '#FF4500';
            ctx.fillRect(imgX - 5, imgY - 5, imgSize + 10, imgSize + 10);

            ctx.fillStyle = '#000000';
            ctx.fillRect(imgX, imgY, imgSize, imgSize);

            ctx.drawImage(image, imgX, imgY, imgSize, imgSize);

            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeRect(imgX, imgY, imgSize, imgSize);

        } catch (err) {
            console.error('erro na imagem:', err);
        }
    }

    const textStartX = 280;
    const maxTitleWidth = width - textStartX - 50;

    const titleGradient = ctx.createLinearGradient(textStartX, 60, textStartX + 400, 60);
    titleGradient.addColorStop(0, '#FF4500');
    titleGradient.addColorStop(0.5, '#FFD700');
    titleGradient.addColorStop(1, '#32CD32');

    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = titleGradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const title = truncateText(opcoes.title, maxTitleWidth, 'bold 36px Arial');
    ctx.fillText(title, textStartX, 80);

    ctx.font = '26px Arial';
    ctx.fillStyle = '#1E90FF';
    ctx.shadowColor = 'rgba(30, 144, 255, 0.4)';
    ctx.shadowBlur = 3;
    ctx.fillText(`@${opcoes.artist}`, textStartX, 120);

    ctx.font = '22px Arial';
    ctx.fillStyle = '#FF6347';
    ctx.shadowColor = 'rgba(255, 99, 71, 0.4)';
    ctx.fillText('♥ ' + opcoes.likes, textStartX, 160);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const progressWidth = 430;
    const progressY = height - 60;
    const currentTime = opcoes.currentTime;
    const duration = opcoes.duration;
    const currentSec = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
    const durationSec = parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]);
    let progressRatio = Math.min(currentSec / durationSec, 1);

    if (currentTime === '00:00') {
        progressRatio = 0.45;
    }

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

    ctx.beginPath();
    ctx.arc(textStartX + progressWidth * progressRatio, progressY + 6, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(currentTime, textStartX, progressY - 10);
    ctx.fillText(duration, textStartX + progressWidth - 40, progressY - 10);

    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(50, 20);
    ctx.lineTo(20, 50);
    ctx.fill();

    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.moveTo(width - 20, 20);
    ctx.lineTo(width - 50, 20);
    ctx.lineTo(width - 20, 50);
    ctx.fill();

    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(50, height - 20);
    ctx.lineTo(20, height - 50);
    ctx.fill();

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(width - 20, height - 20);
    ctx.lineTo(width - 50, height - 20);
    ctx.lineTo(width - 20, height - 50);
    ctx.fill();

    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 50, 50);
        ctx.stroke();
    }

    ctx.strokeStyle = '#1E90FF';
    for (let i = 0; i < width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, height);
        ctx.lineTo(i + 50, height - 50);
        ctx.stroke();
    }

    ctx.font = '14px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Music 3 • Criado por DevCrician', textStartX, height - 20);

    const resultc = canvas.toBuffer('image/png');
    const saida = await Link(resultc);

    return {
        modelo: 'Music 3',
        criador: 'DevCrician',
        url: saida
    };
}

module.exports = {
  MusicCardSimples, CardStalkInsta,
    MusicCardPersonalizado, MusicCardColorido
};