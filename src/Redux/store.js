import { configureStore } from '@reduxjs/toolkit';
import { FileCategoryReducer, fileReducer, PasswordReducer } from './ReducersAction'; //the reducers

const store = configureStore({
  reducer: {
    files: fileReducer,
    password: PasswordReducer,
    categories: FileCategoryReducer,
  },
});

export default store;