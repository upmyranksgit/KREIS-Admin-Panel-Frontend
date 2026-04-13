import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, TrophyOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const DashboardStats = ({ stats, filterType }) => {
  if (!stats) return null;

  if (filterType === 'student') {
    return (
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Scored Marks"
              value={stats.scoredMarks}
              suffix={`/ ${stats.totalMarks}`}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Percentage"
              value={stats.percentageScore}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{
                color: parseFloat(stats.percentageScore) >= 60
                  ? '#52c41a'
                  : parseFloat(stats.percentageScore) >= 40
                    ? '#faad14'
                    : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Correct Answers"
              value={stats.correctAnswers}
              suffix={`/ ${stats.totalQuestions}`}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Accuracy"
              value={stats.accuracy}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{
                color: parseFloat(stats.accuracy) >= 70
                  ? '#52c41a'
                  : parseFloat(stats.accuracy) >= 50
                    ? '#faad14'
                    : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Submissions"
            value={stats.totalSubmissions}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Average Score"
            value={stats.avgScore}
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
            value={stats.highestScore}
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
            value={stats.lowestScore}
            suffix="%"
            prefix={<FallOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;
