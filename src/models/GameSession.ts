import mongoose, { Document, Schema } from 'mongoose';
import type { Question } from '../types';

// Interfaz para TypeScript
export interface GameSession extends Document {
  userId: string;
  questions: Question[];
  correct: number;
  incorrect: number;
  unanswered: number;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema para cada pregunta
const QuestionSchema = new Schema<Question>(
  {
    id: { type: Number, required: true },
    question: { type: String, required: true },
    answers: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    userSelectedAnswer: { type: Number },
    isCorrectUserAnswer: { type: Boolean },
    code: { type: String },
  },
  { _id: false } // Evita que Mongoose agregue un _id a cada pregunta
);

// Schema principal de la sesión
const GameSessionSchema = new Schema<GameSession>(
  {
    userId: { type: String, required: true },
    questions: { type: [QuestionSchema], default: [] },
    correct: { type: Number, required: true },
    incorrect: { type: Number, required: true },
    unanswered: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

// Export default para usarlo en controllers
export default mongoose.model<GameSession>('GameSession', GameSessionSchema);
