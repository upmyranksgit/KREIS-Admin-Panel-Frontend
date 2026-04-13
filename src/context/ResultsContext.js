import React, { createContext, useContext, useState, useCallback } from 'react';
import { assessmentService } from '../services/assessmentService';

const ResultsContext = createContext();

// Provider component
export const ResultsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [error, setError] = useState(null);

  // Fetch results data
  const fetchResultsData = useCallback(async (params) => {
    if (!params.testId) {
      setResultsData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await assessmentService.getSubmittedTestScore({
        page: params.page || 1,
        limit: params.limit || 10,
        ...params
      });

      const data = response.data?.data || [];
      const total = response.data?.total || 0;

      setResultsData(data);
      setPagination(prev => ({
        ...prev,
        current: params.page || 1,
        total
      }));
    } catch (err) {
      console.error('Error fetching results data:', err);
      setError(err.message || 'Failed to fetch results data');
      setResultsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle pagination change
  const handlePaginationChange = useCallback((page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  }, []);

  // Handle row expansion
  const handleExpand = useCallback((expanded, record) => {
    if (expanded) {
      setExpandedRowKeys(prev => [...prev, record.studentId]);
    } else {
      setExpandedRowKeys(prev => prev.filter(key => key !== record.studentId));
    }
  }, []);

  // Toggle row expansion
  const toggleRowExpansion = useCallback((studentId) => {
    setExpandedRowKeys(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(key => key !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  }, []);

  // Show question modal
  const showQuestionModal = useCallback((question) => {
    setSelectedQuestion(question);
    setQuestionModalVisible(true);
  }, []);

  // Hide question modal
  const hideQuestionModal = useCallback(() => {
    setQuestionModalVisible(false);
    setSelectedQuestion(null);
  }, []);

  // Clear results data
  const clearResultsData = useCallback(() => {
    setResultsData([]);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
    setExpandedRowKeys([]);
    setError(null);
  }, []);

  // Export to Excel
  const exportToExcel = useCallback(async (params) => {
    try {
      setLoading(true);
      
      // Fetch all data for export
      const response = await assessmentService.getSubmittedTestScore({
        page: 1,
        limit: 10000,
        ...params
      });

      const data = response.data?.data || [];
      
      // Transform data for Excel
      const excelData = data.map(record => ({
        'Student Name': `${record.firstName || ''} ${record.lastName || ''}`.trim(),
        'Branch': record.branchName || 'N/A',
        'Batch': record.batchName || 'N/A',
        'Scored Marks': record.totalScoredMarks || 0,
        'Total Marks': record.totalTestMarks || 0,
        'Percentage': `${(record.percentageScore || 0).toFixed(2)}%`,
        'Correct Answers': record.totalCorrectAnswers || 0,
        'Incorrect Answers': record.totalIncorrectAnswers || 0,
        'Skipped': record.totalSkippedAnswers || 0,
        'Time Taken (min)': Math.floor(record.totalDuration || 0),
        'Status': record.percentageScore >= 60 ? 'Pass' : 'Fail'
      }));

      return excelData;
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    resultsData,
    pagination,
    expandedRowKeys,
    selectedQuestion,
    questionModalVisible,
    error,
    fetchResultsData,
    handlePaginationChange,
    handleExpand,
    toggleRowExpansion,
    showQuestionModal,
    hideQuestionModal,
    clearResultsData,
    exportToExcel
  };

  return (
    <ResultsContext.Provider value={value}>
      {children}
    </ResultsContext.Provider>
  );
};

// Custom hook to use results context
export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

export default ResultsContext;
