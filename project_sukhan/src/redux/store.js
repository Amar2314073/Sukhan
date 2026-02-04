import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import poemReducer from './slices/poemSlice';
import categoryReducer from './slices/categorySlice';
import poetReducer from './slices/poetSlice';
import collectionReducer from './slices/collectionSlice';
import uiReducer from './slices/uiSlice';
import homeReducer from './slices/homeSlice';
import statReducer from './slices/statSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poems: poemReducer,
    categories: categoryReducer,
    poets: poetReducer,
    collections: collectionReducer,
    ui: uiReducer,
    home: homeReducer,
    stats: statReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;