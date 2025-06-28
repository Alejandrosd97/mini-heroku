import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth/jwt.service';
import { JwtPayload } from '../types/types';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token, process.env.JWT_SECRET!);

  if (!payload) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }

  // @ts-ignore (si quieres tipar el Request más adelante, se puede)
  req.user = payload as JwtPayload;

  next();
}

