import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Button, message, Input, Select, Space, Dropdown, Modal, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, MoreOutlined, ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import { setTestsLoading, setTests, setTestDetails } from '../../store/slices/assessmentSlice';
import moment from 'moment';

const { Search } = Input;
const { confirm } = Modal;

const Tests = () => {
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

  const { tests, testsLoading, testsTotal } = useSelector(state => state.assessment);
  
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({
    searchKey: '',
    gradeId: null,
    isAssigned: undefined
  });

  const fetchTests = useCallback(async (page = 1, pageSize = 10) => {
    dispatch(setTestsLoading(true));
    try {
      const params = {
        skip: (page - 1) * pageSize,
        limit: pageSize,
        withoutPattern: false,
        show_only_user_created_tests: false
      };

      if (filters.searchKey) {
        params.searchKey = filters.searchKey;
      }
      if (filters.gradeId) {
        params.course_id = filters.gradeId;
      }
      if (filters.isAssigned !== undefined) {
        params.isAssigned = filters.isAssigned;
      }

      const response = await assessmentService.getInstituteTests(params);
      dispatch(setTests({
        data: response.data?.data || [],
        total: response.data?.total || 0
      }));
      setPagination({ current: page, pageSize });
    } catch (error) {
      console.error('Error fetching tests:', error);
      message.error('Failed to fetch tests');
    } finally {
      dispatch(setTestsLoading(false));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchTests(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleTableChange = (newPagination) => {
    fetchTests(newPagination.current, newPagination.pageSize);
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, searchKey: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this test?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await assessmentService.deleteInstituteTest({ test_id: id });
          message.success('Test deleted successfully');
          fetchTests(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('Failed to delete test');
        }
      }
    });
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

  const handleEdit = (record) => {
    dispatch(setTestDetails({
      isEdit: true,
      withoutPattern: record.withoutPattern || false
    }));
    navigate(`${basePath}/tests/edit/${record._id}/${record.course_id}`);
  };

  const getActionItems = (record) => {
    const items = [
      {
        key: 'view',
        label: 'View',
        icon: <EyeOutlined />,
        onClick: () => navigate(`${basePath}/tests/view/${record._id}/${record.course_id}`)
      }
    ];

    if (userRole !== 'teacher') {
      items.push(
        {
          key: 'edit',
          label: 'Edit',
          icon: <EditOutlined />,
          onClick: () => handleEdit(record)
        },
        {
          key: 'duplicate',
          label: 'Duplicate',
          icon: <CopyOutlined />,
          onClick: () => handleDuplicate(record)
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: () => handleDelete(record._id)
        }
      );
    }

    return items;
  };

  const getStatusTag = (record) => {
    const now = new Date();
    const startTime = record.test_start_time ? new Date(record.test_start_time) : null;
    const endTime = record.test_end_time ? new Date(record.test_end_time) : null;

    if (!startTime || !endTime) {
      return <Tag color="default">Created</Tag>;
    }

    if (now < startTime) {
      return <Tag color="blue">Scheduled</Tag>;
    } else if (now >= startTime && now <= endTime) {
      return <Tag color="green">Ongoing</Tag>;
    } else {
      return <Tag color="orange">Completed</Tag>;
    }
  };

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'institute_test_name',
      key: 'testName',
      width: 220,
      fixed: 'left',
      render: (text) => (
        <div style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
          {text}
        </div>
      )
    },
    {
      title: 'Pattern',
      dataIndex: 'test_pattern_details',
      key: 'pattern',
      width: 180,
      render: (pattern) => (
        <div style={{ fontSize: '13px', color: 'var(--color-neutral-700)' }}>
          {pattern?.name || 'No Pattern'}
        </div>
      )
    },
    {
      title: 'Subjects',
      dataIndex: 'test_details',
      key: 'subjects',
      width: 200,
      ellipsis: true,
      render: (testDetails) => {
        const subjects = testDetails?.subjects_details || [];
        return (
          <div style={{ fontSize: '13px', color: 'var(--color-neutral-700)' }}>
            {subjects.map(s => s.subject_name).join(', ') || '-'}
          </div>
        );
      }
    },
    {
      title: 'Duration',
      dataIndex: 'test_duration',
      key: 'duration',
      width: 100,
      align: 'center',
      render: (duration) => (
        <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
          {duration} min
        </span>
      )
    },
    {
      title: 'Total Marks',
      dataIndex: 'total_marks',
      key: 'totalMarks',
      width: 110,
      align: 'center',
      render: (marks) => (
        <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
          {marks}
        </span>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record)
    },
    {
      title: 'Start Time',
      dataIndex: 'test_start_time',
      key: 'startTime',
      width: 160,
      render: (date) => {
        if (!date) return '-';
        return (
          <div>
            <div style={{ fontSize: '14px', color: 'var(--color-neutral-800)' }}>
              {moment(date).format('MMM DD, YYYY')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              {moment(date).format('hh:mm A')}
            </div>
          </div>
        );
      }
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
              All Assessments
            </h1>
            <p style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--color-neutral-500)',
              margin: 0
            }}>
              Create, manage, and assign tests to students
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate(`${basePath}/tests/create`)}
            style={{
              borderRadius: '8px',
              height: '44px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
            }}
          >
            Create Test
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
              placeholder="Search tests..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ width: 400 }}
            />
            <Select
              placeholder="Filter by Status"
              allowClear
              size="large"
              style={{ width: 200 }}
              onChange={(value) => setFilters({ ...filters, isAssigned: value })}
              options={[
                { label: 'All Tests', value: undefined },
                { label: 'Assigned', value: true },
                { label: 'Unassigned', value: false }
              ]}
            />
          </div>

          <Table
            columns={columns}
            dataSource={tests}
            rowKey="_id"
            loading={testsLoading}
            pagination={{
              ...pagination,
              total: testsTotal,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} tests`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            onChange={handleTableChange}
            scroll={{ x: 1400 }}
            style={{ marginTop: 'var(--spacing-base)' }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default Tests;
