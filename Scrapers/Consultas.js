const { Request } = require('../Utils/ApiClient.js');
const cheerio = require('cheerio');

function extrairParametroConsulta($) {
    const elementos = $('p.text-gray-600');
    let textoParametro = null;
    
    elementos.each((_, elemento) => {
        const texto = $(elemento).text();
        if (texto.includes('Parâmetro:')) {
            textoParametro = texto;
            return false; 
        }
    });
    
    if (textoParametro) {
        const match = textoParametro.match(/Parâmetro:\s*(.+)/);
        return match ? match[1].trim() : null;
    }
    return null;
}

function extrairDadosEstruturados(resultado) {
    const dados = {};
    const linhas = resultado.split('\n');
    
    linhas.forEach(linha => {
        if (linha.includes('•')) {
            const partes = linha.split(':');
            if (partes.length > 1) {
                const chave = partes[0].replace('•', '').trim();
                const valor = partes.slice(1).join(':').trim();
                if (chave && valor) {
                    dados[chave] = valor;
                }
            }
        }
    });
    
    return dados;
}

async function Extracao(url) {
    try {
        const response = await Request(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        if (response.status === 200) {
            const $ = cheerio.load(response);
            const resultadoElement = $('#resultText');
            const resultado = resultadoElement.length > 0 ? resultadoElement.text().trim() : 'Não encontrado';
            const categoriaElement = $('h2.text-xl.font-semibold.text-gray-800');
            const categoria = categoriaElement.length > 0 ? categoriaElement.text().trim() : 'Não informado';
            const parametro = extrairParametroConsulta($);
            
            const dados = {
                categoria,
                parametro,
                resultado,
            };
            
            return dados;
        } else {
            console.error(`Erro na requisição: Status ${response.status}`);
            return null;
        }
    } catch (e) {
      console.error(e)
    }
};

const APIKEY = 'ck_88155e253b6ce20e501e3b9e8b0ee750dc237d224bc5191d31adb5200fbda431';
const API_BASE_URL = 'https://cog.api.br/api/v1/consulta/';
const API_TIMEOUT = 60000;

async function fazerConsultaAPI(type, dados) {
    try {
        const response = await Request(API_BASE_URL, {
            params: {
                type: type,
                dados: dados
            },
            headers: {
                'Authorization': `Bearer ${APIKEY}`
            },
            timeout: API_TIMEOUT
        });
        
        const api = response.data;

        return {
          tipo: api.type,
          consultado: api.dados,
          dados: api.txt
        }
    } catch (e) {
        console.error(e);
    }
};

async function CPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('cpf', cpfLimpo);
}

async function Vizinhos(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('vizinhos', cpfLimpo);
}

async function Proprietario(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('proprietario', cpfLimpo);
}

async function Empregos(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('empregos', cpfLimpo);
}

async function Vacinas(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('vacinas', cpfLimpo);
}

async function Beneficios(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('beneficios', cpfLimpo);
}

async function Internet(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('internet', cpfLimpo);
}

async function Parentes(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('parentes', cpfLimpo);
}

async function Enderecos(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('enderecos', cpfLimpo);
}

async function Obito(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('obito', cpfLimpo);
}

async function Score(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('score', cpfLimpo);
}

async function Compras(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('compras', cpfLimpo);
}

async function CNH(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        throw new Error('CPF deve conter exatamente 11 dígitos');
    }
    
    return await fazerConsultaAPI('cnh', cpfLimpo);
}

async function Nome(nome) {
    const nomeFormatado = nome.trim();
    
    if (nomeFormatado.length < 3) {
        throw new Error('O nome deve conter pelo menos 3 caracteres');
    }
    
    return await fazerConsultaAPI('nome', nomeFormatado);
}

async function Pai(nome) {
    const nomeFormatado = nome.trim();
    
    if (nomeFormatado.length < 3) {
        throw new Error('O nome deve conter pelo menos 3 caracteres');
    }
    
    return await fazerConsultaAPI('pai', nomeFormatado);
}

async function Mae(nome) {
    const nomeFormatado = nome.trim();
    
    if (nomeFormatado.length < 3) {
        throw new Error('O nome deve conter pelo menos 3 caracteres');
    }
    
    return await fazerConsultaAPI('mae', nomeFormatado);
}

async function Telefone(telefone) {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        throw new Error('O telefone deve conter 10 ou 11 dígitos');
    }
    
    return await fazerConsultaAPI('telefone', telefoneLimpo);
}

async function Placa(placa) {
    const placaFormatada = placa.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (placaFormatada.length !== 7) {
        throw new Error('A placa deve ter 7 caracteres');
    }
    
    return await fazerConsultaAPI('placa', placaFormatada);
}

async function Chassi(chassi) {
    const chassiFormatado = chassi.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (chassiFormatado.length !== 17) {
        throw new Error('O chassi deve conter 17 caracteres');
    }
    
    return await fazerConsultaAPI('chassi', chassiFormatado);
}

async function CNPJ(cnpj) {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ deve conter exatamente 14 dígitos');
    }
    
    return await fazerConsultaAPI('cnpj', cnpjLimpo);
}

async function Funcionarios(cnpj) {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ deve conter exatamente 14 dígitos');
    }
    
    return await fazerConsultaAPI('funcionarios', cnpjLimpo);
}

async function CEP(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
        throw new Error('CEP deve conter exatamente 8 dígitos');
    }
    
    return await fazerConsultaAPI('cep', cepLimpo);
}

async function Email(email) {
    const emailFormatado = email.trim().toLowerCase();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailFormatado)) {
        throw new Error('Email inválido');
    }
    
    return await fazerConsultaAPI('email', emailFormatado);
}

async function Titulo(titulo) {
    const tituloLimpo = titulo.replace(/\D/g, '');
    
    if (tituloLimpo.length !== 12) {
        throw new Error('Título de eleitor deve conter 12 dígitos');
    }
    
    return await fazerConsultaAPI('titulo', tituloLimpo);
}

module.exports = {
    Extracao,
    extrairDadosEstruturados,
    CPF,
    Vizinhos,
    Proprietario,
    Empregos,
    Vacinas,
    Beneficios,
    Internet,
    Parentes,
    Enderecos,
    Obito,
    Score,
    Compras,
    CNH,
    Nome,
    Pai,
    Mae,
    Telefone,
    Placa,
    Chassi,
    CNPJ,
    Funcionarios,
    CEP,
    Email,
    Titulo
};