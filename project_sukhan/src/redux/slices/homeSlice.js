import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';

/* ================= FETCH STATS ================= */

export const fetchStats = createAsyncThunk(
  'home/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/home/stats');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch stats'
      );
    }
  }
);


/* ================= SLICE ================= */

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    poetCount: 0,
    poemCount: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.poetCount = action.payload.poetCount;
        state.poemCount = action.payload.poemCount;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default homeSlice.reducer;
