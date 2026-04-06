const axios = require('axios');
const FormData = require('form-data');
const { fileTypeFromBuffer } = require('file-type');

async function Link(media) {
  try {
    const type = await fileTypeFromBuffer(media)
    const form = new FormData()
      form.append('reqtype', 'fileupload')
      form.append('fileToUpload', media, 'tmp.' + type.ext)
      form.append('userhash', '')
    const { data } = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders(), })
    return data.trim()
  } catch (e) {
    console.error(e) 
    return 'Sem informações do servidor';
  }
};

module.exports = Link;