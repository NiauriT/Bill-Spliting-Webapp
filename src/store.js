import { configureStore } from "@reduxjs/toolkit";
import billReducer from "./billSlice";

export const store = configureStore({
  reducer: {
    bill: billReducer,
  },
});
