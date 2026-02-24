const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

const app = express();

// Logger
app.use(morgan('combined'));

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
}));

// Limit payload size
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

// Global error handler
app.use((err, req, res, next) => {

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 400,
      mensagem: "Invalid JSON syntax"
    });
  }

  const status = err.statusCode || 500;

  res.status(status).json({
    status,
    mensagem: err.message || "Internal server error"
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    mensagem: "Not found"
  });
});

module.exports = app;