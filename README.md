## 👽 Total  de Visitantes 
![Visitas](https://count.getloli.com/@nodz?name=nodz&theme=gelbooru-h&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto)

# APIsNodz 
![Banner](https://raw.githubusercontent.com/nazuninha/uploads/main/fotos/1775506114252_it1zmq.jpg)

> API completa e gratuita desenvolvida por Crician. Use como base para seus projetos!

## 📖 Funcionalidades

- 📥 Downloads de conteúdo
- 🔧 Ferramentas diversas  
- 🤖 APIs de IA
- 🔍 Pesquisas e consultas
- 👁️ Stalkers (redes sociais)
- 🖌️ Manipulação Canvas
- 🎨 Geração de logotipos

## 🛠️ Stack Atual

```
Node.js + Express.js
├── helmet (segurança básica)
├── cors (origin: '*')
├── rate-limit (2000 req/min)
├── compression (gzip)
├── express.static (cache otimizado)
└── Auto-descoberta de rotas (/api/routes)
```

## 🚀 Instalação Rápida

```bash
git clone https://github.com/devcrician/APIsNodz.git
cd APIsNodz
npm install
npm start
```

**Servidor roda em: `http://localhost:20026`**

## ⚙️ Configurações (Server.js)

### 1. **Porta**
```js
const PORT = 20026;  // Mude aqui
```

### 2. **Rate Limit Global** (já incluso)
```js
windowMs: 60 * 1000,  // 1 minuto
max: 2000             // 2000 requisições
```

### 3. **CORS** (já aberto para todos)
```js
app.use(cors({ origin: '*' }));  // Sem restrições
```

## 🌐 Endpoints Disponíveis

Acesse `http://localhost:20026/api/routes` para ver todas as rotas automaticamente!

**Exemplos:**
```
✅ /api/downloads/*
✅ /api/tools/*
✅ /api/ias/*
✅ /api/pesquisas/*
✅ /api/stalkers/*
✅ /api/consultas/*
✅ /api/canvas/*
✅ /api/logotipos/*
```

## 🔒 Segurança Implementada

- ✅ **Helmet** (headers básicos)
- ✅ **Rate Limiting** (2000 req/min global)
- ✅ **CORS aberto** (origin: '*')
- ✅ **Compressão GZIP**
- ✅ **Cache estático** (JS/CSS: 24h, imagens: 24h)
- ✅ **Logs coloridos** (performance + requests)
- ✅ **Error handling** global
- ✅ **Timeouts** otimizados

## 🧪 Testes Rápidos

```bash
# Health check
curl http://localhost:20026/health

# Lista de rotas
curl http://localhost:20026/api/routes

# Site principal
curl http://localhost:20026
```

## 🔍 Solução de Problemas

| Problema | Solução |
|----------|---------|
| **Porta ocupada** | `const PORT = 3000;` no Server.js |
| **Rate limit** | Aguarde 1min ou aumente `max: 2000` |
| **CORS error** | Já está `*` (sem restrições) |
| **npm install falha** | `rm -rf node_modules && npm install` |

## 🎯 Resumo - 3 passos

```bash
npm install    # 1️⃣ Dependências
npm start      # 2️⃣ Rodar (porta 20026)
# 3️⃣ Acessar: http://localhost:20026
```

## 📄 Licença
Uso livre com créditos ao autor.

## 👨‍💻 Autor
**Crician** - [Instagram](https://instagram.com/crician.dev)

---

### Hospedagem NodzHostinger
![NodzHostinger](https://raw.githubusercontent.com/nazuninha/uploads/main/fotos/1775508507742_ssk6k6.jpg)

**Cupom: `NODZ-26`** | **20% OFF** | [nodzhostinger.com.br](https://nodzhostinger.com.br)