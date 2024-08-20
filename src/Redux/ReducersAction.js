// src/redux/filesSlice.js
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { db, uploadFilesSave } from '../Functions/DB';

const filesSlice = createSlice({
  name: 'files',
  initialState: [],
  reducers: {
    setFiles: (state, action) => {
      return action.payload;
    },
    addFile: (state, action) => {
      const { file, password } = action.payload;
      state.push(file);
      // Assuming you want to save the file to the database when it's added
      // Implement your save logic here
    },
  },
});

export const { setFiles, addFile } = filesSlice.actions;
export const fileReducer = filesSlice.reducer;

// Thunk to upload files and save them to the DB
export const uploadFiles = (files, password) => async (dispatch) => {
  try {
    // Upload files and get their IDs
    const ids = await uploadFilesSave(files, password);
    // Fetch the file blobs from the database
    const fileUrls = await Promise.all(ids.map(id => db.getFileBlob(id, password)));
    
    // Create file objects with URLs
    const filesWithUrls = fileUrls.map((blob, index) => ({
      ...files[index],
      id: ids[index],
      url: URL.createObjectURL(blob),
    }));
    
    // Update the Redux store
    dispatch(setFiles(filesWithUrls));
  } catch (error) {
    console.error('Error uploading files:', error);
    // Handle error (e.g., show notification to the user)
  }
};

// Thunk to load files from DB
export const loadFiles = (password) => async (dispatch) => {
  try {
    // Fetch files from the database
    const dbFiles = await db.getAllFiles(password);
    // Fetch the file blobs
    const fileBlobs = await Promise.all(dbFiles.map(file => db.getFileBlob(file.id, password)));
    
    // Create file objects with URLs
    const filesWithUrls = dbFiles.map((file, index) => ({
      ...file,
      url: URL.createObjectURL(fileBlobs[index]),
    }));
    
    // Update the Redux store
    dispatch(setFiles(filesWithUrls));
  } catch (error) {
    console.error('Error loading files:', error);
    // Handle error (e.g., show notification to the user)
  }
};


// src/redux/passwordSlice.js

const passwordSlice = createSlice({
  name: 'password',
  initialState: {
    password: false,
  },
  reducers: {
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const { setPassword } = passwordSlice.actions;
export const PasswordReducer = passwordSlice.reducer;
