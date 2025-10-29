import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import poemReducer from './slices/poemSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poems: poemReducer,
    categories: categoryReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;