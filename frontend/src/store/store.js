import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import chatSlice from './slices/chatSlice';


// Step 2: Import your lostFoundSlice reducer
import lostfoundSlice from './slices/lostFoundSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,  // existing
    chat: chatSlice,  // existing
    lostfound: lostfoundSlice,  // NEW - register lostfound slice here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
