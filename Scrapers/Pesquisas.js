const yts = require("yt-search");
const cheerio = require('cheerio');
const { Request, RequestPost } = require('../Utils/ApiClient.js');

const removerAcentos = (s) => typeof s === 'string' ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const MOBILE_USER_AGENT = 'Mozilla/5.0 (Linux; Android 10; SM-G975F Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36';

const TIMEOUT_MS = 15000;
const CACHE_TTL = 300000;
const cache = new Map();

async function cachedRequest(key, fn, ttl = CACHE_TTL) {
  if (cache.has(key)) {
    const { data, expiry } = cache.get(key);
    if (Date.now() < expiry) return data;
    cache.delete(key);
  }
  
  const result = await fn();
  cache.set(key, { data: result, expiry: Date.now() + ttl });
  return result;
}

async function safeRequest(url, options = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await Request(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Timeout: ${url.substring(0, 100)}`);
    }
    throw err;
  }
}

async function YouTube(query) {
  if (!query || typeof query !== 'string') return [];
  
  try {
    const results = await yts(removerAcentos(query));
    const videos = results.videos
      .slice(0, 10)
      .map(video => ({
        titulo: video.title,
        id: video.videoId,
        autor: video.author?.name || 'Desconhecido',
        url: video.url,
        tempo: video.timestamp,
        views: video.views,
        imagem: video.thumbnail
      }));
    
    if (videos.length === 0) return [];
    const randomIndex = Math.floor(Math.random() * videos.length);
    return [videos[randomIndex]];
  } catch (e) {
    console.error('[YouTube]', e.message);
    return [];
  }
}

async function Pinterest(query) {
  if (!query || typeof query !== 'string') return { status: false, msg: 'Query inválida' };
  
  try {
    const data = await safeRequest(`https://br.pinterest.com/search/pins/?q=${encodeURIComponent(removerAcentos(query))}`, {
      headers: { 'User-Agent': MOBILE_USER_AGENT }
    });
    
    const $ = cheerio.load(data);
    const imagens = [];
    
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http')) {
        imagens.push(src.replace(/236/g, '736').replace('60x60', '736x'));
      }
    });
    
    if (imagens.length === 0) return { status: false, msg: 'Nenhuma imagem encontrada.' };
    
    const randomImage = imagens[Math.floor(Math.random() * imagens.length)];
    
    return {
      criador: 'Hiudy',
      type: 'image',
      mime: 'image/jpeg',
      imagem: randomImage
    };
  } catch (e) {
    console.error('[Pinterest]', e.message);
    return { status: false, msg: 'Erro ao buscar imagens' };
  }
}

async function AudioMeme(query) {
  if (!query || typeof query !== 'string') return null;
  
  try {
    const api = await safeRequest('https://api.vreden.my.id/api/v1/search/soundmeme', {
      params: { query: removerAcentos(query) }
    });
    
    if (!api?.result?.search_data?.length) return null;
    
    const resultado = api.result.search_data.map(item => ({
      filename: item.title + '.mp3',
      audio: item.sound_link
    }));
    
    const indiceAleatorio = Math.floor(Math.random() * resultado.length);
    return resultado[indiceAleatorio];
  } catch (e) {
    console.error('[AudioMeme]', e.message);
    return null;
  }
}

