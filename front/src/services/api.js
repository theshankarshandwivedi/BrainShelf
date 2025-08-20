// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request:', { url, method: config.method || 'GET', headers: config.headers });

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(`${response.status}: ${data.message || 'API request failed'}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Project methods
  async getAllProjects() {
    return this.request('/projects');
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async uploadProject(formData) {
    // For file uploads, don't set Content-Type header
    const token = localStorage.getItem('authToken');
    const config = {
      method: 'POST',
      body: formData,
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_BASE_URL}/projects`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  // Rating methods
  async rateProject(projectId, rating) {
    return this.request(`/projects/${projectId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  async getUserRating(projectId) {
    return this.request(`/projects/${projectId}/rating`);
  }

  async getProjectRatings(projectId) {
    return this.request(`/projects/${projectId}/ratings`);
  }

  // User profile methods
  async getUserProfile(username) {
    return this.request(`/users/${username}`);
  }

  async getUserProjects(userId) {
    return this.request(`/users/${userId}/projects`);
  }

  async updateUserProfile(userId, profileData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadAvatar(userId, formData) {
    const token = localStorage.getItem('authToken');
    const config = {
      method: 'POST',
      body: formData,
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Avatar upload failed');
    }

    return data;
  }
}

export default new ApiService();
