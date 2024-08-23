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
      if(!state.find(i => i.id == file.id)){
        state.unshift(file);
      }
      // Assuming you want to save the file to the database when it's added
      // Implement your save logic here
    },
    deleteFile: (state, action) => {
      const { id } = action.payload;
      return state.filter(i => i.id !== id);
      // Assuming you want to save the file to the database when it's added
      // Implement your save logic here
    },
    clearFiles: (state, action) => {
      db.clearData()
      return action.payload
    }
  },
});
export const { setFiles, addFile, deleteFile, clearFiles } = filesSlice.actions;
export const fileReducer = filesSlice.reducer;



const storageSlice = createSlice({
  name: 'storage',
  initialState: {
    maxStorage: {
      value: 1024,
      percent: 100 // Total storage is always 100%
    },
    usedStorage: {
      value: 0,
      percent: 0
    },
    remainingStorage: {
      value: 1024,
      percent: 100
    },
    categorized: null
  },
  reducers: {
    setStorage: (state, action) => {
      const newUsedStorage = action.payload;

      // Update usedStorage
      state.usedStorage.value = newUsedStorage;
      state.usedStorage.percent = Math.round((newUsedStorage / state.maxStorage.value) * 100);

      // Update remainingStorage
      const newRemainingStorage = state.maxStorage.value - newUsedStorage;
      state.remainingStorage.value = newRemainingStorage;
      state.remainingStorage.percent = Math.round((newRemainingStorage / state.maxStorage.value) * 100);
    },
    loadCategories: (state, action) => {
      state.categorized = action.payload;
    },
    clearStorage: (state, action) => {
      state = {
        maxStorage: {
          value: 1024,
          percent: 100 // Total storage is always 100%
        },
        usedStorage: {
          value: 0,
          percent: 0
        },
        remainingStorage: {
          value: 1024,
          percent: 100
        },
        categorized: null
      }
    },
    
  },
});

export const { setStorage, loadCategories, clearStorage } = storageSlice.actions;
export const storageReducer = storageSlice.reducer;

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
    
    const indexes = filesWithUrls.length - 1
    
    let val = 0
    const loading = setInterval(()=>{
      if(val < filesWithUrls.length){
        dispatch(addFile({file:filesWithUrls[val], password}));        
        val++
      }
      
    }, 100)
    if(val >= filesWithUrls.length){
      clearInterval(loading)
    }
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
    
    const indexes = filesWithUrls.length - 1
    
    let val = 0
    const loading = setInterval(async ()=>{
      if(val < filesWithUrls.length){        
        await dispatch(addFile({file:filesWithUrls[val], password}));        
        val++
      }
      
    }, 10)
    if(val >= filesWithUrls.length){
      clearInterval(loading)
    }

    
  } catch (error) {
    console.error('Error loading files:', error);
    // Handle error (e.g., show notification to the user)
  }
};




export const loadTypes = async (files, dispatch) => {
  files.map(file => {
    dispatch(addType(file.fileType.split('.')[1]));
  })
}


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


const fileCategorySlice = createSlice({
  name: 'fileCategory',
  initialState: {
    currentCategory: 'all',
    allTypes: ['all']
  },
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    addType: (state, action) => {
      if(state.allTypes.includes(action.payload)){
        return state
      }else{
        state.allTypes.push(action.payload);
      }
    }
  },
});

export const { setCategory, addType } = fileCategorySlice.actions;
export const FileCategoryReducer = fileCategorySlice.reducer;
