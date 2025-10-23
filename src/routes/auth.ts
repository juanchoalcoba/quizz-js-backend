// src/routes/authRoutes.ts
import express from 'express';
import { registerUser, verifyEmail, loginUser, resendVerification } from '../controllers/authController';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// GET /api/auth/verify-email?token=...&id=...
router.get('/verify-email', verifyEmail);

// POST /api/auth/resend-verification
router.post('/resend-verification', resendVerification);

// POST /api/auth/login
router.post('/login', loginUser);

export default router;
