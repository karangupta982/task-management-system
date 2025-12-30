import API from './api';

export const taskService = {
  getTasks: async (page = 1, limit = 10) => {
    const response = await API.get(`/tasks?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTask: async (id) => {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  addCollaborator: async (taskId, collaboratorData) => {
    const response = await API.post(`/tasks/${taskId}/collaborators`, collaboratorData);
    return response.data;
  },

  removeCollaborator: async (taskId, userId) => {
    const response = await API.delete(`/tasks/${taskId}/collaborators/${userId}`);
    return response.data;
  },

  updateStatus: async (taskId, status) => {
    const response = await API.put(`/tasks/${taskId}/status`, { status });
    return response.data;
  }
};