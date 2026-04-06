const yts = require("yt-search");
const cheerio = require('cheerio')
const { Request, RequestPost } = require('../Utils/ApiClient.js')
const removerAcentos = (s) => typeof s === 'string' ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';

async function YouTube(query) {
  try {
    const results = await yts(removerAcentos(query));
    const videos = results.videos
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(video => ({
     titulo: video.title,
     id: video.videoId,
     autor: video.author.name, 
     url: video.url,
     tempo: video.timestamp,
     views: video.views,
     imagem: video.thumbnail
      }));
      
    return videos;
    
  } catch (e) {
    console.error(e);
  }
};

async function Pinterest(query) {
  try {
    const data = await Request(`https://br.pinterest.com/search/pins/?q=${removerAcentos(query)}`, {
      headers: {
     'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const imagens = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) imagens.push(src.replace(/236/g, '736').replace('60x60', '736x'));
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
    console.error(e);
  }
};

async function AudioMeme(query) {
  try {
    const api = await Request('https://api.vreden.my.id/api/v1/search/soundmeme', {
      params: { query: removerAcentos(query) }
    });    
    const resultado = api.result.search_data.map(item => ({
      filename: item.title + '.mp3', 
      audio: item.sound_link
    }));
    if (resultado.length === 0) {
      return null;
    }    
    const indiceAleatorio = Math.floor(Math.random() * resultado.length);
    
    return resultado[indiceAleatorio];
    
  } catch (e) {
    console.error(e);
  }
};

async function Dicionario(query) {
    try {
     const url = `https://www.dicio.com.br/${removerAcentos(query)}/`;
     const data  = await Request(url, {
     headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
     }
     });
     const $ = cheerio.load(data);

     const resultado = {
     palavra: $('h1').first().text().trim().replace('amor', '').trim(),
     url, significado: '',
     significados: [], classe: '',
     separacao: '', plural: '',
     etimologia: '', sinonimos: [],
     antonimos: [], frases: [],
      exemplos: [], rimas: [],
     anagramas: [], imagem: '',
     outrasimagens: [], informacoes: {}
     };

     resultado.significado = $('.significado.textonovo').text().trim();

     $('.significado.textonovo > span:not(.etim)').each((i, el) => {
     const texto = $(el).text().trim();
     if (texto) {
      resultado.significados.push(texto);
     }
     });

     $('.adicional:not(.sinonimos)').each((i, el) => {
     const texto = $(el).text().trim();
     if (texto.includes('Classe gramatical:')) {
      resultado.classe = texto.match(/Classe gramatical:\s*(.+?)(?:\n|$)/)?.[1] || '';
      resultado.separacao = texto.match(/Separação silábica:\s*(.+?)(?:\n|$)/)?.[1] || '';
      resultado.plural = texto.match(/Plural:\s*(.+?)(?:\n|$)/)?.[1] || '';
     }
     });

     resultado.etimologia = $('.etim').text().trim();

     $('.adicional.sinonimos a').each((i, el) => {
     resultado.sinonimos.push($(el).text().trim());
     });

     $('.wrap-section').each((i, section) => {
     const titulo = $(section).find('h3').text().trim();
     if (titulo.includes('Antônimos')) {
      $(section).find('a').each((j, el) => {
          resultado.antonimos.push($(el).text().trim());
      });
     }
     });

     $('.frases .frase').each((i, el) => {
     const frase = $(el).find('span').text().trim();
     const autor = $(el).find('em').last().text().trim();
     if (frase) {
      resultado.frases.push({
          texto: frase.split('\n')[0],
          autor: autor || 'Desconhecido'
      });
     }
     });

     $('.wrap-section').each((i, section) => {
     const titulo = $(section).find('h3').text().trim();
     if (titulo.includes('Exemplos')) {
      $(section).find('.frase').each((j, el) => {
          const exemplo = $(el).text().trim();
          const fonte = $(el).find('em').text().trim();
          if (exemplo) {
       resultado.exemplos.push({
           texto: exemplo.replace(fonte, '').trim(),
           fonte: fonte
       });
          }
      });
     }
     });

     $('.wrap-section').each((i, section) => {
     const titulo = $(section).find('h3').text().trim();
     if (titulo.includes('Rimas')) {
      $(section).find('a').each((j, el) => {
          resultado.rimas.push($(el).text().trim());
      });
     }
     });

     $('.wrap-section').each((i, section) => {
     const titulo = $(section).find('h3').text().trim();
     if (titulo.includes('Anagramas')) {
      $(section).find('li').each((j, el) => {
          resultado.anagramas.push($(el).text().trim());
      });
     }
     });

     resultado.imagem = $('.imagem-palavra').attr('src') || '';

     $('img[src*="amor"]').each((i, el) => {
     const src = $(el).attr('src');
     if (src && !resultado.imagem.includes(src)) {
      resultado.imagem.push(src);
     }
     });
     
     return resultado;
     
    } catch (e) {
     console.error(e);
    }
};

async function PlayStore(query) {
  try {
    const data = await Request(`https://play.google.com/store/search?q=${removerAcentos(query)}&c=apps`, {
      headers: {
       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(data);
    const resultado = [];
    $('.VfPpkd-aGsRMb').each((i, e) => {
      const imgSrc = $(e).find('img:first').attr('src') || $(e).find('img:last').attr('src');
      resultado.push({
        nome: $(e).find('.DdYX5:first').text().trim(),
        imagem: imgSrc?.trim(),
        desenvolvedor: $(e).find('.wMUdtb:first').text().trim(),
        estrelas: $(e).find('.w2kbF:first').text().trim(),
        link: 'https://play.google.com' + $(e).find('a:first').attr('href')
      });
    });
    
    return resultado;
    
  } catch (error) {
    console.error(e);
  }
};

async function Horoscopo(query) {
    try {
        const url = `https://www.horoscopovirtual.com.br/horoscopo/${removerAcentos(query)}`;
        const data = await Request(url);
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
        
        const signoLower = removerAcentos(query).toLowerCase();
        const imagem = imagensSignos[signoLower] || null;
        
    return {
            signo: query, 
            dia,
            previsao,
            imagem,
            url
        };
        
    } catch (e) {
        console.error(e);
    }
};

async function TikTok(query) {
  try {
    const response = await RequestPost('https://tikwm.com/api/feed/search', 
      `keywords=${removerAcentos(query)}&count=5&cursor=0&HD=1`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'current_language=pt-BR',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        }
      }
    );
    const videos = response.data.videos;
  
      const randomIndex = Math.floor(Math.random() * videos.length);
      const randomVideo = videos[randomIndex];
      return {
        criador: 'Hiudy',
        titulo: randomVideo.title,
        video: randomVideo.play,
        type: 'video',
        mime: 'video/mp4',
        audio: randomVideo.music
      };
   
  } catch (e) {
    console.error(e);
  }
};

async function Bing(query) {
  try {
    const data = await Request(`https://www.bing.com/images/search?q=${removerAcentos(query)}&form=HDRSC2`);
    
     const $ = cheerio.load(data);
     
     let results = [];
    $('a.iusc').each((i, el) => {
      let meta = $(el).attr('m');
      try {
       let obj = JSON.parse(meta);
        if (obj && obj.murl) results.push(obj.murl);
      } catch {}
      });
 
     return results;
 
  } catch (e) {
    console.error(e);
  }
};


module.exports = { YouTube, Pinterest, AudioMeme, Dicionario, PlayStore, Horoscopo, TikTok, Bing };