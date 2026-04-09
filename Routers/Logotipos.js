const express = require('express');
const router = express.Router();
const { LGS } = require('../Exportacoes.js');

const validateText = (req, res, next) => {
  const { text } = req.query;
  if (!text || (typeof text === 'string' && text.trim().length === 0)) {
    return res.status(400).json({ error: 'O parâmetro [text] é obrigatório' });
  }
  req.validText = typeof text === 'string' ? text.trim() : String(text);
  next();
};

const validateTexts = (req, res, next) => {
  const { text1, text2 } = req.query;
  if (!text1 || (typeof text1 === 'string' && text1.trim().length === 0)) {
    return res.status(400).json({ error: 'O parâmetro [text1] é obrigatório' });
  }
  if (!text2 || (typeof text2 === 'string' && text2.trim().length === 0)) {
    return res.status(400).json({ error: 'O parâmetro [text2] é obrigatório' });
  }
  req.validText1 = typeof text1 === 'string' ? text1.trim() : String(text1);
  req.validText2 = typeof text2 === 'string' ? text2.trim() : String(text2);
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

const rotas1Texto = [
  { nome: 'darkgreen', url: 'https://en.ephoto360.com/dark-green-typography-online-359.html' },
  { nome: 'glitch', url: 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html' },
  { nome: 'write', url: 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html' },
  { nome: 'advanced', url: 'https://en.ephoto360.com/advanced-glow-effects-74.html' },
  { nome: 'typography', url: 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html' },
  { nome: 'pixel', url: 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html' },
  { nome: 'neon', url: 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html' },
  { nome: 'flag', url: 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html' },
  { nome: 'americanflag', url: 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html' },
  { nome: 'deleting', url: 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html' }
];

const rotas2Textos = [
  { nome: 'blackpink', url: 'https://en.ephoto360.com/create-blackpink-s-born-pink-album-logo-online-779.html' },
  { nome: 'deadpool', url: 'https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html' },
  { nome: 'amongus', url: 'https://en.ephoto360.com/create-a-banner-game-among-us-with-your-name-763.html' },
  { nome: 'thor', url: 'https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html' },
  { nome: 'neon2', url: 'https://en.ephoto360.com/neon-text-effect-online-78.html' },
  { nome: 'stone3d', url: 'https://en.ephoto360.com/create-3d-stone-text-effect-online-508.html' },
  { nome: 'captainamerica', url: 'https://en.ephoto360.com/create-a-cinematic-captain-america-text-effect-online-715.html' },
  { nome: 'graffiti', url: 'https://en.ephoto360.com/cute-girl-painting-graffiti-text-effect-667.html' },
  { nome: 'avengers', url: 'https://en.ephoto360.com/create-logo-3d-style-avengers-online-427.html' },
  { nome: 'vintage', url: 'https://en.ephoto360.com/create-realistic-vintage-3d-light-bulb-608.html' },
  { nome: 'tiktok', url: 'https://en.ephoto360.com/tik-tok-text-effects-online-generator-485.html' },
  { nome: 'buoys', url: 'https://en.ephoto360.com/write-letters-on-life-buoys-484.html' },
  { nome: 'wood', url: 'https://en.ephoto360.com/create-3d-wood-text-effects-online-free-705.html' },
  { nome: 'space3d', url: 'https://en.ephoto360.com/latest-space-3d-text-effect-online-559.html' },
  { nome: 'wolf', url: 'https://en.ephoto360.com/create-logo-avatar-wolf-galaxy-online-366.html' },
  { nome: 'steel', url: 'https://en.ephoto360.com/steel-text-effect-66.html' },
  { nome: 'lettering', url: 'https://en.ephoto360.com/heated-steel-lettering-effect-65.html' }, 
  { nome: 'pornhub', url: 'https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html' }
];

rotas1Texto.forEach(rota => {
  router.get(`/${rota.nome}`, validateText, asyncHandler(async (req, res) => {
    const result = await LGS.Ephoto(rota.url, req.validText);
    sendResponse(res, `Logotipo do ${rota.nome.charAt(0).toUpperCase() + rota.nome.slice(1)} processado`, result);
  }));
});

rotas2Textos.forEach(rota => {
  router.get(`/ephoto/${rota.nome}`, validateTexts, asyncHandler(async (req, res) => {
    const result = await LGS.Ephoto2(rota.url, req.validText1, req.validText2);
    sendResponse(res, `Logotipo do ${rota.nome.charAt(0).toUpperCase() + rota.nome.slice(1)} processado`, result);
  }));
});

router.use((err, req, res, next) => {
  console.error(`[Logotipos] ${req.method} ${req.path} -`, err.message);
  sendError(res, 'Erro interno no servidor', err.message);
});

module.exports = router;


router.get('/ephoto/pornhub', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Pornhub processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Pornhub falhado`,
      detalhes: e.message
    });
  }
});