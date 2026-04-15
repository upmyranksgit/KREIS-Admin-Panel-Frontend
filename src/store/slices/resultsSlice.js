import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assessmentService } from '../../services/assessmentService';

// Async thunks
export const fetchSubmissions = createAsyncThunk(
  'results/fetchSubmissions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await assessmentService.getSubmittedTestScore(params);
      return {
        data: response.data?.data || [],
        total: response.data?.total || 0,
        page: params.page,
        limit: params.limit,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

export const downloadResults = createAsyncThunk(
  'results/download',
  async (testId, { rejectWithValue }) => {
    try {
      const response = await assessmentService.getTestScoreInExcel({ testId });
      const fileUrl = response.data?.data?.filePath || response.data?.filePath;
      if (!fileUrl) {
        throw new Error('File URL not found in response');
      }
      return fileUrl;
    } catch (error) {
      return rejectWithValue(error.message || 'Download failed');
    }
  }
);

const initialState = {
  submissions: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    testId: null,
    studentName: '',
    instituteId: null,
    branchId: null,
  },
  expandedRowKeys: [],
  downloadLoading: false,
  downloadError: null,
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1; // Reset to first page on filter change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setExpandedRowKeys: (state, action) => {
      state.expandedRowKeys = action.payload;
    },
    toggleExpandedRow: (state, action) => {
      const key = action.payload;
      const index = state.expandedRowKeys.indexOf(key);
      if (index > -1) {
        state.expandedRowKeys.splice(index, 1);
      } else {
        state.expandedRowKeys.push(key);
      }
    },
    clearError: (state) => {
      state.error = null;
      state.downloadError = null;
    },
    resetResults: (state) => {
      state.submissions = [];
      state.pagination = initialState.pagination;
      state.expandedRowKeys = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.data;
        state.pagination = {
          current: action.payload.page,
          pageSize: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Download results
      .addCase(downloadResults.pending, (state) => {
        state.downloadLoading = true;
        state.downloadError = null;
      })
      .addCase(downloadResults.fulfilled, (state) => {
        state.downloadLoading = false;
      })
      .addCase(downloadResults.rejected, (state, action) => {
        state.downloadLoading = false;
        state.downloadError = action.payload;
      });
  },
});

export const {
  setFilters,
  setPagination,
  setExpandedRowKeys,
  toggleExpandedRow,
  clearError,
  resetResults,
} = resultsSlice.actions;

export default resultsSlice.reducer;
