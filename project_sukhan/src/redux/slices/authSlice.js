import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.loginUser(credentials);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.registerUser(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.logoutUser();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(profileData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'auth/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.deleteProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Account deletion failed');
    }
  }
);

export const toggleLikePoem = createAsyncThunk(
  'auth/toggleLikePoem',
  async (poemId, { rejectWithValue }) => {
    try {
      return await authService.toggleLike(poemId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Like failed');
    }
  }
);

export const toggleSavePoem = createAsyncThunk(
  'auth/toggleSavePoem',
  async (poemId, { rejectWithValue }) => {
    try {
      return await authService.toggleSave(poemId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Save failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await authService.loadUser();

      localStorage.setItem(
        'auth',
        JSON.stringify({
          user,
          isAuthenticated: true,
        })
      );

      return user;
    } catch {
      localStorage.removeItem('auth');
      return rejectWithValue(null);
    }
  }
);



// Initial state
const getInitialState = () => {
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    const parsed = JSON.parse(storedAuth);
    return {
      user: parsed.user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  }
  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };
};

const initialState = getInitialState();


// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setLanguage: (state, action) => {
      if (state.user) state.user.preferredLanguage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem(
          'auth',
          JSON.stringify({
            user: action.payload.user,
            isAuthenticated: true,
          })
        );

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        localStorage.setItem(
          'auth',
          JSON.stringify({
            user: action.payload.user,
            isAuthenticated: true,
          })
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('auth');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Even if logout fails on server, clear local auth state
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Profile
      .addCase(deleteProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Toggle Like
      .addCase(toggleLikePoem.fulfilled, (state, action) => {
        if (state.user) {
          state.user.likedPoems = action.payload.likedPoems;
        }
      })

      // Toggle Save
      .addCase(toggleSavePoem.fulfilled, (state, action) => {
        if (state.user) {
          state.user.savedPoems = action.payload.savedPoems;
        }
      })

      // Load User
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  }
});

export const { resetAuth, clearAuth, setLanguage } = authSlice.actions;
export default authSlice.reducer;