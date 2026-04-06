const { Request } = require('../Utils/ApiClient.js');
const axios = require('axios');

const IA_API_KEY = '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';


async function Copilot(prompt) {
  try {
  
  if (!prompt) {
    throw new Error('Parâmetro obrigatório ausente: prompt');
  }
  
  const api = await Request('https://api.deline.web.id/ai/copilot', {
    params: { text: prompt }
   });
 
   if (!api.result) {
    throw new Error('Resposta da API inválida');
  }

   return api.result;
  
  } catch (e) {
    console.error(e);
  }
};

async function Nvidia(modelo, prompt) {
  try {
  
  if (!modelo || !prompt) {
    throw new Error('Parâmetros obrigatórios ausentes: modelo e prompt');
  }

  const messages = [
    { role: 'user', content: prompt }
  ];

  const response = await axios.post('https://integrate.api.nvidia.com/v1/chat/completions', {
      messages,
      model: modelo,
      temperature: 0.7,
      max_tokens: 2000
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${IA_API_KEY}`
      },
      timeout: 120000
    });

  if (!response.data || !response.data.choices || !response.data.choices[0]) {
    throw new Error('Resposta da API inválida');
  }

  return response.data.choices[0].message.content;
  
  } catch (e) {
    console.error(e);
  }
};


module.exports = { Copilot, Nvidia };