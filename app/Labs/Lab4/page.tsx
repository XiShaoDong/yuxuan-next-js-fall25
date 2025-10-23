"use client"
import React from 'react'
import ClickEvent from './ClickEvent'
import PassingDataOnEvent from './PassingDataOnEvent'
import PassingFunctions from './PassingFunctions'
import EventObject from './EventObject'
import Counter from './Counter'
import BooleanStateVariables from './BooleanStateVariables'
import StringStateVariables from './StringStateVariables'
import DateStateVariable from './DateStateVariable'
import ObjectStateVariable from './ObjectStateVariable'
import ArrayStateVariable from './ArrayStateVariable'

import ReduxExamples from "./ReduxExamples/page";
import store from './store'
import { Provider } from 'react-redux'
import HelloRedux from './ReduxExamples/HelloRedux'
import CounterRedux from './ReduxExamples/CounterRedux'
import AddRedux from './ReduxExamples/AddRedux'
import TodoList from './ReduxExamples/todos/TodoList'
function page() {
    function sayHello() {
        alert("Hello")
    }

    return (
        <Provider store={store}>
            <div>
                <h1>Lab 4</h1>
                <ClickEvent />

                <PassingDataOnEvent />

                <PassingFunctions theFunction={sayHello} />

                <EventObject />

                <Counter />

                <BooleanStateVariables />

                <StringStateVariables />

                <DateStateVariable />

                <ObjectStateVariable />

                <ArrayStateVariable />

                <ReduxExamples />
                
                <HelloRedux/>

                <CounterRedux/>

                <AddRedux/>

                <TodoList/>
            </div>
        </Provider>
    )
}

export default page