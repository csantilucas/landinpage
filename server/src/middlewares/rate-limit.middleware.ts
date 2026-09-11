import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter específico para proteção contra ataques de força bruta na rota de login.
 * Limita a 5 tentativas de login a cada 15 minutos por endereço IP.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 5, // Limite máximo de 5 tentativas por IP
  standardHeaders: true, // Retorna cabeçalhos padronizados RateLimit-* (RFC)
  legacyHeaders: false, // Desativa cabeçalhos antigos X-RateLimit-*
  statusCode: 429,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'Muitas tentativas de login a partir deste IP. Por segurança, aguarde 15 minutos antes de tentar novamente.',
    });
  },
});
