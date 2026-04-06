const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const expressMongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const nocache = require('nocache');
const toobusy = require('toobusy-js');

const app = express();

app.set('trust proxy', 1);

const PORT = 20026;

toobusy.maxLag(200);
toobusy.interval(500);

app.use((req, res, next) => {
  if (toobusy()) {
    res.status(503).json({
      error: 'Servidor muito ocupado',
      message: 'Por favor, tente novamente mais tarde',
      retryAfter: '30s'
    });
  } else {
    next();
  }
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      mediaSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin" }
}));

app.disable('x-powered-by');

app.use(nocache());

app.use(compression({
  level: 6,
  threshold: 100 * 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    error: 'Muitas requisições',
    message: 'Muitas requisições deste IP, por favor tente novamente após 15 minutos',
    retryAfter: '15m'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return req.ip + (req.headers['user-agent'] || '');
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Limite de taxa excedido',
      message: 'Muitas requisições deste dispositivo, por favor tente novamente mais tarde',
      retryAfter: '15 minutos'
    });
  }
});

app.use(globalLimiter);

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
  maxDelayMs: 5000,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => req.ip
});

app.use(speedLimiter);

const downloadsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: {
    error: 'Limite de downloads excedido',
    message: 'Muitas requisições de download deste IP',
    retryAfter: '10m'
  },
  skipFailedRequests: true
});

const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    error: 'Limite de processamento IA excedido',
    message: 'Muitas requisições de IA deste IP',
    retryAfter: '10m'
  }
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(expressMongoSanitize());

app.use(xss());

app.use(hpp({
  whitelist: ['url', 'type', 'quality', 'size', 'text', 'query']
}));

app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  
  if (!userAgent || userAgent.length < 5 || userAgent.length > 500) {
    return res.status(400).json({
      error: 'User-Agent inválido',
      message: 'Requisição bloqueada por segurança'
    });
  }

  const maliciousAgents = [
    'sqlmap', 'nikto', 'nmap', 'metasploit', 'havij',
    'acunetix', 'appscan', 'nessus', 'w3af', 'zap'
  ];

  const lowerUserAgent = userAgent.toLowerCase();
  for (const agent of maliciousAgents) {
    if (lowerUserAgent.includes(agent)) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'User-Agent bloqueado por segurança'
      });
    }
  }

  next();
});

app.use((req, res, next) => {
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 10000) {
    return res.status(413).json({
      error: 'Payload muito grande',
      message: 'O conteúdo da requisição excede o limite permitido'
    });
  }

  const suspiciousHeaders = [
    'x-forwarded-for', 'x-real-ip', 'via', 'proxy-connection',
    'x-requested-with', 'x-originating-ip'
  ];

  for (const header of suspiciousHeaders) {
    if (req.headers[header]) {
      console.warn(`Header suspeito detectado: ${header}`, {
        ip: req.ip,
        url: req.url,
        userAgent: req.headers['user-agent']
      });
    }
  }

  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://ndz-01.nodzhostinger.com.br:20026',
      'http://localhost:20026',
      'https://apisnodz.com.br',
      'http://apisnodz.com.br',
      'https://cdnjs.cloudflare.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net',
      null,
      undefined
    ];
    
    if (origin && origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }
    
    if (origin && origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
      return callback(null, true);
    }
   
    if (origin && origin.match(/^https?:\/\/.*apisnodz\./)) {
      return callback(null, true);
    }
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('Tentativa de acesso de origem não permitida:', origin);
      
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      console.warn('Requisição lenta detectada:', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        duration: `${duration}ms`,
        userAgent: req.headers['user-agent']
      });
    }
    
    const paramCount = Object.keys(req.query).length + Object.keys(req.body).length;
    if (paramCount > 10) {
      console.warn('Muitos parâmetros na requisição:', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        paramCount: paramCount
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
});

app.use(express.static(path.join(__dirname, 'Public'), {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (ext === '.js') {
      res.setHeader('Cache-Control', 'Public, max-age=86400');
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    } else if (ext === '.css') {
      res.setHeader('Cache-Control', 'Public, max-age=86400');
      res.setHeader('Content-Type', 'text/css');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) {
      res.setHeader('Cache-Control', 'Public, max-age=604800');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    } else {
      res.setHeader('Cache-Control', 'Public, max-age=3600');
    }
    
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  },
  dotfiles: 'ignore',
  etag: true,
  lastModified: true,
  redirect: true,
  maxAge: '1d'
}));

app.use((req, res, next) => {
  const staticExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.json', '.txt'];
  const ext = path.extname(req.url).toLowerCase();
  
  if (staticExtensions.includes(ext)) {
    console.log(`[Static] ${req.method} ${req.url} - ${req.headers['user-agent']?.substring(0, 50)}...`);
  }
  next();
});

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

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const mainPageLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: {
    error: 'Muitas requisições para a página principal',
    message: 'Por favor, aguarde alguns minutos',
    retryAfter: '5m'
  }
});

app.get('/', mainPageLimiter, (req, res) => {
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
  res.status(404).json({
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe'
  });
});

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    error: isProduction ? 'Erro interno do servidor' : err.message,
    message: 'Ocorreu um erro inesperado',
    ...(!isProduction && { stack: err.stack })
  });
});

let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📄 Página principal: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    
    if (server) {
      server.keepAliveTimeout = 5000;
      server.headersTimeout = 10000;
      server.maxHeadersCount = 50;
      server.timeout = 30000;
    }
  });
}

process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  if (server) {
    server.close(() => {
      console.log('Servidor encerrado');
      toobusy.shutdown();
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  if (server) {
    server.close(() => {
      console.log('Servidor encerrado');
      toobusy.shutdown();
      process.exit(0);
    });
  }
});