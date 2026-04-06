# APIsNodz 

![Banner](https://raw.githubusercontent.com/nazuninha/uploads/main/fotos/1775506114252_it1zmq.jpg)

> Um site gratuito desenvolvido por mim, Crician. Estou disponibilizando para quem quiser usar como base.

## 📖 Sobre o Projeto

APIsNodz é uma API completa com diversas funcionalidades incluindo:
- Downloads de conteúdo
- Ferramentas diversas
- Processamento de IA
- Consultas e pesquisas
- Stalkers (redes sociais)
- Manipulação de canvas
- Geração de logotipos

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Ambiente de execução
- **Express.js** - Framework web
- **Helmet** - Segurança HTTP
- **CORS** - Compartilhamento de recursos
- **Rate Limit** - Controle de requisições
- **Compression** - Compressão de respostas
- **toobusy-js** - Controle de sobrecarga do servidor

## 📦 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- [Git](https://git-scm.com/) (opcional, para clonar o repositório)

## 🔧 Instalação

1. Clone o repositório (ou baixe os arquivos):
```bash
git clone https://github.com/devcrician/APIsNodz.git
cd APIsNodz
```

2. Instale as dependências:
```bash
npm install
```

## ⚙️ Configuração

### Configurações Essenciais no Server.js

#### 1. Porta do Servidor
```javascript
const PORT = 20026;  // Altere para a porta desejada
```

#### 2. Domínios Permitidos (CORS)
```javascript
const allowedOrigins = [
  'http://localhost:20026',                    // Altere a porta
  'https://seudominio.com.br',                 // Seu domínio HTTPS
  'http://seudominio.com.br',                  // Seu domínio HTTP
];

// Altere o regex para seu domínio
if (origin && origin.match(/^https?:\\/\\/.*seudominio\\./)) {
  return callback(null, true);
}
```

#### 3. Limites de Requisição (Opcional)
```javascript
// Ajuste conforme necessidade
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 500,                   // Máximo de requisições
});

const downloadsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutos
  max: 30,                    // Máximo de downloads
});

const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutos
  max: 20,                    // Máximo de requisições IA
});
```

## 🚀 Executando o Projeto

### Modo Desenvolvimento
```bash
npm start
```

### Modo Produção
```bash
NODE_ENV=production npm start
```

O servidor iniciará na porta configurada. Acesse:
- **Site principal:** http://localhost:20026\
- **Health check:** http://localhost:20026/health\

## 🔒 Segurança

O projeto implementa várias camadas de segurança:

- ✅ **Helmet.js** - Headers HTTP seguros
- ✅ **CORS configurado** - Controle de origens
- ✅ **Rate Limiting** - Limite de requisições
- ✅ **XSS Protection** - Sanitização contra XSS
- ✅ **Mongo Sanitize** - Prevenção de injection
- ✅ **Validação de User-Agent** - Bloqueio de bots maliciosos
- ✅ **Compressão** - Otimização de tráfego
- ✅ **Overload protection** - Proteção contra sobrecarga

## 🔍 Solução de Problemas

### Erro: Porta já em uso
**Solução:** Altere a const PORT no Server.js para outra porta (ex: 3000, 8080).

### Erro de CORS
**Solução:** Verifique se seu domínio está na lista allowedOrigins e no regex.

### Servidor lento
**Solução:** Ajuste os parâmetros de toobusy no início do arquivo:
```javascript
toobusy.maxLag(200);  // Aumente para 500 se necessário
```

## 📝 Dicas Adicionais

### Monitoramento
O servidor já possui logs para:
- Requisições lentas (> 1 segundo)
- Headers suspeitos
- Muitos parâmetros na requisição
- Tentativas de acesso de origens não permitidas

### Performance
- Compressão ativada para respostas > 100KB
- Cache configurado para arquivos estáticos
- Timeouts ajustados para evitar conexões pendentes

## 📄 Licença

Este projeto é de uso livre para estudos e desenvolvimento. Ao utilizar, dê os devidos créditos.

## 👨‍💻 Autor

Desenvolvido por **Crician**
Instagram **crician.dev**

## 🎯 Resumo Rápido - O que configurar:

| Item | Onde | O que fazer |
|------|------|-------------|
| Porta | const PORT | Mudar número |
| Domínio | allowedOrigins | Colocar seu domínio |
| Regex | /.*apisnodz\\./ | Trocar apisnodz pelo seu domínio |

**Pronto! Com essas configurações seu servidor estará rodando perfeitamente.** 🚀


### Comandos Rápidos:
```bash
npm install    # Instalar dependências
npm start      # Iniciar servidor
```

### Hospedagem NodzHostinger
![NodzHostinger](https://raw.githubusercontent.com/nazuninha/uploads/main/fotos/1775508507742_ssk6k6.jpg)
***Hospedagem barata é de confiança, temos serviços para sites, projetos e bots prontos!***

- 🏷️ Cupom: NODZ-26
- 🎁 Desconto: 20% OFF na compra de NodzCoins ✨
- 🌱 Acesse: https://nodzhostinger.com.br

### Pré-visualização:
- 🌐 Site: https://apisnodz.com.br