/////src/redux/store.js//////

import { configureStore } from "@reduxjs/toolkit";
import metaReducer from "./metaSlice";

export const store = configureStore({
  reducer: {
    meta: metaReducer,
  },
});
