const express = require('express');
const router = express.Router();

const { TLS } = require('../Exportacoes.js');

router.get('/lyrics', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await TLS.Lyrics(query);
    res.json({
      success: true,
      message: `Tools do Lyrics processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Tools do Lyrics falhada`,
      detalhes: e.message
    });
  }
});

router.get('/gerarnick', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await TLS.GerarNick(query);
    res.json({
      success: true,
      message: `Tools do Gerar Nick processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Tools do Gerar Nick falhado`,
      detalhes: e.message
    });
  }
});

router.get('/codificar', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await TLS.Codificar(query);
    res.json({
      success: true,
      message: `Tools do Codificar processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Tools do Codificar falhado`,
      detalhes: e.message
    });
  }
});

router.get('/decodificar', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await TLS.Decodificar(query);
    res.json({
      success: true,
      message: `Tools do Decodificar processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Tools do Decodificar falhado`,
      detalhes: e.message
    });
  }
});

router.get('/morse', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await TLS.Morse(query);
    res.json({
      success: true,
      message: `Tools do Morse processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Tools do Morse falhado`,
      detalhes: e.message
    });
  }
});

router.get('/pensador', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'O parâmetro [ query ] é obrigatório' });
    }

    const result = await TLS.Pensador(query);
    res.json({
      success: true,
      message: `Tools do Pensador processado`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Tools do Pensador falhado`,
      detalhes: e.message
    });
  }
});

router.get('/historias', async (req, res) => {
  try {
    const result = await TLS.Historias();
    res.json({
      success: true,
      message: `Tools de Histórias processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Tools de Histórias falhada`,
      detalhes: e.message
    });
  }
});

module.exports = router;