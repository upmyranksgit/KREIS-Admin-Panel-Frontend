import React, { useState, useEffect } from 'react';
import { Modal, Steps, Form, Input, Select, DatePicker, Switch, InputNumber, Button, message, Table, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { assessmentService } from '../services/assessmentService';
import { commonService } from '../services/commonService';

const { Step } = Steps;

const CreateTestModal = ({ visible, onCancel, onSuccess, editingTest }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [testPatterns, setTestPatterns] = useState([]);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [questionFilters, setQuestionFilters] = useState({});

    useEffect(() => {
        if (visible) {
            fetchTestPatterns();
            if (editingTest) {
                populateEditForm();
            } else {
                form.resetFields();
                setCurrentStep(0);
                setSelectedPattern(null);
                setSubjects([]);
                setSelectedQuestions({});
            }
        }
    }, [visible, editingTest]);

    const fetchTestPatterns = async () => {
        try {
            const res = await assessmentService.getTestPatterns({ skip: 0, limit: 100 });
            setTestPatterns(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching test patterns:', error);
        }
    };

    const populateEditForm = () => {
        if (!editingTest) return;

        form.setFieldsValue({
            institute_test_name: editingTest.institute_test_name,
            test_pattern_id: editingTest.test_pattern_details?.id,
            test_duration: editingTest.test_duration,
            test_start_time: editingTest.test_start_time ? dayjs(editingTest.test_start_time) : null,
            test_end_time: editingTest.test_end_time ? dayjs(editingTest.test_end_time) : null,
            add_password: editingTest.add_password,
            password: editingTest.password,
            test_duration_type: editingTest.test_duration_type,
            test_type: editingTest.test_type,
            instruction_text: editingTest.instruction_text,
            result_announce: editingTest.result_announce,
            enabled: editingTest.enabled
        });

        if (editingTest.test_pattern_details?.id) {
            handlePatternSelect(editingTest.test_pattern_details.id);
        }
    };

    const handlePatternSelect = async (patternId) => {
        try {
            const pattern = testPatterns.find(p => p._id === patternId);
            if (pattern) {
                setSelectedPattern(pattern);
                const subjectsData = pattern.subjects_details?.map(sub => ({
                    subject_id: sub.subject_id,
                    subject_name: sub.subject_name,
                    total_questions_for_subject: sub.total_questions_for_subject,
                    questions_to_attempt: sub.questions_to_attempt,
                    sections: sub.sections || [],
                    is_teacher_assigned: false,
                    are_all_questions_added_for_subject: false
                })) || [];
                setSubjects(subjectsData);
            }
        } catch (error) {
            console.error('Error loading pattern:', error);
        }
    };

    const fetchQuestions = async (subjectId, sectionId, filters = {}) => {
        try {
            setLoading(true);
            const params = {
                page: 1,
                limit: 50,
                subjectId,
                ...filters
            };
            const res = await commonService.getQuestionsV2(params);
            return res.data?.data || [];
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionSelect = (subjectId, sectionId, questionId, question) => {
        const key = `${subjectId}_${sectionId}`;
        const current = selectedQuestions[key] || [];

        const exists = current.find(q => q._id === questionId);
        let updated;

        if (exists) {
            updated = current.filter(q => q._id !== questionId);
        } else {
            updated = [...current, question];
        }

        setSelectedQuestions({
            ...selectedQuestions,
            [key]: updated
        });
    };

    const handleNext = async () => {
        try {
            if (currentStep === 0) {
                await form.validateFields(['institute_test_name', 'test_pattern_id', 'test_duration_type', 'test_duration', 'test_type', 'instruction_text']);
                if (!selectedPattern) {
                    message.error('Please select a test pattern');
                    return;
                }
            }
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // Build subjects_details with selected questions
            const subjects_details = subjects.map(subject => {
                const sectionsWithQuestions = subject.sections.map(section => {
                    const key = `${subject.subject_id}_${section._id}`;
                    const questions_list = selectedQuestions[key] || [];

                    return {
                        _id: section._id,
                        questions_list: questions_list
                    };
                });

                return {
                    subject_id: subject.subject_id,
                    is_teacher_assigned: false,
                    are_all_questions_added_for_subject: sectionsWithQuestions.every(s => s.questions_list.length > 0),
                    sections: sectionsWithQuestions
                };
            });

            const payload = {
                institute_test_name: values.institute_test_name,
                test_pattern_details: {
                    id: values.test_pattern_id
                },
                add_password: values.add_password || false,
                password: values.add_password ? values.password : '',
                test_duration: values.test_duration,
                test_start_time: values.test_start_time ? values.test_start_time.toISOString() : undefined,
                test_end_time: values.test_end_time ? values.test_end_time.toISOString() : undefined,
                test_duration_type: values.test_duration_type,
                test_type: values.test_type,
                instruction_text: values.instruction_text,
                result_announce: values.result_announce || 'IMMEDIATE',
                enabled: values.enabled || false,
                test_details: {
                    subjects_details
                }
            };

            if (editingTest) {
                await assessmentService.updateInstituteTest({ ...payload, test_id: editingTest._id });
                message.success('Test updated successfully');
            } else {
                await assessmentService.createInstituteTest(payload);
                message.success('Test created successfully');
            }

            onSuccess();
            handleCancel();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setCurrentStep(0);
        setSelectedPattern(null);
        setSubjects([]);
        setSelectedQuestions({});
        onCancel();
    };

    const renderBasicInfo = () => (
        <Form form={form} layout="vertical">
            <Form.Item name="institute_test_name" label="Test Name" rules={[{ required: true, message: 'Please enter test name' }]}>
                <Input placeholder="Enter test name" size="large" />
            </Form.Item>

            <Form.Item name="test_pattern_id" label="Test Pattern" rules={[{ required: true, message: 'Please select test pattern' }]}>
                <Select
                    placeholder="Select test pattern"
                    size="large"
                    onChange={handlePatternSelect}
                    showSearch
                    optionFilterProp="children"
                >
                    {testPatterns.map(pattern => (
                        <Select.Option key={pattern._id} value={pattern._id}>
                            {pattern.test_name || pattern.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name="test_duration_type" label="Test Duration Type" rules={[{ required: true }]}>
                <Select placeholder="Select duration type" size="large">
                    <Select.Option value="FIXED">Fixed Duration</Select.Option>
                    <Select.Option value="NONE">No Time Limit</Select.Option>
                    <Select.Option value="PRACTICE">Practice Mode</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="test_duration" label="Duration (minutes)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter duration" size="large" />
            </Form.Item>

            <Form.Item name="test_type" label="Test Type" rules={[{ required: true }]}>
                <Select placeholder="Select test type" size="large">
                    <Select.Option value="SUPERADMIN_TEST">Super Admin Test</Select.Option>
                    <Select.Option value="INSTITUTE_ADMIN_TEST">Institute Admin Test</Select.Option>
                    <Select.Option value="BRANCH_ADMIN_TEST">Branch Admin Test</Select.Option>
                    <Select.Option value="TEACHER_TEST">Teacher Test</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="instruction_text" label="Instructions" rules={[{ required: true }]}>
                <Input.TextArea rows={4} placeholder="Enter test instructions" />
            </Form.Item>
        </Form>
    );

    const renderAdvancedSettings = () => (
        <Form form={form} layout="vertical">
            <Form.Item name="test_start_time" label="Test Start Time">
                <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" size="large" />
            </Form.Item>

            <Form.Item name="test_end_time" label="Test End Time">
                <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" size="large" />
            </Form.Item>

            <Form.Item name="add_password" label="Password Protection" valuePropName="checked">
                <Switch />
            </Form.Item>

            <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.add_password !== currentValues.add_password}
            >
                {({ getFieldValue }) =>
                    getFieldValue('add_password') ? (
                        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                            <Input.Password placeholder="Enter test password" size="large" />
                        </Form.Item>
                    ) : null
                }
            </Form.Item>

            <Form.Item name="result_announce" label="Result Announcement" initialValue="IMMEDIATE">
                <Select size="large">
                    <Select.Option value="IMMEDIATE">Immediate</Select.Option>
                    <Select.Option value="LATER">Later</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="enabled" label="Enable Test" valuePropName="checked" initialValue={false}>
                <Switch />
            </Form.Item>
        </Form>
    );

    const renderQuestionSelection = () => (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {subjects.map((subject, subIdx) => (
                <div key={subject.subject_id} style={{ marginBottom: 24, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                    <h3>{subject.subject_name}</h3>
                    <p style={{ color: '#666', marginBottom: 16 }}>
                        Total Questions: {subject.total_questions_for_subject} | To Attempt: {subject.questions_to_attempt}
                    </p>

                    {subject.sections?.map((section, secIdx) => {
                        const key = `${subject.subject_id}_${section._id}`;
                        const selected = selectedQuestions[key] || [];

                        return (
                            <div key={section._id} style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <div>
                                        <strong>{section.section_name}</strong>
                                        <Tag color="blue" style={{ marginLeft: 8 }}>
                                            {selected.length} / {section.total_questions_for_section} selected
                                        </Tag>
                                    </div>
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={async () => {
                                            const qs = await fetchQuestions(subject.subject_id, section._id);
                                            setQuestions(qs);
                                            setQuestionFilters({ subjectId: subject.subject_id, sectionId: section._id });
                                        }}
                                    >
                                        Browse Questions
                                    </Button>
                                </div>

                                {selected.length > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        {selected.map(q => (
                                            <Tag
                                                key={q._id}
                                                closable
                                                onClose={() => handleQuestionSelect(subject.subject_id, section._id, q._id, q)}
                                                style={{ marginBottom: 4 }}
                                            >
                                                Q{q.questionNumber || q._id.slice(-4)}
                                            </Tag>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {questionFilters.subjectId && questions.length > 0 && (
                <Modal
                    title="Select Questions"
                    open={questions.length > 0}
                    onCancel={() => setQuestions([])}
                    footer={null}
                    width={900}
                >
                    <Table
                        dataSource={questions}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        rowSelection={{
                            selectedRowKeys: (selectedQuestions[`${questionFilters.subjectId}_${questionFilters.sectionId}`] || []).map(q => q._id),
                            onSelect: (record, selected) => {
                                handleQuestionSelect(questionFilters.subjectId, questionFilters.sectionId, record._id, record);
                            }
                        }}
                        columns={[
                            { title: 'Question', dataIndex: 'question', key: 'question', ellipsis: true, width: 400 },
                            { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
                            { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty', width: 100 }
                        ]}
                    />
                </Modal>
            )}
        </div>
    );

    const steps = [
        { title: 'Basic Info', content: renderBasicInfo() },
        { title: 'Advanced Settings', content: renderAdvancedSettings() },
        { title: 'Questions', content: renderQuestionSelection() }
    ];

    return (
        <Modal
            title={editingTest ? 'Edit Test' : 'Create Test'}
            open={visible}
            onCancel={handleCancel}
            width={1000}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                currentStep > 0 && (
                    <Button key="previous" onClick={handlePrevious}>
                        Previous
                    </Button>
                ),
                currentStep < steps.length - 1 && (
                    <Button key="next" type="primary" onClick={handleNext}>
                        Next
                    </Button>
                ),
                currentStep === steps.length - 1 && (
                    <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                        {editingTest ? 'Update' : 'Create'} Test
                    </Button>
                )
            ]}
        >
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div>{steps[currentStep].content}</div>
        </Modal>
    );
};

export default CreateTestModal;
