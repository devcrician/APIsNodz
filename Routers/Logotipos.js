const express = require('express');
const router = express.Router();

const { LGS } = require('../Exportacoes.js');

router.get('/darkgreen', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/dark-green-typography-online-359.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Dark Green processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Dark Green falhado`,
      detalhes: e.message
    });
  }
});

router.get('/glitch', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Glitch processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Glitch falhado`,
      detalhes: e.message
    });
  }
});

router.get('/write', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Write processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Write falhado`,
      detalhes: e.message
    });
  }
});

router.get('/advanced', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/advanced-glow-effects-74.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Advanced processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Advanced falhado`,
      detalhes: e.message
    });
  }
});

router.get('/typography', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Typography processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Typography falhado`,
      detalhes: e.message
    });
  }
});

router.get('/pixel', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Pixel processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Pixel falhado`,
      detalhes: e.message
    });
  }
});

router.get('/neon', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Neon processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Neon falhado`,
      detalhes: e.message
    });
  }
});

router.get('/flag', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Flag processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Flag falhado`,
      detalhes: e.message
    });
  }
});

router.get('/americanflag', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do American Flag processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do American Flag falhado`,
      detalhes: e.message
    });
  }
});

router.get('/deleting', async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: 'O parâmetro [ text ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html";
    
    const result = await LGS.Ephoto(modelo, text);
    
    res.json({
      success: true,
      message: `Logotipo do Deleting processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Deleting falhado`,
      detalhes: e.message
    });
  }
});

/*
  * Logotipos 2 textos
*/
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

router.get('/ephoto/blackpink', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-blackpink-s-born-pink-album-logo-online-779.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do BlackPink processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do BlackPink falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/deadpool', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Deadpool processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Deadpool falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/amongus', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-a-banner-game-among-us-with-your-name-763.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Amongus processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Amongus falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/thor', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Thor processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Thor falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/neon2', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/neon-text-effect-online-78.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Neon processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Neon falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/stone3d', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-3d-stone-text-effect-online-508.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Stone3d processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Stone3d falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/captainamerica', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-a-cinematic-captain-america-text-effect-online-715.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Captainamerica processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Captainamerica falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/graffiti', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/cute-girl-painting-graffiti-text-effect-667.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Graffiti processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Graffiti falhado`,
      detalhes: e.message
    });
  }
});

router.get('/ephoto/avengers', async (req, res) => {
  try {
    const { text1, text2 } = req.query;

    if (!text1) {
      return res.status(400).json({ error: 'O parâmetro [ text1 ] é obrigatório' });
    }
    
    if (!text2) {
      return res.status(400).json({ error: 'O parâmetro [ text2 ] é obrigatório' });
    }
    
    const modelo = "https://en.ephoto360.com/create-logo-3d-style-avengers-online-427.html";
    
    const result = await LGS.Ephoto2(modelo, text1, text2);
    
    res.json({
      success: true,
      message: `Logotipo do Avengers processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Logotipo do Avengers falhado`,
      detalhes: e.message
    });
  }
});

/*
    vintage: "https://en.ephoto360.com/create-realistic-vintage-3d-light-bulb-608.html",
    tiktok: "https://en.ephoto360.com/tik-tok-text-effects-online-generator-485.html",
    buoys: "https://en.ephoto360.com/write-letters-on-life-buoys-484.html",
    wood: "https://en.ephoto360.com/create-3d-wood-text-effects-online-free-705.html",
    space3d: "https://en.ephoto360.com/latest-space-3d-text-effect-online-559.html",
    wolf: "https://en.ephoto360.com/create-logo-avatar-wolf-galaxy-online-366.html",
    steel: "https://en.ephoto360.com/steel-text-effect-66.html",
    lattering: "https://en.ephoto360.com/heated-steel-lettering-effect-65.html"
*/

module.exports = router;