const { Request } = require('../Utils/ApiClient.js');
const cheerio = require('cheerio');


async function Lyrics(query) {
  try {
    const api = await Request('https://api.deline.web.id/tools/lyrics', { 
      params: { title: query } 
    });
    
    const result = api.result.map(item => ({
      id: item.id,
      nome: item.name,
      faixa: item.trackName,
      artista: item.artistName,
      tempo: item.duration,
      instrumental: item.instrumental,
      letra: item.plainLyrics
    }));
    
    return result;
    
  } catch (e) {
    console.error(e);
  }
};

async function Codificar(query) {
  try {
    const api = await Request('https://api.popcat.xyz/encode', {
      params: { text: query }
    });
    
    return api.binary;
  
  } catch (e) {
    console.error(e);
  }
};

async function Decodificar(query) {
  try {
    const api = await Request('https://api.popcat.xyz/decode', {
      params: { binary: query }
    });

    return api.text;
    
  } catch (e) {
    console.error(e);
  }
};

async function Morse(query) {
  try {
    const api = await Request('https://api.popcat.xyz/texttomorse', {
      params: { text: query } 
    });
    
    return api.morse;
  
  } catch (e) {
    console.error(e);
  }
};

async function GerarNick(query) {
  try {
    const data = await Request('http://qaz.wtf/u/convert.cgi', {
      params: { text: encodeURIComponent(query) }
    });
    
    const $ = cheerio.load(data);
    const resultado = [];
    
    $('table > tbody > tr').each(function (a, b) {
      resultado.push({
        fonte: $(b).find('td:nth-child(1) > span').text(),
        nome: $(b).find('td:nth-child(2)').text().trim()
      });
    });
    
    return resultado;
    
  } catch (e) {
    console.error(e);
  }
};

async function Pensador(query) {
  try {
    const data = await Request('https://www.pensador.com/busca.php', {
     params: { q: encodeURIComponent(query) }
    });

    const $ = cheerio.load(data);
    const dados = [];
    
     $('p[class="frase fr"]').each(function() {
       const resultado = $(this).text()
        dados.push({ imagem: 'https://uploads.apisnodz.com.br/file/mktp3jdy.jpg',  frase: resultado })
     });
     
    return dados;

  } catch (e) {
    console.error(e);
  }
};

async function Historias() {
  try {
    const data = await Request('https://historiaparadormir.org/');
    const $ = cheerio.load(data);
    const historiasURLs = [];

    $(".posts-items .post-item").each((index, element) => {
      const url = "https://historiaparadormir.org/" + 
        $(element).find(".post-title a").attr("href");
      historiasURLs.push(url);
    });

    let resultadoURLs = historiasURLs.sort(() => Math.random() - 0.5).slice(0, 3);
    const resultado = [];

    for (let url of resultadoURLs) {
      const data = await Request(url);
      const $ = cheerio.load(data);

      const titulo = $(".entry-header .post-title").text().trim();
      
      const imagem = $(".single-featured-image img").attr("data-src") 
        ? "https://historiaparadormir.org" + $(".single-featured-image img").attr("data-src")
        : "Sem imagem";
      
      const historia = $(".entry-content p")
        .map((i, el) => $(el).text().trim())
        .get()
        .join("\n\n");

      resultado.push({ titulo, imagem, url, historia });
    };

    return resultado;

  } catch (e) {
    console.error(e);
  }
}

module.exports = { Lyrics, GerarNick, Historias, Codificar, Decodificar, Morse, Pensador };