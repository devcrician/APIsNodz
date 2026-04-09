const { Request } = require('../Utils/ApiClient.js');
const axios = require('axios');

const IA_API_KEY = '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';

const TIMEOUT_MS = 120000;
const cache = new Map();

async function cachedRequest(key, fn, ttl = 0) {
  if (ttl === 0) return fn();
  
  if (cache.has(key)) {
    const { data, expiry } = cache.get(key);
    if (Date.now() < expiry) return data;
    cache.delete(key);
  }
  
  const result = await fn();
  if (ttl > 0) {
    cache.set(key, { data: result, expiry: Date.now() + ttl });
  }
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

function validatePrompt(prompt, maxLength = 4000) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Parâmetro obrigatório ausente: prompt');
  }
  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    throw new Error('Prompt não pode estar vazio');
  }
  if (trimmed.length > maxLength) {
    throw new Error(`Prompt excede o limite de ${maxLength} caracteres`);
  }
  return trimmed;
}

async function Copilot(prompt) {
  try {
    const promptLimpo = validatePrompt(prompt, 2000);
    
    const api = await safeRequest('https://api.deline.web.id/ai/copilot', {
      params: { text: promptLimpo }
    }, 30000);
    
    if (!api?.result) {
      throw new Error('Resposta da API inválida');
    }
    
    return {
      success: true,
      response: api.result,
      source: 'copilot'
    };
  } catch (e) {
    console.error('[Copilot]', e.message);
    return {
      success: false,
      error: e.message,
      response: null
    };
  }
}

async function Nvidia(modelo, prompt) {
  try {
    if (!modelo || typeof modelo !== 'string') {
      throw new Error('Parâmetro obrigatório ausente: modelo');
    }
    
    const promptLimpo = validatePrompt(prompt, 4000);
    
    const cacheKey = `nvidia_${modelo}_${promptLimpo.substring(0, 100)}`;
    
    const response = await cachedRequest(cacheKey, async () => {
      const messages = [
        { role: 'system', content: 'Você é um assistente útil e respeitoso.' },
        { role: 'user', content: promptLimpo }
      ];
      
      const result = await axios.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        {
          messages,
          model: modelo,
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 0.95
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${IA_API_KEY}`
          },
          timeout: TIMEOUT_MS
        }
      );
      
      if (!result?.data?.choices?.[0]?.message?.content) {
        throw new Error('Resposta da API inválida');
      }
      
      return result.data.choices[0].message.content;
    }, 0);
    
    return {
      success: true,
      response: response,
      model: modelo,
      source: 'nvidia'
    };
  } catch (e) {
    console.error('[Nvidia]', e.message);
    
    if (e.response?.status === 401) {
      return {
        success: false,
        error: 'Chave de API inválida ou expirada',
        response: null
      };
    }
    
    if (e.response?.status === 429) {
      return {
        success: false,
        error: 'Limite de requisições excedido. Tente novamente mais tarde.',
        response: null
      };
    }
    
    return {
      success: false,
      error: e.message,
      response: null
    };
  }
}

async function NvidiaStream(modelo, prompt, onChunk) {
  try {
    if (!modelo || typeof modelo !== 'string') {
      throw new Error('Parâmetro obrigatório ausente: modelo');
    }
    
    const promptLimpo = validatePrompt(prompt, 4000);
    
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        messages: [{ role: 'user', content: promptLimpo }],
        model: modelo,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IA_API_KEY}`
        },
        timeout: TIMEOUT_MS,
        responseType: 'stream'
      }
    );
    
    let fullResponse = '';
    
    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const json = JSON.parse(line.slice(6));
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              if (onChunk) onChunk(content);
            }
          } catch {}
        }
      }
    });
    
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve({
          success: true,
          response: fullResponse,
          model: modelo,
          source: 'nvidia'
        });
      });
      
      response.data.on('error', reject);
    });
  } catch (e) {
    console.error('[NvidiaStream]', e.message);
    return {
      success: false,
      error: e.message,
      response: null
    };
  }
}

module.exports = { Copilot, Nvidia, NvidiaStream };