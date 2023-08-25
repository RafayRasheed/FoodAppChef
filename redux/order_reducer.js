import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const orderReducer = createSlice({
    name: "data",
    initialState: {
        pending: [],
        progress: [],
        history: [],

    },
    reducers: {

        setPendingOrderse(state, action) {
            state.pending = action.payload
        },

        setProgressOrderse(state, action) {
            state.progress = action.payload
        },
        setHistoryOrderse(state, action) {
            state.history = action.payload
        },

    },
});

export const { setPendingOrderse, setProgressOrderse, setHistoryOrderse } = orderReducer.actions;
export default orderReducer.reducer;
