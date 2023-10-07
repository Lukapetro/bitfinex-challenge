import { createSlice } from "@reduxjs/toolkit";

export const mySlice = createSlice({
  name: "mySlice",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = mySlice.actions;
export default mySlice.reducer;
