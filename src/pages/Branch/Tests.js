import React, { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { assessmentService } from '../../services/assessmentService';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchTests(pagination.current, pagination.pageSize);
  }, []);

  const fetchTests = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const response = await assessmentService.getInstituteTests({ skip, limit: pageSize });
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

  const handleTableChange = (newPagination) => {
    fetchTests(newPagination.current, newPagination.pageSize);
  };

  const columns = [
    { title: 'Test Name', dataIndex: 'institute_test_name', key: 'institute_test_name' },
    { title: 'Duration', dataIndex: 'test_duration', key: 'test_duration', render: (val) => `${val} min` },
    { title: 'Total Marks', dataIndex: 'total_marks', key: 'total_marks' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'assigned' ? 'green' : 'default'}>{status}</Tag> },
    { title: 'Start Date', dataIndex: 'test_start_time', key: 'test_start_time', render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '-' },
    { title: 'End Date', dataIndex: 'test_end_time', key: 'test_end_time', render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '-' }
  ];

  return (
    <Table 
      dataSource={tests} 
      columns={columns} 
      rowKey="_id" 
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} tests`
      }}
      onChange={handleTableChange}
    />
  );
};

export default Tests;
