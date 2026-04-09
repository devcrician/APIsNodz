const { Request } = require('../Utils/ApiClient.js');
const cheerio = require('cheerio');
const yt = require('@denzy-official/youtube_scraper');

const cache = new Map();
const TIMEOUT_MS = 15000;
const CACHE_TTL = 300000;

async function requestWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
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

function validateUrl(url, patterns) {
  if (!url || typeof url !== 'string') return false;
  return patterns.some(pattern => pattern.test(url));
}

const YT_PATTERNS = [
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
];

async function YtVideo(link) {
  if (!validateUrl(link, YT_PATTERNS)) {
    return { tipo: 'error', erro: 'URL do YouTube inválida' };
  }
  
  try {
    const dl = await yt.ytmp4(link);
    return {
      tipo: 'vídeo',
      titulo: dl.metadata.title || "Sem título",
      descricao: dl.metadata.description || "Sem descrição",
      tempo: dl.metadata.timestamp || "00:00",
      url: dl.download.url || "",
      filename: dl.download.filename,
      qualidade: dl.download.quality
    };
  } catch (error) {
    return { tipo: 'error', erro: error.message };
  }
}

async function YtAudio(link) {
  if (!validateUrl(link, YT_PATTERNS)) {
    return { tipo: 'error', erro: 'URL do YouTube inválida' };
  }
  
  try {
    const dl = await yt.ytmp3(link);
    return {
      tipo: 'audio',
      titulo: dl.metadata.title || "Sem título",
      descricao: dl.metadata.description || "Sem descrição",
      tempo: dl.metadata.timestamp || "00:00",
      url: dl.download.url || "",
      filename: dl.download.filename,
      qualidade: '128 kbps'
    };
  } catch (error) {
    return { tipo: 'error', erro: error.message };
  }
}

async function InstaDl(url) {
  try {
    const api = await requestWithTimeout('https://nayan-video-downloader.vercel.app/ndown', 
      { params: { url } });
    
    if (!api?.data?.[0]) {
      return { error: 'Não foi possível obter dados do Instagram' };
    }
    
    return {
      imagem: api.data[0].thumbnail,
      video: api.data[0].url
    };
  } catch (e) {
    console.error('[InstaDl]', e.message);
    return { error: 'Falha ao baixar do Instagram' };
  }
}

async function pinterestDl(url) {
  const cacheKey = `pinterest_${url}`;
  
  try {
    return await cachedRequest(cacheKey, async () => {
      const response = await requestWithTimeout(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        }
      });
      
      const $ = cheerio.load(response);
      let tag = $('script[data-test-id="video-snippet"]');
      
      if (tag.length > 0) {
        let result = JSON.parse(tag.text());
        if (!result?.name || !result?.thumbnailUrl) {
          return { msg: "Dados não encontrados, tente outro URL." };
        }
        
        return {
          titulo: result.name,
          imagem: result.thumbnailUrl,
          publicado: new Intl.DateTimeFormat("pt-BR", {
            ano: "numeric", mes: "long", dia: "numeric",
            hora: "numeric", minuto: "numeric", segundo: "numeric"
          }).format(new Date(result.uploadDate)),
          source: result["@id"],
          autor: {
            nome: result.creator?.alternateName || "Desconhecido",
            usuario: "@" + (result.creator?.name || "Desconhecido"),
            url: result.creator?.url || "",
          },
          keyword: result.keywords ? result.keywords.split(", ").map(k => k.trim()) : [],
          download: result.contentUrl || "",
        };
      } else {
        let jsonText = $("script[data-relay-response='true']").eq(0).text();
        if (!jsonText) {
          return { msg: "Não foi possível extrair os dados do Pinterest." };
        }
        
        let json = JSON.parse(jsonText);
        let result = json.response?.data?.["v3GetPinQuery"]?.data;
        
        if (!result) {
          return { msg: "Erro ao obter dados do pin." };
        }
        
        return {
          titulo: result.title || "Sem título",
          publicado: new Intl.DateTimeFormat("en-US", {
            ano: "numeric", mes: "long", dia: "numeric",
            hora: "numeric", minuto: "numeric", segundo: "numeric"
          }).format(new Date(result.createAt)),
          source: result.link || url,
          autor: {
            nome: result.pinner?.username || "Desconhecido",
            username: "@" + (result.pinner?.username || "Desconhecido"),
          },
          keyword: result.pinJoin?.visualAnnotation || [],
          download: result.imageLargeUrl || "",
        };
      }
    });
  } catch (e) {
    console.error('[Pinterest]', e.message);
    return { msg: "Erro ao processar URL do Pinterest" };
  }
}

