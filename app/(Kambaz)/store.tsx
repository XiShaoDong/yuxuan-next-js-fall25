import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer"
import assignmentReducer from "./Courses/[cid]/Assignments/reducer"
const store = configureStore({
    reducer: { 
        coursesReducer,
        modulesReducer,
        accountReducer,
        assignmentReducer,
     },
});
export default store;