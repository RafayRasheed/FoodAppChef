import { createSlice } from "@reduxjs/toolkit";

const categoryReducer = createSlice({
    name: "mainCategories",
    initialState: {
        mainCategories: [],
    },
    reducers: {

        setMainCategories(state, action) {
            state.mainCategories = [...action.payload]
        },

    },
});

export const { setMainCategories } = categoryReducer.actions;
export default categoryReducer.reducer;
