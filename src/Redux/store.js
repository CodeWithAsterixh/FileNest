import { configureStore } from '@reduxjs/toolkit';
import { fileReducer, PasswordReducer, FileCategoryReducer, storageReducer } from './ReducersAction';



const store = configureStore({
  reducer: {
    files: fileReducer,
    password: PasswordReducer,
    categories: FileCategoryReducer,
    storage: storageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable state invariant middleware
    }),
  devTools: {
    maxAge: 50, // Keep the last 50 actions
    actionsDenylist: ['LARGE_ACTION'], // Exclude specific actions if any are large
    stateSanitizer: (state) => state.files ? { ...state, files: '<<EXCLUDED>>' } : state, // Example to exclude large parts of state
    trace: false, // Disable tracing if not needed to reduce overhead
  }, // Disable DevTools in productio
});






export default store;


