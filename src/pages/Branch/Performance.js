import React, { useEffect, useState } from 'react';
import { Card, Row, Col, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { assessmentService } from '../../services/assessmentService';
import { TestSelect } from '../../components/dropdowns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Performance = () => {
    const [selectedTest, setSelectedTest] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedTest) fetchAnalytics();
    }, [selectedTest]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await assessmentService.getTestAnalytics({ testId: selectedTest }); // Changed from test_id to testId
            setAnalytics(response.data?.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            message.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    const scoreData = analytics?.scoreDistribution || [];
    const passFailData = [
        { name: 'Pass', value: analytics?.passCount || 0 },
        { name: 'Fail', value: analytics?.failCount || 0 }
    ];

    return (
        <>
            <Card title="Select Test" style={{ marginBottom: 24 }}>
                <TestSelect
                    placeholder="Select a test"
                    value={selectedTest}
                    onChange={setSelectedTest}
                />
            </Card>

            {selectedTest && analytics && (
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card title="Score Distribution">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={scoreData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#1890ff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="Pass/Fail Ratio">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={passFailData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
                                        {passFailData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default Performance;
