// src/utils/mail.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to: string, name: string | undefined, link: string) => {
  if (!to) throw new Error('No email specified');

  const displayName = name || 'Usuario';
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"App" <no-reply@example.com>',
    to,
    subject: 'Verifica tu email',
    html: `
      <p>Hola ${displayName},</p>
      <p>Por favor verifica tu correo haciendo click en el siguiente enlace:</p>
      <p><a href="${link}">Verificar email</a></p>
      <p>Si no solicitaste esto, ignora el mensaje.</p>
    `
  };

  // nodemailer lanza si hay error — captúralo en el controller
  return transporter.sendMail(mailOptions);
};
