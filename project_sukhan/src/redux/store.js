import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import poemReducer from './slices/poemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poems: poemReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;