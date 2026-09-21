import { Request, Response, NextFunction } from 'express';

// Padrões comuns de injeção de scripts (XSS / Script Execution)
const SCRIPT_INJECTION_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<script\b[^>]*>/gi,
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /<iframe\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
];

function sanitizeString(value: string): string {
  let cleaned = value;
  for (const pattern of SCRIPT_INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned;
}

function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }
  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      // Prevenção contra prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitized[key] = sanitizeObject(val);
    }
    return sanitized;
  }
  return obj;
}

function containsMaliciousScript(obj: any): boolean {
  if (typeof obj === 'string') {
    return SCRIPT_INJECTION_PATTERNS.some((pattern) => pattern.test(obj));
  }
  if (Array.isArray(obj)) {
    return obj.some((item) => containsMaliciousScript(item));
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.values(obj).some((val) => containsMaliciousScript(val));
  }
  return false;
}

/**
 * Middleware para auditoria e prevenção contra injeção de scripts maliciosos (XSS, scripts executáveis e prototype pollution).
 */
export function preventScriptInjection(req: Request, res: Response, next: NextFunction): void {
  // Ignora rotas de autenticação do Better Auth onde senhas podem ter caracteres especiais legítimos
  if (req.path.startsWith('/api/auth')) {
    next();
    return;
  }

  // Verifica se há script malicioso no corpo da requisição
  if (req.body && containsMaliciousScript(req.body)) {
    console.warn(`[Segurança] Tentativa de injeção de script bloqueada do IP: ${req.ip} na rota: ${req.originalUrl}`);
    res.status(400).json({
      success: false,
      error: 'Conteúdo rejeitado por motivos de segurança: tags de script e executáveis não são permitidos.',
    });
    return;
  }

  // Sanitiza dados de entrada
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
}
