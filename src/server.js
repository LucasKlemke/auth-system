import http from 'http';
import { handleRoute } from './routes/router.js';
import { setCORSHeaders } from './utils/http.js';
import { PORT } from './config/constants.js';

/**
 * Cria o servidor HTTP
 * Cada requisição passa por essa função
 */
const server = http.createServer(async (req, res) => {
  

  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Roteia a requisição
  await handleRoute(req, res);
});

// Inicia o servidor
server.listen(PORT, () => {
  console.log('🚀 Servidor rodando!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('');
  console.log('Rotas disponíveis:');
  console.log('  POST /api/register  → Registrar usuário');
  console.log('  POST /api/login     → Fazer login');
  console.log('  POST /api/logout    → Fazer logout');
  console.log('  GET  /api/me        → Obter perfil (protegida)');
});