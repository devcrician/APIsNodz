const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const app = express();

app.set('trust proxy', 1);

const PORT = 20026;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgBlack: '\x1b[40m'
};

function colorStatus(status) {
  if (status >= 200 && status < 300) return `${colors.green}${status}${colors.reset}`;
  if (status >= 300 && status < 400) return `${colors.cyan}${status}${colors.reset}`;
  if (status >= 400 && status < 500) return `${colors.yellow}${status}${colors.reset}`;
  return `${colors.red}${status}${colors.reset}`;
}

function getMethodColor(method) {
  switch (method) {
    case 'GET': return `${colors.green}${method}${colors.reset}`;
    case 'POST': return `${colors.yellow}${method}${colors.reset}`;
    case 'PUT': return `${colors.blue}${method}${colors.reset}`;
    case 'DELETE': return `${colors.red}${method}${colors.reset}`;
    default: return `${colors.magenta}${method}${colors.reset}`;
  }
}

function getRouteColor(route) {
  if (route.startsWith('/api/downloads')) return `${colors.magenta}${route}${colors.reset}`;
  if (route.startsWith('/api/ias')) return `${colors.cyan}${route}${colors.reset}`;
  if (route.startsWith('/api/pesquisas')) return `${colors.green}${route}${colors.reset}`;
  if (route.startsWith('/api/stalkers')) return `${colors.yellow}${route}${colors.reset}`;
  if (route.startsWith('/api/canvas')) return `${colors.blue}${route}${colors.reset}`;
  if (route.startsWith('/api/tools')) return `${colors.red}${route}${colors.reset}`;
  return `${colors.white}${route}${colors.reset}`;
}

const logRequest = (req, res, duration) => {
  const method = getMethodColor(req.method);
  const route = getRouteColor(req.url);
  const status = colorStatus(res.statusCode);
  const time = `${colors.cyan}${duration}ms${colors.reset}`;
  const ip = `${colors.magenta}${req.ip || req.socket.remoteAddress}${colors.reset}`;
  
  console.log(`${colors.bgBlack} HTTP ${colors.reset} ${method} ${route} ${status} ${time} ${colors.dim}${ip}${colors.reset}`);
};

const logInfo = (message, ...args) => {
  console.log(`${colors.bgBlue} INFO ${colors.reset} ${colors.white}${message}${colors.reset}`, ...args);
};

const logWarn = (message, ...args) => {
  console.log(`${colors.bgYellow} WARN ${colors.reset} ${colors.yellow}${message}${colors.reset}`, ...args);
};

const logError = (message, ...args) => {
  console.log(`${colors.bgRed} ERROR ${colors.reset} ${colors.red}${message}${colors.reset}`, ...args);
};

const logDebug = (message, ...args) => {
  console.log(`${colors.bgMagenta} DEBUG ${colors.reset} ${colors.cyan}${message}${colors.reset}`, ...args);
};

const logSuccess = (message, ...args) => {
  console.log(`${colors.bgGreen} SUCCESS ${colors.reset} ${colors.green}${message}${colors.reset}`, ...args);
};

app.use((req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - start;
    logRequest(req, res, duration);
    originalSend.call(this, data);
  };
  
  next();
});

logSuccess(`Servidor inicializando...`);
logInfo(`Modo: ${process.env.NODE_ENV === 'production' ? `${colors.green}PRODUÇÃO${colors.reset}` : `${colors.yellow}DESENVOLVIMENTO${colors.reset}`}`);

// CORS - TOTALMENTE ABERTO (sem bloqueios)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));

app.options('*', cors());

// Helmet - APENAS com configurações básicas (sem bloquear connectSrc)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
}));

app.disable('x-powered-by');

app.use(compression({
  level: 1,
  threshold: 1024
}));

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2000,
  message: {
    error: 'Muitas requisições',
    message: 'Muitas requisições deste IP, por favor tente novamente após 1 minuto',
    retryAfter: '1m'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logWarn(`Rate limit excedido - IP: ${req.ip}`);
    res.status(429).json({
      error: 'Limite de taxa excedido',
      message: 'Muitas requisições, tente novamente mais tarde',
      retryAfter: '1 minuto'
    });
  }
});

