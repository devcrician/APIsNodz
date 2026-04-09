const express = require('express');
const router = express.Router();
const { STK } = require('../Exportacoes.js');

const validateUser = (req, res, next) => {
  const { user } = req.query;
  if (!user || (typeof user === 'string' && user.trim().length === 0)) {
    return res.status(400).json({ error: 'O parâmetro [user] é obrigatório' });
  }
  req.validUser = typeof user === 'string' ? user.trim() : String(user);
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

router.get('/instagram', validateUser, asyncHandler(async (req, res) => {
  const result = await STK.IgStalk(req.validUser);
  sendResponse(res, 'Stalkers do Instagram processado', result);
}));

router.get('/tiktok', validateUser, asyncHandler(async (req, res) => {
  const result = await STK.TikTok(req.validUser);
  sendResponse(res, 'Stalkers do TikTok processado', result);
}));

router.use((err, req, res, next) => {
  console.error(`[Stalkers] ${req.method} ${req.path} -`, err.message);
  sendError(res, 'Erro interno no servidor', err.message);
});

module.exports = router;