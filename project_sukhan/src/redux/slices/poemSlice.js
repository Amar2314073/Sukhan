import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { poemService } from '../../services/poem.service';


// Async thunks for API calls
export const fetchAllPoems = createAsyncThunk(
  'poems/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await poemService.getAllPoems();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch poems'
      );
    }
  }
);

export const searchPoems = createAsyncThunk(
  'poems/search',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await poemService.searchPoems(searchQuery);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

export const fetchPoemsByPoet = createAsyncThunk(
  'poems/fetchByPoet',
  async (poetId, { rejectWithValue }) => {
    try {
      const response = await poemService.getPoemsByPoet(poetId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch poet poems'
      );
    }
  }
);

export const fetchPoemsByCategory = createAsyncThunk(
  'poems/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await poemService.getPoemsByCategory(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category poems'
      );
    }
  }
);

export const fetchPoemById = createAsyncThunk(
  'poems/fetchById',
  async (poemId, { rejectWithValue }) => {
    try {
      const response = await poemService.getPoemById(poemId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch poem'
      );
    }
  }
);

// Admin thunks
export const createPoem = createAsyncThunk(
  'poems/create',
  async (poemData, { rejectWithValue }) => {
    try {
      const response = await poemService.createPoem(poemData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create poem'
      );
    }
  }
);

export const updatePoem = createAsyncThunk(
  'poems/update',
  async ({ id, poemData }, { rejectWithValue }) => {
    try {
      const response = await poemService.updatePoem(id, poemData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update poem'
      );
    }
  }
);

export const deletePoem = createAsyncThunk(
  'poems/delete',
  async (poemId, { rejectWithValue }) => {
    try {
      const response = await poemService.deletePoem(poemId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete poem'
      );
    }
  }
);

// Initial state
const initialState = {
  poems: [],
  currentPoem: null,
  searchResults: [],
  poemsByPoet: [],
  poemsByCategory: [],
  loading: false,
  error: null,
  searchLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalPoems: 0
};

// Poem slice
const poemSlice = createSlice({
  name: 'poems',
  initialState,
  reducers: {
    clearCurrentPoem: (state) => {
      state.currentPoem = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearPoemsByPoet: (state) => {
      state.poemsByPoet = [];
    },
    clearPoemsByCategory: (state) => {
      state.poemsByCategory = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Poems
      .addCase(fetchAllPoems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPoems.fulfilled, (state, action) => {
        state.loading = false;
        state.poems = action.payload.poems || action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.totalPoems = action.payload.totalPoems || action.payload.length;
      })
      .addCase(fetchAllPoems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Poems
      .addCase(searchPoems.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPoems.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.poems || action.payload;
      })
      .addCase(searchPoems.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })
      // Fetch Poems by Poet
      .addCase(fetchPoemsByPoet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPoemsByPoet.fulfilled, (state, action) => {
        state.loading = false;
        state.poemsByPoet = action.payload.poems || action.payload;
      })
      .addCase(fetchPoemsByPoet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Poems by Category
      .addCase(fetchPoemsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPoemsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.poemsByCategory = action.payload.poems || action.payload;
      })
      .addCase(fetchPoemsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Poem by ID
      .addCase(fetchPoemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPoemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoem = action.payload.poem || action.payload;
      })
      .addCase(fetchPoemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Poem (Admin)
      .addCase(createPoem.fulfilled, (state, action) => {
        state.poems.unshift(action.payload.poem || action.payload);
      })
      // Update Poem (Admin)
      .addCase(updatePoem.fulfilled, (state, action) => {
        const updatedPoem = action.payload.poem || action.payload;
        const index = state.poems.findIndex(poem => poem._id === updatedPoem._id);
        if (index !== -1) {
          state.poems[index] = updatedPoem;
        }
        if (state.currentPoem && state.currentPoem._id === updatedPoem._id) {
          state.currentPoem = updatedPoem;
        }
      })
      // Delete Poem (Admin)
      .addCase(deletePoem.fulfilled, (state, action) => {
        const deletedPoemId = action.payload.poem?._id || action.payload._id || action.payload;
        state.poems = state.poems.filter(poem => poem._id !== deletedPoemId);
        state.poemsByPoet = state.poemsByPoet.filter(poem => poem._id !== deletedPoemId);
        state.poemsByCategory = state.poemsByCategory.filter(poem => poem._id !== deletedPoemId);
        state.searchResults = state.searchResults.filter(poem => poem._id !== deletedPoemId);
        if (state.currentPoem && state.currentPoem._id === deletedPoemId) {
          state.currentPoem = null;
        }
      });
  }
});

// Export actions
export const {
  clearCurrentPoem,
  clearSearchResults,
  clearPoemsByPoet,
  clearPoemsByCategory,
  clearError,
  setCurrentPage
} = poemSlice.actions;

// Export selectors
export const selectAllPoems = (state) => state.poems.poems;
export const selectCurrentPoem = (state) => state.poems.currentPoem;
export const selectSearchResults = (state) => state.poems.searchResults;
export const selectPoemsByPoet = (state) => state.poems.poemsByPoet;
export const selectPoemsByCategory = (state) => state.poems.poemsByCategory;
export const selectPoemsLoading = (state) => state.poems.loading;
export const selectSearchLoading = (state) => state.poems.searchLoading;
export const selectPoemsError = (state) => state.poems.error;
export const selectPoemsPagination = (state) => ({
  currentPage: state.poems.currentPage,
  totalPages: state.poems.totalPages,
  totalPoems: state.poems.totalPoems
});

export default poemSlice.reducer;