app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// REMOVIDO: verificação de User-Agent (estava bloqueando)
// REMOVIDO: verificação de maliciousAgents
// REMOVIDO: verificação de content-length excessivo

// CORS manual adicional
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;
    res.send = function(data) {
      const duration = Date.now() - start;
      if (duration > 5000) {
        logWarn(`Requisição lenta: ${req.method} ${req.url} - ${duration}ms`);
      }
      originalSend.call(this, data);
    };
    next();
  });
}

app.use(express.static(path.join(__dirname, 'Public'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    
    if (process.env.NODE_ENV !== 'production') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return;
    }
    
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (ext === '.js') {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    } else if (ext === '.css') {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', 'text/css');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  },
  dotfiles: 'ignore',
  etag: true,
  lastModified: false,
  redirect: true,
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

logDebug(`Carregando roteadores...`);

const downloadsRouter = require('./Routers/Downloads');
const PesquisasRouter = require('./Routers/Pesquisas');
const toolsRouter = require('./Routers/Tools');
const iasRouter = require('./Routers/Ias');
const stkRouter = require('./Routers/Stalkers');
const cstRouter = require('./Routers/Consultas');
const cnvRouter = require('./Routers/Canvas');
const lgsRouter = require('./Routers/Logotipos');

app.use('/api/downloads', downloadsRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/ias', iasRouter);
app.use('/api/consultas', cstRouter);
app.use('/api/pesquisas', PesquisasRouter);
app.use('/api/stalkers', stkRouter);
app.use('/api/canvas', cnvRouter);
app.use('/api/logotipos', lgsRouter);

logSuccess(`Roteadores carregados:`);
console.log(`  ${colors.green}✓${colors.reset} /api/downloads`);
console.log(`  ${colors.green}✓${colors.reset} /api/tools`);
console.log(`  ${colors.green}✓${colors.reset} /api/ias`);
console.log(`  ${colors.green}✓${colors.reset} /api/consultas`);
console.log(`  ${colors.green}✓${colors.reset} /api/pesquisas`);
console.log(`  ${colors.green}✓${colors.reset} /api/stalkers`);
console.log(`  ${colors.green}✓${colors.reset} /api/canvas`);
console.log(`  ${colors.green}✓${colors.reset} /api/logotipos`);

app.get('/health', (req, res) => {
  logDebug(`Health check realizado - IP: ${req.ip}`);
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========== AUTO-DESCOBERTA DE ROTAS ==========
function getRoutesFromRouter(router, basePath = '') {
  const routes = [];
  
  if (!router || !router.stack) return routes;
  
  router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      routes.push({
        path: basePath + layer.route.path,
        method: methods,
        name: generateRouteName(layer.route.path)
      });
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      const subPath = basePath + (layer.regexp.source.replace(/\\\/?/g, '/').replace(/\^|\?/g, ''));
      routes.push(...getRoutesFromRouter(layer.handle, subPath));
    }
  });
  
  return routes;
}

function generateRouteName(path) {
  const name = path.split('/').pop().replace(/[:_\-]/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function extractParams(path) {
  const params = path.match(/:[a-zA-Z]+/g) || [];
  return params.map(p => p.substring(1));
}

app.get('/api/routes', (req, res) => {
  logDebug(`API /api/routes chamada - IP: ${req.ip}`);
  
  const allRoutes = [];
  
  const routers = [
    { router: downloadsRouter, category: 'downloads', name: 'Downloads', icon: 'fas fa-download', color: '#20B2AA' },
    { router: toolsRouter, category: 'tools', name: 'Tools', icon: 'fas fa-tools', color: '#00FF7F' },
    { router: iasRouter, category: 'ias', name: 'IAs', icon: 'fas fa-robot', color: '#ADFF2F' },
    { router: stkRouter, category: 'stalkers', name: 'Stalkers', icon: 'fas fa-eye', color: '#6c2bd9' },
    { router: cstRouter, category: 'consultas', name: 'Consultas', icon: 'fas fa-mask', color: '#fbbf24' },
    { router: PesquisasRouter, category: 'pesquisas', name: 'Pesquisas', icon: 'fas fa-search', color: '#f87171' },
    { router: cnvRouter, category: 'canvas', name: 'Canvas', icon: 'fas fa-paint-brush', color: '#E755C3' },
    { router: lgsRouter, category: 'logotipos', name: 'Logotipos', icon: 'fas fa-certificate', color: '#808080' }
  ];
  
  routers.forEach(({ router, category, name, icon, color }) => {
    const routes = getRoutesFromRouter(router, `/api/${category}`);
    
    allRoutes.push({
      id: category,
      name: name,
      icon: icon,
      color: color,
      description: `APIs de ${name.toLowerCase()}`,
      routes: routes.map(route => ({
        id: route.path.replace(/\//g, '_').replace(/:/g, ''),
        name: route.name,
        method: route.method,
        path: route.path,
        params: extractParams(route.path)
      }))
    });
  });
  
  res.header('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.json(allRoutes);
});

const mainPageLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  message: {
    error: 'Muitas requisições para a página principal',
    message: 'Por favor, aguarde alguns minutos',
    retryAfter: '5m'
  }
});

app.get('/', mainPageLimiter, (req, res) => {
  logInfo(`Página principal acessada - IP: ${req.ip}`);
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

app.get('*', (req, res) => {
  const staticExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.json', '.txt'];
  const ext = path.extname(req.url).toLowerCase();
  
  if (!staticExtensions.includes(ext) && !req.url.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
  }
});

app.use((req, res) => {
  logWarn(`Rota não encontrada: ${req.method} ${req.url} - IP: ${req.ip}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe'
  });
});

app.use((err, req, res, next) => {
  logError(`Erro não tratado: ${err.message} - ${req.method} ${req.url}`);
  console.error(`${colors.red}${err.stack}${colors.reset}`);
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    error: isProduction ? 'Erro interno do servidor' : err.message,
    message: 'Ocorreu um erro inesperado',
    ...(!isProduction && { stack: err.stack })
  });
});

let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log(`${colors.bgBlack}═══════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bgMagenta} ${colors.bright}🚀 APISNODZ SERVER ${colors.reset}`);
    console.log(`${colors.bgBlack}═══════════════════════════════════════════════════${colors.reset}`);
    console.log('');
    console.log(`${colors.bgCyan} INFO ${colors.reset} ${colors.white}Servidor rodando na porta${colors.reset} ${colors.green}${PORT}${colors.reset}`);
    console.log(`${colors.bgCyan} INFO ${colors.reset} ${colors.white}Página principal:${colors.reset} ${colors.blue}http://localhost:${PORT}${colors.reset}`);
    console.log(`${colors.bgCyan} INFO ${colors.reset} ${colors.white}Health check:${colors.reset} ${colors.blue}http://localhost:${PORT}/health${colors.reset}`);
    console.log(`${colors.bgCyan} INFO ${colors.reset} ${colors.white}API Routes:${colors.reset} ${colors.blue}http://localhost:${PORT}/api/routes${colors.reset}`);
    console.log('');
    console.log(`${colors.bgYellow} STATUS ${colors.reset} ${colors.green}Online${colors.reset} - ${new Date().toLocaleString('pt-BR')}`);
    console.log('');
    console.log(`${colors.dim}─────────────────────────────────────────────────────────${colors.reset}`);
  });
  
  if (server) {
    server.keepAliveTimeout = 30000;
    server.headersTimeout = 35000;
    server.maxHeadersCount = 100;
    server.timeout = 60000;
  }
}

process.on('SIGTERM', () => {
  logWarn('SIGTERM recebido. Encerrando servidor...');
  if (server) {
    server.close(() => {
      logSuccess('Servidor encerrado');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  logWarn('SIGINT recebido. Encerrando servidor...');
  if (server) {
    server.close(() => {
      logSuccess('Servidor encerrado');
      process.exit(0);
    });
  }
});