import API from './api';

const marksService = {
  getByStudent: (studentId) => API.get(`/students/${studentId}/marks`),
  upsert: (studentId, data) => API.post(`/students/${studentId}/marks`, data),
  delete: (markId) => API.delete(`/marks/${markId}`),
  getSubjects: () => API.get('/subjects'),
};

export default marksService;
