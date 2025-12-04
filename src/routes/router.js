import  url  from 'url'
import { authController} from '../controllers/authController.js'
import { authenticate} from '../middleware/auth.js'
import { parseBody, getTokenFromHeader, sendJSON } from '../utils/http.js'

export async function handleRoute(req,res) {

    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname;
    const method = req.method;

    try {
            // ===== ROTA: REGISTRO =====
        if (path === '/register' && method === 'POST') {
        const body = await parseBody(req);
        const result = await authController.register(req, res, body);
        return sendJSON(res, result.status, result.data);
        }

        // ===== ROTA: LOGIN =====
        if (path === '/login' && method === 'POST') {
        const body = await parseBody(req);
        const result = await authController.login(req, res, body);
        return sendJSON(res, result.status, result.data);
        }

        // ===== ROTA: LOGOUT =====
        if (path === '/logout' && method === 'POST') {
        const token = getTokenFromHeader(req);
        const result = await authController.logout(req, res, token);
        return sendJSON(res, result.status, result.data);
        }

        // ===== ROTA: PERFIL (PROTEGIDA) =====
        if (path === '/me' && method === 'GET') {
        // Usa middleware para proteger a rota
        return authenticate(req, res, async () => {
            const result = await authController.getProfile(req, res);
            sendJSON(res, result.status, result.data);
        });
        }

        // ===== ROTA NÃO ENCONTRADA =====
        sendJSON(res, 404, { error: 'Rota não encontrada' });
    } catch (error){
          console.error('❌ Erro no roteamento:', error);
          sendJSON(res, 500, { error: 'Erro interno do servidor' });
    }

}