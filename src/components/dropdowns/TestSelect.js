import React from 'react';
import InfiniteScrollSelect from '../InfiniteScrollSelect';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';

/**
 * TestSelect - Dropdown for selecting tests with infinite scroll
 * Automatically filters tests based on user role
 */
const TestSelect = ({
  value,
  onChange,
  placeholder = 'Select a test',
  instituteId = null,
  branchId = null,
  category = null,
  isCompleted = null,
  disabled = false,
  allowClear = true,
  style
}) => {
  // Get current user details
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  // Determine instituteId and branchId based on role
  // If explicitly passed, use those; otherwise use user's own IDs
  let effectiveInstituteId = instituteId;
  let effectiveBranchId = branchId;

  // For institute admin, use their institute ID if not explicitly provided
  if (userRole === 'instituteadmin' && !effectiveInstituteId) {
    effectiveInstituteId = currentUser?.instituteId;
  }

  // For branch admin, use their institute and branch IDs if not explicitly provided
  if (userRole === 'branchadmin') {
    if (!effectiveInstituteId) {
      effectiveInstituteId = currentUser?.instituteId;
    }
    if (!effectiveBranchId) {
      effectiveBranchId = currentUser?.branchId;
    }
  }

  // For teacher, use their institute and branch IDs if not explicitly provided
  if (userRole === 'teacher') {
    if (!effectiveInstituteId) {
      effectiveInstituteId = currentUser?.instituteId;
    }
    if (!effectiveBranchId) {
      effectiveBranchId = currentUser?.branchId;
    }
  }

  const fetchTests = async (params) => {
    const response = await assessmentService.getInstituteTests({
      ...params,
      ...(effectiveInstituteId && { instituteId: effectiveInstituteId }),
      ...(effectiveBranchId && { branchId: effectiveBranchId }),
      ...(category && { category }),
      ...(isCompleted !== null && { isCompleted })
    });
    return response;
  };

  return (
    <InfiniteScrollSelect
      fetchData={fetchTests}
      renderOption={(test) => test.institute_test_name}
      getOptionValue={(test) => test._id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      allowClear={allowClear}
      style={style}
      additionalParams={{
        ...(effectiveInstituteId && { instituteId: effectiveInstituteId }),
        ...(effectiveBranchId && { branchId: effectiveBranchId }),
        ...(category && { category }),
        ...(isCompleted !== null && { isCompleted })
      }}
    />
  );
};

export default TestSelect;
