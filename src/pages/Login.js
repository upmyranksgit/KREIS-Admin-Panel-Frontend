import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await authService.login(values);
      console.log('Login response data:', data);
      console.log('User role:', data?.user?.role);
      
      message.success('Login successful!');
      
      const role = data?.user?.role?.toLowerCase();
      console.log('Navigating based on role:', role);
      
      if (role === 'superadmin') {
        console.log('Navigating to /superadmin');
        navigate('/superadmin', { replace: true });
      } else if (role === 'instituteadmin') {
        console.log('Navigating to /institute');
        navigate('/institute', { replace: true });
      } else if (role === 'branchadmin') {
        console.log('Navigating to /branch');
        navigate('/branch', { replace: true });
      } else if (role === 'teacher') {
        console.log('Navigating to /institute');
        navigate('/institute', { replace: true });
      } else if (role === 'student') {
        console.log('Navigating to /branch');
        navigate('/branch', { replace: true });
      } else {
        console.log('Unknown role, navigating to /');
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        background: 'radial-gradient(circle at top left, #6366f1 0%, #4338ca 40%, #1e1b4b 100%)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        width: '40vw',
        height: '40vw',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
        top: '-10vw',
        right: '-10vw',
        filter: 'blur(80px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '30vw',
        height: '30vw',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
        bottom: '-5vw',
        left: '-5vw',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <Card 
        style={{ 
          width: 480, 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 1,
        }}
        bodyStyle={{ padding: '48px 40px' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div 
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)',
              }}
            >
              <span style={{ color: '#fff', fontSize: 32, fontWeight: 800 }}>K</span>
            </div>
            <Title level={2} style={{ marginBottom: 8, fontWeight: 800, color: '#0f172a' }}>
              Welcome Back
            </Title>
            <Text style={{ fontSize: 16, color: '#64748b' }}>
              Sign in to KREIS Assessment Portal
            </Text>
          </div>

          <Form 
            name="login" 
            onFinish={onFinish} 
            autoComplete="off"
            size="large"
            layout="vertical"
            requiredMark={false}
            style={{ marginTop: 12 }}
          >
            <Form.Item 
              name="username" 
              label={<Text style={{ fontWeight: 600 }}>Username</Text>}
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 8 }} />} 
                placeholder="Enter your username" 
                style={{ 
                  borderRadius: 12,
                  padding: '10px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              label={<Text style={{ fontWeight: 600 }}>Password</Text>}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 8 }} />} 
                placeholder="Enter your password" 
                style={{ 
                  borderRadius: 12,
                  padding: '10px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 40 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block 
                size="large"
                icon={<LoginOutlined />}
                style={{
                  height: 52,
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Sign In to Portal
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ margin: '16px 0' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>SECURE LOGIN</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>
              © 2024 KREIS Assessment Dashboard. All rights reserved.
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
