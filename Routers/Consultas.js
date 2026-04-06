const express = require('express');
const router = express.Router();

const { CST } = require('../Exportacoes.js');

router.get('/nome', async (req, res) => {
  try {
    const { dados } = req.query;

    if (!dados) {
      return res.status(400).json({ error: 'O parâmetro [ dados ] é obrigatório' });
    }

    const result = await CST.Nome(dados);
    res.json({
      success: true,
      message: `Consultas de Nome processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Consultas de Nome falhada`,
      detalhes: e.message
    });
  }
});

router.get('/cpf', async (req, res) => {
  try {
    const { dados } = req.query;

    if (!dados) {
      return res.status(400).json({ error: 'O parâmetro [ dados ] é obrigatório' });
    }

    const result = await CST.CPF(dados);
    res.json({
      success: true,
      message: `Consultas de Cpf processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Consultas de Cpf falhada`,
      detalhes: e.message
    });
  }
});

router.get('/telefone', async (req, res) => {
  try {
    const { dados } = req.query;

    if (!dados) {
      return res.status(400).json({ error: 'O parâmetro [ dados ] é obrigatório' });
    }

    const result = await CST.Telefone(dados);
    res.json({
      success: true,
      message: `Consultas de Telefone processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Consultas de Telefone falhada`,
      detalhes: e.message
    });
  }
});

router.get('/placa', async (req, res) => {
  try {
    const { dados } = req.query;

    if (!dados) {
      return res.status(400).json({ error: 'O parâmetro [ dados ] é obrigatório' });
    }

    const result = await CST.Placa(dados);
    res.json({
      success: true,
      message: `Consultas de Placa processada`,
      resultado: result
    });
  } catch (e) {
    res.status(500).json({
      error: true,
      message: `Consultas de Placa falhada`,
      detalhes: e.message
    });
  }
});

module.exports = router;