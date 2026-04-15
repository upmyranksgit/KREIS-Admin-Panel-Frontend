import React from 'react';
import InfiniteScrollSelect from '../InfiniteScrollSelect';
import { commonService } from '../../services/commonService';
import { authService } from '../../services/authService';

/**
 * BranchSelect - Dropdown for selecting branches with infinite scroll
 * Automatically uses institute admin's instituteId if not provided
 */
const BranchSelect = ({ 
  value, 
  onChange, 
  placeholder = 'Select a principal',
  instituteId = null,
  disabled = false,
  allowClear = true,
  style
}) => {
  // Get current user details
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  // Determine effective instituteId
  // If explicitly passed, use that; otherwise use user's own instituteId for institute admin
  let effectiveInstituteId = instituteId;

  if (!effectiveInstituteId && (userRole === 'instituteadmin' || userRole === 'branchadmin' || userRole === 'teacher')) {
    effectiveInstituteId = currentUser?.instituteId;
  }

  const fetchBranches = async (params) => {
    const response = await commonService.getBranches({
      ...params,
      ...(effectiveInstituteId && { instituteId: effectiveInstituteId })
    });
    return response;
  };

  // Only disable if explicitly disabled prop is true
  // Don't disable for institute admin since we auto-populate their instituteId
  const isDisabled = disabled || (!effectiveInstituteId && userRole === 'superadmin');

  return (
    <InfiniteScrollSelect
      fetchData={fetchBranches}
      renderOption={(branch) => branch.name}
      getOptionValue={(branch) => branch._id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
      allowClear={allowClear}
      style={style}
      additionalParams={{
        ...(effectiveInstituteId && { instituteId: effectiveInstituteId })
      }}
    />
  );
};

export default BranchSelect;
