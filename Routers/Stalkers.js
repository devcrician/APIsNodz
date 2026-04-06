const express = require('express');
const router = express.Router();

const { STK } = require('../Exportacoes.js');

router.get('/instagram', async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ error: 'O parâmetro [ user ] é obrigatório' });
    }

    const result = await STK.IgStalk(user);
    res.json({
      success: true,
      message: `Stalkers do Instagram processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Stalkers do Instagram falhado`,
      detalhes: e.message
    });
  }
});

router.get('/tiktok', async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ error: 'O parâmetro [ user ] é obrigatório' });
    }

    const result = await STK.TikTok(user);
    res.json({
      success: true,
      message: `Stalkers do Tiktok processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Stalkers do TikTok falhado`,
      detalhes: e.message
    });
  }
});

module.exports = router;