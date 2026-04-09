const express = require('express');
const router = express.Router();
const { SRC } = require('../Exportacoes.js');

const validateQuery = (req, res, next) => {
  const { query } = req.query;
  if (!query || (typeof query === 'string' && query.trim().length === 0)) {
    return res.status(400).json({ error: 'O parâmetro [query] é obrigatório' });
  }
  req.validQuery = typeof query === 'string' ? query.trim() : String(query);
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

router.get('/youtube', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.YouTube(req.validQuery);
  sendResponse(res, 'Pesquisa do YouTube processada', result);
}));

router.get('/pinterest', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.Pinterest(req.validQuery);
  sendResponse(res, 'Pesquisa do Pinterest processada', result);
}));

router.get('/audiomeme', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.AudioMeme(req.validQuery);
  sendResponse(res, 'Pesquisa do Audio Meme processada', result);
}));

router.get('/dicionario', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.Dicionario(req.validQuery);
  sendResponse(res, 'Pesquisa do Dicionário processada', result);
}));

router.get('/playstore', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.PlayStore(req.validQuery);
  sendResponse(res, 'Pesquisa do PlayStore processada', result);
}));

router.get('/horoscopo', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.Horoscopo(req.validQuery);
  sendResponse(res, 'Pesquisa do Horóscopo processada', result);
}));

router.get('/tiktok', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.TikTok(req.validQuery);
  sendResponse(res, 'Pesquisa do TikTok processada', result);
}));

router.get('/bing', validateQuery, asyncHandler(async (req, res) => {
  const result = await SRC.Bing(req.validQuery);
  sendResponse(res, 'Pesquisa do Bing processada', result);
}));

router.use((err, req, res, next) => {
  console.error(`[Pesquisas] ${req.method} ${req.path} -`, err.message);
  sendError(res, 'Erro interno no servidor', err.message);
});

module.exports = router;