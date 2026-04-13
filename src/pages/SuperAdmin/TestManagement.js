import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { assessmentService } from '../../services/assessmentService';
import { commonService } from '../../services/commonService';
import TestFilters from '../../components/TestFilters';
import CreateTestModal from '../../components/CreateTestModal';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ searchText: '', category: null, institute: null, branch: null, batches: [] });
  const [filterData, setFilterData] = useState({ institutes: [], branches: [], batches: [], categories: [] });

  useEffect(() => {
    fetchFilterData();
    fetchTests(pagination.current, pagination.pageSize);
  }, []);

  // Fetch branches when institute changes
  useEffect(() => {
    if (filters.institute) {
      fetchBranches(filters.institute);
    } else {
      setFilterData(prev => ({ ...prev, branches: [], batches: [] }));
    }
  }, [filters.institute]);

  // Fetch batches when branch or institute changes
  useEffect(() => {
    if (filters.branch || filters.institute) {
      fetchBatches(filters.institute, filters.branch);
    } else {
      setFilterData(prev => ({ ...prev, batches: [] }));
    }
  }, [filters.branch, filters.institute]);

  const fetchFilterData = async () => {
    try {
      const institutesRes = await commonService.getInstitutes({ page: 1, limit: 100 }).catch(() => ({ data: { data: [] } }));

      setFilterData({
        institutes: institutesRes.data?.data || [],
        branches: [],
        batches: [],
        categories: [
          { value: 'chapterWise', label: 'Chapter Wise' },
          { value: 'fullLength', label: 'Full Length' },
          { value: 'monthly', label: 'Monthly' }
        ]
      });
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const fetchBranches = async (instituteId) => {
    try {
      const branchesRes = await commonService.getBranches({ page: 1, limit: 100, instituteId });
      setFilterData(prev => ({ ...prev, branches: branchesRes.data?.data || [] }));
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchBatches = async (instituteId, branchId) => {
    try {
      const params = { page: 1, limit: 100 };
      if (instituteId) params.instituteId = instituteId;
      if (branchId) params.branchIds = branchId;

      const batchesRes = await commonService.getBatches(params);
      setFilterData(prev => ({ ...prev, batches: batchesRes.data?.data || [] }));
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchTestsWithFilters = async (currentFilters, page, pageSize) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const params = {
        skip,
        limit: pageSize,
        ...(currentFilters.searchText && { search: currentFilters.searchText }),
        ...(currentFilters.institute && { instituteId: currentFilters.institute }),
        ...(currentFilters.branch && { branchId: currentFilters.branch }),
        ...(currentFilters.batches?.length && { batchIds: currentFilters.batches.join(',') }),
        ...(currentFilters.category && { category: currentFilters.category })
      };

      const response = await assessmentService.getInstituteTests(params);
      setTests(response.data?.data || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data?.total || 0
      });
    } catch (error) {
      message.error('Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = (page, pageSize) => {
    fetchTestsWithFilters(filters, page, pageSize);
  };

  const handleTableChange = (newPagination) => {
    fetchTests(newPagination.current, newPagination.pageSize);
  };

  const handleSearch = (value) => {
    const newFilters = { ...filters, searchText: value };
    setFilters(newFilters);
    setPagination({ ...pagination, current: 1 });
    fetchTestsWithFilters(newFilters, 1, pagination.pageSize);
  };

  const handleFilterChange = (key, value) => {
    let newFilters = { ...filters, [key]: value };

    // Reset dependent filters
    if (key === 'institute') {
      newFilters.branch = null;
      newFilters.batches = [];
    } else if (key === 'branch') {
      newFilters.batches = [];
    }

    setFilters(newFilters);
    setPagination({ ...pagination, current: 1 });
    fetchTestsWithFilters(newFilters, 1, pagination.pageSize);
  };

  const handleResetFilters = () => {
    const resetFilters = { searchText: '', category: null, institute: null, branch: null, batches: [] };
    setFilters(resetFilters);
    setPagination({ ...pagination, current: 1 });
    fetchTestsWithFilters(resetFilters, 1, pagination.pageSize);
  };

  const handleCreate = () => {
    setEditingTest(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTest(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await assessmentService.deleteInstituteTest({ test_id: id });
      message.success('Test deleted successfully');
      fetchTests(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete test');
    }
  };

  const handleDuplicate = async (record) => {
    try {
      await assessmentService.duplicateTest({ test_id: record._id });
      message.success('Test duplicated successfully');
      fetchTests(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to duplicate test');
    }
  };

  const handleModalSuccess = () => {
    fetchTests(pagination.current, pagination.pageSize);
  };

  const columns = [
    { title: 'Test Name', dataIndex: 'institute_test_name', key: 'institute_test_name', width: 250 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
    { title: 'Duration', dataIndex: 'test_duration', key: 'test_duration', width: 100, render: (val) => `${val} min` },
    { title: 'Marks', dataIndex: 'total_marks', key: 'total_marks', width: 80 },
    { title: 'Start Time', dataIndex: 'test_start_time', key: 'test_start_time', width: 150, render: (val) => val ? dayjs(val).format('DD/MM/YY HH:mm') : '-' },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Button icon={<CopyOutlined />} onClick={() => handleDuplicate(record)} size="small" />
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <TestFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={filterData.categories}
        selectedInstitute={filters.institute}
        selectedBranch={filters.branch}
        selectedBatches={filters.batches}
        loading={loading}
      />

      <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ marginBottom: 16 }}>
        Create Test
      </Button>

      <Table
        dataSource={tests}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} tests`
        }}
        onChange={handleTableChange}
      />

      <CreateTestModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleModalSuccess}
        editingTest={editingTest}
      />
    </>
  );
};

export default TestManagement;
