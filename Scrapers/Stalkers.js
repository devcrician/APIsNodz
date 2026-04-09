const { Request } = require('../Utils/ApiClient.js');

const TIMEOUT_MS = 15000;
const CACHE_TTL = 3600000;
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
      throw new Error(`Timeout: ${url}`);
    }
    throw err;
  }
}

function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  const trimmed = username.trim();
  if (trimmed.length === 0 || trimmed.length > 50) return false;
  return true;
}

async function IgStalk(user) {
  if (!validateUsername(user)) {
    return { error: 'Username inválido' };
  }
  
  const cacheKey = `igstalk_${user.toLowerCase()}`;
  
  try {
    const api = await cachedRequest(cacheKey, async () => {
      const response = await safeRequest('https://api.vreden.my.id/api/v1/stalker/instagram', {
        params: { username: user.trim() }
      });
      
      if (!response?.result) {
        throw new Error('Resposta inválida da API');
      }
      
      return response;
    });
    
    const result = api.result;
    
    return {
      id: result.id || null,
      username: result.username || user,
      nome: result.full_name || 'Não informado',
      categoria: result.category || null,
      bio: result.biography || '',
      bio_links: result.bio_links || [],
      imagem: result.profile_pic_hd?.url || null,
      empresa: result.is_business ? 'sim' : 'nao',
      conta: result.is_private ? 'privada' : 'publica',
      verificada: result.is_verified ? 'sim' : 'nao',
      seguidores: result.statistics?.follower || 0,
      seguindo: result.statistics?.following || 0,
      postagens: result.statistics?.post || 0
    };
  } catch (e) {
    console.error('[IgStalk]', e.message);
    return { error: `Falha ao buscar dados: ${e.message}` };
  }
}

async function TikTok(user) {
  if (!validateUsername(user)) {
    return { error: 'Username inválido' };
  }
  
  const cacheKey = `ttstalk_${user.toLowerCase()}`;
  
  try {
    const api = await cachedRequest(cacheKey, async () => {
      const response = await safeRequest('https://api.vreden.my.id/api/v1/stalker/tiktok', {
        params: { username: user.trim() }
      });
      
      if (!response?.result) {
        throw new Error('Resposta inválida da API');
      }
      
      return response;
    });
    
    const result = api.result;
    
    return {
      username: result.username || user,
      nome: result.nickname || 'Não informado',
      imagem: result.avatar?.thumbnail || null,
      bio: result.biography || '',
      bio_links: result.biolink || null,
      verificada: result.verified ? 'sim' : 'nao',
      idioma: result.language || null,
      seguidores: result.statistics?.follower || 0,
      seguindo: result.statistics?.following || 0,
      curtidas: result.statistics?.like || 0,
      postagens: result.statistics?.post || 0,
      amigos: result.statistics?.friend || 0
    };
  } catch (e) {
    console.error('[TikTok]', e.message);
    return { error: `Falha ao buscar dados: ${e.message}` };
  }
}

module.exports = { IgStalk, TikTok };