async function Dicionario(query) {
  if (!query || typeof query !== 'string') return null;
  
  const cacheKey = `dicio_${removerAcentos(query)}`;
  
  try {
    return await cachedRequest(cacheKey, async () => {
      const url = `https://www.dicio.com.br/${encodeURIComponent(removerAcentos(query))}/`;
      const data = await safeRequest(url, {
        headers: { 'User-Agent': USER_AGENT }
      });
      
      const $ = cheerio.load(data);
      
      const palavra = $('h1').first().text().trim().replace('amor', '').trim();
      if (!palavra) return null;
      
      const resultado = {
        palavra,
        url,
        significado: '',
        significados: [],
        classe: '',
        separacao: '',
        plural: '',
        etimologia: '',
        sinonimos: [],
        antonimos: [],
        frases: [],
        exemplos: [],
        rimas: [],
        anagramas: [],
        imagem: '',
        outrasimagens: [],
        informacoes: {}
      };
      
      resultado.significado = $('.significado.textonovo').text().trim();
      
      $('.significado.textonovo > span:not(.etim)').each((_, el) => {
        const texto = $(el).text().trim();
        if (texto) resultado.significados.push(texto);
      });
      
      $('.adicional:not(.sinonimos)').each((_, el) => {
        const texto = $(el).text().trim();
        if (texto.includes('Classe gramatical:')) {
          resultado.classe = texto.match(/Classe gramatical:\s*(.+?)(?:\n|$)/)?.[1] || '';
          resultado.separacao = texto.match(/Separação silábica:\s*(.+?)(?:\n|$)/)?.[1] || '';
          resultado.plural = texto.match(/Plural:\s*(.+?)(?:\n|$)/)?.[1] || '';
        }
      });
      
      resultado.etimologia = $('.etim').text().trim();
      
      $('.adicional.sinonimos a').each((_, el) => {
        resultado.sinonimos.push($(el).text().trim());
      });
      
      $('.wrap-section').each((_, section) => {
        const titulo = $(section).find('h3').text().trim();
        if (titulo.includes('Antônimos')) {
          $(section).find('a').each((__, el) => {
            resultado.antonimos.push($(el).text().trim());
          });
        }
      });
      
      $('.frases .frase').each((_, el) => {
        const frase = $(el).find('span').text().trim();
        const autor = $(el).find('em').last().text().trim();
        if (frase) {
          resultado.frases.push({
            texto: frase.split('\n')[0],
            autor: autor || 'Desconhecido'
          });
        }
      });
      
      $('.wrap-section').each((_, section) => {
        const titulo = $(section).find('h3').text().trim();
        if (titulo.includes('Exemplos')) {
          $(section).find('.frase').each((__, el) => {
            const exemplo = $(el).text().trim();
            const fonte = $(el).find('em').text().trim();
            if (exemplo) {
              resultado.exemplos.push({
                texto: exemplo.replace(fonte, '').trim(),
                fonte: fonte || 'Desconhecido'
              });
            }
          });
        }
      });
      
      $('.wrap-section').each((_, section) => {
        const titulo = $(section).find('h3').text().trim();
        if (titulo.includes('Rimas')) {
          $(section).find('a').each((__, el) => {
            resultado.rimas.push($(el).text().trim());
          });
        }
      });
      
      $('.wrap-section').each((_, section) => {
        const titulo = $(section).find('h3').text().trim();
        if (titulo.includes('Anagramas')) {
          $(section).find('li').each((__, el) => {
            resultado.anagramas.push($(el).text().trim());
          });
        }
      });
      
      resultado.imagem = $('.imagem-palavra').attr('src') || '';
      
      return resultado;
    });
  } catch (e) {
    console.error('[Dicionario]', e.message);
    return null;
  }
}

async function PlayStore(query) {
  if (!query || typeof query !== 'string') return [];
  
  try {
    const data = await safeRequest(`https://play.google.com/store/search?q=${encodeURIComponent(removerAcentos(query))}&c=apps`, {
      headers: { 'User-Agent': USER_AGENT }
    });
    
    const $ = cheerio.load(data);
    const resultado = [];
    
    $('.VfPpkd-aGsRMb').each((_, e) => {
      const imgSrc = $(e).find('img:first').attr('src') || $(e).find('img:last').attr('src');
      const nome = $(e).find('.DdYX5:first').text().trim();
      if (nome) {
        resultado.push({
          nome,
          imagem: imgSrc?.trim() || null,
          desenvolvedor: $(e).find('.wMUdtb:first').text().trim(),
          estrelas: $(e).find('.w2kbF:first').text().trim(),
          link: 'https://play.google.com' + $(e).find('a:first').attr('href')
        });
      }
    });
    
    return resultado;
  } catch (e) {
    console.error('[PlayStore]', e.message);
    return [];
  }
}

