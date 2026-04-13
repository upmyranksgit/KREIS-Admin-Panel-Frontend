import api from '../utils/api';

export const commonService = {
  // Get institutes - uses page, limit, searchKey
  getInstitutes: (params) => api.get('/institutes', { params }),
  
  // Get branches - uses page, limit, instituteId, boardId, searchKey
  getBranches: (params) => api.get('/branch', { params }),
  
  // Get batches - uses page, limit, branchIds, instituteId, searchKey
  getBatches: (params) => api.get('/batch', { params }),
  
  // Get categories (if available)
  getCategories: (params) => api.get('/category', { params }),
  
  // Get courses
  getCourses: (params) => api.get('/course', { params }),
  
  // Get questions V2
  getQuestionsV2: (params) => api.get('/question-bank-v2/questions', { params })
};
