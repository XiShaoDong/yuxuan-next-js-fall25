import { createSlice } from "@reduxjs/toolkit";
import { quizzes } from "../../../Database";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    quizzes: quizzes,
    // @Todo Maybe not neccessary, just prevent auto fetch from database
    // quizs: [],

};

const quizSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        // @Todo Maybe not neccessary, just prevent auto fetch from database
        setQuizzes: (state, { payload }) => {
            state.quizzes = payload;
        },

        addQuiz: (state, { payload: quiz }) => {
            const newquiz: any = {
                _id: uuidv4(),
                title: quiz.title,
                course: quiz.course,
                description: quiz.description ? quiz.description : "Welcome to quiz!",
                startDate: quiz.dueDate ? quiz.dueDate : "2025-09-11T12:00",
                dueDate: quiz.startDate ? quiz.startDate : "2025-10-11T12:00",
                points: 200
            };
            state.quizzes = [...state.quizzes, newquiz] as any;
            // console.log("@Add quiz reducer", state.quizs, newquiz );

        },

        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter((a: any) => (
                a._id !== quizId
            ))
            // console.log("@quiz reducer", state.quizs, quizId  );
        },
        
        updateQuiz: (state, { payload: quiz }) => {
            state.quizzes = state.quizzes.map((a: any) =>
                // if right id update; not return original a
                a._id === quiz._id ? quiz : a
            ) as any;
            console.log("@Update quiz reducer", quiz, state.quizzes);

        },
    },


});

export const { setQuizzes, addQuiz, deleteQuiz, updateQuiz } = quizSlice.actions;
export default quizSlice.reducer;



