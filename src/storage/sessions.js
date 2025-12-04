import {generateToken} from '../utils/auth.js'
import { SESSION_DURATION } from '../config/constants.js'

 class SessionStore {
    constructor() {
        this.sessions = new Map()
        this.startCleanupInterval();
    }
    
    // cria uma sessão para o usuário
    create(userId){
        const token = generateToken()
        const expiresAt = Date.now() + SESSION_DURATION

        this.sessions.set(token, {
            userId,
            expiresAt,
            createdAt: Date.now()
        })

        return token;
    }

    // Valida se o token é valido
    validate(token) {
        const session = this.sessions.get(token)

        if (!session) return null

        if (Date.now() > session.expiresAt){
            this.sessions.delete(token)
            return null
        }

        return session.userId
    }

    destroy(token) {
        return this.sessions.delete(token)
    }

    cleanExpired(){
        const now = Date.now();
        let cleaned = 0;

        for (const [token, session] of this.sessions.entries()) {
            if (now > session.expiresAt) {
                this.sessions.delete(token);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`${cleaned} sessões expiradas removidas`)
        }
    }

    startCleanupInterval(){
        setInterval(() => this.cleanExpired(), 60 * 60 * 1000)
    }

    getActiveSessionsCount(){
        return this.sessions.size
    }
}

export const sessionStore = new SessionStore()


// **Fluxo de uma Sessão:**

// 1. REGISTRO/LOGIN
   
// 2. Gera token único: "a1b2c3..."
   
// 3. Armazena: token → { userId: 1, expiresAt: ... }
   
// 4. Retorna token para o cliente
   
// 5. Cliente guarda token (localStorage, cookie, etc)
   
// 6. REQUISIÇÕES FUTURAS
//    Cliente envia: Authorization: Bearer a1b2c3...
   
// 7. Valida token e identifica usuário
