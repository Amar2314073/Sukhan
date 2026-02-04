import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';

/* ===========================
   THUNKS
=========================== */

// Fetch global stats
export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/stats');
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stats'
      );
    }
  }
);

// Sync stats (admin only)
export const syncStats = createAsyncThunk(
  'stats/syncStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/stats/sync');
      return res.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to sync stats'
      );
    }
  }
);

// Reset stats (admin only)
export const resetStats = createAsyncThunk(
  'stats/resetStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/stats/reset');
      return res.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reset stats'
      );
    }
  }
);

/* ===========================
   SLICE
=========================== */

const statSlice = createSlice({
  name: 'stats',
  initialState: {
    statsData: {
      poems: 0,
      poets: 0,
      collections: 0,
      languages: 0,
      literaryEras: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    setStatsFromCache: (state, action) => {
      state.statsData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.statsData = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(syncStats.fulfilled, (state, action) => {
        state.statsData = action.payload;
      })
      .addCase(resetStats.fulfilled, (state, action) => {
        state.statsData = action.payload;
      });
  }
});

export const { setStatsFromCache } = statSlice.actions;
export default statSlice.reducer;
