import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { assessmentService } from '../../services/assessmentService';
import { TestSelect } from '../../components/dropdowns';

const Analytics = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    if (selectedTest) {
      fetchAnalytics();
      fetchSubmissions(1, 10);
    }
  }, [selectedTest]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getTestAnalytics({ testId: selectedTest }); // Changed from test_id to testId
      setAnalytics(response.data?.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      message.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await assessmentService.getSubmittedTestScore({
        testId: selectedTest, // Changed from test_id to testId
        page, // Changed from skip/limit to page/limit
        limit: pageSize
      });
      setSubmissions(response.data?.data || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data?.total || 0
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      message.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    fetchSubmissions(newPagination.current, newPagination.pageSize);
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await assessmentService.getTestScoreInExcel({ testId: selectedTest });

      // The API returns a filePath URL, not the file data
      const fileUrl = response.data?.data?.filePath;

      if (!fileUrl) {
        throw new Error('File URL not found in response');
      }

      // Download from the S3 URL
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `test-scores-${selectedTest}.xlsx`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success('Excel downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      message.error('Failed to download Excel');
    }
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text, record) => record.firstName || record.studentName || '-'
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      render: (text) => text || '-'
    },
    {
      title: 'Batch',
      dataIndex: 'batchName',
      key: 'batchName',
      render: (text) => text || '-'
    },
    {
      title: 'Score',
      dataIndex: 'totalScoredMarks',
      key: 'totalScoredMarks',
      render: (text, record) => text || record.score || 0
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalTestMarks',
      key: 'totalTestMarks',
      render: (text, record) => text || record.totalMarks || 0
    },
    {
      title: 'Percentage',
      dataIndex: 'percentageScore',
      key: 'percentageScore',
      render: (val, record) => {
        const percentage = val || record.percentage || 0;
        return `${percentage.toFixed(2)}%`;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => text || 'Completed'
    }
  ];

  const chartData = analytics?.scoreDistribution || [];

  return (
    <>
      <Card title="Select Test" style={{ marginBottom: 24 }}>
        <TestSelect
          placeholder="Select a test"
          value={selectedTest}
          onChange={setSelectedTest}
        />
      </Card>

      {selectedTest && analytics && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Score Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Submission Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.submissionTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="submissions" stroke="#52c41a" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card title="Student Scores" style={{ marginTop: 24 }} extra={<Button icon={<DownloadOutlined />} onClick={handleDownloadExcel}>Download Excel</Button>}>
            <Table
              dataSource={submissions}
              columns={columns}
              rowKey={(record) => record._id || record.studentId || Math.random()}
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} submissions`
              }}
              onChange={handleTableChange}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default Analytics;
