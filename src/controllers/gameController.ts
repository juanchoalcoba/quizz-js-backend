import { Request, Response } from 'express';
import {default as GameSession} from '../models/GameSession';

export const saveGameSession = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { questions, correct, incorrect, unanswered } = req.body;
    const totalQuestions = questions.length;
    const session = await GameSession.create({
      userId: req.user.id,
      questions,
      correct,
      incorrect,
      unanswered,
      totalQuestions,
    });
    res.status(201).json({ message: 'Partida guardada', session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error guardando partida' });
  }
};

export const getLastSession = async (req: Request & { user?: any }, res: Response) => {
  try {
    const session = await GameSession.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (!session) return res.status(404).json({ message: 'No hay partidas' });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo partida' });
  }
};
