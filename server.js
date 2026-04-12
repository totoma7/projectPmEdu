const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// 보안 헤더
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "cdnjs.cloudflare.com"],
      connectSrc: ["'self'"]
    }
  }
}));

// 응답 압축
app.use(compression());

// 요청 로깅
app.use(morgan('combined'));

// 정적 파일 (캐시 1시간)
app.use(express.static(path.join(__dirname), {
  maxAge: '1h',
  etag: true
}));

// SPA 폴백 — HTML 파일 직접 요청이 아닌 경우만
app.get('*path', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).send('서버 오류가 발생했습니다.');
});

const server = app.listen(PORT, () => {
  console.log(`AI 실무 활용 가이드 서버 실행 중: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 수신, 서버 종료 중...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT 수신, 서버 종료 중...');
  server.close(() => process.exit(0));
});
