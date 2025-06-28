import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import * as jwtService from '../../services/auth/jwt.service';

const JWT_SECRET = 'testsecret';

describe('jwt.service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should sign a token correctly', () => {
    const payload = { userId: '123' };
    const token = jwtService.generateToken(payload, JWT_SECRET, '1h');

    expect(typeof token).toBe('string');
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded).toHaveProperty('userId', '123');
  });

  it('should verify a valid token and return payload', () => {
    const payload = { userId: 'abc' };
    const token = jwt.sign(payload, JWT_SECRET);
    const result = jwtService.verifyToken(token, JWT_SECRET);

    expect(result).toBeTruthy();
    expect(result?.userId).toBe('abc');
  });

  it('should return null for invalid token', () => {
    const result = jwtService.verifyToken('invalid.token', JWT_SECRET);
    expect(result).toBeNull();
  });
});
