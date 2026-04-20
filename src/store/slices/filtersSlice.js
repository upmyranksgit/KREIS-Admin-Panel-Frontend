import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Global filters that can be shared across pages
  selectedInstitute: null,
  selectedBranch: null,
  selectedBatch: null,
  selectedTest: null,
  testCategory: null,
  dateRange: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSelectedInstitute: (state, action) => {
      state.selectedInstitute = action.payload;
      // Reset dependent filters
      state.selectedBranch = null;
      state.selectedBatch = null;
    },
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
      // Reset dependent filters
      state.selectedBatch = null;
    },
    setSelectedBatch: (state, action) => {
      state.selectedBatch = action.payload;
    },
    setSelectedTest: (state, action) => {
      state.selectedTest = action.payload;
    },
    setTestCategory: (state, action) => {
      state.testCategory = action.payload;
      // Reset test when category changes
      state.selectedTest = null;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const {
  setSelectedInstitute,
  setSelectedBranch,
  setSelectedBatch,
  setSelectedTest,
  setTestCategory,
  setDateRange,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
