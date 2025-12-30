import API from './api';

export const userService = {
  searchUsers: async (username) => {
    const response = await API.get(`/users/search?username=${username}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  },

  getNotifications: async () => {
    const response = await API.get('/users/notifications');
    return response.data;
  }
};