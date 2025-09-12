// src/store/slices/lostFoundSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lostFoundService from '../../services/lostFoundService';

export const fetchItems = createAsyncThunk(
  'lostfound/fetchItems',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await lostFoundService.listItems(filters);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch items');
    }
  }
);

export const fetchMyItems = createAsyncThunk(
  'lostfound/fetchMyItems',
  async (_, { rejectWithValue }) => {
    try {
      const data = await lostFoundService.getMyItems();
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch my items');
    }
  }
);

export const createLostFound = createAsyncThunk(
  'lostfound/create',
  async ({ payload, onUploadProgress }, { rejectWithValue }) => {
    try {
      const created = await lostFoundService.createItem(payload, onUploadProgress);
      return created;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to create item');
    }
  }
);

export const changeStatus = createAsyncThunk(
  'lostfound/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const updated = await lostFoundService.updateStatus(id, status);
      return updated;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to update status');
    }
  }
);

export const claimItem = createAsyncThunk(
  'lostfound/claimItem',
  async (id, { rejectWithValue }) => {
    try {
      const updated = await lostFoundService.claimItem(id);
      return updated;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to claim item');
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  myItems: [],
  isLoading: false,
  isCreating: false,
  uploadProgress: 0,
  error: null,
  filters: {
    q: '',
    type: '',
    category: '',
    status: 'open',
    page: 1,
    limit: 12,
  },
};

const lostFoundSlice = createSlice({
  name: 'lostfound',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetCreateState(state) {
      state.isCreating = false;
      state.uploadProgress = 0;
      state.error = null;
    },
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload || 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myItems = action.payload;
      })
      .addCase(fetchMyItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createLostFound.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(createLostFound.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items = [action.payload, ...state.items];
        state.uploadProgress = 100;
      })
      .addCase(createLostFound.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      .addCase(changeStatus.fulfilled, (state, action) => {
        state.items = state.items.map((i) => (i._id === action.payload._id ? action.payload : i));
        state.myItems = state.myItems.map((i) => (i._id === action.payload._id ? action.payload : i));
      })

      .addCase(claimItem.fulfilled, (state, action) => {
        state.items = state.items.map((i) => (i._id === action.payload._id ? action.payload : i));
      });
  }
});

export const { setFilters, resetCreateState, setUploadProgress } = lostFoundSlice.actions;
export default lostFoundSlice.reducer;
