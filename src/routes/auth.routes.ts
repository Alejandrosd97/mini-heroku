import { Router } from 'express';
import { generateToken } from '../services/auth/jwt.service';

const router = Router();

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superpassword';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ username });
  res.json({ token });
});

export { router as authRouter };
