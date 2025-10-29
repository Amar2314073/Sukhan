import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/categories';

// Get all categories
export const getAllCategories = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Search categories
export const searchCategories = createAsyncThunk(
  'categories/search',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/search?query=${searchQuery}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get category stats
export const getCategoryStats = createAsyncThunk(
  'categories/stats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/stats/types`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get categories by type
export const getCategoriesByType = createAsyncThunk(
  'categories/byType',
  async (type, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/type/${type}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get category by ID
export const getCategoryById = createAsyncThunk(
  'categories/getById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get poems by category (with pagination)
export const getPoemsByCategory = createAsyncThunk(
  'categories/getPoems',
  async ({ categoryId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${categoryId}/poems?page=${page}&limit=${limit}`
      );
      return response.data; // { poems, pagination }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch poems" });
    }
  }
);

// Create category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(BASE_URL, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${BASE_URL}/${id}`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (categoryId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${BASE_URL}/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    currentCategory: null,
    categoryPoems: [],
    pagination: null,
    stats: null,
    searchResults: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCategoryPoems: (state) => {  // 🆕 optional
      state.categoryPoems = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Categories
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.success = true;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Search Categories
      .addCase(searchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.success = true;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Category Stats
      .addCase(getCategoryStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.success = true;
      })
      .addCase(getCategoryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Categories By Type
      .addCase(getCategoriesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoriesByType.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.success = true;
      })
      .addCase(getCategoriesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Category By ID
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
        state.success = true;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Poems By Category (Paginated)
      .addCase(getPoemsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPoemsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryPoems = action.payload.poems;
        state.pagination = action.payload.pagination;
        state.success = true;
      })
      .addCase(getPoemsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory && state.currentCategory._id === action.payload._id) {
          state.currentCategory = action.payload;
        }
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentCategory,
  clearSearchResults,
  clearCategoryPoems,
} = categorySlice.actions;

export default categorySlice.reducer;
