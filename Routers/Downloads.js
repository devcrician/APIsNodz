const express = require('express');
const router = express.Router();

const { DL } = require('../Exportacoes.js');

router.get('/youtube/audio', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }
   
    const result = await DL.YtAudio(url);
    res.json({
      success: true,
      message: `Download audio do YouTube processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download audio do YouTube falhado`,
      detalhes: e.message
    });
  }
});

router.get('/youtube/video', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }
   
    const result = await DL.YtVideo(url);
    res.json({
      success: true,
      message: `Download video do YouTube processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download video do YouTube falhado`,
      detalhes: e.message
    });
  }
});

router.get('/instagram', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.InstaDl(url);
    res.json({
      success: true,
      message: `Download do Instagram processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do Instagram falhado`,
      detalhes: e.message
    });
  }
});

router.get('/tiktok', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.TikTok(url);
    res.json({
      success: true,
      message: `Download do TikTok processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do TikTok falhado`,
      detalhes: e.message
    });
  }
});

router.get('/pinterest', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.pinterestDl(url);
    res.json({
      success: true,
      message: `Download do Pinterest processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do Pinterest falhado`,
      detalhes: e.message
    });
  }
});

router.get('/facebook', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.FaceBook(url);
    res.json({
      success: true,
      message: `Download do FaceBook processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do FaceBook falhado`,
      detalhes: e.message
    });
  }
});

router.get('/kwai', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.Kwai(url);
    res.json({
      success: true,
      message: `Download do Kwai processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do Kwai falhado`,
      detalhes: e.message
    });
  }
});

router.get('/twitter', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.twitterDl(url);
    res.json({
      success: true,
      message: `Download do Twitter processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do Twitter falhado`,
      detalhes: e.message
    });
  }
});

router.get('/gdrive', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.Gdrive(url);
    res.json({
      success: true,
      message: `Download do Gdrive processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do Gdrive falhado`,
      detalhes: e.message
    });
  }
});

router.get('/capcut', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.CapCut(url);
    res.json({
      success: true,
      message: `Download do CapCut processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do CapCut falhado`,
      detalhes: e.message
    });
  }
});

router.get('/fdroid', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.Fdroid(url);
    res.json({
      success: true,
      message: `Download do Fdroid processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do Fdroid falhado`,
      detalhes: e.message
    });
  }
});

router.get('/threads', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'O parâmetro [ url ] é obrigatório' });
    }

    const result = await DL.Threads(url);
    res.json({
      success: true,
      message: `Download do Threads processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Download do Threads falhado`,
      detalhes: e.message
    });
  }
});



module.exports = router;