import React from 'react';
import InfiniteScrollSelect from '../InfiniteScrollSelect';
import { commonService } from '../../services/commonService';

/**
 * CourseSelect - Dropdown for selecting courses with infinite scroll
 */
const CourseSelect = ({ 
  value, 
  onChange, 
  placeholder = 'Select a course',
  disabled = false,
  allowClear = true,
  style
}) => {
  const fetchCourses = async (params) => {
    const response = await commonService.getCourses(params);
    return response;
  };

  return (
    <InfiniteScrollSelect
      fetchData={fetchCourses}
      renderOption={(course) => course.name || course.courseName}
      getOptionValue={(course) => course._id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      allowClear={allowClear}
      style={style}
    />
  );
};

export default CourseSelect;
