import React from 'react';
import InfiniteScrollSelect from '../InfiniteScrollSelect';
import { assessmentService } from '../../services/assessmentService';

/**
 * TestPatternSelect - Dropdown for selecting test patterns with infinite scroll
 */
const TestPatternSelect = ({ 
  value, 
  onChange, 
  placeholder = 'Select a test pattern',
  disabled = false,
  allowClear = true,
  style
}) => {
  const fetchTestPatterns = async (params) => {
    // Convert page/limit to skip/limit for this API
    const skip = (params.page - 1) * params.limit;
    const response = await assessmentService.getTestPatterns({
      skip,
      limit: params.limit,
      ...(params.search && { search: params.search })
    });
    return response;
  };

  return (
    <InfiniteScrollSelect
      fetchData={fetchTestPatterns}
      renderOption={(pattern) => pattern.test_name || pattern.name}
      getOptionValue={(pattern) => pattern._id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      allowClear={allowClear}
      style={style}
    />
  );
};

export default TestPatternSelect;
