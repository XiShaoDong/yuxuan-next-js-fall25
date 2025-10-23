import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "../ReduxExamples/HelloRedux/helloReducer";
import counterReducer from"../ReduxExamples/CounterRedux/counterReducer";
import addReducer from "../ReduxExamples/AddRedux/addReducer"
import todoReducer from "../ReduxExamples/todos/todoReducer"
const store = configureStore({
    reducer: { 
        helloReducer,
        counterReducer,
        addReducer,
        todoReducer,
    }
});
export default store;