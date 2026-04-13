import api from '../utils/api';

export const assessmentService = {
  // Test Pattern APIs
  createTestPattern: (data) => api.post('/assessment/test-pattern', data),
  getTestPatterns: (params) => api.get('/assessment/test-pattern', { params }),
  editTestPattern: (data) => api.patch('/assessment/test-pattern', data),
  deleteTestPattern: (data) => api.delete('/assessment/test-pattern', { data }),

  // Institute Test APIs
  createInstituteTest: (data) => api.post('/assessment/institute-test', data),
  getInstituteTests: (params) => api.get('/assessment/institute-test', { params }),
  updateInstituteTest: (data) => api.put('/assessment/institute-test', data),
  deleteInstituteTest: (data) => api.delete('/assessment/institute-test', { data }),
  duplicateTest: (data) => api.post('/assessment/duplicate-test', data),
  addInstituteBatchToTest: (data) => api.post('/assessment/add-institute-batch-to-test', data),

  // Test Submissions
  getAllSubmittedTests: (params) => api.get('/assessment/institute-test/submit-test', { params }),
  getTestAnalytics: (params) => api.get('/assessment/test-analytics', { params }),
  getTestStartedStudents: (params) => api.get('/assessment/test-started-students', { params }),
  getSubmittedTestScore: (params) => api.get('/assessment/submitted-score', { params }),
  getTestScoreInExcel: (params) => api.get('/assessment/submitted-score-excel', { params }),
  
  // Dashboard APIs
  assessmentDashboard: (params) => api.get('/assessment/assessment-dashboard', { params })
};
