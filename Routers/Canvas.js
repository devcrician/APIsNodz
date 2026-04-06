const express = require('express');
const router = express.Router();

const { CNV } = require('../Exportacoes.js'); 

router.get('/musica', async (req, res) => {
  try {
    const { titulo, artista, views, tempo, imagem } = req.query;

     if (!titulo) {
      return res.status(400).json({ error: 'O parâmetro [ titulo ] é obrigatório' });
    }
    
    if (!artista) {
      return res.status(400).json({ error: 'O parâmetro [ artista ] é obrigatório '});
    }
    
    if (!views) {
      return res.status(400).json({ error: 'O parâmetro [ views ] é obrigatório '});
    }
    
    if (!tempo) {
      return res.status(400).json({ error: 'O parâmetro [ tempo ] é obrigatório '});
    }
    
    if (!imagem) {
      return res.status(400).json({ error: 'O parâmetro [ imagem ] é obrigatório '});
    }

    const result = await CNV.MusicCardSimples(titulo, artista, views, tempo, imagem);
    
    res.json({
      success: true,
      message: 'Canvas de Musica processado',
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: 'Canvas de Musica falhado',
      detalhes: e.message
    });
  }
});

router.get('/instagram', async (req, res) => {
  try {
    const { username, followers, following, posts, imagem } = req.query;

if (!username) {
      return res.status(400).json({ error: 'O parâmetro [ username ] é obrigatório' });
    }
    
    if (!followers) {
      return res.status(400).json({ error: 'O parâmetro [ followers ] é obrigatório '});
    }
    
    if (!following) {
      return res.status(400).json({ error: 'O parâmetro [ following ] é obrigatório '});
    }
    
    if (!posts) {
      return res.status(400).json({ error: 'O parâmetro [ posts ] é obrigatório '});
    }
    
    if (!imagem) {
      return res.status(400).json({ error: 'O parâmetro [ imagem ] é obrigatório '});
    }

    const followersNum = parseInt(followers) || 0;
    const followingNum = parseInt(following) || 0;
    const postsNum = parseInt(posts) || 0;

    const result = await CNV.CardStalkInsta(
      username, 
      followersNum.toString(), 
      followingNum.toString(), 
      postsNum.toString(), 
      imagem
    );
    
    res.json({
      success: true,
      message: 'Canvas do Instagram processado',
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: 'Canvas de Instagram falhado',
      detalhes: e.message
    });
  }
});

router.get('/music-personalizado', async (req, res) => {
  try {
    const { titulo, artista, views, tempo, imagem } = req.query;

    if (!titulo) {
      return res.status(400).json({ 
        error: true,
        message: 'O parâmetro [ titulo ] é obrigatório'
      });
    }

    const result = await CNV.MusicCardPersonalizado(titulo, artista, views, tempo, imagem);
    
    res.json({
      success: true,
      message: 'Cartão de música personalizado gerado com sucesso',
      resultado: result
    });
  } catch (e) {
    console.error('Erro na rota music-personalizado:', e);
    res.status(500).json({
      error: true,
      message: 'Falha ao gerar cartão de música personalizado',
      detalhes: e.message
    });
  }
});

// Rota para MusicCardColorido
router.get('/music-colorido', async (req, res) => {
  try {
    const { titulo, artista, views, tempo, imagem } = req.query;

    if (!titulo) {
      return res.status(400).json({ 
        error: true,
        message: 'O parâmetro [ titulo ] é obrigatório'
      });
    }

    const result = await CNV.MusicCardColorido(titulo, artista, views, tempo, imagem);
    
    res.json({
      success: true,
      message: 'Cartão de música colorido gerado com sucesso',
      resultado: result
    });
  } catch (e) {
    console.error('Erro na rota music-colorido:', e);
    res.status(500).json({
      error: true,
      message: 'Falha ao gerar cartão de música colorido',
      detalhes: e.message
    });
  }
});

module.exports = router;