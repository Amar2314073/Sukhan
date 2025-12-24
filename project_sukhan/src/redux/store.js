import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import poemReducer from './slices/poemSlice';
import categoryReducer from './slices/categorySlice';
import poetReducer from './slices/poetSlice';
import collectionReducer from './slices/collectionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poems: poemReducer,
    categories: categoryReducer,
    poets: poetReducer,
    collections: collectionReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;