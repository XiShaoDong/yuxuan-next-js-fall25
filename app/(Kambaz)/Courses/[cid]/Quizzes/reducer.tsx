import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { Question, Quiz } from "../../../types";

interface QuizzesState {
    quizzes: Quiz[];
    currentQuiz: Quiz | null;
}

type QuizInput = Partial<Pick<Quiz, "_id">> & Omit<Quiz, "_id" | "questions"> & Partial<Pick<Quiz, "questions">>;

const initialState: QuizzesState = {
    quizzes: [],
    currentQuiz: null,
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        // Set all quizzes
        setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
            state.quizzes = action.payload;
        },

        // Add a new quiz
        addQuiz: (state, { payload: quiz }: PayloadAction<QuizInput>) => {
            const nextQuiz: Quiz = {
                _id: quiz._id ?? uuidv4(),
                questions: [],
                ...quiz,
            };
            state.quizzes = [...state.quizzes, nextQuiz];
        },

        // Update a quiz
        updateQuiz: (state, { payload: quiz }: PayloadAction<Quiz>) => {
            state.quizzes = state.quizzes.map((current) =>
                current._id === quiz._id ? quiz : current
            );
        },

        // Delete a quiz
        deleteQuiz: (state, { payload: quizId }: PayloadAction<string>) => {
            state.quizzes = state.quizzes.filter(
                (quiz) => quiz._id !== quizId
            );
        },

        // Toggle publish status
        togglePublish: (state, { payload: quizId }: PayloadAction<string>) => {
            state.quizzes = state.quizzes.map((quiz) =>
                quiz._id === quizId ? { ...quiz, published: !quiz.published } : quiz
            );
        },

        // Set current quiz (for editing)
        setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
            state.currentQuiz = action.payload;
        },

        // Add question to current quiz
        addQuestion: (state, { payload: question }: PayloadAction<Question>) => {
            if (state.currentQuiz) {
                state.currentQuiz.questions.push(question);
            }
        },

        // Update question in current quiz
        updateQuestionInQuiz: (state, { payload: { questionId, question } }: PayloadAction<{ questionId: string; question: Question }>) => {
            if (state.currentQuiz) {
                state.currentQuiz.questions = state.currentQuiz.questions.map((current) =>
                    current._id === questionId ? question : current
                );
            }
        },

        // Delete question from current quiz
        deleteQuestionFromQuiz: (state, { payload: questionId }: PayloadAction<string>) => {
            if (state.currentQuiz) {
                state.currentQuiz.questions = state.currentQuiz.questions.filter(
                    (question) => question._id !== questionId
                );
            }
        },
    },
});

export const {
    setQuizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    togglePublish,
    setCurrentQuiz,
    addQuestion,
    updateQuestionInQuiz,
    deleteQuestionFromQuiz,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
