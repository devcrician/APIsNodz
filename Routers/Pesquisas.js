const express = require('express');
const router = express.Router();

const { SRC } = require('../Exportacoes.js');

router.get('/youtube', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.YouTube(query);
    res.json({
      success: true,
      message: `Pesquisa do YouTube processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do YouTube falhada`,
      detalhes: e.message
    });
  }
});

router.get('/pinterest', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.Pinterest(query);
    res.json({
      success: true,
      message: `Pesquisa do Pinterest processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do Pinterest falhada`,
      detalhes: e.message
    });
  }
});

router.get('/audiomeme', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.AudioMeme(query);
    res.json({
      success: true,
      message: `Pesquisa do Audio Meme processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do Audio Meme falhada`,
      detalhes: e.message
    });
  }
});

router.get('/dicionario', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.Dicionario(query);
    res.json({
      success: true,
      message: `Pesquisa do Dicionário processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do Dicionário falhada`,
      detalhes: e.message
    });
  }
});

router.get('/playstore', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.PlayStore(query);
    res.json({
      success: true,
      message: `Pesquisa do PlayStore processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do PlayStore falhada`,
      detalhes: e.message
    });
  }
});

router.get('/horoscopo', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.Horoscopo(query);
    res.json({
      success: true,
      message: `Pesquisa do Horóscopo processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do Horóscopo falhada`,
      detalhes: e.message
    });
  }
});

router.get('/tiktok', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.TikTok(query);
    res.json({
      success: true,
      message: `Pesquisa do TikTok processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do TikTok falhada`,
      detalhes: e.message
    });
  }
});

router.get('/bing', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await SRC.Bing(query);
    res.json({
      success: true,
      message: `Pesquisa do Bing processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Pesquisa do Bing falhada`,
      detalhes: e.message
    });
  }
});

module.exports = router;