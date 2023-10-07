import { configureStore } from "@reduxjs/toolkit";
import myReducer from "./my-slice";

const store = configureStore({
  reducer: {
    my: myReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
