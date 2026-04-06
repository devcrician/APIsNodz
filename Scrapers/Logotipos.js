const { Request } = require('../Utils/ApiClient.js');
const axios = require('axios');
const cheerio = require("cheerio");
const qs = require('qs');

async function Ephoto(url, text) {
  try {
    const form = new URLSearchParams();
    
    const firstResponse = await axios.get(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9"
      }
    });

    const $ = cheerio.load(firstResponse.data);
    const token = $("input[name=token]").val();
    const build_server = $("input[name=build_server]").val();
    const build_server_id = $("input[name=build_server_id]").val();

    if (!token || !build_server || !build_server_id) {
      throw new Error("Não foi possível obter os tokens necessários da página");
    }

    form.append("text[]", text);
    form.append("token", token);
    form.append("build_server", build_server);
    form.append("build_server_id", build_server_id);

    const cookies = firstResponse.headers['set-cookie'];
    const cookieString = cookies ? cookies.join("; ") : '';

    const secondResponse = await axios.post(url, form.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://en.ephoto360.com",
        "Referer": url,
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        "cookie": cookieString
      }
    });

    const $$ = cheerio.load(secondResponse.data);
    const formValueInput = $$("input[name=form_value_input]").val();
    
    if (!formValueInput) {
      throw new Error("Campo form_value_input não encontrado na resposta");
    }

    let json;
    try {

      const cleanJson = formValueInput.trim();
      json = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", formValueInput);
      throw new Error("Formato JSON inválido: " + parseError.message);
    }

    const postData = new URLSearchParams();
    postData.append("text[]", json.text || text);
    postData.append("token", json.token || token);
    postData.append("build_server", json.build_server || build_server);
    postData.append("build_server_id", json.build_server_id || build_server_id);
    
    Object.keys(json).forEach(key => {
      if (key !== "text" && key !== "token" && key !== "build_server" && key !== "build_server_id") {
        postData.append(key, json[key]);
      }
    });

    const thirdResponse = await axios.post("https://en.ephoto360.com/effect/create-image", postData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://en.ephoto360.com",
        "Referer": url,
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        "cookie": cookieString
      }
    });

    if (!thirdResponse.data || !thirdResponse.data.image) {
      throw new Error("Resposta inválida da API: " + JSON.stringify(thirdResponse.data));
    }

    return { imagem: build_server + thirdResponse.data.image };
    
  } catch (error) {
    console.error("Erro no Ephoto:", error.message);
    throw new Error(`Falha ao processar imagem: ${error.message}`);
  }
};

async function Ephoto2(url, ...texts) {
  try {
    const initialResponse = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(initialResponse.data);
    const token = $('input[name=token]').val();
    const buildServer = $('input[name=build_server]').val();
    const buildServerId = $('input[name=build_server_id]').val();
    
    const cookies = initialResponse.headers['set-cookie'];
    const cookieString = cookies ? cookies.join('; ') : '';

    const textFields = $('input[name^="text["]').length || texts.length || 1;
   
    const formData = new URLSearchParams();
    for (let i = 0; i < textFields; i++) {
      formData.append('text[]', texts[i] || texts[0] || 'Texto');
    }
    formData.append('token', token);
    formData.append('build_server', buildServer);
    formData.append('build_server_id', buildServerId);
    
    const postResponse = await axios.post(url, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://en.ephoto360.com',
        'Referer': url,
        'Cookie': cookieString
      }
    });

    const $$ = cheerio.load(postResponse.data);
    
    const hasFormValueInput = $$('input[name=form_value_input]').length > 0;
    
    if (hasFormValueInput) {
      console.log("5. Template tipo 1 (com form_value_input)");
      
      const formValueInput = JSON.parse($$('input[name=form_value_input]').val());
      const body = qs.stringify(formValueInput, { arrayFormat: 'brackets' });
      
      const result = await axios.post('https://en.ephoto360.com/effect/create-image', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://en.ephoto360.com',
          'Referer': url,
          'Cookie': cookieString
        }
      });
      
      const imageUrl = buildServer + result.data.image;
      return { imagem: imageUrl};
      
    } else {
      const scriptContent = $$('script').text();
      const imageMatch = scriptContent.match(/image[:\s]*['"]([^'"]*user_image[^'"]*\.(jpg|png|webp))['"]/i);
      
      if (imageMatch) {
        const imageUrl = imageMatch[1].startsWith('http') ? imageMatch[1] : buildServer + imageMatch[1];
        return { imagem: imageUrl};
      }
      
      throw new Error("Não foi possível encontrar a imagem");
    }
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers enviados:", error.config.headers);
    }
    throw error;
  }
};

module.exports = { Ephoto, Ephoto2 };