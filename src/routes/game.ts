import express from 'express';
import { saveGameSession, getLastSession, getUserSessions } from '../controllers/gameController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/game-session
// Guarda la partida actual de un usuario
router.post('/', authMiddleware, saveGameSession);

// GET /api/game-session/last
// Trae la última partida guardada de un usuario
router.get('/last', authMiddleware, getLastSession);

router.get('/sessions', authMiddleware, getUserSessions);




export default router;
