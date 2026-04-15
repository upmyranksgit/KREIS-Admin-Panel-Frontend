import React from 'react';
import { Typography, Space, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PageHeader = ({ 
  title, 
  subtitle, 
  extra, 
  breadcrumbs = [],
  style = {} 
}) => {
  return (
    <div 
      style={{ 
        marginBottom: 24,
        ...style 
      }}
    >
      {breadcrumbs.length > 0 && (
        <Breadcrumb 
          style={{ marginBottom: 16 }}
          items={[
            { href: '/', title: <HomeOutlined /> },
            ...breadcrumbs
          ]}
        />
      )}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <Space direction="vertical" size={4}>
          <Title 
            level={2} 
            style={{ 
              margin: 0, 
              fontWeight: 700,
              color: '#262626',
            }}
          >
            {title}
          </Title>
          {subtitle && (
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 14,
                display: 'block',
              }}
            >
              {subtitle}
            </Text>
          )}
        </Space>
        {extra && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {extra}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
