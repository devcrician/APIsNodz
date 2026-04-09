const express = require('express');
const router = express.Router();
const { IAS } = require('../Exportacoes.js');

const validatePrompt = (req, res, next) => {
  const { prompt } = req.query;
  if (!prompt || (typeof prompt === 'string' && prompt.trim().length === 0)) {
    return res.status(400).json({ error: 'O parâmetro [prompt] é obrigatório' });
  }
  req.validPrompt = typeof prompt === 'string' ? prompt.trim() : String(prompt);
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

const modelos = {
  'qwen3-235b-a22b': 'qwen/qwen3-235b-a22b',
  'gemma-7b': 'google/gemma-7b',
  'kimi-k2-instruct': 'moonshotai/kimi-k2-instruct',
  'dracarys-llama-3': 'abacusai/dracarys-llama-3.1-70b-instruct',
  'phi-3-medium': 'microsoft/phi-3-medium-4k-instruct'
};

router.get('/copilot', validatePrompt, asyncHandler(async (req, res) => {
  const result = await IAS.Copilot(req.validPrompt);
  sendResponse(res, 'AI do Copilot processada', result);
}));

router.get('/qwen3-235b-a22b', validatePrompt, asyncHandler(async (req, res) => {
  const result = await IAS.Nvidia(modelos['qwen3-235b-a22b'], req.validPrompt);
  sendResponse(res, 'AI do qwen3-235b-a22b processada', result);
}));

router.get('/gemma-7b', validatePrompt, asyncHandler(async (req, res) => {
  const result = await IAS.Nvidia(modelos['gemma-7b'], req.validPrompt);
  sendResponse(res, 'AI do gemma-7b processada', result);
}));

router.get('/kimi-k2-instruct', validatePrompt, asyncHandler(async (req, res) => {
  const result = await IAS.Nvidia(modelos['kimi-k2-instruct'], req.validPrompt);
  sendResponse(res, 'AI do kimi-k2-instruct processada', result);
}));

router.get('/dracarys-llama-3', validatePrompt, asyncHandler(async (req, res) => {
  const result = await IAS.Nvidia(modelos['dracarys-llama-3'], req.validPrompt);
  sendResponse(res, 'AI do dracarys-llama-3 processada', result);
}));

router.get('/phi-3-medium', validatePrompt, asyncHandler(async (req, res) => {
  const result = await IAS.Nvidia(modelos['phi-3-medium'], req.validPrompt);
  sendResponse(res, 'AI do phi-3-medium-4k-instruct processada', result);
}));

router.use((err, req, res, next) => {
  console.error(`[IAs] ${req.method} ${req.path} -`, err.message);
  sendError(res, 'Erro interno no servidor', err.message);
});

module.exports = router;