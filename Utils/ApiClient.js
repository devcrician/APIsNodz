const swiftly = require('@cognima/swiftly');
const axios = require('axios');

async function Request(url, options = {}) {
  try {
    
    const apiClient = await swiftly.get(url, options);
    return apiClient;
  
  } catch (e) {
    console.error(e)
  }
};

async function RequestPost(url, options = {}) {
  try {
    
    const apiClient = await axios.post(url, options);
    return apiClient.data;
  
  } catch (e) {
    console.error(e)
  }
};

module.exports = { Request, RequestPost };