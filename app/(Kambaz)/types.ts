export type UserRole = "STUDENT" | "FACULTY" | "ADMIN" | "USER";

export interface User {
  _id: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  dob?: string | Date;
  loginId?: string;
  section?: string;
  lastActivity?: string | Date;
  totalActivity?: string;
}

export interface Lesson {
  _id: string;
  name: string;
  description?: string;
}

export interface Module {
  _id: string;
  name: string;
  course: string;
  lessons: Lesson[];
  editing?: boolean;
}

export interface Course {
  _id: string;
  name: string;
  number: string;
  credits: number;
  description: string;
  modules?: Module[];
}

export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  startDate: string;
  dueDate: string;
  points: number | string;
}

export interface Choice {
  _id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Blank {
  id: string;
  possibleAnswers: string[];
  caseSensitive?: boolean;
}

export type QuestionType = "multipleChoice" | "trueFalse" | "fillInBlank";

export interface Question {
  _id: string;
  type: QuestionType;
  title: string;
  points: number;
  question: string;
  choices?: Choice[];
  correctAnswer?: boolean;
  blanks?: Blank[];
  possibleAnswers?: string[];
  caseSensitive?: boolean;
}

export interface Quiz {
  _id: string;
  course: string;
  title: string;
  description?: string;
  quizType?: "GradedQuiz" | "PracticeQuiz" | "GradedSurvey" | "UngradedSurvey";
  points?: number;
  assignmentGroup?: "Quizzes" | "Exams" | "Assignments" | "Project";
  shuffleAnswers?: boolean;
  timeLimit?: number;
  multipleAttempts?: boolean;
  howManyAttempts?: number;
  showCorrectAnswers?: string;
  accessCode?: string;
  oneQuestionAtTime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  dueDate?: string | Date;
  availableDate?: string | Date;
  untilDate?: string | Date;
  published?: boolean;
  questions: Question[];
}

export interface QuizAttemptAnswer {
  question: string;
  answer: string | boolean | Record<string, string> | null;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface QuizAttempt {
  _id: string;
  quiz: string;
  student: string;
  course: string;
  attemptNumber: number;
  answers: QuizAttemptAnswer[];
  score: number;
  submittedAt?: string | Date;
  timeSpent?: number;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface QuizAttemptPayload {
  studentId: string;
  answers: Array<{
    question: string;
    answer: QuizAttemptAnswer["answer"];
  }>;
  timeSpent: number;
}
