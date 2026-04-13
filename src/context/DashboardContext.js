import React, { createContext, useContext, useState, useCallback } from 'react';
import { assessmentService } from '../services/assessmentService';

const DashboardContext = createContext();

// Provider component
export const DashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (params) => {
    if (!params.testId) {
      setDashboardData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await assessmentService.getSubmittedTestScore({
        page: 1,
        limit: 1000,
        ...params
      });

      const submissions = response.data?.data || [];

      if (submissions.length === 0) {
        setDashboardData(null);
        return;
      }

      const processedData = processDashboardData(submissions, params.filterType);
      setDashboardData(processedData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch students for dropdown
  const fetchStudents = useCallback(async (params) => {
    try {
      const response = await assessmentService.getSubmittedTestScore({
        page: 1,
        limit: 1000,
        ...params
      });
      setStudents(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    }
  }, []);

  // Process dashboard data based on filter type
  const processDashboardData = (submissions, filterType) => {
    const totalSubmissions = submissions.length;
    const scores = submissions.map(s => s.percentageScore || 0);
    const avgScore = scores.reduce((a, b) => a + b, 0) / totalSubmissions;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    let stats = {};

    if (filterType === 'student') {
      // Individual student metrics
      const student = submissions[0];
      stats = {
        totalMarks: student.totalTestMarks || 0,
        scoredMarks: student.totalScoredMarks || 0,
        percentageScore: (student.percentageScore || 0).toFixed(2),
        totalQuestions: student.questionsToAttempt || 0,
        correctAnswers: student.totalCorrectAnswers || 0,
        accuracy: student.questionsToAttempt > 0
          ? ((student.totalCorrectAnswers / student.questionsToAttempt) * 100).toFixed(2)
          : 0
      };
    } else {
      // Group metrics
      stats = {
        totalSubmissions,
        avgScore: avgScore.toFixed(2),
        highestScore: highestScore.toFixed(2),
        lowestScore: lowestScore.toFixed(2)
      };
    }

    // Score distribution
    const scoreRanges = [
      { range: '0-20%', count: 0, fill: '#0088FE' },
      { range: '21-40%', count: 0, fill: '#00C49F' },
      { range: '41-60%', count: 0, fill: '#FFBB28' },
      { range: '61-80%', count: 0, fill: '#FF8042' },
      { range: '81-100%', count: 0, fill: '#8884D8' }
    ];

    submissions.forEach(s => {
      const score = s.percentageScore || 0;
      if (score <= 20) scoreRanges[0].count++;
      else if (score <= 40) scoreRanges[1].count++;
      else if (score <= 60) scoreRanges[2].count++;
      else if (score <= 80) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });

    let branchPerformance = [];
    let topPerformers = [];
    let subjectPerformance = [];
    let questionAnalysis = null;
    let timeAnalysis = null;

    if (filterType === 'student') {
      const student = submissions[0];

      topPerformers = [{
        name: truncateText(student.firstName || 'Unknown', 15),
        score: parseFloat((student.percentageScore || 0).toFixed(2))
      }];

      // Question analysis
      questionAnalysis = [
        {
          category: 'Correct',
          count: student.totalCorrectAnswers || 0,
          fill: '#52c41a'
        },
        {
          category: 'Incorrect',
          count: student.totalIncorrectAnswers || 0,
          fill: '#ff4d4f'
        },
        {
          category: 'Skipped',
          count: student.totalSkippedAnswers || 0,
          fill: '#d9d9d9'
        }
      ];

      // Time analysis
      timeAnalysis = {
        totalTime: student.totalDuration || 0,
        avgTimePerQuestion: student.averageTimeForSingleQuestion || 0,
        totalQuestions: student.questionsToAttempt || 0
      };

      // Subject-wise performance
      if (student.testDetails?.subjectDetails) {
        subjectPerformance = student.testDetails.subjectDetails.map(subject => ({
          subject: truncateText(subject.subjectName, 20),
          percentage: parseFloat(((subject.scoredMarks / subject.totalMarks) * 100).toFixed(2)),
          correct: subject.correctAnswers || 0,
          incorrect: subject.incorrectAnswers || 0,
          skipped: subject.skippedAnswers || 0
        }));
      }
    } else {
      // Branch performance
      const branchMap = {};
      submissions.forEach(s => {
        const branch = s.branchName || 'Unknown';
        if (!branchMap[branch]) {
          branchMap[branch] = { branch, totalScore: 0, count: 0 };
        }
        branchMap[branch].totalScore += s.percentageScore || 0;
        branchMap[branch].count++;
      });

      branchPerformance = Object.values(branchMap)
        .map(b => ({
          branch: truncateText(b.branch, 20),
          avgScore: parseFloat((b.totalScore / b.count).toFixed(2))
        }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 10);

      // Top performers
      topPerformers = [...submissions]
        .sort((a, b) => (b.percentageScore || 0) - (a.percentageScore || 0))
        .slice(0, 10)
        .map(s => ({
          name: truncateText(s.firstName || 'Unknown', 15),
          score: parseFloat((s.percentageScore || 0).toFixed(2))
        }));
    }

    return {
      stats,
      scoreDistribution: scoreRanges,
      branchPerformance,
      topPerformers,
      subjectPerformance,
      questionAnalysis,
      timeAnalysis
    };
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Clear dashboard data
  const clearDashboardData = useCallback(() => {
    setDashboardData(null);
    setError(null);
  }, []);

  // Clear students
  const clearStudents = useCallback(() => {
    setStudents([]);
  }, []);

  const value = {
    loading,
    dashboardData,
    students,
    error,
    fetchDashboardData,
    fetchStudents,
    clearDashboardData,
    clearStudents
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;