async function TikTok(url) {
  const cacheKey = `tiktok_${url}`;
  
  try {
    return await cachedRequest(cacheKey, async () => {
      const api = await requestWithTimeout('https://www.tikwm.com/api', {
        params: { url }
      });
      
      if (!api?.data) {
        return { error: 'Não foi possível obter dados do TikTok' };
      }
      
      return {
        regiao: api.data.region,
        titulo: api.data.title,
        capa: api.data.cover,
        capa_dinamica_ia: api.data.ai_dynamic_cover,
        capa_original: api.data.origin_cover,
        duracao: api.data.duration,
        video_url: api.data.play,
        video_url_wm: api.data.wmplay,
        tamanho: api.data.size,
        tamanho_wm: api.data.wm_size,
        musica_url: api.data.music,
        informacoes_musica: {
          id: api.data.music_info?.id,
          titulo: api.data.music_info?.title,
          url: api.data.music_info?.play,
          capa: api.data.music_info?.cover,
          autor: api.data.music_info?.author,
          original: api.data.music_info?.original,
          duracao: api.data.music_info?.duration,
          album: api.data.music_info?.album
        },
        visualizacoes: api.data.play_count,
        curtidas: api.data.diggit_count,
        comentarios: api.data.comment_count,
        compartilhamentos: api.data.share_count,
        downloads: api.data.download_count,
        favoritos: api.data.collect_count,
        data_criacao: api.data.create_time,
        ancoras: api.data.anchors,
        extras_ancoras: api.data.anchors_extras,
        eh_anuncio: api.data.is_ad,
        informacoes_comerciais: api.data.commerce_info,
        informacoes_video_comercial: api.data.commercial_video_info,
        configuracoes_comentarios: api.data.item_comment_settings,
        usuarios_mencionados: api.data.mentioned_users,
        autor: {
          id: api.data.author?.id,
          id_unico: api.data.author?.unique_id,
          apelido: api.data.author?.nickname,
          avatar: api.data.author?.avatar
        }
      };
    });
  } catch (e) {
    console.error('[TikTok]', e.message);
    return { error: 'Falha ao processar URL do TikTok' };
  }
}

async function FaceBook(url) {
  try {
    const api = await requestWithTimeout('https://nayan-video-downloader.vercel.app/ndown', 
      { params: { url } });
    
    if (!api?.data?.[0]) {
      return { error: 'Não foi possível obter dados do Facebook' };
    }
    
    return {
      imagem: api.data[0].thumbnail,
      video: api.data[0].url
    };
  } catch (e) {
    console.error('[Facebook]', e.message);
    return { error: 'Falha ao baixar do Facebook' };
  }
}

