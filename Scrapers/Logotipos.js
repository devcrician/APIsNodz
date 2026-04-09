const { Request } = require('../Utils/ApiClient.js');
const axios = require('axios');
const cheerio = require("cheerio");
const qs = require('qs');

const TIMEOUT_MS = 30000;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function safeRequest(url, options = {}, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await axios({ ...options, url, signal: controller.signal });
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

function getCookieString(response) {
  const cookies = response.headers['set-cookie'];
  return cookies ? cookies.join('; ') : '';
}

async function Ephoto(url, text) {
  if (!url || !text) {
    throw new Error('Parâmetros obrigatórios: url e text');
  }
  
  try {
    const firstResponse = await safeRequest(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });

    const $ = cheerio.load(firstResponse.data);
    const token = $("input[name=token]").val();
    const build_server = $("input[name=build_server]").val();
    const build_server_id = $("input[name=build_server_id]").val();

    if (!token || !build_server || !build_server_id) {
      throw new Error("Não foi possível obter os tokens necessários");
    }

    const form = new URLSearchParams();
    form.append("text[]", text);
    form.append("token", token);
    form.append("build_server", build_server);
    form.append("build_server_id", build_server_id);

    const cookieString = getCookieString(firstResponse);

    const secondResponse = await safeRequest(url, {
      method: 'POST',
      data: form.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
        "Origin": "https://en.ephoto360.com",
        "Referer": url,
        "Cookie": cookieString
      }
    });

    const $$ = cheerio.load(secondResponse.data);
    const formValueInput = $$("input[name=form_value_input]").val();
    
    if (!formValueInput) {
      throw new Error("Campo form_value_input não encontrado");
    }

    let json;
    try {
      json = JSON.parse(formValueInput.trim());
    } catch (parseError) {
      throw new Error("Formato JSON inválido");
    }

    const postData = new URLSearchParams();
    postData.append("text[]", json.text || text);
    postData.append("token", json.token || token);
    postData.append("build_server", json.build_server || build_server);
    postData.append("build_server_id", json.build_server_id || build_server_id);
    
    Object.keys(json).forEach(key => {
      if (!["text", "token", "build_server", "build_server_id"].includes(key)) {
        postData.append(key, json[key]);
      }
    });

    const thirdResponse = await safeRequest("https://en.ephoto360.com/effect/create-image", {
      method: 'POST',
      data: postData.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
        "Origin": "https://en.ephoto360.com",
        "Referer": url,
        "Cookie": cookieString
      }
    });

    if (!thirdResponse.data?.image) {
      throw new Error("Resposta inválida da API");
    }

    return { imagem: build_server + thirdResponse.data.image };
    
  } catch (error) {
    console.error("[Ephoto]", error.message);
    throw new Error(`Falha ao processar imagem: ${error.message}`);
  }
}

async function Ephoto2(url, ...texts) {
  if (!url) {
    throw new Error('Parâmetro obrigatório: url');
  }
  
  try {
    const initialResponse = await safeRequest(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    const $ = cheerio.load(initialResponse.data);
    const token = $('input[name=token]').val();
    const buildServer = $('input[name=build_server]').val();
    const buildServerId = $('input[name=build_server_id]').val();
    
    if (!token || !buildServer || !buildServerId) {
      throw new Error("Não foi possível obter os tokens necessários");
    }
    
    const cookieString = getCookieString(initialResponse);
    const textFields = $('input[name^="text["]').length || texts.length || 1;
   
    const formData = new URLSearchParams();
    for (let i = 0; i < textFields; i++) {
      formData.append('text[]', texts[i] || texts[0] || 'Texto');
    }
    formData.append('token', token);
    formData.append('build_server', buildServer);
    formData.append('build_server_id', buildServerId);
    
    const postResponse = await safeRequest(url, {
      method: 'POST',
      data: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
        'Origin': 'https://en.ephoto360.com',
        'Referer': url,
        'Cookie': cookieString
      }
    });

    const $$ = cheerio.load(postResponse.data);
    const hasFormValueInput = $$('input[name=form_value_input]').length > 0;
    
    if (hasFormValueInput) {
      const formValueInput = JSON.parse($$('input[name=form_value_input]').val());
      const body = qs.stringify(formValueInput, { arrayFormat: 'brackets' });
      
      const result = await safeRequest('https://en.ephoto360.com/effect/create-image', {
        method: 'POST',
        data: body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': USER_AGENT,
          'Accept': 'application/json, text/plain, */*',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://en.ephoto360.com',
          'Referer': url,
          'Cookie': cookieString
        }
      });
      
      if (!result.data?.image) {
        throw new Error("Resposta inválida da API");
      }
      
      return { imagem: buildServer + result.data.image };
    } else {
      const scriptContent = $$('script').text();
      const imageMatch = scriptContent.match(/image[:\s]*['"]([^'"]*user_image[^'"]*\.(jpg|png|webp))['"]/i);
      
      if (!imageMatch) {
        throw new Error("Não foi possível encontrar a imagem");
      }
      
      const imageUrl = imageMatch[1].startsWith('http') ? imageMatch[1] : buildServer + imageMatch[1];
      return { imagem: imageUrl };
    }
    
  } catch (error) {
    console.error("[Ephoto2]", error.message);
    throw new Error(`Falha ao processar imagem: ${error.message}`);
  }
}

module.exports = { Ephoto, Ephoto2 };