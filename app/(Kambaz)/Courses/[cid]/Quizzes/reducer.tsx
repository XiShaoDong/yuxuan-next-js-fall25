import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    quizzes: [],
    currentQuiz: null,
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        // Set all quizzes
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },

        // Add a new quiz
        addQuiz: (state, { payload: quiz }) => {
            state.quizzes = [...state.quizzes, quiz] as any;
        },

        // Update a quiz
        updateQuiz: (state, { payload: quiz }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quiz._id ? quiz : q
            ) as any;
        },

        // Delete a quiz
        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter(
                (q: any) => q._id !== quizId
            ) as any;
        },

        // Toggle publish status
        togglePublish: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quizId ? { ...q, published: !q.published } : q
            ) as any;
        },

        // Set current quiz (for editing)
        setCurrentQuiz: (state, action) => {
            state.currentQuiz = action.payload;
        },

        // Add question to current quiz
        addQuestion: (state, { payload: question }) => {
            if (state.currentQuiz) {
                (state.currentQuiz as any).questions.push(question);
            }
        },

        // Update question in current quiz
        updateQuestionInQuiz: (state, { payload: { questionId, question } }) => {
            if (state.currentQuiz) {
                (state.currentQuiz as any).questions = (state.currentQuiz as any).questions.map(
                    (q: any) => q._id === questionId ? question : q
                );
            }
        },

        // Delete question from current quiz
        deleteQuestionFromQuiz: (state, { payload: questionId }) => {
            if (state.currentQuiz) {
                (state.currentQuiz as any).questions = (state.currentQuiz as any).questions.filter(
                    (q: any) => q._id !== questionId
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