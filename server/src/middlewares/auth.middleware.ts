import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../auth/better-auth.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
  session?: any;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      res.status(401).json({
        success: false,
        error: 'Não autorizado. Sessão inválida ou expirada.',
      });
      return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Erro ao validar sessão:', error);
    res.status(401).json({
      success: false,
      error: 'Falha na autenticação da sessão.',
    });
  }
}
