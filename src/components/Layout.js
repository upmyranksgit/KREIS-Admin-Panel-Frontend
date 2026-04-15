import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Typography, Space, Badge, Divider } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const { Header, Sider, Content } = AntLayout;
const { Title, Text } = Typography;

const Layout = ({ children, menuItems, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: (
          <div>
            <div style={{ fontWeight: 600 }}>{user?.firstName || user?.username || 'User'}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.role || 'User'}
            </Text>
          </div>
        ),
        disabled: true,
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
        danger: true
      }
    ]
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
          boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            margin: '16px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div 
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: collapsed ? 0 : 12,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>K</span>
          </div>
          {!collapsed && (
            <Title
              level={4}
              style={{
                color: '#fff',
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 1,
                background: 'linear-gradient(to right, #fff, #cbd5e1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              KREIS
            </Title>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ 
            background: 'transparent',
            borderRight: 0,
            padding: '0 8px'
          }}
        />
      </Sider>
      <AntLayout style={{ 
        marginLeft: collapsed ? 80 : 240, 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh'
      }}>
        <Header
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            height: 72,
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <Space size="large">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { 
                fontSize: 20, 
                cursor: 'pointer',
                color: '#64748b',
                padding: '8px',
                borderRadius: '8px',
                background: '#f8fafc',
                transition: 'all 0.2s'
              }
            })}
            <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{title}</Title>
          </Space>
          <Space size="large">
            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <Space 
                style={{ 
                  cursor: 'pointer', 
                  padding: '4px 8px', 
                  borderRadius: 12,
                  transition: 'all 0.2s',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                }}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{ 
                    backgroundColor: '#6366f1',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                  }}
                />
                {!collapsed && (
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                      {user?.firstName || user?.username || 'User'}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>
                      {user?.role || 'User'}
                    </Text>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            padding: '32px 24px',
            background: '#f8fafc',
            minHeight: 'calc(100vh - 72px)',
          }}
        >
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
