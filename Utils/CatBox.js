const axios = require('axios');
const FormData = require('form-data');
const { fileTypeFromBuffer } = require('file-type');

const TIMEOUT_MS = 60000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryRequest(fn, retries = MAX_RETRIES) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries - 1) {
        await sleep(RETRY_DELAY_MS * (i + 1));
      }
    }
  }
  
  throw lastError;
}

async function Link(media) {
  if (!media || !Buffer.isBuffer(media)) {
    throw new Error('Media deve ser um Buffer');
  }
  
  try {
    const type = await fileTypeFromBuffer(media);
    if (!type || !type.ext) {
      throw new Error('Não foi possível identificar o tipo do arquivo');
    }
    
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mp3', 'ogg', 'wav', 'pdf', 'txt', 'zip'];
    if (!validExtensions.includes(type.ext)) {
      throw new Error(`Extensão não suportada: ${type.ext}`);
    }
    
    return await retryRequest(async () => {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', media, `tmp.${type.ext}`);
      form.append('userhash', '');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      try {
        const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
          headers: { ...form.getHeaders() },
          signal: controller.signal,
          timeout: TIMEOUT_MS
        });
        
        clearTimeout(timeoutId);
        
        const url = data.trim();
        if (!url || !url.startsWith('https://')) {
          throw new Error('Resposta inválida do servidor');
        }
        
        return url;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    });
  } catch (e) {
    console.error('[Link]', e.message);
    return null;
  }
}

module.exports = Link;