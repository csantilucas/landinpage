import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter específico para proteção contra ataques de força bruta no login.
 * Limita a 5 tentativas de login a cada 15 minutos por endereço IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite de 5 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente mais tarde.',
    error: 'Muitas tentativas de login. Tente novamente mais tarde.',
  },
});

// Mantido para compatibilidade com importações existentes
export const loginRateLimiter = authLimiter;

/**
 * Rate Limiter global para proteger a API contra DoS e abuso de requisições.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // 300 requisições por janela por IP
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    error: 'Muitas requisições enviadas por este IP. Tente novamente mais tarde.',
  },
});
