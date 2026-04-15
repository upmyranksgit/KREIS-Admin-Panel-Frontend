import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

/**
 * InfiniteScrollSelect - A reusable Select component with infinite scroll and search
 * 
 * @param {Function} fetchData - Function to fetch data. Should return { data: [], total: number }
 * @param {Function} renderOption - Function to render option label from item
 * @param {Function} getOptionValue - Function to get option value from item
 * @param {string} placeholder - Placeholder text
 * @param {any} value - Selected value
 * @param {Function} onChange - Change handler
 * @param {number} pageSize - Items per page (default: 20)
 * @param {Object} additionalParams - Additional params to pass to fetchData
 * @param {boolean} disabled - Disable the select
 * @param {boolean} allowClear - Allow clearing selection
 * @param {string} mode - Select mode (default, multiple, tags)
 * @param {boolean} skipInitialLoad - Skip initial data load (default: false)
 */
const InfiniteScrollSelect = ({
  fetchData,
  renderOption,
  getOptionValue,
  placeholder = 'Select an option',
  value,
  onChange,
  pageSize = 20,
  additionalParams = {},
  disabled = false,
  allowClear = true,
  mode = undefined,
  style = { width: '100%' },
  skipInitialLoad = false
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState(0);

  const fetchingRef = useRef(false);

  const loadOptions = useCallback(async (pageNum, search) => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const params = {
        page: pageNum,
        limit: pageSize,
        ...(search && { search }),
        ...additionalParams
      };

      const response = await fetchData(params);
      const newData = response.data?.data || response.data || [];
      const totalCount = response.data?.total || response.data?.count || 0;

      setTotal(totalCount);

      if (pageNum === 1) {
        setOptions(newData);
      } else {
        setOptions(prev => [...prev, ...newData]);
      }

      setHasMore(options.length + newData.length < totalCount);
    } catch (error) {
      console.error('Error loading options:', error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [fetchData, pageSize, additionalParams, options.length]);

  // Initial load
  useEffect(() => {
    if (!skipInitialLoad) {
      loadOptions(1, '');
    }
  }, [loadOptions, skipInitialLoad]);

  const handleScroll = (e) => {
    const { target } = e;
    const isBottom = target.scrollTop + target.offsetHeight === target.scrollHeight;

    if (isBottom && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(nextPage, searchText);
    }
  };

  const handleSearch = debounce((value) => {
    setSearchText(value);
    setPage(1);
    setOptions([]);
    setHasMore(true);
    loadOptions(1, value);
  }, 500);

  const handleClear = () => {
    setSearchText('');
    setPage(1);
    setOptions([]);
    setHasMore(true);
    loadOptions(1, '');
  };

  return (
    <Select
      showSearch
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onPopupScroll={handleScroll}
      onSearch={handleSearch}
      onClear={handleClear}
      filterOption={false}
      disabled={disabled}
      allowClear={allowClear}
      mode={mode}
      style={style}
      size="large"
      loading={loading && page === 1}
      notFoundContent={loading && page === 1 ? <Spin size="small" /> : options.length === 0 ? 'No data' : null}
      dropdownRender={(menu) => (
        <>
          {menu}
          {loading && page > 1 && hasMore && (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <Spin size="small" />
            </div>
          )}
        </>
      )}
    >
      {options.map((item) => (
        <Select.Option key={getOptionValue(item)} value={getOptionValue(item)}>
          {renderOption(item)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default InfiniteScrollSelect;
