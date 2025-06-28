import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../types/types';

export function generateToken(payload: object, secret: string, expiresIn = '7d'): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}


