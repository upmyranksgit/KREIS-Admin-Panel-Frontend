import React from 'react';
import { Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StatCard = ({ 
  title, 
  value, 
  prefix, 
  suffix, 
  trend, 
  trendValue,
  icon,
  color = '#1890ff',
  loading = false,
  style = {}
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  const getTrendColor = () => {
    if (!trend) return undefined;
    return trend === 'up' ? '#52c41a' : '#ff4d4f';
  };

  return (
    <Card
      loading={loading}
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        ...style
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ 
              color: color,
              fontSize: 28,
              fontWeight: 700,
            }}
          />
          {icon && (
            <div 
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: color,
              }}
            >
              {icon}
            </div>
          )}
        </div>
        {trend && trendValue && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: getTrendColor(), fontSize: 14, fontWeight: 600 }}>
              {getTrendIcon()} {trendValue}
            </span>
            <span style={{ color: '#8c8c8c', fontSize: 14 }}>vs last period</span>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default StatCard;
