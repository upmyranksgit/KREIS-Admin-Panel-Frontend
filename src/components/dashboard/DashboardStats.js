import React from 'react';
import { Row, Col } from 'antd';
import { UserOutlined, TrophyOutlined, RiseOutlined, FallOutlined, CheckCircleOutlined, PercentageOutlined } from '@ant-design/icons';
import StatCard from '../StatCard';

const DashboardStats = ({ stats, filterType, loading = false }) => {
  if (!stats) return null;

  if (filterType === 'student') {
    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Scored Marks"
            value={stats.scoredMarks}
            suffix={`/ ${stats.totalMarks}`}
            icon={<TrophyOutlined />}
            color="#1890ff"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Percentage"
            value={stats.percentageScore}
            suffix="%"
            icon={<PercentageOutlined />}
            color={
              parseFloat(stats.percentageScore) >= 60
                ? '#52c41a'
                : parseFloat(stats.percentageScore) >= 40
                  ? '#faad14'
                  : '#ff4d4f'
            }
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Correct Answers"
            value={stats.correctAnswers}
            suffix={`/ ${stats.totalQuestions}`}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Accuracy"
            value={stats.accuracy}
            suffix="%"
            icon={<RiseOutlined />}
            color={
              parseFloat(stats.accuracy) >= 70
                ? '#52c41a'
                : parseFloat(stats.accuracy) >= 50
                  ? '#faad14'
                  : '#ff4d4f'
            }
            loading={loading}
          />
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={<UserOutlined />}
          color="#3f8600"
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Average Score"
          value={stats.avgScore}
          suffix="%"
          icon={<TrophyOutlined />}
          color="#1890ff"
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Highest Score"
          value={stats.highestScore}
          suffix="%"
          icon={<RiseOutlined />}
          color="#52c41a"
          loading={loading}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Lowest Score"
          value={stats.lowestScore}
          suffix="%"
          icon={<FallOutlined />}
          color="#ff4d4f"
          loading={loading}
        />
      </Col>
    </Row>
  );
};

export default DashboardStats;
