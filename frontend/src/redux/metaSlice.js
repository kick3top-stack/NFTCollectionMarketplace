import { createSlice } from "@reduxjs/toolkit";

// Initial state: empty array of meta
const initialState = {
  metaFiles: [], // Array of metadata objects
};

export const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    setMetaFiles: (state, action) => {
      state.metaFiles = action.payload;
    },
    addMetaFile: (state, action) => {
      state.metaFiles.push(action.payload);
    },
    updateMetaFile: (state, action) => {
      const index = state.metaFiles.findIndex(
        (m) => m.tokenId === action.payload.tokenId
      );
      if (index !== -1) state.metaFiles[index] = action.payload;
    },
  },
});

export const { setMetaFiles, addMetaFile, updateMetaFile } = metaSlice.actions;

export default metaSlice.reducer;
