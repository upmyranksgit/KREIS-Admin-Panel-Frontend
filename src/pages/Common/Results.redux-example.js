// Example: Results component migrated to use Redux
// This shows how to convert the existing Results.js to use Redux state management

import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Row, Col, Input, Select, Empty, Tag, Modal } from 'antd';
import { DownloadOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchSubmissions, 
  downloadResults, 
  setFilters, 
  setPagination, 
  toggleExpandedRow,
  clearError 
} from '../../store/slices/resultsSlice';
import { authService } from '../../services/authService';
import { TestSelect, InstituteSelect, BranchSelect } from '../../components/dropdowns';
import MathRenderer from '../../components/MathRenderer';

const { Search } = Input;

const Results = () => {
  // Redux state
  const dispatch = useAppDispatch();
  const { 
    submissions, 
    loading, 
    pagination, 
    filters, 
    expandedRowKeys,
    downloadLoading,
    error 
  } = useAppSelector((state) => state.results);

  // Local state for modals
  const [questionModal, setQuestionModal] = useState({
    visible: false,
    question: null
  });

  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  const showInstituteFilter = userRole === 'superadmin';
  const showBranchFilter = userRole === 'superadmin' || userRole === 'instituteadmin';

  // Fetch submissions when filters change
  useEffect(() => {
    if (filters.testId) {
      dispatch(fetchSubmissions({
        testId: filters.testId,
        page: pagination.current,
        limit: pagination.pageSize,
        search: filters.studentName,
        instituteId: filters.instituteId,
        branchId: filters.branchId,
      }));
    }
  }, [dispatch, filters, pagination.current, pagination.pageSize]);

  // Show error messages
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (value) => {
    dispatch(setFilters({ studentName: value }));
  };

  const handleInstituteChange = (value) => {
    dispatch(setFilters({ instituteId: value, branchId: null }));
  };

  const handleBranchChange = (value) => {
    dispatch(setFilters({ branchId: value }));
  };

  const handleTestChange = (value) => {
    dispatch(setFilters({ testId: value }));
  };

  const handleTableChange = (newPagination) => {
    dispatch(setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleDownload = async () => {
    try {
      const fileUrl = await dispatch(downloadResults(filters.testId)).unwrap();
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `results-${filters.testId}.xlsx`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success('Downloaded successfully');
    } catch (error) {
      message.error('Download failed');
    }
  };

  const handleRowExpand = (key) => {
    dispatch(toggleExpandedRow(key));
  };

  // ... rest of the component (columns, render functions, etc.)
  // The main difference is using Redux state and dispatch instead of local state

  return (
    <div style={{ background: 'var(--color-neutral-50)', minHeight: 'calc(100vh - 64px)', padding: 'var(--spacing-xl)' }}>
      {/* Filters */}
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Search
              placeholder="Search by student name"
              onSearch={handleSearch}
              loading={loading}
            />
          </Col>
          {showInstituteFilter && (
            <Col span={8}>
              <InstituteSelect
                value={filters.instituteId}
                onChange={handleInstituteChange}
              />
            </Col>
          )}
          {showBranchFilter && (
            <Col span={8}>
              <BranchSelect
                instituteId={filters.instituteId}
                value={filters.branchId}
                onChange={handleBranchChange}
              />
            </Col>
          )}
        </Row>
      </Card>

      {/* Table */}
      <Card style={{ marginTop: 20 }}>
        <Table
          dataSource={submissions}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} entries`,
          }}
          onChange={handleTableChange}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpandedRowsChange: (keys) => {
              // Handle multiple row expansion if needed
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Results;
