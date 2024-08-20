import { configureStore } from '@reduxjs/toolkit';
import { fileReducer, PasswordReducer } from './ReducersAction'; //the reducers

const store = configureStore({
  reducer: {
    files: fileReducer,
    password: PasswordReducer,
  },
});

export default store;