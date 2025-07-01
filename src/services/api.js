import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

// Owners API
export const ownersAPI = {
  getAll: () => api.get('/owners'),
  getById: (id) => api.get(`/owners/${id}`),
  create: (ownerData) => api.post('/owners', ownerData),
  update: (id, ownerData) => api.put(`/owners/${id}`, ownerData),
  delete: (id) => api.delete(`/owners/${id}`),
  getMyOwners: () => api.get('/owners/my-owners'),
};

// Apartments API
export const apartmentsAPI = {
  getAll: () => api.get('/apartments'),
  getById: (id) => api.get(`/apartments/${id}`),
  create: (apartmentData) => api.post('/apartments', apartmentData),
  update: (id, apartmentData) => api.put(`/apartments/${id}`, apartmentData),
  delete: (id) => api.delete(`/apartments/${id}`),
  getMyApartments: () => api.get('/apartments/my-apartments'),
};

// Payments API
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (paymentData) => api.post('/payments', paymentData),
  update: (id, paymentData) => api.put(`/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/payments/${id}`),
  getMyPayments: () => api.get('/payments/my-payments'),
  processPayment: (paymentData) => api.post('/payments/process', paymentData),
};

// PQRS API
export const pqrsAPI = {
  getAll: () => api.get('/pqrs'),
  getById: (id) => api.get(`/pqrs/${id}`),
  create: (pqrsData) => api.post('/pqrs', pqrsData),
  update: (id, pqrsData) => api.put(`/pqrs/${id}`, pqrsData),
  delete: (id) => api.delete(`/pqrs/${id}`),
  getMyPQRS: () => api.get('/pqrs/my-pqrs'),
  updateStatus: (id, status) => api.put(`/pqrs/${id}/status`, { status }),
};

// Reservations API
export const reservationsAPI = {
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (reservationData) => api.post('/reservations', reservationData),
  update: (id, reservationData) => api.put(`/reservations/${id}`, reservationData),
  delete: (id) => api.delete(`/reservations/${id}`),
  getMyReservations: () => api.get('/reservations/my-reservations'),
  getAvailableSlots: (facilityId, date) => api.get(`/reservations/available-slots/${facilityId}`, { params: { date } }),
};

// Parking API
export const parkingAPI = {
  getAll: () => api.get('/parking'),
  getById: (id) => api.get(`/parking/${id}`),
  create: (parkingData) => api.post('/parking', parkingData),
  update: (id, parkingData) => api.put(`/parking/${id}`, parkingData),
  delete: (id) => api.delete(`/parking/${id}`),
  getMyParking: () => api.get('/parking/my-parking'),
  assignParking: (parkingId, userId) => api.put(`/parking/${parkingId}/assign`, { userId }),
  releaseParking: (parkingId) => api.put(`/parking/${parkingId}/release`),
};

// Pets API
export const petsAPI = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (petData) => api.post('/pets', petData),
  update: (id, petData) => api.put(`/pets/${id}`, petData),
  delete: (id) => api.delete(`/pets/${id}`),
  getMyPets: () => api.get('/pets/my-pets'),
  uploadPhoto: (id, formData) => api.post(`/pets/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Visitors API
export const visitorsAPI = {
  getAll: () => api.get('/visitors'),
  getById: (id) => api.get(`/visitors/${id}`),
  create: (visitorData) => api.post('/visitors', visitorData),
  update: (id, visitorData) => api.put(`/visitors/${id}`, visitorData),
  delete: (id) => api.delete(`/visitors/${id}`),
  registerEntry: (visitorData) => api.post('/visitors/entry', visitorData),
  registerExit: (visitorId) => api.put(`/visitors/${visitorId}/exit`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (notificationData) => api.post('/notifications', notificationData),
  update: (id, notificationData) => api.put(`/notifications/${id}`, notificationData),
  delete: (id) => api.delete(`/notifications/${id}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  getUnread: () => api.get('/notifications/unread'),
};

// Surveys API
export const surveysAPI = {
  getAll: () => api.get('/surveys'),
  getById: (id) => api.get(`/surveys/${id}`),
  create: (surveyData) => api.post('/surveys', surveyData),
  update: (id, surveyData) => api.put(`/surveys/${id}`, surveyData),
  delete: (id) => api.delete(`/surveys/${id}`),
  submitResponse: (surveyId, responses) => api.post(`/surveys/${surveyId}/respond`, { responses }),
  getResults: (surveyId) => api.get(`/surveys/${surveyId}/results`),
};

// Guards API
export const guardsAPI = {
  getAll: () => api.get('/guards'),
  getById: (id) => api.get(`/guards/${id}`),
  create: (guardData) => api.post('/guards', guardData),
  update: (id, guardData) => api.put(`/guards/${id}`, guardData),
  delete: (id) => api.delete(`/guards/${id}`),
};

// File Upload API
export const fileUploadAPI = {
  upload: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api; 