const express = require('express');
const router = express.Router();
const { CNV } = require('../Exportacoes.js');

const validateParams = (params) => (req, res, next) => {
  for (const param of params) {
    const value = req.query[param];
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return res.status(400).json({ error: `O parâmetro [${param}] é obrigatório` });
    }
  }
  next();
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const sendResponse = (res, message, result) => {
  res.json({
    success: true,
    message,
    resultado: result
  });
};

const sendError = (res, message, error) => {
  res.status(500).json({
    error: true,
    message,
    detalhes: error?.message || error
  });
};

router.get('/musica', validateParams(['titulo', 'artista', 'views', 'tempo', 'imagem']), asyncHandler(async (req, res) => {
  const { titulo, artista, views, tempo, imagem } = req.query;
  const result = await CNV.MusicCardSimples(titulo, artista, views, tempo, imagem);
  sendResponse(res, 'Canvas de Musica processado', result);
}));

router.get('/instagram', validateParams(['username', 'followers', 'following', 'posts', 'imagem']), asyncHandler(async (req, res) => {
  const { username, followers, following, posts, imagem } = req.query;
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
  sendResponse(res, 'Canvas do Instagram processado', result);
}));

router.get('/music-personalizado', validateParams(['titulo']), asyncHandler(async (req, res) => {
  const { titulo, artista, views, tempo, imagem } = req.query;
  const result = await CNV.MusicCardPersonalizado(titulo, artista, views, tempo, imagem);
  sendResponse(res, 'Cartão de música personalizado gerado com sucesso', result);
}));

router.get('/music-colorido', validateParams(['titulo']), asyncHandler(async (req, res) => {
  const { titulo, artista, views, tempo, imagem } = req.query;
  const result = await CNV.MusicCardColorido(titulo, artista, views, tempo, imagem);
  sendResponse(res, 'Cartão de música colorido gerado com sucesso', result);
}));

router.use((err, req, res, next) => {
  console.error(`[Canvas] ${req.method} ${req.path} -`, err.message);
  sendError(res, 'Erro interno no servidor', err.message);
});

module.exports = router;