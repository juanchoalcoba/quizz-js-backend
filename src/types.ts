export interface Question {
  id: number;                  // ID de la pregunta
  question: string;            // Texto de la pregunta
  answers: string[];           // Opciones de respuesta
  correctAnswer: number;       // Índice de la respuesta correcta
  userSelectedAnswer?: number; // Índice que seleccionó el usuario
  isCorrectUserAnswer?: boolean; // true si acertó
  code?: string;               // Para preguntas con código, opcional
}
