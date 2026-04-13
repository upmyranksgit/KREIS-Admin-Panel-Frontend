import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Row, Col, Card, Statistic, Spin, Empty, Select, Space, Typography } from 'antd';
import { UserOutlined, TrophyOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import { TestSelect, InstituteSelect, BranchSelect, BatchSelect } from '../../components/dropdowns';

const { Option } = Select;
const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
        { value: 'branch', label: 'Branch-wise' },
        { value: 'batch', label: 'Batch-wise' },
        { value: 'student', label: 'Individual Student' }
      );
    } else if (userRole === 'instituteadmin') {
      filterOptions.push(
        { value: 'branch', label: 'Branch-wise' },
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
      } else if (filterType === 'branch' && filters.branchId) {
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
    } else if (filterType === 'branch' && filters.branchId) {
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
      fontSize: '14px',
      color: '#262626'
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

    if (filterType === 'branch') {
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
            <label style={labelStyle}>Branch</label>
            <BranchSelect
              value={filters.branchId}
              onChange={(value) => handleFilterChange('branchId', value)}
              instituteId={preFilterInstituteId || filters.instituteId}
              style={{ width: '100%' }}
              placeholder="Select branch"
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
              <label style={labelStyle}>Branch</label>
              <BranchSelect
                value={filters.branchId}
                onChange={(value) => handleFilterChange('branchId', value)}
                instituteId={preFilterInstituteId || filters.instituteId}
                style={{ width: '100%' }}
                placeholder="Select branch"
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
              <label style={labelStyle}>Branch (Optional)</label>
              <BranchSelect
                value={filters.branchId}
                onChange={(value) => handleFilterChange('branchId', value)}
                instituteId={preFilterInstituteId || filters.instituteId}
                style={{ width: '100%' }}
                placeholder="Select branch"
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
    <div style={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#262626' }}>Dashboard</Title>
        <p style={{ color: '#8c8c8c', margin: '4px 0 0 0' }}>View and analyze test performance metrics</p>
      </div>

      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
        }}
      >
        <Row gutter={[16, 16]}>
          {userRole === 'superadmin' && (
            <Col xs={24} sm={12} lg={6}>
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
          <Col xs={24} sm={12} lg={6}>
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
          <Col xs={24} sm={12} lg={6}>
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
                value={selectedTest}
                onChange={setSelectedTest}
                category={testCategory}
                instituteId={preFilterInstituteId}
                style={{ width: '100%' }}
                placeholder="Select a test"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '14px',
                color: '#262626'
              }}>
                View By
              </label>
              <Select
                value={filterType}
                onChange={handleFilterTypeChange}
                style={{ width: '100%' }}
                placeholder="Select view type"
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
            borderTop: '1px solid #f0f0f0'
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
        <Card style={{ marginTop: '24px' }}>
          <Empty
            description="Please select a test to view dashboard"
            style={{ padding: '60px 0' }}
          />
        </Card>
      )}

      {!loading && selectedTest && filterType !== 'all' && (
        ((filterType === 'institute' && !(filters.instituteId || preFilterInstituteId)) ||
          (filterType === 'branch' && !filters.branchId) ||
          (filterType === 'batch' && !filters.batchId) ||
          (filterType === 'student' && !filters.studentId))
      ) && (
          <Card style={{ marginTop: '24px' }}>
            <Empty
              description="Please select the required filters to view dashboard"
              style={{ padding: '60px 0' }}
            />
          </Card>
        )}

      {!loading && selectedTest && !dashboardData && (
        (filterType === 'all') ||
        (filterType === 'institute' && (filters.instituteId || preFilterInstituteId)) ||
        (filterType === 'branch' && filters.branchId) ||
        (filterType === 'batch' && filters.batchId) ||
        (filterType === 'student' && filters.studentId)
      ) && (
          <Card style={{ marginTop: '24px' }}>
            <Empty
              description="No submissions found for the selected filters"
              style={{ padding: '60px 0' }}
            />
          </Card>
        )}

      {!loading && dashboardData && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            {filterType === 'student' ? (
              <>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Scored Marks"
                      value={dashboardData.stats.scoredMarks}
                      suffix={`/ ${dashboardData.stats.totalMarks}`}
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Percentage"
                      value={dashboardData.stats.percentageScore}
                      suffix="%"
                      prefix={<RiseOutlined />}
                      valueStyle={{ color: parseFloat(dashboardData.stats.percentageScore) >= 60 ? '#52c41a' : parseFloat(dashboardData.stats.percentageScore) >= 40 ? '#faad14' : '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Correct Answers"
                      value={dashboardData.stats.correctAnswers}
                      suffix={`/ ${dashboardData.stats.totalQuestions}`}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Accuracy"
                      value={dashboardData.stats.accuracy}
                      suffix="%"
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: parseFloat(dashboardData.stats.accuracy) >= 70 ? '#52c41a' : parseFloat(dashboardData.stats.accuracy) >= 50 ? '#faad14' : '#ff4d4f' }}
                    />
                  </Card>
                </Col>
              </>
            ) : (
              <>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Submissions"
                      value={dashboardData.stats.totalSubmissions}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Average Score"
                      value={dashboardData.stats.avgScore}
                      suffix="%"
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Highest Score"
                      value={dashboardData.stats.highestScore}
                      suffix="%"
                      prefix={<RiseOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Lowest Score"
                      value={dashboardData.stats.lowestScore}
                      suffix="%"
                      prefix={<FallOutlined />}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
              </>
            )}
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            {filterType === 'student' ? (
              <>
                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Question Analysis</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <defs>
                          <linearGradient id="correctGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#52c41a" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#52c41a" stopOpacity={0.7} />
                          </linearGradient>
                          <linearGradient id="incorrectGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0.7} />
                          </linearGradient>
                          <linearGradient id="skippedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d9d9d9" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#d9d9d9" stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        <Pie
                          data={dashboardData.questionAnalysis}
                          cx="50%"
                          cy="50%"
                          labelLine={{ stroke: '#8c8c8c', strokeWidth: 1 }}
                          label={({ category, count }) => `${category}: ${count}`}
                          outerRadius={110}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="count"
                          paddingAngle={2}
                        >
                          {dashboardData.questionAnalysis.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.category === 'Correct' ? 'url(#correctGradient)' : entry.category === 'Incorrect' ? 'url(#incorrectGradient)' : 'url(#skippedGradient)'}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #f0f0f0',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Time Analysis</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <div style={{ padding: '40px 20px' }}>
                      <Row gutter={[16, 32]}>
                        <Col span={24}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', fontWeight: 700, color: '#1890ff', marginBottom: '8px' }}>
                              {Math.floor(dashboardData.timeAnalysis.totalTime)} min
                            </div>
                            <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Time Taken</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f5ff', borderRadius: '8px' }}>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: '#1890ff', marginBottom: '8px' }}>
                              {dashboardData.timeAnalysis.avgTimePerQuestion.toFixed(1)}s
                            </div>
                            <div style={{ fontSize: '14px', color: '#595959' }}>Avg Time/Question</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: '#52c41a', marginBottom: '8px' }}>
                              {dashboardData.timeAnalysis.totalQuestions}
                            </div>
                            <div style={{ fontSize: '14px', color: '#595959' }}>Total Questions</div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </Col>
              </>
            ) : (
              <>
                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Score Distribution</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={dashboardData.scoreDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <defs>
                          <linearGradient id="colorBar0" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0088FE" stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="colorBar1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#00C49F" stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="colorBar2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FFBB28" stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="colorBar3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF8042" stopOpacity={0.6} />
                          </linearGradient>
                          <linearGradient id="colorBar4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884D8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884D8" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="range"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                          tick={{ fill: '#8c8c8c', fontSize: 12 }}
                        />
                        <YAxis
                          label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
                          tick={{ fill: '#8c8c8c', fontSize: 12 }}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]}>
                          {dashboardData.scoreDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#colorBar${index})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Score Distribution</span>}
                    bodyStyle={{ padding: '24px' }}
                    style={{
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <ResponsiveContainer width="100%" height={350}>
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
                          labelLine={{ stroke: '#8c8c8c', strokeWidth: 1 }}
                          label={({ range, count, percent }) => `${range}: ${count}`}
                          outerRadius={110}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="count"
                          paddingAngle={2}
                        >
                          {dashboardData.scoreDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#pieGradient${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #f0f0f0',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </>
            )}
          </Row>

          <Row gutter={[16, 16]}>
            {filterType !== 'student' && dashboardData.branchPerformance.length > 0 && (
              <Col xs={24} lg={12}>
                <Card
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Branch-wise Performance</span>}
                  bodyStyle={{ padding: '24px' }}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dashboardData.branchPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <defs>
                        <linearGradient id="colorBranch" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#52c41a" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="branch"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                      />
                      <YAxis
                        label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar
                        dataKey="avgScore"
                        fill="url(#colorBranch)"
                        name="Average Score (%)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            )}

            {filterType === 'student' && dashboardData.subjectPerformance && dashboardData.subjectPerformance.length > 0 && (
              <Col xs={24}>
                <Card
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Subject-wise Performance</span>}
                  bodyStyle={{ padding: '24px' }}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dashboardData.subjectPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <defs>
                        <linearGradient id="colorSubject" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1890ff" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="subject"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                      />
                      <YAxis
                        label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar
                        dataKey="percentage"
                        fill="url(#colorSubject)"
                        name="Score (%)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            )}

            {filterType !== 'student' && (
              <Col xs={24} lg={12}>
                <Card
                  title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Top 10 Performers</span>}
                  bodyStyle={{ padding: '24px' }}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={dashboardData.topPerformers} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorTop" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="5%" stopColor="#faad14" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#faad14" stopOpacity={0.5} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        label={{ value: 'Score (%)', position: 'insideBottom', offset: -10, style: { fill: '#8c8c8c' } }}
                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={90}
                        interval={0}
                        tick={{ fill: '#8c8c8c', fontSize: 12 }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      />
                      <Legend />
                      <Bar
                        dataKey="score"
                        fill="url(#colorTop)"
                        name="Score (%)"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;
