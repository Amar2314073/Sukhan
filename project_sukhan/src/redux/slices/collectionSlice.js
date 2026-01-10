import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';

/* ========================= THUNKS ========================= */

// 1️⃣ Fetch all collections (pagination + filters)
export const fetchCollections = createAsyncThunk(
  'collections/fetchAll',
  async ({ page = 1, limit = 12, category, featured }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (category) params.category = category;
      if (featured) params.featured = true;

      const res = await axiosClient.get('/collections', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch collections');
    }
  }
);

// 2️⃣ Featured collections
export const fetchFeaturedCollections = createAsyncThunk(
  'collections/fetchFeatured',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/collections/featured', { params: { limit } });
      return res.data.collections;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured collections');
    }
  }
);

// 3️⃣ Trending collections
export const fetchTrendingCollections = createAsyncThunk(
  'collections/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/collections/trending');
      return res.data.collections;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch trending collections');
    }
  }
);

// 4️⃣ Collections by category
export const fetchCollectionsByCategory = createAsyncThunk(
  'collections/fetchByCategory',
  async ({ categoryId, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/collections/category/${categoryId}`, {
        params: { page, limit }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch category collections');
    }
  }
);

// 5️⃣ Single collection detail
export const fetchCollectionById = createAsyncThunk(
  'collections/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/collections/${id}`);
      return res.data.collection;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch collection');
    }
  }
);

// 6️⃣ Search collections
export const searchCollections = createAsyncThunk(
  'collections/search',
  async ({ query, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/collections/search', {
        params: { q: query, page, limit }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

/* ========================= SLICE ========================= */

const collectionSlice = createSlice({
  name: 'collections',

  initialState: {
    list: [],
    featured: [],
    trending: [],
    selected: null,

    loading: false,
    error: null,

    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    },

    filters: {
      category: null,
      featured: false
    }
  },

  reducers: {
    clearCollections(state) {
      state.list = [];
      state.pagination = { currentPage: 1, totalPages: 1, totalItems: 0 };
    },

    clearSelectedCollection(state) {
      state.selected = null;
    },

    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.list = [];
      state.pagination.currentPage = 1;
    }
  },

  extraReducers: (builder) => {
    builder

      /* ===== Fetch All ===== */
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        const { collections, pagination } = action.payload;

        if (pagination.currentPage === 1) {
          state.list = collections;
        } else {
          state.list.push(...collections);
        }

        state.pagination = {
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalCollections
        };
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== Featured ===== */
      .addCase(fetchFeaturedCollections.fulfilled, (state, action) => {
        state.featured = action.payload;
      })

      /* ===== Trending ===== */
      .addCase(fetchTrendingCollections.fulfilled, (state, action) => {
        state.trending = action.payload;
      })

      /* ===== Category ===== */
      .addCase(fetchCollectionsByCategory.fulfilled, (state, action) => {
        state.list = action.payload.collections;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalCollections
        };
      })

      /* ===== Single Collection ===== */
      .addCase(fetchCollectionById.pending, (state) => {
        state.loading = true;
        state.selected = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== Search ===== */
      .addCase(searchCollections.fulfilled, (state, action) => {
        state.list = action.payload.collections;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalResults
        };
      });
  }
});

export const {
  clearCollections,
  clearSelectedCollection,
  setFilters
} = collectionSlice.actions;

export default collectionSlice.reducer;