async function Kwai(url) {
  try {
    const response = await requestWithTimeout(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      }
    });
    
    const $ = cheerio.load(response);
    const scriptTag = $('script#VideoObject');
    
    if (!scriptTag.length) {
      return { error: "Não foi possível extrair dados do Kwai" };
    }
    
    const videoData = JSON.parse(scriptTag.html());
    
    return {
      titulo: videoData.name,
      descricao: videoData.description || "Sem descrição",
      thumbnail: videoData.thumbnailUrl?.[0],
      publicado: videoData.uploadDate,
      video: videoData.contentUrl,
      duracao: videoData.duration,
      criador: {
        nome: videoData.creator?.mainEntity?.name,
        usuario: videoData.creator?.mainEntity?.alternateName,
        perfil: videoData.creator?.mainEntity?.url
      }
    };
  } catch (e) {
    console.error('[Kwai]', e.message);
    return { error: "Falha ao processar URL do Kwai" };
  }
}

async function twitterDl(url) {
  try {
    const api = await requestWithTimeout('https://api.deline.web.id/downloader/twitter', 
      { params: { url } });
    
    if (!api?.data) {
      return { error: 'Não foi possível obter dados do Twitter' };
    }
    
    return {
      imagem: api.data.imgUrl,
      video: api.data.downloadLink,
      titulo: api.data.videoTitle,
      descricao: api.data.videoDescription
    };
  } catch (e) {
    console.error('[Twitter]', e.message);
    return { error: 'Falha ao baixar do Twitter' };
  }
}

async function Gdrive(url) {
  try {
    const api = await requestWithTimeout('https://api.deline.web.id/downloader/gdrive', 
      { params: { url } });
    
    if (!api?.result) {
      return { error: 'Não foi possível obter dados do Google Drive' };
    }
    
    return {
      arquivo: api.result.downloadUrl,
      filename: api.result.fileName,
      tamanho: api.result.fileSize,
      tipo: api.result.mimetype
    };
  } catch (e) {
    console.error('[Gdrive]', e.message);
    return { error: 'Falha ao processar Google Drive' };
  }
}

async function CapCut(url) {
  try {
    const api = await requestWithTimeout('https://api.vreden.my.id/api/v1/download/capcut', 
      { params: { url } });
    
    if (!api?.result?.media?.[0]) {
      return { error: 'Não foi possível obter dados do CapCut' };
    }
    
    return {
      titulo: api.result.title,
      imagem: api.result.thumbnail,
      url: api.result.media[0].url,
      qualidade: api.result.media[0].quality
    };
  } catch (e) {
    console.error('[CapCut]', e.message);
    return { error: 'Falha ao baixar do CapCut' };
  }
}

async function Fdroid(url) {
  try {
    const api = await requestWithTimeout('https://api.vreden.my.id/api/v1/download/fdroid', 
      { params: { url } });
    
    if (!api?.result) {
      return { error: 'Não foi possível obter dados do F-Droid' };
    }
    
    const link = api.result.links?.map(item => ({
      titulo: item.text,
      link: item.href
    })) || [];
    
    const versao = api.result.versions?.map(item => ({
      versao: item.version,
      adicionada: item.added,
      requerimentos: item.requeriments,
      link: item.link,
      tamanho: item.size
    })) || [];
    
    return {
      nome: api.result.name,
      resumo: api.result.summary,
      links: link,
      versoes: versao
    };
  } catch (e) {
    console.error('[Fdroid]', e.message);
    return { error: 'Falha ao processar F-Droid' };
  }
}

async function Threads(url) {
  try {
    const api = await requestWithTimeout('https://api.vreden.my.id/api/v1/download/threads',
      { params: { url } });
    
    if (!api?.result?.media?.[0]) {
      return { error: 'Não foi possível obter dados do Threads' };
    }
    
    return {
      url: api.result.media[0].url,
      imagem: api.result.media[0].thumb,
      tipo: api.result.media[0].type
    };
  } catch (e) {
    console.error('[Threads]', e.message);
    return { error: 'Falha ao baixar do Threads' };
  }
}

module.exports = { 
  YtVideo, 
  YtAudio, 
  InstaDl, 
  pinterestDl, 
  TikTok, 
  FaceBook, 
  Kwai, 
  twitterDl, 
  Gdrive, 
  CapCut, 
  Fdroid, 
  Threads 
};