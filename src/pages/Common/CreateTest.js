import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space, message, DatePicker, Switch } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import { setTestDetails, resetTestDetails } from '../../store/slices/assessmentSlice';
import api from '../../utils/api';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const CreateTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const currentUser = authService.getCurrentUser();
  const userRole = currentUser?.role?.toLowerCase();

  const roleConfig = {
    superadmin: '/superadmin',
    instituteadmin: '/institute',
    branchadmin: '/branch',
    teacher: '/institute',
    student: '/branch'
  };
  const basePath = roleConfig[userRole] || '/institute';
  
  const queryParams = new URLSearchParams(location.search);
  const patternId = queryParams.get('patternId');

  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState('withpattern');
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [testTypes, setTestTypes] = useState([]);

  useEffect(() => {
    fetchTestTypes();
    fetchGrades();
    if (patternId) {
      fetchPatternById(patternId);
    }
    if (id) {
      fetchTestDetails();
    }
    return () => {
      dispatch(resetTestDetails());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, patternId]);

  const fetchTestTypes = async () => {
    try {
      const response = await api.get('/assessment/test-types', { params: { page: 1, limit: 200 } });
      setTestTypes(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch test types');
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await api.get('/question-bank/courses', { params: { page: 1, limit: 100 } });
      setGrades(response.data?.data || []);
    } catch (error) {
      message.error('Failed to fetch grades');
    }
  };



  const fetchPatterns = async (gradeId) => {
    try {
      const response = await assessmentService.getTestPatterns({ 
        course_id: gradeId,
        skip: 0, 
        limit: 100 
      });
      setPatterns(response.data?.data || []);
    } catch (error) {
      message.error('Failed to fetch patterns');
    }
  };

  const fetchPatternById = async (patternId) => {
    try {
      const response = await assessmentService.getTestPatterns({ 
        test_id: patternId,
        skip: 0, 
        limit: 1 
      });
      const pattern = response.data?.data?.[0];
      if (pattern) {
        handlePatternSelect(pattern);
      }
    } catch (error) {
      message.error('Failed to fetch pattern');
    }
  };

  const fetchTestDetails = async () => {
    try {
      const response = await assessmentService.getInstituteTests({ 
        test_id: id,
        skip: 0, 
        limit: 1 
      });
      const test = response.data?.data?.[0];
      if (test) {
        form.setFieldsValue({
          institute_test_name: test.institute_test_name,
          test_duration: test.test_duration,
          instruction_text: test.instruction_text,
          type: test.type,
          password: test.password
        });
        
        setIsPasswordProtected(test.add_password || false);
        setTestType(test.withoutPattern ? 'withoutpattern' : 'withpattern');
        
        if (test.test_start_time) {
          form.setFieldValue('test_start_time', moment(test.test_start_time));
        }
        if (test.test_end_time) {
          form.setFieldValue('test_end_time', moment(test.test_end_time));
        }

        if (test.test_pattern_details) {
          setSelectedPattern(test.test_pattern_details);
          setSelectedGrade(test.course_id);
          await fetchPatterns(test.course_id);
        }

        dispatch(setTestDetails({
          isEdit: true,
          withoutPattern: test.withoutPattern || false,
          testName: test.institute_test_name,
          courseId: test.course_id,
          courseName: test.course_name,
          testDuration: test.test_duration,
          totalQuestions: test.total_test_questions,
          totalMarks: test.total_marks,
          instructionText: test.instruction_text,
          subjectDetails: test.test_details?.subjects_details || [],
          isPasswordProtect: test.add_password || false,
          password: test.password,
          type: test.type
        }));
      }
    } catch (error) {
      message.error('Failed to fetch test details');
    }
  };

  const handlePatternSelect = async (pattern) => {
    if (typeof pattern === 'string') {
      const patternData = patterns.find(p => p._id === pattern);
      if (patternData) {
        pattern = patternData;
      } else {
        return;
      }
    }

    setSelectedPattern(pattern);
    
    form.setFieldsValue({
      test_duration: pattern.test_duration,
      instruction_text: pattern.instruction_text
    });

    const subjectsWithTotalMarks = pattern.subjects_details?.map(subject => {
      let totalMarks = 0;
      const updatedSections = (subject.sections || []).map(section => {
        let sectionTotalQuestions = 0;
        if (section.optional_question > 0) {
          totalMarks += section.optional_question * section.marks_per_question;
        } else {
          sectionTotalQuestions = section.questions_to - section.questions_from + 1;
          totalMarks += sectionTotalQuestions * section.marks_per_question;
        }
        return {
          ...section,
          total_questions_for_section: sectionTotalQuestions
        };
      });

      return {
        ...subject,
        are_all_questions_added_for_subject: false,
        is_teacher_assigned: false,
        sections: updatedSections,
        total_subject_marks: totalMarks
      };
    });

    dispatch(setTestDetails({
      testPattern: pattern.test_name,
      testPatternId: pattern._id,
      instructionText: pattern.instruction_text,
      totalQuestions: pattern.total_questions,
      totalMarks: pattern.total_marks,
      courseId: pattern.course_details?.course_id,
      courseName: pattern.course_details?.course_name,
      testDuration: pattern.test_duration,
      subjectDetails: subjectsWithTotalMarks
    }));
  };

  const handleGradeChange = async (gradeId) => {
    setSelectedGrade(gradeId);
    setSelectedPattern(null);
    form.setFieldValue('pattern_id', undefined);
    
    if (testType === 'withpattern') {
      await fetchPatterns(gradeId);
    }
  };

  const handleSubmit = async (values) => {
    const testStartTime = values.test_start_time ? values.test_start_time.toISOString() : null;
    const testEndTime = values.test_end_time ? values.test_end_time.toISOString() : null;

    let payload = {
      institute_test_name: values.institute_test_name,
      test_duration: values.test_duration,
      instruction_text: values.instruction_text,
      add_password: isPasswordProtected,
      password: isPasswordProtected ? values.password : '',
      type: values.type,
      created_by: currentUser._id,
      test_type: currentUser.role === 'teacher' ? 'TEACHER_TEST' : 'SUPERADMIN_TEST'
    };

    if (testType === 'withpattern' && selectedPattern) {
      payload = {
        ...payload,
        test_pattern_details: {
          id: selectedPattern._id,
          name: selectedPattern.test_name
        },
        course_id: selectedPattern.course_details?.course_id,
        course_name: selectedPattern.course_details?.course_name,
        total_test_questions: selectedPattern.total_questions,
        total_marks: selectedPattern.total_marks,
        test_details: {
          subjects_details: selectedPattern.subjects_details?.map(subject => ({
            ...subject,
            sections: subject.sections?.map(section => ({
              ...section,
              questions_list: section.questions_list || []
            }))
          }))
        },
        withoutPattern: false
      };
    } else {
      payload = {
        ...payload,
        course_id: selectedGrade,
        withoutPattern: true
      };
    }

    if (testStartTime && testEndTime) {
      payload.test_start_time = testStartTime;
      payload.test_end_time = testEndTime;
    }

    setLoading(true);
    try {
      if (id) {
        await assessmentService.updateInstituteTest({ ...payload, test_id: id });
        message.success('Test updated successfully');
      } else {
        await assessmentService.createInstituteTest(payload);
        message.success('Test created successfully');
      }
      navigate(`${basePath}/tests`);
    } catch (error) {
      message.error(id ? 'Failed to update test' : 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--color-neutral-50)', minHeight: 'calc(100vh - 64px)', padding: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`${basePath}/tests`)}
          style={{ marginBottom: '16px' }}
        >
          Back to Tests
        </Button>
        <h1 style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 700,
          color: 'var(--color-neutral-800)',
          margin: 0,
          marginBottom: 'var(--spacing-sm)'
        }}>
          {id ? 'Edit Test' : 'Create Test'}
        </h1>
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--color-neutral-500)',
          margin: 0
        }}>
          Schedule and configure your assessment
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Test Configuration" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Form.Item
                label="Test Type"
              >
                <Select
                  value={testType}
                  onChange={setTestType}
                  size="large"
                  disabled={!!id}
                >
                  <Option value="withpattern">Assessment With Pattern</Option>
                  <Option value="withoutpattern">Assessment Without Pattern</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="institute_test_name"
                label="Test Name"
                rules={[
                  { required: true, message: 'Please enter test name' },
                  { max: 50, message: 'Maximum 50 characters allowed' }
                ]}
              >
                <Input placeholder="Enter test name" size="large" />
              </Form.Item>

              <Form.Item
                name="type"
                label="Assessment Type"
                rules={[{ required: true, message: 'Please select assessment type' }]}
              >
                <Select placeholder="Select assessment type" size="large" showSearch>
                  {testTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>

              {testType === 'withpattern' ? (
                <>
                  <Form.Item
                    label="Select Grade"
                    rules={[{ required: true, message: 'Please select a grade' }]}
                  >
                    <Select
                      placeholder="Select grade"
                      size="large"
                      value={selectedGrade}
                      onChange={handleGradeChange}
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {grades.map(grade => (
                        <Option key={grade._id} value={grade._id}>{grade.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="pattern_id"
                    label="Select Test Pattern"
                    rules={[{ required: true, message: 'Please select a pattern' }]}
                  >
                    <Select
                      placeholder="Select test pattern"
                      size="large"
                      onChange={handlePatternSelect}
                      disabled={!selectedGrade}
                      value={selectedPattern?._id}
                    >
                      {patterns.map(pattern => (
                        <Option key={pattern._id} value={pattern._id}>{pattern.test_name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              ) : (
                <Form.Item
                  label="Select Grade"
                  rules={[{ required: true, message: 'Please select a grade' }]}
                >
                  <Select
                    placeholder="Select grade"
                    size="large"
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    showSearch
                  >
                    {grades.map(grade => (
                      <Option key={grade._id} value={grade._id}>{grade.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                name="test_duration"
                label="Test Duration (minutes)"
                rules={[{ required: true, message: 'Please enter test duration' }]}
              >
                <InputNumber
                  placeholder="Enter duration in minutes"
                  min={1}
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="instruction_text"
                label="Instructions"
                rules={[{ required: true, message: 'Please enter instructions' }]}
              >
                <TextArea
                  placeholder="Enter test instructions"
                  rows={4}
                  size="large"
                />
              </Form.Item>
            </Space>
          </Card>

          <Card title="Schedule & Security" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Form.Item
                name="test_start_time"
                label="Test Start Date & Time"
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < moment().startOf('day')}
                />
              </Form.Item>

              <Form.Item
                name="test_end_time"
                label="Test End Date & Time"
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < moment().startOf('day')}
                />
              </Form.Item>

              <Form.Item label="Password Protection">
                <Switch
                  checked={isPasswordProtected}
                  onChange={setIsPasswordProtected}
                  checkedChildren="Enabled"
                  unCheckedChildren="Disabled"
                />
              </Form.Item>

              {isPasswordProtected && (
                <Form.Item
                  name="password"
                  label="Test Password"
                  rules={[
                    { required: isPasswordProtected, message: 'Please enter password' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                  ]}
                >
                  <Input.Password
                    placeholder="Enter password (min 6 characters)"
                    size="large"
                  />
                </Form.Item>
              )}
            </Space>
          </Card>

          {selectedPattern && (
            <Card title="Pattern Summary" style={{ borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <Card size="small" style={{ flex: 1, minWidth: '200px', background: 'var(--color-info-bg)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-neutral-600)' }}>Total Questions</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {selectedPattern.total_questions}
                  </div>
                </Card>
                <Card size="small" style={{ flex: 1, minWidth: '200px', background: 'var(--color-success-bg)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-neutral-600)' }}>Total Marks</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-success)' }}>
                    {selectedPattern.total_marks}
                  </div>
                </Card>
                <Card size="small" style={{ flex: 1, minWidth: '200px', background: 'var(--color-warning-bg)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-neutral-600)' }}>Subjects</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-warning)' }}>
                    {selectedPattern.subjects_details?.length || 0}
                  </div>
                </Card>
              </div>
            </Card>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={() => navigate(`${basePath}/tests`)}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              {id ? 'Update Test' : 'Create Test'}
            </Button>
          </div>
        </Space>
      </Form>
    </div>
  );
};

export default CreateTest;
