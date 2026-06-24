import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { assignments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";
import type { Assignment } from "../../../types";

interface AssignmentsState {
    assignments: Assignment[];
}

type AssignmentInput = Partial<Omit<Assignment, "_id">> & Pick<Assignment, "title" | "course">;

const initialState: AssignmentsState = {
    assignments: assignments,
    // @Todo Maybe not neccessary, just prevent auto fetch from database
    // assignments: [],

};

const assignmentSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        // @Todo Maybe not neccessary, just prevent auto fetch from database
        setAssignments: (state, { payload }: PayloadAction<Assignment[]>) => {
            state.assignments = payload;
          },
        addAssignment: (state, { payload: assignment }: PayloadAction<AssignmentInput>) => {
            const newAssignment: Assignment = {
                _id: uuidv4(),
                title: assignment.title,
                course: assignment.course,
                description: assignment.description ?? "Welcome to assignment!",
                startDate: assignment.startDate ?? "2025-09-11T12:00",
                dueDate: assignment.dueDate ?? "2025-10-11T12:00",
                points: assignment.points ?? 200,
            };
            state.assignments = [...state.assignments, newAssignment];

        },

        deleteAssignment: (state, { payload: assignmentId }: PayloadAction<string>) => {
            state.assignments = state.assignments.filter((assignment) => (
                assignment._id !== assignmentId
            ));
        },
        updateAssignment: (state, { payload: assignment }: PayloadAction<Assignment>) => {
            state.assignments = state.assignments.map((current) =>
                current._id === assignment._id ? assignment : current
            );

        },
    },


});

export const {setAssignments, addAssignment, deleteAssignment, updateAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;



