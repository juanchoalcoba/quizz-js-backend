// src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/mail';

const TOKEN_EXPIRATION_MIN = 60; // 1 hora
const FRONTEND_URL = 'http://localhost:5173'; // React frontend
const JWT_SECRET = 'secret'; // Cambia por tu secreto real

// -------------------------
// Registro de usuario
// -------------------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Reenvío de token si no está verificado
        const verifyToken = crypto.randomBytes(32).toString('hex');
        existingUser.verifyToken = verifyToken;
        existingUser.verifyTokenExpires = new Date(Date.now() + TOKEN_EXPIRATION_MIN * 60 * 1000);
        await existingUser.save();

        const link = `${FRONTEND_URL}/verify?token=${verifyToken}&id=${existingUser._id.toString()}`;

        try {
          await sendVerificationEmail(existingUser.email, existingUser.name, link);
          return res.status(400).json({
            message: 'Usuario ya existe pero no verificado. Se reenvió el correo de verificación.'
          });
        } catch (mailErr) {
          console.error('MAIL ERROR al reenviar token a usuario existente:', mailErr);
          return res.status(400).json({
            message: 'Usuario ya existe pero no verificado. No se pudo enviar el email de verificación.'
          });
        }
      } else {
        return res.status(400).json({ message: 'Usuario ya registrado' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpires = new Date(Date.now() + TOKEN_EXPIRATION_MIN * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyToken,
      verifyTokenExpires,
    });

    const link = `${FRONTEND_URL}/verify?token=${verifyToken}&id=${user._id.toString()}`;

    try {
      await sendVerificationEmail(email, name, link);
      return res.status(201).json({
        message: 'Usuario creado. Revisa tu email para verificar.',
        userId: user._id.toString(),
      });
    } catch (mailErr) {
      console.error('MAIL ERROR al crear usuario:', mailErr);
      return res.status(201).json({
        message: 'Usuario creado, pero no se pudo enviar el email de verificación. Puedes reenviarlo.',
        userId: user._id.toString(),
        emailSendFailed: true
      });
    }

  } catch (err) {
    console.error('Error en registerUser:', err);
    return res.status(500).json({ message: 'Error registrando usuario' });
  }
};

// -------------------------
// Verificación de email
// -------------------------
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    let { token, id } = req.query;
    if (!token || !id) return res.status(400).json({ message: 'Faltan parámetros' });

    const tokenStr = Array.isArray(token) ? token[0] : token;
    const idStr = Array.isArray(id) ? id[0] : id;

    const user = await User.findById(idStr).exec();
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    if (user.isVerified) return res.status(200).json({ message: 'Usuario ya verificado' });

    if (!user.verifyToken || user.verifyToken !== tokenStr)
      return res.status(400).json({ message: 'Token inválido' });

    if (!user.verifyTokenExpires || user.verifyTokenExpires < new Date())
      return res.status(400).json({ message: 'Token expirado' });

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Usuario verificado correctamente ✅' });

  } catch (err) {
    console.error('Error en verifyEmail:', err);
    return res.status(500).json({ message: 'Error verificando usuario' });
  }
};

// -------------------------
// Reenvío de verificación
// POST /api/auth/resend-verification
// Body: { id } OR { email }
// -------------------------
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { id, email } = req.body;
    if (!id && !email) return res.status(400).json({ message: 'Falta id o email' });

    const user = id ? await User.findById(id).exec() : await User.findOne({ email }).exec();
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    if (user.isVerified) return res.status(200).json({ message: 'Usuario ya verificado' });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.verifyToken = verifyToken;
    user.verifyTokenExpires = new Date(Date.now() + TOKEN_EXPIRATION_MIN * 60 * 1000);
    await user.save();

    const link = `${FRONTEND_URL}/verify?token=${verifyToken}&id=${user._id.toString()}`;

    try {
      await sendVerificationEmail(user.email, user.name, link);
      return res.status(200).json({ message: 'Email de verificación reenviado' });
    } catch (mailErr) {
      console.error('Error reenviando email:', mailErr);
      return res.status(500).json({ message: 'No se pudo enviar el email de verificación' });
    }

  } catch (err) {
    console.error('Error en resendVerification:', err);
    return res.status(500).json({ message: 'Error reenviando verificación' });
  }
};

// -------------------------
// Login de usuario
// -------------------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    if (!user.isVerified) return res.status(400).json({ message: 'Usuario no verificado' });

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (err) {
    console.error('Error en loginUser:', err);
    return res.status(500).json({ message: 'Error en login' });
  }
};
