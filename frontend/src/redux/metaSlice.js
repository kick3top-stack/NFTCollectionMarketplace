// src/redux/metaSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metaFiles: [], // This will store all metadata files
};

const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    setMetaFiles: (state, action) => {
      // Clear existing state and add the new meta files
      state.metaFiles = action.payload;
    },
  },
});

export const { setMetaFiles } = metaSlice.actions;
export default metaSlice.reducer;
