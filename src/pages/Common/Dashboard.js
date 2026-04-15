import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Row, Col, Card, Spin, Empty, Select, Typography, Button } from 'antd';
import { UserOutlined, TrophyOutlined, RiseOutlined, AimOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import { TestSelect, InstituteSelect, BranchSelect, BatchSelect } from '../../components/dropdowns';

const { Option } = Select;
const { Title } = Typography;

const COLORS = ['#1e293b', '#0ea5e9', '#ef4444', '#f59e0b', '#10b981'];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [preFilterInstituteId, setPreFilterInstituteId] = useState(null); // For SuperAdmin to filter tests
  const [selectedTest, setSelectedTest] = useState(null);
  const [testCategory, setTestCategory] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filters, setFilters] = useState({
    instituteId: null,
    branchId: null,
    batchId: null,
    studentId: null
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);

  // Get current user role
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  // Define available filter types based on user role
  const availableFilterTypes = useMemo(() => {
    const filterOptions = [{ value: 'all', label: 'All Submissions' }];

    if (userRole === 'superadmin') {
      filterOptions.push(
        { value: 'institute', label: 'Institute-wise' },
        { value: 'principal', label: 'Principal-wise' },
        { value: 'batch', label: 'Batch-wise' },
        { value: 'student', label: 'Individual Student' }
      );
    } else if (userRole === 'instituteadmin') {
      filterOptions.push(
        { value: 'principal', label: 'Principal-wise' },
        { value: 'batch', label: 'Batch-wise' },
        { value: 'student', label: 'Individual Student' }
      );
    } else if (userRole === 'branchadmin') {
      filterOptions.push(
        { value: 'batch', label: 'Batch-wise' },
        { value: 'student', label: 'Individual Student' }
      );
    } else {
      filterOptions.push(
        { value: 'student', label: 'Individual Student' }
      );
    }

    return filterOptions;
  }, [userRole]);

  // Sync pre-filter institute with filter institute for institute-wise view
  useEffect(() => {
    if (filterType === 'institute' && preFilterInstituteId && filters.instituteId !== preFilterInstituteId) {
      setFilters(prev => ({ ...prev, instituteId: preFilterInstituteId }));
    }
  }, [filterType, preFilterInstituteId, filters.instituteId]);

  // Reset test when category changes
  useEffect(() => {
    setSelectedTest(null);
  }, [testCategory]);

  const fetchStudents = useCallback(async () => {
    if (!selectedTest) return;

    try {
      const params = {
        testId: selectedTest,
        page: 1,
        limit: 1000
      };

      if (preFilterInstituteId || filters.instituteId) params.instituteId = preFilterInstituteId || filters.instituteId;
      if (filters.branchId) params.branchId = filters.branchId;
      if (filters.batchId) params.batchId = filters.batchId;

      const response = await assessmentService.getSubmittedTestScore(params);
      setStudents(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  }, [selectedTest, preFilterInstituteId, filters.instituteId, filters.branchId, filters.batchId]);

  const fetchDashboardData = useCallback(async () => {
    if (!selectedTest) return;

    setLoading(true);
    try {
      const params = {
        testId: selectedTest,
        page: 1,
        limit: 1000
      };

      if (filterType === 'institute' && (filters.instituteId || preFilterInstituteId)) {
        params.instituteId = filters.instituteId || preFilterInstituteId;
      } else if (filterType === 'principal' && filters.branchId) {
        params.branchId = filters.branchId;
        if (preFilterInstituteId || filters.instituteId) params.instituteId = preFilterInstituteId || filters.instituteId;
      } else if (filterType === 'batch' && filters.batchId) {
        params.batchId = filters.batchId;
        if (preFilterInstituteId || filters.instituteId) params.instituteId = preFilterInstituteId || filters.instituteId;
        if (filters.branchId) params.branchId = filters.branchId;
      } else if (filterType === 'student' && filters.studentId) {
        params.studentId = filters.studentId;
      }

      const response = await assessmentService.getSubmittedTestScore(params);
      const submissions = response.data?.data || [];

      if (submissions.length === 0) {
        setDashboardData(null);
        return;
      }

      const totalSubmissions = submissions.length;
      const scores = submissions.map(s => s.percentageScore || 0);
      const avgScore = scores.reduce((a, b) => a + b, 0) / totalSubmissions;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);

      let stats = {};

      if (filterType === 'student') {
        // For individual student, show different metrics
        const student = submissions[0];
        stats = {
          totalMarks: student.totalTestMarks || 0,
          scoredMarks: student.totalScoredMarks || 0,
          percentageScore: (student.percentageScore || 0).toFixed(2),
          totalQuestions: student.questionsToAttempt || 0,
          correctAnswers: student.totalCorrectAnswers || 0,
          accuracy: student.questionsToAttempt > 0
            ? ((student.totalCorrectAnswers / student.questionsToAttempt) * 100).toFixed(2)
            : 0
        };
      } else {
        // For group views, show aggregate metrics
        stats = {
          totalSubmissions,
          avgScore: avgScore.toFixed(2),
          highestScore: highestScore.toFixed(2),
          lowestScore: lowestScore.toFixed(2)
        };
      }

      const scoreRanges = [
        { range: '0-20%', count: 0, fill: COLORS[0] },
        { range: '21-40%', count: 0, fill: COLORS[1] },
        { range: '41-60%', count: 0, fill: COLORS[2] },
        { range: '61-80%', count: 0, fill: COLORS[3] },
        { range: '81-100%', count: 0, fill: COLORS[4] }
      ];

      submissions.forEach(s => {
        const score = s.percentageScore || 0;
        if (score <= 20) scoreRanges[0].count++;
        else if (score <= 40) scoreRanges[1].count++;
        else if (score <= 60) scoreRanges[2].count++;
        else if (score <= 80) scoreRanges[3].count++;
        else scoreRanges[4].count++;
      });

      let branchPerformance = [];
      let topPerformers = [];
      let subjectPerformance = [];
      let questionAnalysis = null;
      let timeAnalysis = null;

      if (filterType === 'student') {
        // For individual student, show only that student's performance
        const student = submissions[0];

        topPerformers = [{
          name: (student.firstName || 'Unknown').length > 15 ? (student.firstName || 'Unknown').substring(0, 15) + '...' : (student.firstName || 'Unknown'),
          score: parseFloat((student.percentageScore || 0).toFixed(2))
        }];

        // Question-wise analysis
        questionAnalysis = [
          {
            category: 'Correct',
            count: student.totalCorrectAnswers || 0,
            fill: '#52c41a'
          },
          {
            category: 'Incorrect',
            count: student.totalIncorrectAnswers || 0,
            fill: '#ff4d4f'
          },
          {
            category: 'Skipped',
            count: student.totalSkippedAnswers || 0,
            fill: '#d9d9d9'
          }
        ];

        // Time analysis
        timeAnalysis = {
          totalTime: student.totalDuration || 0,
          avgTimePerQuestion: student.averageTimeForSingleQuestion || 0,
          totalQuestions: student.questionsToAttempt || 0
        };

        // Get subject-wise performance for the student
        if (student.testDetails?.subjectDetails) {
          subjectPerformance = student.testDetails.subjectDetails.map(subject => ({
            subject: subject.subjectName.length > 20 ? subject.subjectName.substring(0, 20) + '...' : subject.subjectName,
            percentage: parseFloat(((subject.scoredMarks / subject.totalMarks) * 100).toFixed(2)),
            correct: subject.correctAnswers || 0,
            incorrect: subject.incorrectAnswers || 0,
            skipped: subject.skippedAnswers || 0
          }));
        }
      } else {
        // For other filter types, show branch performance
        const branchMap = {};
        submissions.forEach(s => {
          const branch = s.branchName || 'Unknown';
          if (!branchMap[branch]) {
            branchMap[branch] = { branch, totalScore: 0, count: 0 };
          }
          branchMap[branch].totalScore += s.percentageScore || 0;
          branchMap[branch].count++;
        });

        branchPerformance = Object.values(branchMap)
          .map(b => ({
            branch: b.branch.length > 20 ? b.branch.substring(0, 20) + '...' : b.branch,
            avgScore: parseFloat((b.totalScore / b.count).toFixed(2))
          }))
          .sort((a, b) => b.avgScore - a.avgScore)
          .slice(0, 10);

        topPerformers = [...submissions]
          .sort((a, b) => (b.percentageScore || 0) - (a.percentageScore || 0))
          .slice(0, 10)
          .map(s => ({
            name: (s.firstName || 'Unknown').length > 15 ? (s.firstName || 'Unknown').substring(0, 15) + '...' : (s.firstName || 'Unknown'),
            score: parseFloat((s.percentageScore || 0).toFixed(2))
          }));
      }

      setDashboardData({
        stats,
        scoreDistribution: scoreRanges,
        branchPerformance,
        topPerformers,
        subjectPerformance,
        questionAnalysis,
        timeAnalysis
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedTest, filterType, filters, preFilterInstituteId]);

  useEffect(() => {
    if (!selectedTest) return;

    // Check if required filters are selected before fetching data
    if (filterType === 'all') {
      fetchDashboardData();
    } else if (filterType === 'institute' && (filters.instituteId || preFilterInstituteId)) {
      fetchDashboardData();
    } else if (filterType === 'principal' && filters.branchId) {
      fetchDashboardData();
    } else if (filterType === 'batch' && filters.batchId) {
      fetchDashboardData();
    } else if (filterType === 'student' && filters.studentId) {
      fetchDashboardData();
    } else {
      // Clear dashboard data if required filters are not selected
      setDashboardData(null);
    }
  }, [selectedTest, filterType, filters, preFilterInstituteId, fetchDashboardData]);

  useEffect(() => {
    if (selectedTest && filterType === 'student') {
      fetchStudents();
    }
  }, [selectedTest, filterType, fetchStudents]);

  const handleFilterTypeChange = (value) => {
    setFilterType(value);

    // For SuperAdmin, if switching to institute-wise and pre-filter institute is selected,
    // automatically use it as the filter institute
    const newFilters = {
      instituteId: (value === 'institute' && preFilterInstituteId) ? preFilterInstituteId : null,
      branchId: null,
      batchId: null,
      studentId: null
    };

    setFilters(newFilters);
    setDashboardData(null);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };

    if (key === 'instituteId') {
      newFilters.branchId = null;
      newFilters.batchId = null;
      newFilters.studentId = null;
    } else if (key === 'branchId') {
      newFilters.batchId = null;
      newFilters.studentId = null;
    } else if (key === 'batchId') {
      newFilters.studentId = null;
    }

    setFilters(newFilters);
  };

  const renderFilterInputs = () => {
    const showInstituteSelector = userRole === 'superadmin';
    const showBranchSelector = userRole === 'superadmin' || userRole === 'instituteadmin';

    const labelStyle = {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 600,
      fontSize: '13px',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    const filterInputs = [];

    if (filterType === 'institute' && showInstituteSelector) {
      // If pre-filter institute is selected, use it and don't show another dropdown
      if (preFilterInstituteId) {
        // Auto-use the pre-filter institute, no need to show another dropdown
        // The filter is already set in handleFilterTypeChange
      } else {
        // Show institute dropdown only if pre-filter is not selected
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="institute">
            <div>
              <label style={labelStyle}>Institute</label>
              <InstituteSelect
                value={filters.instituteId}
                onChange={(value) => handleFilterChange('instituteId', value)}
                style={{ width: '100%' }}
                placeholder="Select institute"
              />
            </div>
          </Col>
        );
      }
    }

    if (filterType === 'principal') {
      if (showInstituteSelector && !preFilterInstituteId) {
        // Only show institute dropdown if pre-filter is not selected
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="institute">
            <div>
              <label style={labelStyle}>Institute</label>
              <InstituteSelect
                value={filters.instituteId}
                onChange={(value) => handleFilterChange('instituteId', value)}
                style={{ width: '100%' }}
                placeholder="Select institute"
              />
            </div>
          </Col>
        );
      }
      filterInputs.push(
        <Col xs={24} sm={12} md={8} key="branch">
          <div>
            <label style={labelStyle}>Principal</label>
            <BranchSelect
              value={filters.branchId}
              onChange={(value) => handleFilterChange('branchId', value)}
              instituteId={preFilterInstituteId || filters.instituteId}
              style={{ width: '100%' }}
              placeholder="Select principal"
            />
          </div>
        </Col>
      );
    }

    if (filterType === 'batch') {
      if (showInstituteSelector && !preFilterInstituteId) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="institute">
            <div>
              <label style={labelStyle}>Institute</label>
              <InstituteSelect
                value={filters.instituteId}
                onChange={(value) => handleFilterChange('instituteId', value)}
                style={{ width: '100%' }}
                placeholder="Select institute"
              />
            </div>
          </Col>
        );
      }
      if (showBranchSelector) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="branch">
            <div>
              <label style={labelStyle}>Principal</label>
              <BranchSelect
                value={filters.branchId}
                onChange={(value) => handleFilterChange('branchId', value)}
                instituteId={preFilterInstituteId || filters.instituteId}
                style={{ width: '100%' }}
                placeholder="Select principal"
              />
            </div>
          </Col>
        );
      }
      filterInputs.push(
        <Col xs={24} sm={12} md={8} key="batch">
          <div>
            <label style={labelStyle}>Batch</label>
            <BatchSelect
              value={filters.batchId}
              onChange={(value) => handleFilterChange('batchId', value)}
              instituteId={preFilterInstituteId || filters.instituteId}
              branchId={filters.branchId}
              style={{ width: '100%' }}
              placeholder="Select batch"
              allowClear
              mode={undefined}
            />
          </div>
        </Col>
      );
    }

    if (filterType === 'student') {
      if (showInstituteSelector && !preFilterInstituteId) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="institute">
            <div>
              <label style={labelStyle}>Institute (Optional)</label>
              <InstituteSelect
                value={filters.instituteId}
                onChange={(value) => handleFilterChange('instituteId', value)}
                style={{ width: '100%' }}
                placeholder="Select institute"
                allowClear
              />
            </div>
          </Col>
        );
      }
      if (showBranchSelector) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="branch">
            <div>
              <label style={labelStyle}>Principal (Optional)</label>
              <BranchSelect
                value={filters.branchId}
                onChange={(value) => handleFilterChange('branchId', value)}
                instituteId={preFilterInstituteId || filters.instituteId}
                style={{ width: '100%' }}
                placeholder="Select principal"
                allowClear
              />
            </div>
          </Col>
        );
      }
      filterInputs.push(
        <Col xs={24} sm={12} md={8} key="batch">
          <div>
            <label style={labelStyle}>Batch (Optional)</label>
            <BatchSelect
              value={filters.batchId}
              onChange={(value) => handleFilterChange('batchId', value)}
              instituteId={preFilterInstituteId || filters.instituteId}
              branchId={filters.branchId}
              style={{ width: '100%' }}
              placeholder="Select batch"
              allowClear
              mode={undefined}
            />
          </div>
        </Col>,
        <Col xs={24} sm={12} md={8} key="student">
          <div>
            <label style={labelStyle}>Student</label>
            <Select
              showSearch
              value={filters.studentId}
              onChange={(value) => handleFilterChange('studentId', value)}
              style={{ width: '100%' }}
              placeholder="Select student"
              size="large"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {students.map(student => (
                <Option key={student.studentId} value={student.studentId}>
                  {student.firstName} {student.lastName ? `(${student.lastName})` : ''}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
      );
    }

    return filterInputs;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: 700 }}>Performance Overview</Title>
        <p style={{ color: '#64748b', margin: '8px 0 0 0', fontSize: '15px' }}>Monitor and evaluate student outcomes across your organization</p>
      </div>

      <Card
        style={{
          marginBottom: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {userRole === 'superadmin' && (
            <Col xs={24} sm={12} lg={6}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#475569',
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
                  placeholder="All Institutes (SuperAdmin)"
                  allowClear
                />
              </div>
            </Col>
          )}
          <Col xs={24} sm={12} lg={6}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#475569',
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
          <Col xs={24} sm={12} lg={6}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Test Name
              </label>
              <TestSelect
                value={selectedTest}
                onChange={setSelectedTest}
                category={testCategory}
                instituteId={preFilterInstituteId}
                style={{ width: '100%' }}
                placeholder={testCategory ? "Select category's test" : "Select category first"}
                disabled={!testCategory}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                View By
              </label>
              <Select
                value={filterType}
                onChange={handleFilterTypeChange}
                style={{ width: '100%' }}
                placeholder="All Submissions"
                size="large"
              >
                {availableFilterTypes.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        {selectedTest && filterType !== 'all' && (
          <Row gutter={[16, 16]} style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
          }}>
            {renderFilterInputs()}
          </Row>
        )}
      </Card>

      {loading && selectedTest && (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && !selectedTest && (
        <Card style={{ marginTop: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Empty
            description="Please select a test to view dashboard"
            style={{ padding: '60px 0' }}
          />
        </Card>
      )}

      {!loading && selectedTest && filterType !== 'all' && (
        ((filterType === 'institute' && !(filters.instituteId || preFilterInstituteId)) ||
          (filterType === 'principal' && !filters.branchId) ||
          (filterType === 'batch' && !filters.batchId) ||
          (filterType === 'student' && !filters.studentId))
      ) && (
          <Card style={{ marginTop: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Empty
              description="Please select the required filters to view dashboard"
              style={{ padding: '60px 0' }}
            />
          </Card>
        )}

      {!loading && selectedTest && !dashboardData && (
        (filterType === 'all') ||
        (filterType === 'institute' && (filters.instituteId || preFilterInstituteId)) ||
        (filterType === 'principal' && filters.branchId) ||
        (filterType === 'batch' && filters.batchId) ||
        (filterType === 'student' && filters.studentId)
      ) && (
          <Card style={{ marginTop: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Empty
              description="No submissions found for the selected filters"
              style={{ padding: '60px 0' }}
            />
          </Card>
        )}

      {!loading && dashboardData && (
        <>
          <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
            {filterType === 'student' ? (
              <>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.1s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Scored Marks</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#0ea5e9', marginBottom: '4px' }}>
                          {dashboardData.stats.scoredMarks}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>out of {dashboardData.stats.totalMarks}</div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TrophyOutlined style={{ fontSize: '24px', color: '#0ea5e9' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.2s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Avg. Test Score</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#0ea5e9', marginBottom: '4px' }}>
                          {dashboardData.stats.percentageScore}%
                        </div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AimOutlined style={{ fontSize: '24px', color: '#0ea5e9' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.3s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Highest Score</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                          98/100
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>Flat</div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#d1fae5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircleOutlined style={{ fontSize: '24px', color: '#10b981' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.4s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Critical Cases</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
                          {dashboardData.stats.totalQuestions - dashboardData.stats.correctAnswers}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>Accuracy: {dashboardData.stats.accuracy}%</div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CloseCircleOutlined style={{ fontSize: '24px', color: '#ef4444' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
              </>
            ) : (
              <>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.1s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Total Submissions</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#0ea5e9', marginBottom: '4px' }}>
                          {dashboardData.stats.totalSubmissions.toLocaleString()}
                        </div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <UserOutlined style={{ fontSize: '24px', color: '#0ea5e9' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.2s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Avg. Test Score</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#0ea5e9', marginBottom: '4px' }}>
                          {dashboardData.stats.avgScore}%
                        </div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AimOutlined style={{ fontSize: '24px', color: '#0ea5e9' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.3s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Highest Score</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                          {dashboardData.stats.highestScore}%
                        </div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#d1fae5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <RiseOutlined style={{ fontSize: '24px', color: '#10b981' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    className="animate-fade-in"
                    style={{
                      animationDelay: '0.4s',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>Test Completion</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#0ea5e9', marginBottom: '4px' }}>
                          89%
                        </div>
                      </div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TrophyOutlined style={{ fontSize: '24px', color: '#0ea5e9' }} />
                      </div>
                    </div>
                  </Card>
                </Col>
              </>
            )}
          </Row>

          {userRole === 'student' ? (
            <>
              {/* Student Performance Analytics */}
              <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>Scored Marks</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#0ea5e9', marginBottom: '8px' }}>
                        {dashboardData.stats.correctAnswers * 4} / {dashboardData.stats.totalQuestions * 4}
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#e0f2fe',
                        color: '#0ea5e9'
                      }}>
                        <TrophyOutlined style={{ fontSize: '14px' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Score</span>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>Percentage</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
                        {dashboardData.stats.avgScore}%
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#fef3c7',
                        color: '#f59e0b'
                      }}>
                        <RiseOutlined style={{ fontSize: '14px' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Score Rate</span>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>Correct Answers</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>
                        {dashboardData.stats.correctAnswers} / {dashboardData.stats.totalQuestions}
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#d1fae5',
                        color: '#10b981'
                      }}>
                        <CheckCircleOutlined style={{ fontSize: '14px' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Correct</span>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>Accuracy</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>
                        {dashboardData.stats.accuracy}%
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444'
                      }}>
                        <AimOutlined style={{ fontSize: '14px' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Hit Rate</span>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Question Analysis</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <defs>
                          <linearGradient id="correctGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.7} />
                          </linearGradient>
                          <linearGradient id="incorrectGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.7} />
                          </linearGradient>
                          <linearGradient id="skippedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        <Pie
                          data={[
                            { name: 'Correct', value: dashboardData.stats.correctAnswers, label: `Correct: ${dashboardData.stats.correctAnswers}` },
                            { name: 'Incorrect', value: dashboardData.stats.totalQuestions - dashboardData.stats.correctAnswers, label: `Incorrect: ${dashboardData.stats.totalQuestions - dashboardData.stats.correctAnswers}` },
                            { name: 'Skipped', value: 0, label: 'Skipped: 0' }
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={3}
                        >
                          <Cell fill="url(#correctGradient)" stroke="#fff" strokeWidth={3} />
                          <Cell fill="url(#incorrectGradient)" stroke="#fff" strokeWidth={3} />
                          <Cell fill="url(#skippedGradient)" stroke="#fff" strokeWidth={3} />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Time Analysis</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      <div style={{ fontSize: '48px', fontWeight: 700, color: '#0ea5e9', marginBottom: '8px' }}>
                        1 min
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>Total Time Taken</div>
                    </div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{
                          padding: '20px',
                          borderRadius: '12px',
                          backgroundColor: '#dbeafe',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0ea5e9', marginBottom: '4px' }}>
                            0.0s
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>Avg Time/Question</div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{
                          padding: '20px',
                          borderRadius: '12px',
                          backgroundColor: '#d1fae5',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                            {dashboardData.stats.totalQuestions}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>Total Questions</div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Score Distribution</span>}
                    extra={<span style={{ fontSize: '13px', color: '#64748b' }}>Cumulative performance across all active tests</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <defs>
                          {COLORS.map((color, index) => (
                            <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                              <stop offset="95%" stopColor={color} stopOpacity={0.7} />
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={dashboardData.scoreDistribution.filter(d => d.count > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="count"
                          paddingAngle={3}
                        >
                          {dashboardData.scoreDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#pieGradient${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={3}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value, entry) => `${entry.payload.range}: ${entry.payload.count}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Branch-wise Performance (Avg %)</span>}
                    extra={<span style={{ fontSize: '13px', color: '#64748b' }}>Average percentage scores by branch location</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={dashboardData.branchPerformance.slice(0, 5)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorBranch" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                        <XAxis
                          type="number"
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <YAxis
                          dataKey="branch"
                          type="category"
                          width={90}
                          interval={0}
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
                        />
                        <Bar
                          dataKey="avgScore"
                          fill="url(#colorBranch)"
                          radius={[0, 8, 8, 0]}
                          barSize={24}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[20, 20]}>
                <Col xs={24}>
                  <Card
                    title={
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Top 10 Performers</span>
                    }
                    bodyStyle={{ padding: '0' }}
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <Row gutter={16}>
                        <Col span={2} style={{ fontWeight: 600, fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Rank</Col>
                        <Col span={6} style={{ fontWeight: 600, fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Student Name</Col>
                        <Col span={3} style={{ fontWeight: 600, fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Scored Marks</Col>
                        <Col span={3} style={{ fontWeight: 600, fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Correct</Col>
                        <Col span={3} style={{ fontWeight: 600, fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Incorrect</Col>
                        <Col span={3} style={{ fontWeight: 600, fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Skipped</Col>
                        <Col span={4} style={{ fontWeight: 600, fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Score %</Col>
                      </Row>
                    </div>
                    {dashboardData.topPerformers.map((performer, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '16px 24px',
                          borderBottom: index < dashboardData.topPerformers.length - 1 ? '1px solid #e2e8f0' : 'none',
                          transition: 'background-color 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Row gutter={16} align="middle">
                          <Col span={2}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: index < 3 ? '#fef3c7' : '#f1f5f9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '14px',
                              color: index < 3 ? '#f59e0b' : '#64748b'
                            }}>
                              {index + 1}
                            </div>
                          </Col>
                          <Col span={6}>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{performer.name}</div>
                          </Col>
                          <Col span={3}>
                            <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                              {Math.round((performer.score / 100) * 100)}/100
                            </div>
                          </Col>
                          <Col span={3}>
                            <div style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#d1fae5',
                              color: '#065f46',
                              fontSize: '13px',
                              fontWeight: 600
                            }}>
                              {Math.round((performer.score / 100) * 80)}
                            </div>
                          </Col>
                          <Col span={3}>
                            <div style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              fontSize: '13px',
                              fontWeight: 600
                            }}>
                              {Math.round((100 - performer.score) / 100 * 15)}
                            </div>
                          </Col>
                          <Col span={3}>
                            <div style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              fontSize: '13px',
                              fontWeight: 600
                            }}>
                              {Math.round((100 - performer.score) / 100 * 5)}
                            </div>
                          </Col>
                          <Col span={4}>
                            <span style={{ fontWeight: 700, fontSize: '16px', color: '#0ea5e9' }}>
                              {performer.score}%
                            </span>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
