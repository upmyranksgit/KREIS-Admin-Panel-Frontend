import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Button, message, Input, Select, Space, Tag, Modal, Dropdown } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileAddOutlined, SearchOutlined, MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import { setPatternsLoading, setPatterns } from '../../store/slices/assessmentSlice';
import moment from 'moment';

const { Search } = Input;
const { confirm } = Modal;

const TestPatterns = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  const roleConfig = {
    superadmin: '/superadmin',
    instituteadmin: '/institute',
    branchadmin: '/branch',
    teacher: '/institute',
    student: '/branch'
  };
  const basePath = roleConfig[userRole] || '/institute';

  const { patterns, patternsLoading, patternsTotal } = useSelector(state => state.assessment);
  
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({
    searchKey: '',
    gradeId: null
  });

  const fetchPatterns = useCallback(async (page = 1, pageSize = 10) => {
    dispatch(setPatternsLoading(true));
    try {
      const params = {
        skip: (page - 1) * pageSize,
        limit: pageSize
      };

      if (filters.searchKey) {
        params.searchKey = filters.searchKey;
      }
      if (filters.gradeId) {
        params.course_id = filters.gradeId;
      }

      const response = await assessmentService.getTestPatterns(params);
      dispatch(setPatterns({
        data: response.data?.data || [],
        total: response.data?.total || 0
      }));
      setPagination({ current: page, pageSize });
    } catch (error) {
      console.error('Error fetching patterns:', error);
      message.error('Failed to fetch test patterns');
    } finally {
      dispatch(setPatternsLoading(false));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchPatterns(pagination.current, pagination.pageSize);
  }, [filters]);

  const handleTableChange = (newPagination) => {
    fetchPatterns(newPagination.current, newPagination.pageSize);
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, searchKey: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this pattern?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await assessmentService.deleteTestPattern({ test_id: id });
          message.success('Pattern deleted successfully');
          fetchPatterns(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('Failed to delete pattern');
        }
      }
    });
  };

  const getActionItems = (record) => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => navigate(`${basePath}/test-patterns/edit/${record._id}`)
    },
    {
      key: 'create-test',
      label: 'Create Test',
      icon: <FileAddOutlined />,
      onClick: () => navigate(`${basePath}/tests/create?patternId=${record._id}`)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(record._id)
    }
  ];

  const columns = [
    {
      title: 'Pattern Name',
      dataIndex: 'test_name',
      key: 'test_name',
      width: 200,
      fixed: 'left',
      render: (text) => (
        <div style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
          {text}
        </div>
      )
    },
    {
      title: 'Grade',
      dataIndex: 'course_details',
      key: 'grade',
      width: 120,
      render: (courseDetails) => (
        <Tag color="blue" style={{ borderRadius: '6px', fontSize: '13px' }}>
          {courseDetails?.course_name || '-'}
        </Tag>
      )
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects_details',
      key: 'subjects',
      width: 250,
      ellipsis: true,
      render: (subjects) => (
        <div style={{ fontSize: '13px', color: 'var(--color-neutral-700)' }}>
          {subjects?.map(s => s.subject_name).join(', ') || '-'}
        </div>
      )
    },
    {
      title: 'Duration (min)',
      dataIndex: 'test_duration',
      key: 'duration',
      width: 120,
      align: 'center',
      render: (duration) => (
        <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
          {duration}
        </span>
      )
    },
    {
      title: 'Total Marks',
      dataIndex: 'total_marks',
      key: 'totalMarks',
      width: 120,
      align: 'center',
      render: (marks) => (
        <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
          {marks}
        </span>
      )
    },
    {
      title: 'Total Questions',
      dataIndex: 'total_questions',
      key: 'totalQuestions',
      width: 140,
      align: 'center',
      render: (questions) => (
        <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
          {questions}
        </span>
      )
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <div>
          <div style={{ fontSize: '14px', color: 'var(--color-neutral-800)' }}>
            {moment(date).format('MMM DD, YYYY')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            {moment(date).format('hh:mm A')}
          </div>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionItems(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{ color: 'var(--color-neutral-600)' }}
          />
        </Dropdown>
      )
    }
  ];

  return (
    <div style={{ background: 'var(--color-neutral-50)', minHeight: 'calc(100vh - 64px)', padding: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-base)' }}>
          <div>
            <h1 style={{
              fontSize: 'var(--font-size-4xl)',
              fontWeight: 700,
              color: 'var(--color-neutral-800)',
              margin: 0,
              marginBottom: 'var(--spacing-sm)'
            }}>
              Test Patterns
            </h1>
            <p style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--color-neutral-500)',
              margin: 0
            }}>
              Create and manage test patterns/templates for assessments
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate(`${basePath}/test-patterns/create`)}
            style={{
              borderRadius: '8px',
              height: '44px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
            }}
          >
            Create Pattern
          </Button>
        </div>
      </div>

      <Card
        style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-base)',
          border: '1px solid var(--color-neutral-200)'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-base)', flexWrap: 'wrap' }}>
            <Search
              placeholder="Search patterns..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ width: 400 }}
            />
          </div>

          <Table
            columns={columns}
            dataSource={patterns}
            rowKey="_id"
            loading={patternsLoading}
            pagination={{
              ...pagination,
              total: patternsTotal,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} patterns`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            style={{ marginTop: 'var(--spacing-base)' }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default TestPatterns;
