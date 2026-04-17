import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space, message, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentService } from '../../services/assessmentService';
import { authService } from '../../services/authService';
import api from '../../utils/api';

const { TextArea } = Input;
const { Option } = Select;

const CreateTestPattern = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [activeSubjectTab, setActiveSubjectTab] = useState('0');
  const [subjectSections, setSubjectSections] = useState({});

  useEffect(() => {
    fetchGrades();
    if (id) {
      fetchPatternDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchGrades = async () => {
    try {
      const response = await api.get('/question-bank/courses', { params: { page: 1, limit: 100 } });
      setGrades(response.data?.data || []);
    } catch (error) {
      message.error('Failed to fetch grades');
    }
  };

  const fetchSubjects = async (gradeId) => {
    try {
      const response = await api.get('/question-bank/subjects', { 
        params: { courseId: gradeId, page: 1, limit: 100 } 
      });
      setSubjects(response.data?.data || []);
    } catch (error) {
      message.error('Failed to fetch subjects');
    }
  };

  const fetchPatternDetails = async () => {
    try {
      const response = await assessmentService.getTestPatterns({ test_id: id, skip: 0, limit: 1 });
      const pattern = response.data?.data?.[0];
      if (pattern) {
        form.setFieldsValue({
          test_name: pattern.test_name,
          test_duration: pattern.test_duration,
          instruction_text: pattern.instruction_text,
          course_id: pattern.course_details?.course_id
        });
        setSelectedGrade(pattern.course_details?.course_id);
        await fetchSubjects(pattern.course_details?.course_id);
        
        const subjectIds = pattern.subjects_details?.map(s => s.subject_id) || [];
        setSelectedSubjects(subjectIds);
        
        const sections = {};
        pattern.subjects_details?.forEach(subject => {
          sections[subject.subject_id] = subject.sections || [];
        });
        setSubjectSections(sections);
      }
    } catch (error) {
      message.error('Failed to fetch pattern details');
    }
  };

  const handleGradeChange = async (gradeId) => {
    setSelectedGrade(gradeId);
    setSelectedSubjects([]);
    setSubjectSections({});
    await fetchSubjects(gradeId);
  };

  const handleSubjectsChange = (subjectIds) => {
    setSelectedSubjects(subjectIds);
    const newSections = { ...subjectSections };
    subjectIds.forEach(subjectId => {
      if (!newSections[subjectId]) {
        newSections[subjectId] = [];
      }
    });
    Object.keys(newSections).forEach(key => {
      if (!subjectIds.includes(key)) {
        delete newSections[key];
      }
    });
    setSubjectSections(newSections);
    if (subjectIds.length > 0) {
      setActiveSubjectTab(subjectIds[0]);
    }
  };

  const addSection = (subjectId) => {
    const newSection = {
      section_name: `Section ${(subjectSections[subjectId]?.length || 0) + 1}`,
      question_type: 'MCQ',
      questions_from: 1,
      questions_to: 10,
      marks_per_question: 1,
      negative_marks: 0,
      optional_question: 0
    };
    setSubjectSections({
      ...subjectSections,
      [subjectId]: [...(subjectSections[subjectId] || []), newSection]
    });
  };

  const updateSection = (subjectId, sectionIndex, field, value) => {
    const updatedSections = [...subjectSections[subjectId]];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value
    };
    setSubjectSections({
      ...subjectSections,
      [subjectId]: updatedSections
    });
  };

  const deleteSection = (subjectId, sectionIndex) => {
    const updatedSections = subjectSections[subjectId].filter((_, idx) => idx !== sectionIndex);
    setSubjectSections({
      ...subjectSections,
      [subjectId]: updatedSections
    });
  };

  const calculateTotals = () => {
    let totalQuestions = 0;
    let totalMarks = 0;

    Object.keys(subjectSections).forEach(subjectId => {
      subjectSections[subjectId]?.forEach(section => {
        const questionsCount = section.optional_question > 0 
          ? section.optional_question 
          : (section.questions_to - section.questions_from + 1);
        totalQuestions += questionsCount;
        totalMarks += questionsCount * section.marks_per_question;
      });
    });

    return { totalQuestions, totalMarks };
  };

  const handleSubmit = async (values) => {
    if (selectedSubjects.length === 0) {
      message.error('Please select at least one subject');
      return;
    }

    const hasEmptySections = selectedSubjects.some(subjectId => 
      !subjectSections[subjectId] || subjectSections[subjectId].length === 0
    );

    if (hasEmptySections) {
      message.error('Each subject must have at least one section');
      return;
    }

    const { totalQuestions, totalMarks } = calculateTotals();

    const payload = {
      test_name: values.test_name,
      test_duration: values.test_duration,
      total_marks: totalMarks,
      total_questions: totalQuestions,
      instruction_text: values.instruction_text,
      course_details: {
        course_id: selectedGrade,
        course_name: grades.find(g => g._id === selectedGrade)?.name || ''
      },
      subjects_details: selectedSubjects.map(subjectId => {
        const subject = subjects.find(s => s._id === subjectId);
        const sections = subjectSections[subjectId] || [];
        const totalSubjectQuestions = sections.reduce((sum, section) => {
          return sum + (section.optional_question > 0 
            ? section.optional_question 
            : (section.questions_to - section.questions_from + 1));
        }, 0);

        return {
          subject_id: subjectId,
          subject_name: subject?.name || '',
          total_questions_for_subject: totalSubjectQuestions,
          sections: sections.map(section => ({
            ...section,
            questions_list: []
          }))
        };
      })
    };

    setLoading(true);
    try {
      if (id) {
        await assessmentService.editTestPattern({ ...payload, test_id: id });
        message.success('Pattern updated successfully');
      } else {
        await assessmentService.createTestPattern(payload);
        message.success('Pattern created successfully');
      }
      navigate(`${basePath}/test-patterns`);
    } catch (error) {
      message.error(id ? 'Failed to update pattern' : 'Failed to create pattern');
    } finally {
      setLoading(false);
    }
  };

  const { totalQuestions, totalMarks } = calculateTotals();

  const renderSectionForm = (subjectId) => {
    const sections = subjectSections[subjectId] || [];

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {sections.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--color-neutral-500)', marginBottom: '16px' }}>
              No sections added yet. Add a section to get started.
            </p>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addSection(subjectId)}>
              Add Section
            </Button>
          </Card>
        ) : (
          <>
            {sections.map((section, index) => (
              <Card
                key={index}
                title={`Section ${index + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteSection(subjectId, index)}
                  >
                    Delete
                  </Button>
                }
                style={{ borderRadius: '8px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Input
                    placeholder="Section Name"
                    value={section.section_name}
                    onChange={(e) => updateSection(subjectId, index, 'section_name', e.target.value)}
                  />
                  <Select
                    placeholder="Question Type"
                    value={section.question_type}
                    onChange={(value) => updateSection(subjectId, index, 'question_type', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="MCQ">MCQ</Option>
                    <Option value="TRUE_FALSE">True/False</Option>
                    <Option value="FILL_IN_THE_BLANKS">Fill in the Blanks</Option>
                    <Option value="DESCRIPTIVE">Descriptive</Option>
                  </Select>
                  <Space>
                    <InputNumber
                      placeholder="From Question"
                      min={1}
                      value={section.questions_from}
                      onChange={(value) => updateSection(subjectId, index, 'questions_from', value)}
                    />
                    <InputNumber
                      placeholder="To Question"
                      min={section.questions_from}
                      value={section.questions_to}
                      onChange={(value) => updateSection(subjectId, index, 'questions_to', value)}
                    />
                  </Space>
                  <Space>
                    <InputNumber
                      placeholder="Marks per Question"
                      min={0}
                      value={section.marks_per_question}
                      onChange={(value) => updateSection(subjectId, index, 'marks_per_question', value)}
                    />
                    <InputNumber
                      placeholder="Negative Marks"
                      min={0}
                      value={section.negative_marks}
                      onChange={(value) => updateSection(subjectId, index, 'negative_marks', value)}
                    />
                    <InputNumber
                      placeholder="Optional Questions"
                      min={0}
                      value={section.optional_question}
                      onChange={(value) => updateSection(subjectId, index, 'optional_question', value)}
                    />
                  </Space>
                </Space>
              </Card>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => addSection(subjectId)}
              block
              style={{ height: '48px' }}
            >
              Add Another Section
            </Button>
          </>
        )}
      </Space>
    );
  };

  const subjectTabs = selectedSubjects.map(subjectId => {
    const subject = subjects.find(s => s._id === subjectId);
    return {
      key: subjectId,
      label: subject?.name || 'Subject',
      children: renderSectionForm(subjectId)
    };
  });

  return (
    <div style={{ background: 'var(--color-neutral-50)', minHeight: 'calc(100vh - 64px)', padding: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`${basePath}/test-patterns`)}
          style={{ marginBottom: '16px' }}
        >
          Back to Patterns
        </Button>
        <h1 style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 700,
          color: 'var(--color-neutral-800)',
          margin: 0,
          marginBottom: 'var(--spacing-sm)'
        }}>
          {id ? 'Edit Test Pattern' : 'Create Test Pattern'}
        </h1>
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--color-neutral-500)',
          margin: 0
        }}>
          Define the structure and rules for your assessment
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Basic Information" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Form.Item
                name="test_name"
                label="Pattern Name"
                rules={[{ required: true, message: 'Please enter pattern name' }]}
              >
                <Input placeholder="Enter pattern name" size="large" />
              </Form.Item>

              <Form.Item
                name="course_id"
                label="Select Grade"
                rules={[{ required: true, message: 'Please select a grade' }]}
              >
                <Select
                  placeholder="Select grade"
                  size="large"
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
                label="Select Subjects"
                rules={[{ required: true, message: 'Please select at least one subject' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select subjects"
                  size="large"
                  value={selectedSubjects}
                  onChange={handleSubjectsChange}
                  disabled={!selectedGrade}
                >
                  {subjects.map(subject => (
                    <Option key={subject._id} value={subject._id}>{subject.name}</Option>
                  ))}
                </Select>
              </Form.Item>

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

              <div style={{ display: 'flex', gap: '24px' }}>
                <Card size="small" style={{ flex: 1, background: 'var(--color-info-bg)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-neutral-600)' }}>Total Questions</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {totalQuestions}
                  </div>
                </Card>
                <Card size="small" style={{ flex: 1, background: 'var(--color-success-bg)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-neutral-600)' }}>Total Marks</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-success)' }}>
                    {totalMarks}
                  </div>
                </Card>
              </div>
            </Space>
          </Card>

          {selectedSubjects.length > 0 && (
            <Card title="Subject Sections" style={{ borderRadius: '12px' }}>
              <Tabs
                activeKey={activeSubjectTab}
                onChange={setActiveSubjectTab}
                items={subjectTabs}
              />
            </Card>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={() => navigate(`${basePath}/test-patterns`)}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              {id ? 'Update Pattern' : 'Create Pattern'}
            </Button>
          </div>
        </Space>
      </Form>
    </div>
  );
};

export default CreateTestPattern;
