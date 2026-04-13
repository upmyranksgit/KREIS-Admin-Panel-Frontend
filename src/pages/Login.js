import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const { Title } = Typography;

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
      
      const role = data?.user?.role?.toLowerCase(); // Convert to lowercase for comparison
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>KREIS Assessment</Title>
        <Form name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
