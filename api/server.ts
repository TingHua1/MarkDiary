/**
 * server entry file, for production and development
 */
import app, { config } from './app.js';
import fs from 'fs';
import https from 'https';
import http from 'http';

/**
 * start server with port
 */
const PORT = config.PORT;
const TLS_ENABLED = process.env.TLS_ENABLED === 'true';
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

let server;

// 检查是否配置了证书路径
const hasCertConfig = SSL_KEY_PATH && SSL_CERT_PATH;
const certsExist = hasCertConfig && fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH);

if (TLS_ENABLED) {
  // 强制HTTPS模式
  if (certsExist) {
    const options = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    };
    
    server = https.createServer(options, app);
    server.listen(PORT, config.HOST, () => {
      console.log(`HTTPS Server ready on ${config.HOST}:${PORT}`);
      console.log(`Access via: https://${config.HOST === '0.0.0.0' ? 'localhost' : config.HOST}:${PORT}`);
    });
  } else {
    console.error('TLS_ENABLED is true but SSL certificates not found!');
    console.error('Please configure SSL_KEY_PATH and SSL_CERT_PATH with valid certificate files.');
    process.exit(1);
  }
} else if (certsExist) {
  // 配置了证书，使用HTTPS
  const options = {
    key: fs.readFileSync(SSL_KEY_PATH),
    cert: fs.readFileSync(SSL_CERT_PATH)
  };
  
  server = https.createServer(options, app);
  server.listen(PORT, config.HOST, () => {
    console.log(`HTTPS Server ready on ${config.HOST}:${PORT}`);
    console.log(`Access via: https://${config.HOST === '0.0.0.0' ? 'localhost' : config.HOST}:${PORT}`);
  });
} else {
  // 未配置证书，使用HTTP
  server = http.createServer(app);
  server.listen(PORT, config.HOST, () => {
    console.log(`HTTP Server ready on ${config.HOST}:${PORT}`);
    console.log(`Access via: http://${config.HOST === '0.0.0.0' ? 'localhost' : config.HOST}:${PORT}`);
  });
}

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;