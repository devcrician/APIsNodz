const express = require('express');
const router = express.Router();

const { IAS } = require('../Exportacoes.js');

router.get('/copilot', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'O parâmetro [ prompt ] é obrigatório' });
    }

    const result = await IAS.Copilot(prompt);
    res.json({
      success: true,
      message: `AI do Copilot processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `AI do Copilot falhada`,
      detalhes: e.message
    });
  }
});

router.get('/qwen3-235b-a22b', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'O parâmetro [ prompt ] é obrigatório' });
    }

    const result = await IAS.Nvidia('qwen/qwen3-235b-a22b', prompt);
    res.json({
      success: true,
      message: `AI do qwen3-235b-a22b processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `AI do qwen3-235b-a22b falhada`,
      detalhes: e.message
    });
  }
});

router.get('/gemma-7b', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'O parâmetro [ prompt ] é obrigatório' });
    }

    const result = await IAS.Nvidia('google/gemma-7b', prompt);
    res.json({
      success: true,
      message: `AI do gemma-7b processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `AI do gemma-7b falhada`,
      detalhes: e.message
    });
  }
});

router.get('/kimi-k2-instruct', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'O parâmetro [ prompt ] é obrigatório' });
    }

    const result = await IAS.Nvidia('moonshotai/kimi-k2-instruct', prompt);
    res.json({
      success: true,
      message: `AI do kimi-k2-instruct processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `AI do kimi-k2-instruct falhada`,
      detalhes: e.message
    });
  }
});

router.get('/dracarys-llama-3', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'O parâmetro [ prompt ] é obrigatório' });
    }

    const result = await IAS.Nvidia('abacusai/dracarys-llama-3.1-70b-instruct', prompt);
    res.json({
      success: true,
      message: `AI do dracarys-llama-3 processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `AI do dracarys-llama-3 falhada`,
      detalhes: e.message
    });
  }
});

router.get('/phi-3-medium-4k-instruct', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'O parâmetro [ prompt ] é obrigatório' });
    }

    const result = await IAS.Nvidia('microsoft/phi-3-medium-4k-instruct', prompt);
    res.json({
      success: true,
      message: `AI do phi-3-medium-4k-instruct processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `AI do phi-3-medium-4k-instruct falhada`,
      detalhes: e.message
    });
  }
});

module.exports = router;