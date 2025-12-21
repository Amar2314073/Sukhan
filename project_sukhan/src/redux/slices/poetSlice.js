// redux/slices/poetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/poets';

// Async thunks
export const fetchAllPoets = createAsyncThunk(
  'poets/fetchAll',
  async ({ page = 1, limit = 12, era = 'all' }, { rejectWithValue }) => {
    try {
      const params = { page, limit };

      if (era && era !== 'all') {
        params.era = era;
      }

      const response = await axios.get(BASE_URL, { params });
      return response.data;
    } catch (err) {
        return rejectWithValue(
          err.response?.data?.message ||
          err.message ||
          'Unknown error'
        );
    }
  }
);


export const searchPoets = createAsyncThunk(
  'poets/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/poets/search?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const getPoetById = createAsyncThunk(
  'poets/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/poets/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch poet');
    }
  }
);

export const getPoemsByPoet = createAsyncThunk(
  'poets/getPoems',
  async (poetId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/poets/${poetId}/poems`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch poems by poet');
    }
  }
);

export const getPopularPoets = createAsyncThunk(
  'poets/getPopular',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/poets/popular`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch popular poets');
    }
  }
);

export const getPoetsByEra = createAsyncThunk(
  'poets/getByEra',
  async (era, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/poets/era/${era}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch poets by era');
    }
  }
);

const poetSlice = createSlice({
  name: 'poets',
  initialState: {
    poets: [],
    searchResults: [],
    popularPoets: [],
    currentPoet: null,
    poetPoems: [],
    loading: false,
    searchLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalPoets: 0,
    filters: {
      era: 'all',
      sortBy: 'popular'
    },
    pagination: {
      hasNext: false,
      hasPrev: false
    }
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentPoet: (state) => {
      state.currentPoet = null;
      state.poetPoems = [];
    },
    resetPoetState: (state) => {
      state.poets = [];
      state.searchResults = [];
      state.currentPoet = null;
      state.poetPoems = [];
      state.loading = false;
      state.searchLoading = false;
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalPoets = 0;
      state.filters = {
        era: 'all',
        sortBy: 'popular'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all poets
      .addCase(fetchAllPoets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPoets.fulfilled, (state, action) => {
        state.loading = false;
        state.poets = action.payload.poets || [];
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.totalPoets = action.payload.pagination?.totalPoets || 0;
        state.currentPage = action.payload.pagination?.currentPage || 1;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchAllPoets.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          JSON.stringify(action.error);
      });

      
      // Search poets
      .addCase(searchPoets.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPoets.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.poets || [];
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.totalPoets = action.payload.pagination?.totalResults || 0;
      })
      .addCase(searchPoets.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload || 'Search failed';
      })
      
      // Get poet by ID
      .addCase(getPoetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoet = action.payload.poet || null;
      })
      .addCase(getPoetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load poet';
      })
      
      // Get poems by poet
      .addCase(getPoemsByPoet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoemsByPoet.fulfilled, (state, action) => {
        state.loading = false;
        state.poetPoems = action.payload.poems || [];
      })
      .addCase(getPoemsByPoet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load poems';
      })
      
      // Get popular poets
      .addCase(getPopularPoets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPopularPoets.fulfilled, (state, action) => {
        state.loading = false;
        state.popularPoets = action.payload.poets || [];
      })
      .addCase(getPopularPoets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load popular poets';
      })
      
      // Get poets by era
      .addCase(getPoetsByEra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoetsByEra.fulfilled, (state, action) => {
        state.loading = false;
        state.poets = action.payload.poets || [];
        state.totalPages = action.payload.pagination?.totalPages || 1;
        state.totalPoets = action.payload.pagination?.totalPoets || 0;
        state.currentPage = action.payload.pagination?.currentPage || 1;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(getPoetsByEra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load poets by era';
      });
  }
});

export const { 
  clearSearchResults, 
  setCurrentPage, 
  clearError, 
  setFilters,
  clearCurrentPoet,
  resetPoetState 
} = poetSlice.actions;

export default poetSlice.reducer;