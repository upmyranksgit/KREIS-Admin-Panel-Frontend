import React from 'react';
import InfiniteScrollSelect from '../InfiniteScrollSelect';
import { commonService } from '../../services/commonService';
import { authService } from '../../services/authService';

/**
 * BatchSelect - Dropdown for selecting batches with infinite scroll
 * Automatically uses user's instituteId and branchId if not provided
 */
const BatchSelect = ({
  value,
  onChange,
  placeholder = 'Select batch(es)',
  instituteId = null,
  branchId = null,
  disabled = false,
  allowClear = true,
  mode = 'multiple', // Default to multiple selection for batches
  style
}) => {
  // Get current user details
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  // Determine effective instituteId and branchId
  let effectiveInstituteId = instituteId;
  let effectiveBranchId = branchId;

  // Auto-populate based on user role
  if (userRole === 'instituteadmin' && !effectiveInstituteId) {
    effectiveInstituteId = currentUser?.instituteId;
  }

  if ((userRole === 'branchadmin' || userRole === 'teacher')) {
    if (!effectiveInstituteId) {
      effectiveInstituteId = currentUser?.instituteId;
    }
    if (!effectiveBranchId) {
      effectiveBranchId = currentUser?.branchId;
    }
  }

  const fetchBatches = async (params) => {
    const response = await commonService.getBatches({
      ...params,
      ...(effectiveInstituteId && { instituteId: effectiveInstituteId }),
      ...(effectiveBranchId && { branchIds: [effectiveBranchId] }) // Send as array - will be JSON stringified
    });
    return response;
  };

  return (
    <InfiniteScrollSelect
      fetchData={fetchBatches}
      renderOption={(batch) => batch.name}
      getOptionValue={(batch) => batch._id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      allowClear={allowClear}
      mode={mode}
      style={style}
      additionalParams={{
        ...(effectiveInstituteId && { instituteId: effectiveInstituteId }),
        ...(effectiveBranchId && { branchIds: [effectiveBranchId] }) // Send as array - will be JSON stringified
      }}
    />
  );
};

export default BatchSelect;
