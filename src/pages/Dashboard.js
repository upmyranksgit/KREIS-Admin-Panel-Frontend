import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardOutlined, FileTextOutlined, FileProtectOutlined, FileDoneOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import { Dashboard as OverviewPage, Results, TestPatterns, Tests, CreateTestPattern, CreateTest } from './Common';
import { authService } from '../services/authService';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const userRole = user?.role?.toLowerCase();

  // Determine base path and title based on role
  const roleConfig = {
    superadmin: {
      basePath: '/superadmin',
      title: 'Super Admin Dashboard'
    },
    instituteadmin: {
      basePath: '/institute',
      title: 'Institute Dashboard'
    },
    branchadmin: {
      basePath: '/branch',
      title: 'Principal Dashboard'
    },
    teacher: {
      basePath: '/institute',
      title: 'Institute Dashboard'
    },
    student: {
      basePath: '/branch',
      title: 'Principal Dashboard'
    }
  };

  const config = roleConfig[userRole] || roleConfig.instituteadmin;
  const { basePath, title } = config;

  const menuItems = [
    { key: `${basePath}/overview`, icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: `${basePath}/results`, icon: <FileTextOutlined />, label: 'Results' },
    { key: `${basePath}/test-patterns`, icon: <FileProtectOutlined />, label: 'Test Patterns' },
    { key: `${basePath}/tests`, icon: <FileDoneOutlined />, label: 'All Assessments' }
  ];

  return (
    <Layout menuItems={menuItems} title={title}>
      <Routes>
        <Route path="/" element={<Navigate to={`${basePath}/overview`} replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/test-patterns" element={<TestPatterns />} />
        <Route path="/test-patterns/create" element={<CreateTestPattern />} />
        <Route path="/test-patterns/edit/:id" element={<CreateTestPattern />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/tests/create" element={<CreateTest />} />
        <Route path="/tests/edit/:id/:courseId" element={<CreateTest />} />
        <Route path="/tests/view/:id/:courseId" element={<CreateTest />} />
      </Routes>
    </Layout>
  );
};

export default Dashboard;
