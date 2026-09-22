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

function sanitizeValue(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    return sanitizeString(val);
  }
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeValue(item));
  }
  if (typeof val === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      // Prevenção contra prototype pollution
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
        continue;
      }
      sanitizedObj[k] = sanitizeValue(v);
    }
    return sanitizedObj;
  }
  return val;
}

function mutateAndSanitize(target: any): void {
  if (!target || typeof target !== 'object') return;

  for (const key of Object.keys(target)) {
    // Prevenção contra prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete target[key];
      continue;
    }
    target[key] = sanitizeValue(target[key]);
  }
}

function containsMaliciousScript(obj: any): boolean {
  if (typeof obj === 'string') {
    // Reseta o lastIndex dos regexes globais antes do teste
    return SCRIPT_INJECTION_PATTERNS.some((pattern) => {
      pattern.lastIndex = 0;
      return pattern.test(obj);
    });
  }
  if (Array.isArray(obj)) {
    return obj.some((item) => containsMaliciousScript(item));
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).some(([k, val]) => {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') return true;
      return containsMaliciousScript(val);
    });
  }
  return false;
}

/**
 * Middleware para auditoria e prevenção contra injeção de scripts maliciosos (XSS, scripts executáveis e prototype pollution).
 */
export function preventScriptInjection(req: Request, res: Response, next: NextFunction): void {
  // Ignora rotas de autenticação do Better Auth onde senhas podem conter caracteres especiais legítimos
  const url = req.originalUrl || req.url || '';
  if (url.startsWith('/api/auth')) {
    next();
    return;
  }

  // Verifica se há script malicioso no corpo, query params ou route params
  const hasMaliciousPayload =
    (req.body && containsMaliciousScript(req.body)) ||
    (req.query && containsMaliciousScript(req.query)) ||
    (req.params && containsMaliciousScript(req.params));

  if (hasMaliciousPayload) {
    console.warn(`[Segurança] Tentativa de injeção bloqueada do IP: ${req.ip} na rota: ${req.originalUrl}`);
    res.status(400).json({
      success: false,
      error: 'Conteúdo rejeitado por motivos de segurança: tags de script e executáveis não são permitidos.',
    });
    return;
  }

  // Sanitiza dados de entrada mutando as propriedades internas
  // (Evita o erro de "Cannot set property query which has only a getter")
  if (req.body && typeof req.body === 'object') {
    mutateAndSanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    mutateAndSanitize(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    mutateAndSanitize(req.params);
  }

  next();
}