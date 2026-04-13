import React from 'react';
import { Row, Col, Card } from 'antd';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ data, filterType }) => {
  if (!data) return null;

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {filterType === 'student' ? (
          <>
            <Col xs={24} lg={12}>
              <Card
                title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Question Analysis</span>}
                bodyStyle={{ padding: '24px' }}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.questionAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={{ stroke: '#8c8c8c', strokeWidth: 1 }}
                      label={({ category, count }) => `${category}: ${count}`}
                      outerRadius={110}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                      paddingAngle={2}
                    >
                      {data.questionAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Time Analysis</span>}
                bodyStyle={{ padding: '24px' }}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
              >
                <div style={{ padding: '40px 20px' }}>
                  <Row gutter={[16, 32]}>
                    <Col span={24}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', fontWeight: 700, color: '#1890ff', marginBottom: '8px' }}>
                          {Math.floor(data.timeAnalysis.totalTime)} min
                        </div>
                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Time Taken</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f5ff', borderRadius: '8px' }}>
                        <div style={{ fontSize: '32px', fontWeight: 600, color: '#1890ff', marginBottom: '8px' }}>
                          {data.timeAnalysis.avgTimePerQuestion.toFixed(1)}s
                        </div>
                        <div style={{ fontSize: '14px', color: '#595959' }}>Avg Time/Question</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
                        <div style={{ fontSize: '32px', fontWeight: 600, color: '#52c41a', marginBottom: '8px' }}>
                          {data.timeAnalysis.totalQuestions}
                        </div>
                        <div style={{ fontSize: '14px', color: '#595959' }}>Total Questions</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          </>
        ) : (
          <>
            <Col xs={24} lg={12}>
              <Card
                title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Score Distribution</span>}
                bodyStyle={{ padding: '24px' }}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.scoreDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="range"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fill: '#8c8c8c', fontSize: 12 }}
                    />
                    <YAxis
                      label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
                      tick={{ fill: '#8c8c8c', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]}>
                      {data.scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Score Distribution</span>}
                bodyStyle={{ padding: '24px' }}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.scoreDistribution.filter(d => d.count > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={{ stroke: '#8c8c8c', strokeWidth: 1 }}
                      label={({ range, count }) => `${range}: ${count}`}
                      outerRadius={110}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                      paddingAngle={2}
                    >
                      {data.scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </>
        )}
      </Row>

      <Row gutter={[16, 16]}>
        {filterType !== 'student' && data.branchPerformance.length > 0 && (
          <Col xs={24} lg={12}>
            <Card
              title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Branch-wise Performance</span>}
              bodyStyle={{ padding: '24px' }}
              style={{
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
              }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.branchPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="branch"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fill: '#8c8c8c', fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
                    tick={{ fill: '#8c8c8c', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="avgScore" fill="#52c41a" name="Average Score (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}

        {filterType === 'student' && data.subjectPerformance && data.subjectPerformance.length > 0 && (
          <Col xs={24}>
            <Card
              title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Subject-wise Performance</span>}
              bodyStyle={{ padding: '24px' }}
              style={{
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
              }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.subjectPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="subject"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fill: '#8c8c8c', fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#8c8c8c' } }}
                    tick={{ fill: '#8c8c8c', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="percentage" fill="#1890ff" name="Score (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}

        {filterType !== 'student' && (
          <Col xs={24} lg={12}>
            <Card
              title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Top 10 Performers</span>}
              bodyStyle={{ padding: '24px' }}
              style={{
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
              }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.topPerformers} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    label={{ value: 'Score (%)', position: 'insideBottom', offset: -10, style: { fill: '#8c8c8c' } }}
                    tick={{ fill: '#8c8c8c', fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={90}
                    interval={0}
                    tick={{ fill: '#8c8c8c', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  <Legend />
                  <Bar dataKey="score" fill="#faad14" name="Score (%)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default DashboardCharts;
