import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    assignments: assignments,
    // @Todo Maybe not neccessary, just prevent auto fetch from database
    // assignments: [],

};

const assignmentSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        // @Todo Maybe not neccessary, just prevent auto fetch from database
        setAssignments: (state, { payload }) => {
            state.assignments = payload;
          },
        addAssignment: (state, { payload: assignment }) => {
            const newAssignment: any = {
                _id: uuidv4(),
                title: assignment.title,
                course: assignment.courseId,
                description: assignment.description? assignment.description:"Welcome to assignment!",
                startDate: assignment.dueDate? assignment.dueDate:"2025-09-11T12:00",
                dueDate: assignment.startDate? assignment.startDate:"2025-10-11T12:00",
                points: 200
            };
            state.assignments = [...state.assignments, newAssignment] as any;
            // console.log("@Add assignment reducer", state.assignments, newAssignment );

        },

        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter((a: any) => (
                a._id !== assignmentId
            ))
            // console.log("@assignment reducer", state.assignments, assignmentId  );
        },
        updateAssignment: (state, { payload: assignment }) => {
            state.assignments = state.assignments.map((a: any) =>
                // if right id update; not return original a
                a._id === assignment._id ? assignment : a
            ) as any;
            console.log("@Update assignment reducer", assignment,  state.assignments );

        },
    },


});

export const {setAssignments, addAssignment, deleteAssignment, updateAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;



