import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'github/fetchUserProfile',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserRepos = createAsyncThunk(
  'github/fetchUserRepos',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/${username}/repos`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserActivity = createAsyncThunk(
  'github/fetchUserActivity',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/${username}/activity`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const compareUsers = createAsyncThunk(
  'github/compareUsers',
  async ({ user1, user2 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/compare/${user1}/${user2}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  currentProfile: null,
  userRepos: [],
  userActivity: [],
  comparison: null,
  loading: false,
  error: null
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.currentProfile = null;
      state.userRepos = [];
      state.userActivity = [];
    },
    clearComparison: (state) => {
      state.comparison = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user profile';
      })
      // Fetch user repos
      .addCase(fetchUserRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.loading = false;
        state.userRepos = action.payload;
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch repositories';
      })
      // Fetch user activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.userActivity = action.payload;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch activity';
      })
      // Compare users
      .addCase(compareUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(compareUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.comparison = action.payload;
      })
      .addCase(compareUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to compare users';
      });
  }
});

export const { clearProfile, clearComparison, clearError } = githubSlice.actions;
export default githubSlice.reducer; 