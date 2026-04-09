const swiftly = require('@cognima/swiftly');
const axios = require('axios');

const TIMEOUT_MS = 30000;
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

async function Request(url, options = {}) {
  return retryRequest(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    try {
      const response = await swiftly.get(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Timeout: ${url.substring(0, 100)}`);
      }
      throw err;
    }
  });
}

async function RequestPost(url, data = {}, options = {}) {
  return retryRequest(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    try {
      const response = await axios.post(url, data, {
        ...options,
        signal: controller.signal,
        timeout: TIMEOUT_MS
      });
      clearTimeout(timeoutId);
      return response.data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Timeout: ${url.substring(0, 100)}`);
      }
      
      if (err.response) {
        throw new Error(`API Error ${err.response.status}: ${err.response.statusText}`);
      }
      
      throw err;
    }
  });
}

async function RequestGet(url, options = {}) {
  return retryRequest(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    try {
      const response = await axios.get(url, {
        ...options,
        signal: controller.signal,
        timeout: TIMEOUT_MS
      });
      clearTimeout(timeoutId);
      return response.data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Timeout: ${url.substring(0, 100)}`);
      }
      
      if (err.response) {
        throw new Error(`API Error ${err.response.status}: ${err.response.statusText}`);
      }
      
      throw err;
    }
  });
}

module.exports = { Request, RequestPost, RequestGet };