import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';

export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Não autorizado. Autenticação necessária.',
    });
    return;
  }

  // Permite se o papel for 'admin' ou se o e-mail for o e-mail administrativo configurado
  const isAdmin = req.user.role === 'admin' || req.user.email === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
    res.status(403).json({
      success: false,
      error: 'Acesso negado. Apenas administradores podem realizar esta ação.',
    });
    return;
  }

  next();
}
