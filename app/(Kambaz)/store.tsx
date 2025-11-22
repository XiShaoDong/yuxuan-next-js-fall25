import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer"
import assignmentReducer from "./Courses/[cid]/Assignments/reducer"
import quizReducer from "./Courses/[cid]/Quizzes/reducer"
const store = configureStore({
    reducer: { 
        coursesReducer,
        modulesReducer,
        accountReducer,
        assignmentReducer,
        quizReducer,
     },
});
export default store;