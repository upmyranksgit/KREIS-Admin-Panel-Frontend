import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag } from 'antd';
import { PlusOutlined, EyeOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { assessmentService } from '../../services/assessmentService';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  const fetchTests = useCallback(async (page = 1, pageSize = 10) => {
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
  }, []);

  useEffect(() => {
    fetchTests(pagination.current, pagination.pageSize);
  }, [fetchTests, pagination.current, pagination.pageSize]);

  const handleTableChange = (newPagination) => {
    fetchTests(newPagination.current, newPagination.pageSize);
  };

  const handleAssignBatch = (test) => {
    setSelectedTest(test);
    setBatchModalVisible(true);
  };

  const handleBatchSubmit = async (values) => {
    try {
      await assessmentService.addInstituteBatchToTest({ test_id: selectedTest._id, ...values });
      message.success('Batch assigned successfully');
      setBatchModalVisible(false);
      fetchTests(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to assign batch');
    }
  };

  const columns = [
    { title: 'Test Name', dataIndex: 'institute_test_name', key: 'institute_test_name' },
    { title: 'Duration', dataIndex: 'test_duration', key: 'test_duration', render: (val) => `${val} min` },
    { title: 'Total Marks', dataIndex: 'total_marks', key: 'total_marks' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'assigned' ? 'green' : 'default'}>{status}</Tag> },
    { title: 'Start Time', dataIndex: 'test_start_time', key: 'test_start_time', render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '-' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<TeamOutlined />} onClick={() => handleAssignBatch(record)} size="small">Assign Batch</Button>
          <Button icon={<EyeOutlined />} size="small">View Details</Button>
        </Space>
      )
    }
  ];

  return (
    <>
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

      <Modal title="Assign Batch to Test" open={batchModalVisible} onCancel={() => setBatchModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleBatchSubmit}>
          <Form.Item name="batch_id" label="Select Batch" rules={[{ required: true }]}>
            <Select placeholder="Select batch">
              <Select.Option value="batch1">Batch 1</Select.Option>
              <Select.Option value="batch2">Batch 2</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TestManagement;
