import React from 'react';
import InfiniteScrollSelect from '../InfiniteScrollSelect';
import { commonService } from '../../services/commonService';

/**
 * InstituteSelect - Dropdown for selecting institutes with infinite scroll
 */
const InstituteSelect = ({ 
  value, 
  onChange, 
  placeholder = 'Select an institute',
  disabled = false,
  allowClear = true,
  style
}) => {
  const fetchInstitutes = async (params) => {
    const response = await commonService.getInstitutes(params);
    return response;
  };

  return (
    <InfiniteScrollSelect
      fetchData={fetchInstitutes}
      renderOption={(institute) => institute.name}
      getOptionValue={(institute) => institute._id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      allowClear={allowClear}
      style={style}
    />
  );
};

export default InstituteSelect;
