const { Request } = require('../Utils/ApiClient.js');


async function IgStalk(user) {
  try {
    const api = await Request('https://api.vreden.my.id/api/v1/stalker/instagram', 
    { params: { username: user }});
     
    return {
     id: api.result.id,
     username: api.result.username,
     nome: api.result.full_name,
     categoria: api.result.category,
     bio: api.result.biography,
     bio_links: api.result.bio_links,
     imagem: api.result.profile_pic_hd.url,
     empresa: api.result.is_business ? 'sim' : 'nao',
     conta: api.result.is_private ? 'privada' : 'publica',
     verificada: api.result.is_verified ? 'sim' : 'nao',
     seguidores: api.result.statistics.follower,
     seguindo: api.result.statistics.following,
     postagens: api.result.statistics.post
    }
  } catch (e) {
    console.error(e);
  }
};

async function TikTok(user) {
  try {
    const api = await Request('https://api.vreden.my.id/api/v1/stalker/tiktok',
    { params: { username: user }});
    
    return {
      username: api.result.username,
      nome: api.result.nickname,
      imagem: api.result.avatar.thumbnail,
      bio: api.result.biography,
      bio_links: api.result.biolink,
      verificada: api.result.verified ? 'sim' : 'nao',
      idioma: api.result.language,
      seguidores: api.result.statistics.follower,
      seguindo: api.result.statistics.following,
      curtidas: api.result.statistics.like,
      postagens: api.result.statistics.post,
      amigos: api.result.statistics.friend
    }
  } catch (e) {
    console.error(e);
  }
};


module.exports = { IgStalk, TikTok };