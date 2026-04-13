import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Empty, Select, Space, Typography } from 'antd';
import { UserOutlined, TrophyOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TestSelect, InstituteSelect, BranchSelect, BatchSelect } from '../../components/dropdowns';
import { useFilters, useDashboard } from '../../context';
import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardCharts from '../../components/dashboard/DashboardCharts';
import FilterSection from '../../components/dashboard/FilterSection';

const { Option } = Select;
const { Title } = Typography;

const DashboardWithContext = () => {
  const {
    selectedTest,
    testCategory,
    filterType,
    filters,
    setTest,
    setCategory,
    setFilterType,
    setInstitute,
    setBranch,
    setBatch,
    setStudent,
    areRequiredFiltersSelected,
    getAvailableFilterTypes,
    canSeeInstituteFilter,
    canSeeBranchFilter
  } = useFilters();

  const {
    loading,
    dashboardData,
    students,
    error,
    fetchDashboardData,
    fetchStudents,
    clearDashboardData
  } = useDashboard();

  // Fetch dashboard data when filters change
  useEffect(() => {
    if (!selectedTest) {
      clearDashboardData();
      return;
    }

    if (!areRequiredFiltersSelected()) {
      clearDashboardData();
      return;
    }

    const params = {
      testId: selectedTest,
      filterType
    };

    if (filterType === 'institute' && filters.instituteId) {
      params.instituteId = filters.instituteId;
    } else if (filterType === 'branch' && filters.branchId) {
      params.branchId = filters.branchId;
      if (filters.instituteId) params.instituteId = filters.instituteId;
    } else if (filterType === 'batch' && filters.batchId) {
      params.batchId = filters.batchId;
      if (filters.instituteId) params.instituteId = filters.instituteId;
      if (filters.branchId) params.branchId = filters.branchId;
    } else if (filterType === 'student' && filters.studentId) {
      params.studentId = filters.studentId;
    }

    fetchDashboardData(params);
  }, [selectedTest, filterType, filters, areRequiredFiltersSelected, fetchDashboardData, clearDashboardData]);

  // Fetch students for dropdown
  useEffect(() => {
    if (selectedTest && filterType === 'student') {
      const params = { testId: selectedTest };
      if (filters.instituteId) params.instituteId = filters.instituteId;
      if (filters.branchId) params.branchId = filters.branchId;
      if (filters.batchId) params.batchId = filters.batchId;
      fetchStudents(params);
    }
  }, [selectedTest, filterType, filters.batchId, filters.branchId, filters.instituteId, fetchStudents]);

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '14px',
    color: '#262626'
  };

  const renderFilterInputs = () => {
    const filterInputs = [];

    if (filterType === 'institute' && canSeeInstituteFilter()) {
      filterInputs.push(
        <Col xs={24} sm={12} md={8} key="institute">
          <div>
            <label style={labelStyle}>Institute</label>
            <InstituteSelect
              value={filters.instituteId}
              onChange={setInstitute}
              style={{ width: '100%' }}
              placeholder="Select institute"
            />
          </div>
        </Col>
      );
    }

    if (filterType === 'branch') {
      if (canSeeInstituteFilter()) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="institute">
            <div>
              <label style={labelStyle}>Institute</label>
              <InstituteSelect
                value={filters.instituteId}
                onChange={setInstitute}
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
              onChange={setBranch}
              instituteId={filters.instituteId}
              style={{ width: '100%' }}
              placeholder="Select branch"
            />
          </div>
        </Col>
      );
    }

    if (filterType === 'batch') {
      if (canSeeInstituteFilter()) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="institute">
            <div>
              <label style={labelStyle}>Institute</label>
              <InstituteSelect
                value={filters.instituteId}
                onChange={setInstitute}
                style={{ width: '100%' }}
                placeholder="Select institute"
              />
            </div>
          </Col>
        );
      }
      if (canSeeBranchFilter()) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="branch">
            <div>
              <label style={labelStyle}>Branch</label>
              <BranchSelect
                value={filters.branchId}
                onChange={setBranch}
                instituteId={filters.instituteId}
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
              onChange={setBatch}
              instituteId={filters.instituteId}
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
      if (canSeeInstituteFilter()) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="institute">
            <div>
              <label style={labelStyle}>Institute (Optional)</label>
              <InstituteSelect
                value={filters.instituteId}
                onChange={setInstitute}
                style={{ width: '100%' }}
                placeholder="Select institute"
                allowClear
              />
            </div>
          </Col>
        );
      }
      if (canSeeBranchFilter()) {
        filterInputs.push(
          <Col xs={24} sm={12} md={8} key="branch">
            <div>
              <label style={labelStyle}>Branch (Optional)</label>
              <BranchSelect
                value={filters.branchId}
                onChange={setBranch}
                instituteId={filters.instituteId}
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
              onChange={setBatch}
              instituteId={filters.instituteId}
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
              onChange={setStudent}
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
          <Col xs={24} sm={12} lg={6}>
            <div>
              <label style={labelStyle}>Category</label>
              <Select
                value={testCategory}
                onChange={setCategory}
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
              <label style={labelStyle}>Test</label>
              <TestSelect
                value={selectedTest}
                onChange={setTest}
                category={testCategory}
                style={{ width: '100%' }}
                placeholder="Select a test"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div>
              <label style={labelStyle}>View By</label>
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: '100%' }}
                placeholder="Select view type"
                size="large"
              >
                {getAvailableFilterTypes().map(option => (
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

      {loading && <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />}

      {!loading && !selectedTest && (
        <Card style={{ marginTop: '24px' }}>
          <Empty
            description="Please select a test to view dashboard"
            style={{ padding: '60px 0' }}
          />
        </Card>
      )}

      {!loading && selectedTest && !areRequiredFiltersSelected() && (
        <Card style={{ marginTop: '24px' }}>
          <Empty
            description="Please select the required filters to view dashboard"
            style={{ padding: '60px 0' }}
          />
        </Card>
      )}

      {!loading && selectedTest && areRequiredFiltersSelected() && !dashboardData && (
        <Card style={{ marginTop: '24px' }}>
          <Empty
            description="No submissions found for the selected filters"
            style={{ padding: '60px 0' }}
          />
        </Card>
      )}

      {!loading && dashboardData && (
        <>
          <DashboardStats stats={dashboardData.stats} filterType={filterType} />
          <DashboardCharts data={dashboardData} filterType={filterType} />
        </>
      )}
    </div>
  );
};

export default DashboardWithContext;
