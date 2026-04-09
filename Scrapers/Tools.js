const { Request } = require('../Utils/ApiClient.js');
const cheerio = require('cheerio');

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

async function Lyrics(query) {
  if (!query || typeof query !== 'string') return [];
  
  try {
    const api = await safeRequest('https://api.deline.web.id/tools/lyrics', {
      params: { title: encodeURIComponent(query) }
    });
    
    if (!api?.result?.length) return [];
    
    return api.result.map(item => ({
      id: item.id,
      nome: item.name,
      faixa: item.trackName,
      artista: item.artistName,
      tempo: item.duration,
      instrumental: item.instrumental,
      letra: item.plainLyrics
    }));
  } catch (e) {
    console.error('[Lyrics]', e.message);
    return [];
  }
}

async function Codificar(query) {
  if (!query || typeof query !== 'string') return null;
  
  try {
    const api = await safeRequest('https://api.popcat.xyz/encode', {
      params: { text: query.substring(0, 500) }
    });
    
    return api?.binary || null;
  } catch (e) {
    console.error('[Codificar]', e.message);
    return null;
  }
}

async function Decodificar(query) {
  if (!query || typeof query !== 'string') return null;
  
  try {
    const api = await safeRequest('https://api.popcat.xyz/decode', {
      params: { binary: query.substring(0, 2000) }
    });
    
    return api?.text || null;
  } catch (e) {
    console.error('[Decodificar]', e.message);
    return null;
  }
}

async function Morse(query) {
  if (!query || typeof query !== 'string') return null;
  
  try {
    const api = await safeRequest('https://api.popcat.xyz/texttomorse', {
      params: { text: query.substring(0, 200) }
    });
    
    return api?.morse || null;
  } catch (e) {
    console.error('[Morse]', e.message);
    return null;
  }
}

async function GerarNick(query) {
  if (!query || typeof query !== 'string') return [];
  
  try {
    const data = await safeRequest('http://qaz.wtf/u/convert.cgi', {
      params: { text: encodeURIComponent(query.substring(0, 50)) }
    });
    
    const $ = cheerio.load(data);
    const resultado = [];
    
    $('table > tbody > tr').each((_, element) => {
      const fonte = $(element).find('td:nth-child(1) > span').text();
      const nome = $(element).find('td:nth-child(2)').text().trim();
      if (fonte && nome) {
        resultado.push({ fonte, nome });
      }
    });
    
    return resultado;
  } catch (e) {
    console.error('[GerarNick]', e.message);
    return [];
  }
}

async function Pensador(query) {
  if (!query || typeof query !== 'string') return [];
  
  const cacheKey = `pensador_${query.toLowerCase()}`;
  
  try {
    return await cachedRequest(cacheKey, async () => {
      const data = await safeRequest('https://www.pensador.com/busca.php', {
        params: { q: encodeURIComponent(query) }
      });
      
      const $ = cheerio.load(data);
      const dados = [];
      
      $('p[class="frase fr"]').each((_, element) => {
        const frase = $(element).text().trim();
        if (frase && frase.length > 5) {
          dados.push({
            imagem: 'https://uploads.apisnodz.com.br/file/mktp3jdy.jpg',
            frase
          });
        }
      });
      
      return dados.slice(0, 20);
    }, 1800000);
  } catch (e) {
    console.error('[Pensador]', e.message);
    return [];
  }
}

async function Historias() {
  try {
    const data = await safeRequest('https://historiaparadormir.org/');
    const $ = cheerio.load(data);
    const historiasURLs = [];

    $(".posts-items .post-item").each((_, element) => {
      const href = $(element).find(".post-title a").attr("href");
      if (href) {
        historiasURLs.push("https://historiaparadormir.org/" + href);
      }
    });

    if (historiasURLs.length === 0) return [];

    const shuffled = [...historiasURLs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const resultadoURLs = shuffled.slice(0, 3);
    const resultado = [];

    for (const url of resultadoURLs) {
      try {
        const pageData = await safeRequest(url);
        const $page = cheerio.load(pageData);

        const titulo = $page(".entry-header .post-title").text().trim() || "Sem título";
        
        const imagemSrc = $page(".single-featured-image img").attr("data-src");
        const imagem = imagemSrc ? "https://historiaparadormir.org" + imagemSrc : "Sem imagem";
        
        const historia = $page(".entry-content p")
          .map((_, el) => $page(el).text().trim())
          .get()
          .filter(text => text.length > 10)
          .join("\n\n");

        if (historia) {
          resultado.push({ titulo, imagem, url, historia });
        }
      } catch (err) {
        console.error('[Historias] Erro na URL:', url, err.message);
      }
    }

    return resultado;
  } catch (e) {
    console.error('[Historias]', e.message);
    return [];
  }
}

module.exports = { Lyrics, GerarNick, Historias, Codificar, Decodificar, Morse, Pensador };