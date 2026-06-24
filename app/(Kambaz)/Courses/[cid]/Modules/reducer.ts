import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { Module } from "../../../types";

interface ModulesState {
    modules: Module[];
}

type ModuleInput = Pick<Module, "name" | "course">;

const initialState: ModulesState = {
    modules: [],
};
const modulesSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        addModule: (state, { payload: module }: PayloadAction<ModuleInput>) => {
            const newModule: Module = {
                _id: uuidv4(),
                lessons: [],
                name: module.name,
                course: module.course,
            };
            state.modules = [...state.modules, newModule];
        },
        deleteModule: (state, { payload: moduleId }: PayloadAction<string>) => {
            state.modules = state.modules.filter((module) => module._id !== moduleId);
        },
        updateModule: (state, { payload: module }: PayloadAction<Module>) => {
            state.modules = state.modules.map((current) =>
                current._id === module._id ? module : current
            );
        },
        editModule: (state, { payload: moduleId }: PayloadAction<string>) => {
            state.modules = state.modules.map((module) =>
                module._id === moduleId ? { ...module, editing: true } : module
            );
        },

        setModules: (state, action: PayloadAction<Module[]>) => {
            state.modules = action.payload;
        },

    },
});
export const { addModule, deleteModule, updateModule, editModule, setModules } =
    modulesSlice.actions;
export default modulesSlice.reducer;
