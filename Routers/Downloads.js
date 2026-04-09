const express = require('express');
const router = express.Router();
const { DL } = require('../Exportacoes.js');

const validateUrl = (req, res, next) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'O parâmetro [url] é obrigatório' });
  }
  if (typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({ error: 'URL inválida' });
  }
  req.validUrl = url.trim();
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

router.get('/youtube/audio', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.YtAudio(req.validUrl);
  sendResponse(res, 'Download audio do YouTube processado', result);
}));

router.get('/youtube/video', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.YtVideo(req.validUrl);
  sendResponse(res, 'Download video do YouTube processado', result);
}));

router.get('/instagram', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.InstaDl(req.validUrl);
  sendResponse(res, 'Download do Instagram processado', result);
}));

router.get('/tiktok', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.TikTok(req.validUrl);
  sendResponse(res, 'Download do TikTok processado', result);
}));

router.get('/pinterest', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.pinterestDl(req.validUrl);
  sendResponse(res, 'Download do Pinterest processado', result);
}));

router.get('/facebook', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.FaceBook(req.validUrl);
  sendResponse(res, 'Download do Facebook processado', result);
}));

router.get('/kwai', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.Kwai(req.validUrl);
  sendResponse(res, 'Download do Kwai processado', result);
}));

router.get('/twitter', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.twitterDl(req.validUrl);
  sendResponse(res, 'Download do Twitter processado', result);
}));

router.get('/gdrive', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.Gdrive(req.validUrl);
  sendResponse(res, 'Download do Google Drive processado', result);
}));

router.get('/capcut', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.CapCut(req.validUrl);
  sendResponse(res, 'Download do CapCut processado', result);
}));

router.get('/fdroid', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.Fdroid(req.validUrl);
  sendResponse(res, 'Download do F-Droid processado', result);
}));

router.get('/threads', validateUrl, asyncHandler(async (req, res) => {
  const result = await DL.Threads(req.validUrl);
  sendResponse(res, 'Download do Threads processado', result);
}));

router.use((err, req, res, next) => {
  console.error(`[${req.method}] ${req.path} -`, err.message);
  sendError(res, 'Erro interno no servidor', err.message);
});

module.exports = router;