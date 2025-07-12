import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import githubReducer from '../features/github/githubSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    github: githubReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 