async function Horoscopo(query) {
  if (!query || typeof query !== 'string') return null;
  
  const signosValidos = ['aries', 'touro', 'gemeos', 'cancer', 'leao', 'virgem', 'libra', 'escorpiao', 'sagitario', 'capricornio', 'aquario', 'peixes'];
  const signoLower = removerAcentos(query).toLowerCase();
  
  if (!signosValidos.includes(signoLower)) return null;
  
  const cacheKey = `horoscopo_${signoLower}_${new Date().toLocaleDateString()}`;
  
  try {
    return await cachedRequest(cacheKey, async () => {
      const url = `https://www.horoscopovirtual.com.br/horoscopo/${signoLower}`;
      const data = await safeRequest(url);
      const $ = cheerio.load(data);
      
      const dia = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      
      let previsao = $('.text-wrapper[data-type="diario"]').text().trim();
      if (!previsao) {
        previsao = $('.text-wrapper').first().find('p').first().text().trim();
      }
      previsao = previsao.replace(/\s+/g, " ").trim();
      
      const imagensSignos = {
        'aries': 'https://uploads.apisnodz.com.br/file/ml31ujdn.jpg',
        'touro': 'https://uploads.apisnodz.com.br/file/ml31olhr.jpg',
        'gemeos': 'https://uploads.apisnodz.com.br/file/ml3114ob.jpg',
        'cancer': 'https://uploads.apisnodz.com.br/file/ml31lkxp.jpg',
        'leao': 'https://uploads.apisnodz.com.br/file/ml31hg3q.jpg',
        'virgem': 'https://uploads.apisnodz.com.br/file/ml310fjs.jpg',
        'libra': 'https://uploads.apisnodz.com.br/file/ml31ak86.jpg',
        'escorpiao': 'https://uploads.apisnodz.com.br/file/ml31ki6g.jpg',
        'sagitario': 'https://uploads.apisnodz.com.br/file/ml31ksja.jpg',
        'capricornio': 'https://uploads.apisnodz.com.br/file/ml31innn.jpg',
        'aquario': 'https://uploads.apisnodz.com.br/file/ml31ib6x.jpg',
        'peixes': 'https://uploads.apisnodz.com.br/file/ml31cvgu.jpg'
      };
      
      return {
        signo: query,
        dia,
        previsao: previsao || 'Previsão não disponível',
        imagem: imagensSignos[signoLower],
        url
      };
    }, 3600000);
  } catch (e) {
    console.error('[Horoscopo]', e.message);
    return null;
  }
}

async function TikTok(query) {
  if (!query || typeof query !== 'string') return null;
  
  try {
    const response = await safeRequest('https://tikwm.com/api/feed/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'current_language=pt-BR',
        'User-Agent': MOBILE_USER_AGENT
      },
      body: `keywords=${encodeURIComponent(removerAcentos(query))}&count=5&cursor=0&HD=1`
    });
    
    if (!response?.data?.videos?.length) return null;
    
    const videos = response.data.videos;
    const randomIndex = Math.floor(Math.random() * videos.length);
    const randomVideo = videos[randomIndex];
    
    return {
      criador: 'Hiudy',
      titulo: randomVideo.title || 'Sem título',
      video: randomVideo.play,
      type: 'video',
      mime: 'video/mp4',
      audio: randomVideo.music
    };
  } catch (e) {
    console.error('[TikTok]', e.message);
    return null;
  }
}

async function Bing(query) {
  if (!query || typeof query !== 'string') return [];
  
  try {
    const data = await safeRequest(`https://www.bing.com/images/search?q=${encodeURIComponent(removerAcentos(query))}&form=HDRSC2`);
    const $ = cheerio.load(data);
    const results = [];
    
    $('a.iusc').each((_, el) => {
      const meta = $(el).attr('m');
      if (meta) {
        try {
          const obj = JSON.parse(meta);
          if (obj && obj.murl) results.push(obj.murl);
        } catch {}
      }
    });
    
    return results.slice(0, 20);
  } catch (e) {
    console.error('[Bing]', e.message);
    return [];
  }
}

module.exports = { YouTube, Pinterest, AudioMeme, Dicionario, PlayStore, Horoscopo, TikTok, Bing };