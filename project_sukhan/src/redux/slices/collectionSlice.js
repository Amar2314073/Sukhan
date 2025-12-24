import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';

/* ================= FETCH COLLECTIONS ================= */
export const fetchCollections = createAsyncThunk(
  'collections/fetchAll',
  async (
    { page = 1, limit = 12, category = null, featured = false },
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit };

      if (category) params.category = category;
      if (featured) params.featured = true;

      const res = await axiosClient.get('/collections', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch collections'
      );
    }
  }
);

const collectionSlice = createSlice({
  name: 'collections',
  initialState: {
    collections: [],
    loading: false,
    error: null,

    currentPage: 1,
    totalPages: 1,
    totalCollections: 0,

    filters: {
      category: null,
      featured: false
    }
  },

  reducers: {
    clearCollections: (state) => {
      state.collections = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.collections = [];
      state.currentPage = 1;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;

        const newCollections = action.payload.collections || [];
        const page = action.payload.pagination?.currentPage || 1;

        if (page === 1) {
          state.collections = newCollections;
        } else {
          state.collections = [...state.collections, ...newCollections];
        }

        state.currentPage = page;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.totalCollections =
          action.payload.pagination?.totalCollections || 0;
      })

      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCollections, setFilters } = collectionSlice.actions;
export default collectionSlice.reducer;
