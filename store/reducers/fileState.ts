import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileIn } from "./fileTypes";

interface FileState {
  files: FileIn[]; // Array of files
  loading: boolean; // Whether files are being loaded or not
  error: string | null; // Error message (if any)
}

const initialState: FileState = {
  files: [], // Initial empty file array
  loading: false, // No files are loading initially
  error: null, // No errors initially
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<FileState["files"][0]>) => {
      state.files.push(action.payload);
    },
  },
});

export const { setFiles, addFile } = filesSlice.actions;
export default filesSlice.reducer;
