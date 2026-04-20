import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Test Pattern State
  patterns: [],
  patternsLoading: false,
  patternsTotal: 0,
  
  // Tests State
  tests: [],
  testsLoading: false,
  testsTotal: 0,
  
  // Create/Edit Test State
  testDetails: {
    isEdit: false,
    withoutPattern: false,
    testName: '',
    testPattern: '',
    testPatternId: '',
    courseId: '',
    courseName: '',
    testDuration: 0,
    totalQuestions: 0,
    totalMarks: 0,
    instructionText: '',
    subjectDetails: [],
    startDate: null,
    endDate: null,
    startTime: { title: '', firstName: '', lastName: '' },
    endTime: { title: '', firstName: '', lastName: '' },
    isPasswordProtect: false,
    password: '',
    isTimeChange: false,
    type: '',
    isOffline: false,
    hasOfflineQuestions: false,
    selectedPatternDetails: null
  },
  
  // Filters
  filters: {
    instituteId: null,
    branchId: null,
    gradeId: null,
    searchKey: ''
  }
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    // Pattern Actions
    setPatternsLoading: (state, action) => {
      state.patternsLoading = action.payload;
    },
    setPatterns: (state, action) => {
      state.patterns = action.payload.data;
      state.patternsTotal = action.payload.total;
    },
    
    // Tests Actions
    setTestsLoading: (state, action) => {
      state.testsLoading = action.payload;
    },
    setTests: (state, action) => {
      state.tests = action.payload.data;
      state.testsTotal = action.payload.total;
    },
    
    // Test Details Actions
    setTestDetails: (state, action) => {
      state.testDetails = { ...state.testDetails, ...action.payload };
    },
    resetTestDetails: (state) => {
      state.testDetails = initialState.testDetails;
    },
    
    // Filters Actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  setPatternsLoading,
  setPatterns,
  setTestsLoading,
  setTests,
  setTestDetails,
  resetTestDetails,
  setFilters,
  resetFilters
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
