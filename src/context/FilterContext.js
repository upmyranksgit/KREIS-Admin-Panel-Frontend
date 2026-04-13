import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const FilterContext = createContext();

// Action types
const ACTIONS = {
    SET_TEST: 'SET_TEST',
    SET_CATEGORY: 'SET_CATEGORY',
    SET_FILTER_TYPE: 'SET_FILTER_TYPE',
    SET_PRE_FILTER_INSTITUTE: 'SET_PRE_FILTER_INSTITUTE',
    SET_INSTITUTE: 'SET_INSTITUTE',
    SET_BRANCH: 'SET_BRANCH',
    SET_BATCH: 'SET_BATCH',
    SET_STUDENT: 'SET_STUDENT',
    SET_SEARCH: 'SET_SEARCH',
    RESET_FILTERS: 'RESET_FILTERS',
    RESET_DEPENDENT_FILTERS: 'RESET_DEPENDENT_FILTERS'
};

// Initial state
const initialState = {
    preFilterInstituteId: null, // For SuperAdmin to filter tests by institute
    selectedTest: null,
    testCategory: null,
    filterType: 'all',
    filters: {
        instituteId: null,
        branchId: null,
        batchId: null,
        studentId: null
    },
    searchText: ''
};

// Reducer
const filterReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_TEST:
            return {
                ...state,
                selectedTest: action.payload
            };

        case ACTIONS.SET_CATEGORY:
            return {
                ...state,
                testCategory: action.payload,
                selectedTest: null // Reset test when category changes
            };

        case ACTIONS.SET_PRE_FILTER_INSTITUTE:
            return {
                ...state,
                preFilterInstituteId: action.payload,
                selectedTest: null // Reset test when pre-filter institute changes
            };

        case ACTIONS.SET_FILTER_TYPE:
            return {
                ...state,
                filterType: action.payload,
                filters: {
                    instituteId: null,
                    branchId: null,
                    batchId: null,
                    studentId: null
                }
            };

        case ACTIONS.SET_INSTITUTE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    instituteId: action.payload,
                    branchId: null, // Reset dependent filters
                    batchId: null,
                    studentId: null
                }
            };

        case ACTIONS.SET_BRANCH:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    branchId: action.payload,
                    batchId: null, // Reset dependent filters
                    studentId: null
                }
            };

        case ACTIONS.SET_BATCH:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    batchId: action.payload,
                    studentId: null // Reset dependent filter
                }
            };

        case ACTIONS.SET_STUDENT:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    studentId: action.payload
                }
            };

        case ACTIONS.SET_SEARCH:
            return {
                ...state,
                searchText: action.payload
            };

        case ACTIONS.RESET_FILTERS:
            return {
                ...initialState,
                selectedTest: state.selectedTest,
                testCategory: state.testCategory
            };

        case ACTIONS.RESET_DEPENDENT_FILTERS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload
                }
            };

        default:
            return state;
    }
};

// Provider component
export const FilterProvider = ({ children }) => {
    const [state, dispatch] = useReducer(filterReducer, initialState);

    // Get current user
    const currentUser = authService.getCurrentUser();
    const userRole = currentUser?.role?.toLowerCase();

    // Actions
    const setTest = (testId) => {
        dispatch({ type: ACTIONS.SET_TEST, payload: testId });
    };

    const setCategory = (category) => {
        dispatch({ type: ACTIONS.SET_CATEGORY, payload: category });
    };

    const setPreFilterInstitute = (instituteId) => {
        dispatch({ type: ACTIONS.SET_PRE_FILTER_INSTITUTE, payload: instituteId });
    };

    const setFilterType = (filterType) => {
        dispatch({ type: ACTIONS.SET_FILTER_TYPE, payload: filterType });
    };

    const setInstitute = (instituteId) => {
        dispatch({ type: ACTIONS.SET_INSTITUTE, payload: instituteId });
    };

    const setBranch = (branchId) => {
        dispatch({ type: ACTIONS.SET_BRANCH, payload: branchId });
    };

    const setBatch = (batchId) => {
        dispatch({ type: ACTIONS.SET_BATCH, payload: batchId });
    };

    const setStudent = (studentId) => {
        dispatch({ type: ACTIONS.SET_STUDENT, payload: studentId });
    };

    const setSearch = (searchText) => {
        dispatch({ type: ACTIONS.SET_SEARCH, payload: searchText });
    };

    const resetFilters = () => {
        dispatch({ type: ACTIONS.RESET_FILTERS });
    };

    // Check if required filters are selected
    const areRequiredFiltersSelected = () => {
        const { filterType, filters } = state;

        if (filterType === 'all') return true;
        if (filterType === 'institute') return !!filters.instituteId;
        if (filterType === 'branch') return !!filters.branchId;
        if (filterType === 'batch') return !!filters.batchId;
        if (filterType === 'student') return !!filters.studentId;

        return false;
    };

    // Get available filter types based on user role
    const getAvailableFilterTypes = () => {
        const filterOptions = [{ value: 'all', label: 'All Submissions' }];

        if (userRole === 'superadmin') {
            filterOptions.push(
                { value: 'institute', label: 'Institute-wise' },
                { value: 'branch', label: 'Branch-wise' },
                { value: 'batch', label: 'Batch-wise' },
                { value: 'student', label: 'Individual Student' }
            );
        } else if (userRole === 'instituteadmin') {
            filterOptions.push(
                { value: 'branch', label: 'Branch-wise' },
                { value: 'batch', label: 'Batch-wise' },
                { value: 'student', label: 'Individual Student' }
            );
        } else if (userRole === 'branchadmin') {
            filterOptions.push(
                { value: 'batch', label: 'Batch-wise' },
                { value: 'student', label: 'Individual Student' }
            );
        } else {
            filterOptions.push(
                { value: 'student', label: 'Individual Student' }
            );
        }

        return filterOptions;
    };

    // Check if user can see specific filter
    const canSeeInstituteFilter = () => userRole === 'superadmin';
    const canSeeBranchFilter = () => userRole === 'superadmin' || userRole === 'instituteadmin';
    const canSeeBatchFilter = () => userRole !== 'student';

    const value = {
        // State
        ...state,
        currentUser,
        userRole,

        // Actions
        setTest,
        setCategory,
        setPreFilterInstitute,
        setFilterType,
        setInstitute,
        setBranch,
        setBatch,
        setStudent,
        setSearch,
        resetFilters,

        // Helpers
        areRequiredFiltersSelected,
        getAvailableFilterTypes,
        canSeeInstituteFilter,
        canSeeBranchFilter,
        canSeeBatchFilter
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};

// Custom hook to use filter context
export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};

export default FilterContext;
