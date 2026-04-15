import React, { useEffect, useState, useCallback } from 'react';
import { Table, Card, Button, message, Row, Col, Input, Select, Empty, Tag, Modal, Space } from 'antd';
import { DownloadOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import { TestSelect, InstituteSelect, BranchSelect } from '../../components/dropdowns';
import MathRenderer from '../../components/MathRenderer';

const { Search } = Input;
const { Option } = Select;

const Results = () => {
  const [preFilterInstituteId, setPreFilterInstituteId] = useState(null);
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

  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  const showInstituteFilter = userRole === 'superadmin';
  const showBranchFilter = userRole === 'superadmin' || userRole === 'instituteadmin';

  // Reset test when category changes
  useEffect(() => {
    setSelectedTest(null);
  }, [testCategory]);

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

      message.success('Downloaded successfully');
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
      <div style={{ padding: 'var(--spacing-base)' }}>
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{
            fontWeight: 600,
            marginBottom: 'var(--spacing-md)',
            fontSize: '15px',
            color: 'var(--color-neutral-700)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Question
          </div>
          <div
            style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-neutral-50)',
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-neutral-200)',
              fontSize: '15px',
              lineHeight: '1.6'
            }}
          >
            <MathRenderer content={question.question?.text || 'No question text available'} />
          </div>
        </div>

        {question.options && question.options.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{
              fontWeight: 600,
              marginBottom: 'var(--spacing-md)',
              fontSize: '15px',
              color: 'var(--color-neutral-700)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Options
            </div>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fff',
                    border: '1px solid var(--color-neutral-200)',
                    borderRadius: 'var(--radius-base)',
                    transition: 'all 0.2s',
                    cursor: 'default'
                  }}
                >
                  <span style={{
                    fontWeight: 600,
                    marginRight: 'var(--spacing-md)',
                    color: 'var(--color-primary)',
                    fontSize: '14px'
                  }}>
                    {option.v}.
                  </span>
                  <MathRenderer content={option.d?.text || '-'} />
                </div>
              ))}
            </div>
          </div>
        )}

        <Row gutter={16} style={{ marginBottom: 'var(--spacing-xl)' }}>
          <Col span={12}>
            <div style={{
              fontWeight: 600,
              marginBottom: 'var(--spacing-md)',
              fontSize: '15px',
              color: 'var(--color-neutral-700)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Student Answer
            </div>
            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: question.isCorrect ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
              border: `2px solid ${question.isCorrect ? 'var(--color-success)' : 'var(--color-warning)'}`,
              borderRadius: 'var(--radius-base)',
              fontSize: '15px',
              fontWeight: 500
            }}>
              {question.answer ? (
                typeof question.answer === 'object' ? JSON.stringify(question.answer) : String(question.answer)
              ) : (
                <span style={{ color: 'var(--color-neutral-400)', fontStyle: 'italic' }}>Not answered</span>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div style={{
              fontWeight: 600,
              marginBottom: 'var(--spacing-md)',
              fontSize: '15px',
              color: 'var(--color-neutral-700)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Correct Answer
            </div>
            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-info-bg)',
              border: '2px solid var(--color-info)',
              borderRadius: 'var(--radius-base)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-info)'
            }}>
              {question.correctAnswer ? (
                typeof question.correctAnswer === 'object' ? JSON.stringify(question.correctAnswer) : String(question.correctAnswer)
              ) : '-'}
            </div>
          </Col>
        </Row>

        {question.solution?.text && (
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{
              fontWeight: 600,
              marginBottom: 'var(--spacing-md)',
              fontSize: '15px',
              color: 'var(--color-neutral-700)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Solution
            </div>
            <div
              style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-primary-bg)',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-base)',
                borderLeft: '4px solid var(--color-primary)',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              <MathRenderer content={question.solution.text} />
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--spacing-base)',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-neutral-50)',
          borderRadius: 'var(--radius-base)',
          border: '1px solid var(--color-neutral-200)'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginBottom: '4px' }}>Status</div>
            <div>
              {question.skipped ? (
                <Tag icon={<MinusCircleOutlined />} color="default" style={{ borderRadius: '6px', padding: '6px 12px' }}>
                  Skipped
                </Tag>
              ) : question.isCorrect ? (
                <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: '6px', padding: '6px 12px' }}>
                  Correct
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: '6px', padding: '6px 12px' }}>
                  Incorrect
                </Tag>
              )}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginBottom: '4px' }}>Marks Awarded</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-neutral-800)' }}>
              {question.mark || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginBottom: '4px' }}>Time Taken</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-neutral-800)' }}>
              {question.timeTakenForQuestion ? `${question.timeTakenForQuestion.toFixed(1)}s` : '-'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginBottom: '4px' }}>Question Type</div>
            <div>
              <Tag color="blue" style={{ borderRadius: '6px', padding: '6px 12px', fontSize: '13px' }}>
                {question.type || 'MCQ'}
              </Tag>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionDetails = (record) => {
    if (!record.testDetails?.subjectDetails) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Empty description="No question details available" />
        </div>
      );
    }

    return (
      <div style={{
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--color-neutral-50)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {record.testDetails.subjectDetails.map((subject, subIdx) => (
          <Card
            key={subIdx}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-neutral-800)' }}>
                  📚 {subject.subjectName}
                </span>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-neutral-600)' }}>
                    <strong>{subject.scoredMarks || 0}</strong>/{subject.totalMarks || 0} marks
                  </span>
                  <span style={{ color: 'var(--color-success)' }}>
                    ✓ {subject.correctAnswers || 0}
                  </span>
                  <span style={{ color: 'var(--color-error)' }}>
                    ✗ {subject.incorrectAnswers || 0}
                  </span>
                </div>
              </div>
            }
            style={{
              marginBottom: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-neutral-200)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {subject.sections?.map((section, secIdx) => (
              <div key={secIdx} style={{ marginBottom: secIdx < subject.sections.length - 1 ? 'var(--spacing-lg)' : 0 }}>
                <div style={{
                  backgroundColor: 'var(--color-primary-bg)',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-base)',
                  marginBottom: 'var(--spacing-md)',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-primary)',
                  borderLeft: '4px solid var(--color-primary)'
                }}>
                  {section.sectionName}
                </div>

                <Table
                  dataSource={section.questionsList || []}
                  pagination={false}
                  size="small"
                  rowKey={(q, idx) => `${subIdx}-${secIdx}-${idx}`}
                  rowClassName={(record) => {
                    if (record.skipped) return 'row-skipped';
                    if (record.isCorrect) return 'row-correct';
                    return 'row-incorrect';
                  }}
                  onRow={() => ({
                    style: { cursor: 'default' },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  })}
                  columns={[
                    {
                      title: '#',
                      key: 'index',
                      width: 50,
                      align: 'center',
                      render: (_, __, idx) => (
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-neutral-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '13px',
                          color: 'var(--color-neutral-700)'
                        }}>
                          {idx + 1}
                        </div>
                      )
                    },
                    {
                      title: 'Type',
                      dataIndex: 'type',
                      key: 'type',
                      width: 120,
                      render: (type) => (
                        <Tag
                          color="blue"
                          style={{
                            borderRadius: '6px',
                            fontSize: '12px',
                            border: 'none',
                            padding: '4px 10px'
                          }}
                        >
                          {type || 'MCQ'}
                        </Tag>
                      )
                    },
                    {
                      title: 'Status',
                      key: 'status',
                      width: 120,
                      render: (_, q) => {
                        if (q.skipped) {
                          return (
                            <Tag
                              icon={<MinusCircleOutlined />}
                              color="default"
                              style={{ borderRadius: '6px', padding: '4px 12px', border: 'none' }}
                            >
                              Skipped
                            </Tag>
                          );
                        }
                        if (q.isCorrect) {
                          return (
                            <Tag
                              icon={<CheckCircleOutlined />}
                              color="success"
                              style={{ borderRadius: '6px', padding: '4px 12px', border: 'none' }}
                            >
                              Correct
                            </Tag>
                          );
                        }
                        return (
                          <Tag
                            icon={<CloseCircleOutlined />}
                            color="error"
                            style={{ borderRadius: '6px', padding: '4px 12px', border: 'none' }}
                          >
                            Incorrect
                          </Tag>
                        );
                      }
                    },
                    {
                      title: 'Marks',
                      dataIndex: 'mark',
                      key: 'mark',
                      width: 80,
                      align: 'center',
                      render: (mark) => (
                        <span style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
                          {mark || 0}
                        </span>
                      )
                    },
                    {
                      title: 'Time',
                      dataIndex: 'timeTakenForQuestion',
                      key: 'timeTakenForQuestion',
                      width: 100,
                      align: 'center',
                      render: (time) => (
                        <span style={{
                          fontSize: '13px',
                          color: 'var(--color-neutral-600)',
                          fontFamily: 'monospace'
                        }}>
                          {time ? `${time.toFixed(1)}s` : '-'}
                        </span>
                      )
                    },
                    {
                      title: 'Student Answer',
                      dataIndex: 'answer',
                      key: 'answer',
                      width: 140,
                      ellipsis: true,
                      render: (answer) => {
                        if (!answer) return <span style={{ color: 'var(--color-neutral-400)' }}>-</span>;
                        const displayAnswer = typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
                        return (
                          <span style={{
                            fontSize: '13px',
                            color: 'var(--color-neutral-700)',
                            fontWeight: 500
                          }}>
                            {displayAnswer}
                          </span>
                        );
                      }
                    },
                    {
                      title: 'Correct Answer',
                      dataIndex: 'correctAnswer',
                      key: 'correctAnswer',
                      width: 140,
                      ellipsis: true,
                      render: (correctAnswer) => {
                        if (!correctAnswer) return <span style={{ color: 'var(--color-neutral-400)' }}>-</span>;
                        const displayAnswer = typeof correctAnswer === 'object' ? JSON.stringify(correctAnswer) : String(correctAnswer);
                        return (
                          <span style={{
                            fontSize: '13px',
                            color: 'var(--color-success)',
                            fontWeight: 600
                          }}>
                            {displayAnswer}
                          </span>
                        );
                      }
                    },
                    {
                      title: 'Action',
                      key: 'action',
                      width: 140,
                      fixed: 'right',
                      align: 'center',
                      render: (_, question) => (
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => showQuestionModal(question)}
                          size="small"
                          style={{ fontWeight: 500 }}
                        >
                          View Question
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
      width: 180,
      fixed: 'left',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '16px'
          }}>
            {(record.firstName || record.studentName || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-neutral-800)', fontSize: '14px' }}>
              {record.firstName || record.studentName || '-'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Batch',
      dataIndex: 'batchName',
      key: 'batchName',
      width: 150,
      render: (text) => (
        <Tag color="blue" style={{ borderRadius: '6px', padding: '4px 12px', fontSize: '13px', border: 'none' }}>
          {text || '2024-Elite A'}
        </Tag>
      )
    },
    {
      title: 'Marks',
      key: 'marks',
      width: 120,
      render: (_, record) => {
        const scored = record.totalScoredMarks || record.score || 0;
        const total = record.totalTestMarks || record.totalMarks || 0;
        return (
          <div style={{ fontWeight: 600, color: 'var(--color-neutral-800)' }}>
            {scored}/{total}
          </div>
        );
      }
    },
    {
      title: 'Score %',
      dataIndex: 'percentageScore',
      key: 'percentageScore',
      width: 120,
      render: (val, record) => {
        const percentage = val || record.percentage || 0;
        const color = percentage >= 90 ? '#10b981' : percentage >= 75 ? '#3b82f6' : percentage >= 60 ? '#f59e0b' : '#ef4444';
        const bgColor = percentage >= 90 ? '#d1fae5' : percentage >= 75 ? '#dbeafe' : percentage >= 60 ? '#fef3c7' : '#fee2e2';

        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: bgColor,
            fontWeight: 600,
            fontSize: '14px',
            color: color
          }}>
            {percentage.toFixed(1)}%
          </div>
        );
      }
    },
    {
      title: 'Breakdown',
      key: 'breakdown',
      width: 200,
      render: (_, record) => {
        const correct = record.totalCorrectAnswers || 0;
        const incorrect = record.totalIncorrectAnswers || 0;
        const skipped = record.totalSkippedAnswers || 0;

        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--color-neutral-700)' }}>{correct}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--color-neutral-700)' }}>{incorrect}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--color-neutral-700)' }}>{skipped}</span>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedOn',
      key: 'submittedOn',
      width: 180,
      render: (text, record) => {
        const date = text || record.submittedAt;
        if (!date) return '-';
        const dateObj = new Date(date);
        return (
          <div>
            <div style={{ fontSize: '14px', color: 'var(--color-neutral-800)' }}>
              {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        const rowKey = record.submitTestId || record._id || record.studentId;
        const isExpanded = expandedRowKeys.includes(rowKey);

        return (
          <Button
            type={isExpanded ? 'default' : 'primary'}
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              if (isExpanded) {
                setExpandedRowKeys(expandedRowKeys.filter(key => key !== rowKey));
              } else {
                setExpandedRowKeys([...expandedRowKeys, rowKey]);
              }
            }}
            style={{
              borderRadius: '6px',
              fontWeight: 500
            }}
          >
            {isExpanded ? 'Hide' : 'Details'}
          </Button>
        );
      }
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
              Student Performance Overview
            </h1>
            <p style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--color-neutral-500)',
              margin: 0
            }}>
              Review detailed metrics and test data for all enrolled students.
            </p>
          </div>
          {selectedTest && submissions.length > 0 && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              size="large"
              style={{
                borderRadius: 'var(--radius-base)',
                height: '44px',
                padding: '0 var(--spacing-xl)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 500
              }}
            >
              Download Excel
            </Button>
          )}
        </div>
      </div>

      <Card
        style={{
          marginBottom: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-neutral-200)',
          boxShadow: 'var(--shadow-base)',
        }}
        bodyStyle={{ padding: 'var(--spacing-xl)' }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <FilterOutlined style={{ fontSize: 16, color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)', color: 'var(--color-neutral-800)' }}>Filters</span>
          </div>
          <Row gutter={[16, 16]}>
            {userRole === 'superadmin' && (
              <Col xs={24} sm={12} md={6}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-sm)',
                    fontWeight: 600,
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-neutral-600)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Institute
                  </label>
                  <InstituteSelect
                    value={preFilterInstituteId}
                    onChange={(value) => {
                      setPreFilterInstituteId(value);
                      setSelectedTest(null);
                    }}
                    style={{ width: '100%' }}
                    placeholder="All Institutes"
                    allowClear
                  />
                </div>
              </Col>
            )}
            <Col xs={24} sm={12} md={6}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-neutral-600)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Category
                </label>
                <Select
                  value={testCategory}
                  onChange={setTestCategory}
                  style={{ width: '100%' }}
                  placeholder="Select Category"
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
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-neutral-600)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Test Name
                </label>
                <TestSelect
                  placeholder={testCategory ? "Select category's test" : "Select category first"}
                  value={selectedTest}
                  onChange={setSelectedTest}
                  category={testCategory}
                  instituteId={preFilterInstituteId}
                  disabled={!testCategory}
                />
              </div>
            </Col>
            {selectedTest && (
              <>
                <Col xs={24} sm={12} md={showInstituteFilter && showBranchFilter ? 4 : showInstituteFilter || showBranchFilter ? 6 : 12}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-sm)',
                      fontWeight: 600,
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-neutral-600)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Search Student
                    </label>
                    <Search
                      placeholder="Name or ID..."
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
                        marginBottom: 'var(--spacing-sm)',
                        fontWeight: 600,
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-neutral-600)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Institute
                      </label>
                      <InstituteSelect
                        value={filters.instituteId}
                        onChange={handleInstituteChange}
                        placeholder="All Principals"
                      />
                    </div>
                  </Col>
                )}
                {showBranchFilter && (
                  <Col xs={24} sm={12} md={4}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: 'var(--spacing-sm)',
                        fontWeight: 600,
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-neutral-600)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Principal
                      </label>
                      <BranchSelect
                        value={filters.branchId}
                        onChange={handleBranchChange}
                        instituteId={filters.instituteId}
                        placeholder="All Branches"
                      />
                    </div>
                  </Col>
                )}
              </>
            )}
          </Row>
        </Space>
      </Card>

      {selectedTest && submissions.length === 0 && !loading && (
        <Card
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-neutral-200)',
            boxShadow: 'var(--shadow-base)',
          }}
          bodyStyle={{ padding: 80 }}
        >
          <Empty
            description="No results found for the selected test and filters"
            style={{ margin: 0 }}
          />
        </Card>
      )}

      {selectedTest && submissions.length > 0 && (
        <Card
          bordered={false}
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-neutral-200)',
            boxShadow: 'var(--shadow-base)',
          }}
          bodyStyle={{ padding: 0 }}
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
              showTotal: (total) => `Showing 1-5 of ${total} entries`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            onChange={handleTableChange}
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
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-neutral-800)' }}>
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
