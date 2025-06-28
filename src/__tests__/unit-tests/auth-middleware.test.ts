import { describe, it, expect, vi } from 'vitest';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { verifyToken } from '../../services/auth/jwt.service';
import { Request, Response, NextFunction } from 'express';

vi.mock('../../services/auth/jwt.service', () => ({
  verifyToken: vi.fn()
}));

const mockReq = (token?: string) => ({
  headers: {
    authorization: token ? `Bearer ${token}` : undefined
  }
}) as unknown as Request;

const mockRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const next = vi.fn() as NextFunction;

describe('auth.middleware', () => {
  it('should return 401 if no token', () => {
    const req = mockReq();
    const res = mockRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
  });

  it('should return 401 if token is invalid', () => {
    const req = mockReq('invalidtoken');
    const res = mockRes();
    (verifyToken as ReturnType<typeof vi.fn>).mockReturnValue(null);

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
  });

  it('should call next if token is valid', () => {
    const req = mockReq('validtoken');
    const res = mockRes();
    (verifyToken as ReturnType<typeof vi.fn>).mockReturnValue({ userId: '123' });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
