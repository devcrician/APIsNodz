const express = require('express');
const router = express.Router();
const { TLS } = require('../Exportacoes.js');

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

router.get('/lyrics', validateQuery, asyncHandler(async (req, res) => {
  const result = await TLS.Lyrics(req.validQuery);
  sendResponse(res, 'Tools do Lyrics processada', result);
}));

router.get('/gerarnick', validateQuery, asyncHandler(async (req, res) => {
  const result = await TLS.GerarNick(req.validQuery);
  sendResponse(res, 'Tools do Gerar Nick processado', result);
}));

router.get('/codificar', validateQuery, asyncHandler(async (req, res) => {
  const result = await TLS.Codificar(req.validQuery);
  sendResponse(res, 'Tools do Codificar processado', result);
}));

router.get('/decodificar', validateQuery, asyncHandler(async (req, res) => {
  const result = await TLS.Decodificar(req.validQuery);
  sendResponse(res, 'Tools do Decodificar processado', result);
}));

router.get('/morse', validateQuery, asyncHandler(async (req, res) => {
  const result = await TLS.Morse(req.validQuery);
  sendResponse(res, 'Tools do Morse processado', result);
}));

router.get('/pensador', validateQuery, asyncHandler(async (req, res) => {
  const result = await TLS.Pensador(req.validQuery);
  sendResponse(res, 'Tools do Pensador processado', result);
}));

router.get('/historias', asyncHandler(async (req, res) => {
  const result = await TLS.Historias();
  sendResponse(res, 'Tools de Histórias processada', result);
}));

router.use((err, req, res, next) => {
  console.error(`[Tools] ${req.method} ${req.path} -`, err.message);
  sendError(res, 'Erro interno no servidor', err.message);
});

module.exports = router;