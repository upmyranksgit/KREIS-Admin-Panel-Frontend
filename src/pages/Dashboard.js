import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardOutlined, FileTextOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import { Dashboard as OverviewPage, Results } from './Common';
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
      title: 'Branch Dashboard'
    },
    teacher: {
      basePath: '/institute',
      title: 'Institute Dashboard'
    },
    student: {
      basePath: '/branch',
      title: 'Branch Dashboard'
    }
  };

  const config = roleConfig[userRole] || roleConfig.instituteadmin;
  const { basePath, title } = config;

  const menuItems = [
    { key: `${basePath}/overview`, icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: `${basePath}/results`, icon: <FileTextOutlined />, label: 'Results' }
    // Test Management temporarily hidden
    // { key: `${basePath}/tests`, icon: <BarChartOutlined />, label: userRole === 'superadmin' || userRole === 'instituteadmin' ? 'Test Management' : 'Tests' }
  ];

  return (
    <Layout menuItems={menuItems} title={title}>
      <Routes>
        <Route path="/" element={<Navigate to={`${basePath}/overview`} replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/results" element={<Results />} />
        {/* Test Management route temporarily hidden */}
        {/* <Route path="/tests" element={testComponent} /> */}
      </Routes>
    </Layout>
  );
};

export default Dashboard;
