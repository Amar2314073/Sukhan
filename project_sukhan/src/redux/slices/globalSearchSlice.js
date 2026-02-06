import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchService } from '../../services/search.service';

export const globalSearch = createAsyncThunk(
  'globalSearch/search',
  async (q, { rejectWithValue }) => {
    try {
      const [
        poetsRes,
        poemsRes,
        booksRes,
        collectionsRes
      ] = await Promise.all([
        searchService.searchPoets(q),
        searchService.searchPoems(q),
        searchService.searchBooks(q),
        searchService.searchCollections(q)
      ]);

      return {
        poets: poetsRes.data.poets || [],
        poems: poemsRes.data.poems || [],
        books: booksRes.data.books || [],
        collections: collectionsRes.data.collections || []
      };
    } catch (err) {
      return rejectWithValue('Search failed');
    }
  }
);

const globalSearchSlice = createSlice({
  name: 'globalSearch',
  initialState: {
    poets: [],
    poems: [],
    books: [],
    collections: [],
    loading: false,
    error: null
  },
  reducers: {
    clearGlobalSearch: (state) => {
      state.poets = [];
      state.poems = [];
      state.books = [];
      state.collections = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(globalSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.poets = action.payload.poets;
        state.poems = action.payload.poems;
        state.books = action.payload.books;
        state.collections = action.payload.collections;
      })
      .addCase(globalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearGlobalSearch } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;
