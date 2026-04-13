import React, { useEffect, useState, useCallback } from 'react';
import { Table, Card, Button, message, Row, Col, Input, Select, Typography, Empty, Tag, Descriptions, Modal } from 'antd';
import { DownloadOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import { TestSelect, InstituteSelect, BranchSelect } from '../../components/dropdowns';
import MathRenderer from '../../components/MathRenderer';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const Results = () => {
  const [preFilterInstituteId, setPreFilterInstituteId] = useState(null); // For SuperAdmin to filter tests
  const [selectedTest, setSelectedTest] = useState(null);
  const [testCategory, setTestCategory] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({
    studentName: '',
    instituteId: null,
    branchId: null
  });
  const [questionModal, setQuestionModal] = useState({
    visible: false,
    question: null
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Get current user role
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  // Determine which filters to show based on role
  const showInstituteFilter = userRole === 'superadmin';
  const showBranchFilter = userRole === 'superadmin' || userRole === 'instituteadmin';

  const fetchSubmissions = useCallback(async (page = 1, pageSize = 10) => {
    if (!selectedTest) return;
    
    setLoading(true);
    try {
      const params = {
        testId: selectedTest,
        page,
        limit: pageSize
      };

      if (filters.studentName) {
        params.search = filters.studentName;
      }
      if (filters.instituteId) {
        params.instituteId = filters.instituteId;
      }
      if (filters.branchId) {
        params.branchId = filters.branchId;
      }

      const response = await assessmentService.getSubmittedTestScore(params);
      const data = response.data?.data || [];
      console.log('Fetched submissions:', data);
      console.log('First record testDetails:', data[0]?.testDetails);
      setSubmissions(data);
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
  }, [selectedTest, filters]);

  useEffect(() => {
    if (selectedTest) {
      fetchSubmissions(1, 10);
    }
  }, [selectedTest, filters, fetchSubmissions]);

  const handleSearch = (value) => {
    setFilters({ ...filters, studentName: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleInstituteChange = (value) => {
    setFilters({ ...filters, instituteId: value, branchId: null });
    setPagination({ ...pagination, current: 1 });
  };

  const handleBranchChange = (value) => {
    setFilters({ ...filters, branchId: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (newPagination) => {
    fetchSubmissions(newPagination.current, newPagination.pageSize);
  };

  const handleDownload = async () => {
    try {
      const response = await assessmentService.getTestScoreInExcel({ testId: selectedTest });
      
      // Debug: Log the full response to see its structure
      console.log('Full response:', response);
      console.log('response.data:', response.data);
      console.log('response.data.data:', response.data?.data);
      
      // The API returns a filePath URL, not the file data
      const fileUrl = response.data?.data?.filePath || response.data?.filePath;
      
      if (!fileUrl) {
        console.error('File URL not found. Response structure:', response);
        throw new Error('File URL not found in response');
      }

      // Download from the S3 URL
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `results-${selectedTest}.xlsx`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Download started successfully');
    } catch (error) {
      console.error('Error downloading:', error);
      message.error('Download failed');
    }
  };

  const showQuestionModal = (question) => {
    setQuestionModal({
      visible: true,
      question: question
    });
  };

  const closeQuestionModal = () => {
    setQuestionModal({
      visible: false,
      question: null
    });
  };

  const renderQuestionContent = (question) => {
    if (!question) return null;

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>Question:</div>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #d9d9d9'
            }}
          >
            <MathRenderer content={question.question?.text || 'No question text available'} />
          </div>
        </div>

        {question.options && question.options.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>Options:</div>
            {question.options.map((option, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  marginBottom: '8px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px'
                }}
              >
                <span style={{ fontWeight: 500, marginRight: '8px' }}>Option {option.v}:</span>
                <MathRenderer content={option.d?.text || '-'} />
              </div>
            ))}
          </div>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>Student Answer:</div>
              <div style={{
                padding: '12px',
                backgroundColor: question.isCorrect ? '#f6ffed' : '#fff2e8',
                border: `1px solid ${question.isCorrect ? '#b7eb8f' : '#ffbb96'}`,
                borderRadius: '4px'
              }}>
                {question.answer ? (
                  typeof question.answer === 'object' ? JSON.stringify(question.answer) : String(question.answer)
                ) : (
                  <span style={{ color: '#8c8c8c' }}>Not answered</span>
                )}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>Correct Answer:</div>
              <div style={{
                padding: '12px',
                backgroundColor: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '4px'
              }}>
                {question.correctAnswer ? (
                  typeof question.correctAnswer === 'object' ? JSON.stringify(question.correctAnswer) : String(question.correctAnswer)
                ) : '-'}
              </div>
            </div>
          </Col>
        </Row>

        {question.solution?.text && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>Solution:</div>
            <div
              style={{
                padding: '12px',
                backgroundColor: '#f0f5ff',
                border: '1px solid #adc6ff',
                borderRadius: '4px'
              }}
            >
              <MathRenderer content={question.solution.text} />
            </div>
          </div>
        )}

        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="Status">
            {question.skipped ? (
              <Tag icon={<MinusCircleOutlined />} color="default">Skipped</Tag>
            ) : question.isCorrect ? (
              <Tag icon={<CheckCircleOutlined />} color="success">Correct</Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">Incorrect</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Marks">{question.mark || 0}</Descriptions.Item>
          <Descriptions.Item label="Time Taken">{question.timeTakenForQuestion ? `${question.timeTakenForQuestion.toFixed(1)} sec` : '-'}</Descriptions.Item>
          <Descriptions.Item label="Type">
            <Tag color="blue">{question.type || 'N/A'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  const renderQuestionDetails = (record) => {
    if (!record.testDetails?.subjectDetails) {
      return <Empty description="No question details available" />;
    }

    return (
      <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
        {record.testDetails.subjectDetails.map((subject, subIdx) => (
          <Card
            key={subIdx}
            title={
              <span style={{ fontSize: '15px', fontWeight: 600 }}>
                {subject.subjectName}
              </span>
            }
            style={{ marginBottom: '16px' }}
            size="small"
          >
            <Descriptions size="small" column={4} style={{ marginBottom: '12px' }}>
              <Descriptions.Item label="Total Questions">{subject.totalQuestions || 0}</Descriptions.Item>
              <Descriptions.Item label="Scored Marks">{subject.scoredMarks || 0}/{subject.totalMarks || 0}</Descriptions.Item>
              <Descriptions.Item label="Correct">{subject.correctAnswers || 0}</Descriptions.Item>
              <Descriptions.Item label="Incorrect">{subject.incorrectAnswers || 0}</Descriptions.Item>
            </Descriptions>

            {subject.sections?.map((section, secIdx) => (
              <div key={secIdx} style={{ marginBottom: '16px' }}>
                <div style={{
                  backgroundColor: '#e6f7ff',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  fontWeight: 500
                }}>
                  {section.sectionName}
                </div>

                <Table
                  dataSource={section.questionsList || []}
                  pagination={false}
                  size="small"
                  rowKey={(q, idx) => `${subIdx}-${secIdx}-${idx}`}
                  columns={[
                    {
                      title: 'Q#',
                      key: 'index',
                      width: 50,
                      render: (_, __, idx) => idx + 1
                    },
                    {
                      title: 'Type',
                      dataIndex: 'type',
                      key: 'type',
                      width: 120,
                      render: (type) => (
                        <Tag color="blue" style={{ fontSize: '11px' }}>
                          {type || 'N/A'}
                        </Tag>
                      )
                    },
                    {
                      title: 'Status',
                      key: 'status',
                      width: 100,
                      render: (_, q) => {
                        if (q.skipped) {
                          return <Tag icon={<MinusCircleOutlined />} color="default">Skipped</Tag>;
                        }
                        if (q.isCorrect) {
                          return <Tag icon={<CheckCircleOutlined />} color="success">Correct</Tag>;
                        }
                        return <Tag icon={<CloseCircleOutlined />} color="error">Incorrect</Tag>;
                      }
                    },
                    {
                      title: 'Marks',
                      dataIndex: 'mark',
                      key: 'mark',
                      width: 80,
                      render: (mark) => mark || 0
                    },
                    {
                      title: 'Time (sec)',
                      dataIndex: 'timeTakenForQuestion',
                      key: 'timeTakenForQuestion',
                      width: 100,
                      render: (time) => time ? time.toFixed(1) : '-'
                    },
                    {
                      title: 'Student Answer',
                      dataIndex: 'answer',
                      key: 'answer',
                      width: 120,
                      ellipsis: true,
                      render: (answer) => {
                        if (!answer) return '-';
                        if (typeof answer === 'object') {
                          return JSON.stringify(answer);
                        }
                        return String(answer);
                      }
                    },
                    {
                      title: 'Correct Answer',
                      dataIndex: 'correctAnswer',
                      key: 'correctAnswer',
                      width: 120,
                      ellipsis: true,
                      render: (correctAnswer) => {
                        if (!correctAnswer) return '-';
                        if (typeof correctAnswer === 'object') {
                          return JSON.stringify(correctAnswer);
                        }
                        return String(correctAnswer);
                      }
                    },
                    {
                      title: 'Action',
                      key: 'action',
                      width: 100,
                      fixed: 'right',
                      render: (_, question) => (
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => showQuestionModal(question)}
                          size="small"
                        >
                          Details
                        </Button>
                      )
                    }
                  ]}
                />
              </div>
            ))}
          </Card>
        ))}
      </div>
    );
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text, record) => record.firstName || record.studentName || '-'
    },
    {
      title: 'Batch',
      dataIndex: 'batchName',
      key: 'batchName',
      render: (text) => text || '-'
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      render: (text) => text || '-'
    },
    {
      title: 'Scored Marks',
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
      title: 'Correct',
      dataIndex: 'totalCorrectAnswers',
      key: 'totalCorrectAnswers',
      render: (text) => text || 0
    },
    {
      title: 'Incorrect',
      dataIndex: 'totalIncorrectAnswers',
      key: 'totalIncorrectAnswers',
      render: (text) => text || 0
    },
    {
      title: 'Skipped',
      dataIndex: 'totalSkippedAnswers',
      key: 'totalSkippedAnswers',
      render: (text) => text || 0
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedOn',
      key: 'submittedOn',
      render: (text, record) => {
        const date = text || record.submittedAt;
        return date ? new Date(date).toLocaleString() : '-';
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        const rowKey = record.submitTestId || record._id || record.studentId;
        const isExpanded = expandedRowKeys.includes(rowKey);

        return (
          <Button
            type="text"
            size="middle"
            icon={isExpanded ? <MinusCircleOutlined style={{ fontSize: '18px' }} /> : <EyeOutlined style={{ fontSize: '18px' }} />}
            onClick={() => {
              if (isExpanded) {
                setExpandedRowKeys(expandedRowKeys.filter(key => key !== rowKey));
              } else {
                setExpandedRowKeys([...expandedRowKeys, rowKey]);
              }
            }}
            style={{ 
              color: isExpanded ? '#ff4d4f' : '#1890ff',
              padding: '4px 8px'
            }}
          />
        );
      }
    }
  ];

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>Test Results</Title>
        <p style={{ color: '#8c8c8c', margin: '4px 0 0 0' }}>View detailed test submissions and student performance</p>
      </div>

      <Card style={{
        marginBottom: 24,
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
      }}>
        <Row gutter={[16, 16]}>
          {userRole === 'superadmin' && (
            <Col xs={24} sm={12} md={6}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#262626'
                }}>
                  Institute
                </label>
                <InstituteSelect
                  value={preFilterInstituteId}
                  onChange={(value) => {
                    setPreFilterInstituteId(value);
                    setSelectedTest(null); // Reset test when institute changes
                  }}
                  style={{ width: '100%' }}
                  placeholder="Select institute"
                  allowClear
                />
              </div>
            </Col>
          )}
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: '#262626'
              }}>
                Category
              </label>
              <Select
                value={testCategory}
                onChange={setTestCategory}
                style={{ width: '100%' }}
                placeholder="All categories"
                allowClear
                size="large"
              >
                <Option value="fullLength">Full Length</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="chapterWise">Chapter Wise</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: '#262626'
              }}>
                Test
              </label>
              <TestSelect
                placeholder="Select a test"
                value={selectedTest}
                onChange={setSelectedTest}
                category={testCategory}
                instituteId={preFilterInstituteId}
              />
            </div>
          </Col>
          {selectedTest && (
            <>
              <Col xs={24} sm={12} md={showInstituteFilter && showBranchFilter ? 4 : showInstituteFilter || showBranchFilter ? 6 : 12}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#262626'
                  }}>
                    Search Student
                  </label>
                  <Search
                    placeholder="Search by student name"
                    allowClear
                    onSearch={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </div>
              </Col>
              {showInstituteFilter && (
                <Col xs={24} sm={12} md={4}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#262626'
                    }}>
                      Institute
                    </label>
                    <InstituteSelect
                      value={filters.instituteId}
                      onChange={handleInstituteChange}
                      placeholder="Filter by institute"
                    />
                  </div>
                </Col>
              )}
              {showBranchFilter && (
                <Col xs={24} sm={12} md={4}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#262626'
                    }}>
                      Branch
                    </label>
                    <BranchSelect
                      value={filters.branchId}
                      onChange={handleBranchChange}
                      instituteId={filters.instituteId}
                      placeholder="Filter by branch"
                    />
                  </div>
                </Col>
              )}
            </>
          )}
        </Row>
      </Card>

      {selectedTest && submissions.length === 0 && !loading && (
        <Card style={{
          marginTop: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
        }}>
          <Empty
            description={
              <span style={{ color: '#8c8c8c', fontSize: '14px' }}>
                No results found for the selected test and filters
              </span>
            }
            style={{ padding: '80px 0' }}
          />
        </Card>
      )}

      {selectedTest && submissions.length > 0 && (
        <Card
          title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#262626' }}>Test Results</span>}
          extra={
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              type="primary"
              size="large"
              style={{
                borderRadius: '6px',
                fontWeight: 500
              }}
            >
              Download Excel
            </Button>
          }
          style={{
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
          }}
        >
          <Table
            dataSource={submissions}
            columns={columns}
            rowKey={(record) => record.submitTestId || record._id || record.studentId || Math.random()}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} submissions`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            expandable={{
              expandedRowRender: renderQuestionDetails,
              expandedRowKeys: expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys(keys),
              showExpandColumn: false,
              rowExpandable: (record) => {
                const hasDetails = record.testDetails?.subjectDetails?.length > 0;
                return hasDetails;
              }
            }}
          />
        </Card>
      )}

      <Modal
        title={
          <div style={{ fontSize: '16px', fontWeight: 600 }}>
            Question Details
          </div>
        }
        open={questionModal.visible}
        onCancel={closeQuestionModal}
        footer={[
          <Button key="close" onClick={closeQuestionModal}>
            Close
          </Button>
        ]}
        width={800}
      >
        {renderQuestionContent(questionModal.question)}
      </Modal>
    </div>
  );
};

export default Results;
