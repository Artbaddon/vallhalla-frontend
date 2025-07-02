import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
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
      console.log('Request with token:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenPreview: token.substring(0, 20) + '...'
      });
    } else {
      console.log('Request without token:', {
        url: config.url,
        method: config.method
      });
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('Token expired or invalid, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to normalize response data
const normalizeData = (response) => {
  // Check if response has specific data structure
  if (response.data?.owners) return response.data.owners;
  if (response.data?.payments) return response.data.payments;
  if (response.data?.pqrs) return response.data.pqrs;
  if (response.data?.reservations) return response.data.reservations;
  if (response.data?.apartments) return response.data.apartments;
  if (response.data?.users) return response.data.users;
  if (response.data?.notifications) return response.data.notifications;
  if (response.data?.pets) return response.data.pets;
  if (response.data?.visitors) return response.data.visitors;
  if (response.data?.parking) return response.data.parking;
  if (response.data?.surveys) return response.data.surveys;
  if (response.data?.questions) return response.data.questions;
  if (response.data?.answers) return response.data.answers;
  
  // Default: return the data object itself
  return response.data;
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  validateToken: () => api.get('/auth/validate-token'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, new_password: newPassword }),
  changePassword: (oldPassword, newPassword) => api.post('/auth/change-password', { old_password: oldPassword, new_password: newPassword }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users').then(normalizeData),
  getDetails: () => api.get('/users/details').then(normalizeData),
  getById: (id) => api.get(`/users/${id}`).then(normalizeData),
  searchByName: (name) => api.get(`/users/search?name=${name}`).then(normalizeData),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  updateStatus: (id, statusId) => api.patch(`/users/${id}/status`, { status_id: statusId }),
  delete: (id) => api.delete(`/users/${id}`),
};

// Profile API
export const profileAPI = {
  getAll: () => api.get('/profile').then(normalizeData),
  getMyProfile: () => api.get('/profile/me').then(normalizeData),
  getById: (id) => api.get(`/profile/${id}`).then(normalizeData),
  create: (profileData) => api.post('/profile', profileData),
  update: (id, profileData) => api.put(`/profile/${id}`, profileData),
  delete: (id) => api.delete(`/profile/${id}`),
};

// Owners API
export const ownersAPI = {
  getAll: () => api.get('/owners').then(response => {
    // Special handling for owners endpoint
    if (response.data && response.data.owners) {
      return { data: response.data.owners };
    }
    return response;
  }),
  getDetails: () => api.get('/owners/details').then(normalizeData),
  getById: (id) => api.get(`/owners/${id}`).then(normalizeData),
  getDetailById: (id) => api.get(`/owners/${id}/details`).then(normalizeData),
  getByUserId: (userId) => api.get(`/owners/search?user_id=${userId}`).then(normalizeData),
  getTenantStatus: () => api.get('/owners/tenant-status').then(normalizeData),
  create: (ownerData) => api.post('/owners', ownerData),
  update: (id, ownerData) => api.put(`/owners/${id}`, ownerData),
  delete: (id) => api.delete(`/owners/${id}`),
};

// Apartments API
export const apartmentsAPI = {
  getAll: () => api.get('/apartments').then(normalizeData),
  getDetails: () => api.get('/apartments/details').then(normalizeData),
  getById: (id) => api.get(`/apartments/${id}`).then(normalizeData),
  getWithDetails: (id) => api.get(`/apartments/${id}/details`).then(normalizeData),
  searchByNumber: (number) => api.get(`/apartments/search/number?apartment_number=${number}`).then(normalizeData),
  searchByOwner: (ownerId) => api.get(`/apartments/search/owner?owner_id=${ownerId}`).then(normalizeData),
  searchByStatus: (statusId) => api.get(`/apartments/search/status?status_id=${statusId}`).then(normalizeData),
  searchByTower: (towerId) => api.get(`/apartments/search/tower?tower_id=${towerId}`).then(normalizeData),
  getOccupancyReport: () => api.get('/apartments/report/occupancy').then(normalizeData),
  create: (apartmentData) => api.post('/apartments', apartmentData),
  update: (id, apartmentData) => api.put(`/apartments/${id}`, apartmentData),
  updateStatus: (id, statusId) => api.patch(`/apartments/${id}/status`, { status_id: statusId }),
  delete: (id) => api.delete(`/apartments/${id}`),
};

// Payments API
export const paymentsAPI = {
  getAll: () => api.get('/payments').then(response => {
    if (response.data && response.data.payments) {
      return { data: response.data.payments };
    }
    return response;
  }),
  getStats: () => api.get('/payments/stats').then(normalizeData),
  getById: (id) => api.get(`/payments/${id}`).then(normalizeData),
  getByOwner: (ownerId) => api.get(`/payments/owner/${ownerId}`).then(normalizeData),
  create: (paymentData) => api.post('/payments', paymentData),
  update: (id, paymentData) => api.put(`/payments/${id}`, paymentData),
  delete: (id) => api.delete(`/payments/${id}`),
};

// PQRS API
export const pqrsAPI = {
  getAll: () => api.get('/pqrs').then(response => {
    if (response.data && response.data.pqrs) {
      return { data: response.data.pqrs };
    }
    return response;
  }),
  search: (params) => api.get('/pqrs/search', { params }).then(normalizeData),
  getStats: () => api.get('/pqrs/stats').then(normalizeData),
  getById: (id) => api.get(`/pqrs/${id}`).then(normalizeData),
  getByOwner: (ownerId) => api.get(`/pqrs/owner/${ownerId}`).then(normalizeData),
  getByStatus: (statusId) => api.get(`/pqrs/status/${statusId}`).then(normalizeData),
  getByCategory: (categoryId) => api.get(`/pqrs/category/${categoryId}`).then(normalizeData),
  create: (pqrsData) => api.post('/pqrs', pqrsData),
  update: (id, pqrsData) => api.put(`/pqrs/${id}`, pqrsData),
  updateStatus: (id, statusId) => api.put(`/pqrs/${id}/status`, { status_id: statusId }),
  delete: (id) => api.delete(`/pqrs/${id}`),
};

// PQRS Categories API
export const pqrsCategoriesAPI = {
  getAll: () => api.get('/pqrs-categories').then(normalizeData),
  getById: (id) => api.get(`/pqrs-categories/${id}`).then(normalizeData),
  create: (categoryData) => api.post('/pqrs-categories', categoryData),
  update: (id, categoryData) => api.put(`/pqrs-categories/${id}`, categoryData),
  delete: (id) => api.delete(`/pqrs-categories/${id}`),
};

// Reservations API
export const reservationsAPI = {
  getAll: () => api.get('/reservations').then(response => {
    if (response.data && response.data.reservations) {
      return { data: response.data.reservations };
    }
    return response;
  }),
  getById: (id) => api.get(`/reservations/${id}`).then(normalizeData),
  getByOwner: (ownerId) => api.get(`/reservations/owner/${ownerId}`).then(normalizeData),
  getByDateRange: (startDate, endDate) => api.get(`/reservations/date-range?start_date=${startDate}&end_date=${endDate}`).then(normalizeData),
  create: (reservationData) => api.post('/reservations', reservationData),
  update: (id, reservationData) => api.put(`/reservations/${id}`, reservationData),
  delete: (id) => api.delete(`/reservations/${id}`),
};

// Reservation Status API
export const reservationStatusAPI = {
  getAll: () => api.get('/reservation-status').then(normalizeData),
  getById: (id) => api.get(`/reservation-status/${id}`).then(normalizeData),
  create: (statusData) => api.post('/reservation-status', statusData),
  update: (id, statusData) => api.put(`/reservation-status/${id}`, statusData),
  delete: (id) => api.delete(`/reservation-status/${id}`),
};

// Reservation Type API
export const reservationTypeAPI = {
  getAll: () => api.get('/reservation-type').then(normalizeData),
  getById: (id) => api.get(`/reservation-type/${id}`).then(normalizeData),
  create: (typeData) => api.post('/reservation-type', typeData),
  update: (id, typeData) => api.put(`/reservation-type/${id}`, typeData),
  delete: (id) => api.delete(`/reservation-type/${id}`),
};

// Parking API
export const parkingAPI = {
  getAll: () => api.get('/parking').then(response => {
    if (response.data && response.data.parking) {
      return { data: response.data.parking };
    }
    return response;
  }),
  getById: (id) => api.get(`/parking/${id}`).then(normalizeData),
  create: (parkingData) => api.post('/parking', parkingData),
  assignVehicle: (parkingId, vehicleId) => api.post('/parking/assignVehicle', { parking_id: parkingId, vehicle_id: vehicleId }),
  update: (id, parkingData) => api.put(`/parking/${id}`, parkingData),
  delete: (id) => api.delete(`/parking/${id}`),
};

// Pets API
export const petsAPI = {
  getAll: () => api.get('/pets').then(response => {
    if (response.data && response.data.pets) {
      return { data: response.data.pets };
    }
    return response;
  }),
  getById: (id) => api.get(`/pets/${id}`).then(normalizeData),
  create: (petData) => api.post('/pets', petData),
  update: (id, petData) => api.put(`/pets/${id}`, petData),
  delete: (id) => api.delete(`/pets/${id}`),
};

// Visitors API
export const visitorsAPI = {
  getAll: () => api.get('/visitors').then(response => {
    if (response.data && response.data.visitors) {
      return { data: response.data.visitors };
    }
    return response;
  }),
  getById: (id) => api.get(`/visitors/${id}`).then(normalizeData),
  getByHost: (hostId) => api.get(`/visitors/host/${hostId}`).then(normalizeData),
  getByDate: (date) => api.get(`/visitors/date/${date}`).then(normalizeData),
  create: (visitorData) => api.post('/visitors', visitorData),
  update: (id, visitorData) => api.put(`/visitors/${id}`, visitorData),
  delete: (id) => api.delete(`/visitors/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications').then(response => {
    if (response.data && response.data.notifications) {
      return { data: response.data.notifications };
    }
    return response;
  }),
  getStats: () => api.get('/notifications/stats').then(normalizeData),
  getById: (id) => api.get(`/notifications/${id}`).then(normalizeData),
  getByRecipient: (recipientId, recipientType) => api.get(`/notifications/recipient/${recipientId}/${recipientType}`).then(normalizeData),
  getUnread: (recipientId, recipientType) => api.get(`/notifications/unread/${recipientId}/${recipientType}`).then(normalizeData),
  getByType: (typeId) => api.get(`/notifications/type/${typeId}`).then(normalizeData),
  create: (notificationData) => api.post('/notifications', notificationData),
  update: (id, notificationData) => api.put(`/notifications/${id}`, notificationData),
  markAsRead: (id) => api.put(`/notifications/${id}/read`, { read: true }),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Surveys API
export const surveysAPI = {
  getAll: () => api.get('/survey').then(response => {
    if (response.data && response.data.surveys) {
      return { data: response.data.surveys };
    }
    return response;
  }),
  getById: (id) => api.get(`/survey/${id}`).then(normalizeData),
  create: (surveyData) => api.post('/survey', surveyData),
  update: (id, surveyData) => api.put(`/survey/${id}`, surveyData),
  delete: (id) => api.delete(`/survey/${id}`),
};

// Questions API
export const questionsAPI = {
  getById: (id) => api.get(`/question/${id}`).then(normalizeData),
  getBySurvey: (surveyId) => api.get(`/question/bySurvey/${surveyId}`).then(normalizeData),
  create: (questionData) => api.post('/question', questionData),
  update: (id, questionData) => api.put(`/question/${id}`, questionData),
  delete: (id) => api.delete(`/question/${id}`),
};

// Answers API
export const answersAPI = {
  getBySurvey: (surveyId) => api.get(`/answer/bySurvey/${surveyId}`).then(normalizeData),
  getByUser: (userId) => api.get(`/answer/byUser/${userId}`).then(normalizeData),
  create: (answerData) => api.post('/answer', answerData),
  delete: (id) => api.delete(`/answer/${id}`),
};

// Towers API
export const towersAPI = {
  getAll: () => api.get('/towers').then(normalizeData),
  getById: (id) => api.get(`/towers/${id}`).then(normalizeData),
  create: (towerData) => api.post('/towers', towerData),
  update: (id, towerData) => api.put(`/towers/${id}`, towerData),
  delete: (id) => api.delete(`/towers/${id}`),
};

// Vehicle Types API
export const vehicleTypesAPI = {
  getAll: () => api.get('/vehicleType').then(normalizeData),
  getById: (id) => api.get(`/vehicleType/${id}`).then(normalizeData),
  create: (vehicleData) => api.post('/vehicleType', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicleType/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicleType/${id}`),
};

// Apartment Status API
export const apartmentStatusAPI = {
  getAll: () => api.get('/apartment-status').then(normalizeData),
  getById: (id) => api.get(`/apartment-status/${id}`).then(normalizeData),
  create: (statusData) => api.post('/apartment-status', statusData),
  update: (id, statusData) => api.put(`/apartment-status/${id}`, statusData),
  delete: (id) => api.delete(`/apartment-status/${id}`),
};

// Guards API
export const guardsAPI = {
  getAll: () => api.get('/guards').then(normalizeData),
  getById: (id) => api.get(`/guards/${id}`).then(normalizeData),
  getByShift: (shift) => api.get(`/guards/shift/${shift}`).then(normalizeData),
  create: (guardData) => api.post('/guards', guardData),
  update: (id, guardData) => api.put(`/guards/${id}`, guardData),
  delete: (id) => api.delete(`/guards/${id}`),
};

// Facilities API
export const facilitiesAPI = {
  getAll: () => api.get('/facilities').then(normalizeData),
  getAvailability: () => api.get('/facilities/availability').then(normalizeData),
  getByStatus: (status) => api.get(`/facilities/status?status=${status}`).then(normalizeData),
  getById: (id) => api.get(`/facilities/${id}`).then(normalizeData),
  create: (facilityData) => api.post('/facilities', facilityData),
  update: (id, facilityData) => api.put(`/facilities/${id}`, facilityData),
  updateStatus: (id, status) => api.put(`/facilities/${id}/status`, { status }),
  delete: (id) => api.delete(`/facilities/${id}`),
};

// Roles API
export const rolesAPI = {
  getAll: () => api.get('/roles').then(normalizeData),
  getById: (id) => api.get(`/roles/${id}`).then(normalizeData),
  create: (roleData) => api.post('/roles', roleData),
  update: (id, roleData) => api.put(`/roles/${id}`, roleData),
  delete: (id) => api.delete(`/roles/${id}`),
};

// Permissions API
export const permissionsAPI = {
  getAll: () => api.get('/permissions').then(normalizeData),
  getById: (id) => api.get(`/permissions/${id}`).then(normalizeData),
  create: (permissionData) => api.post('/permissions', permissionData),
  update: (id, permissionData) => api.put(`/permissions/${id}`, permissionData),
  delete: (id) => api.delete(`/permissions/${id}`),
};

// Role Permissions API
export const rolePermissionsAPI = {
  getAll: () => api.get('/role-permissions').then(normalizeData),
  getById: (id) => api.get(`/role-permissions/${id}`).then(normalizeData),
  create: (rolePermissionData) => api.post('/role-permissions', rolePermissionData),
  update: (id, rolePermissionData) => api.put(`/role-permissions/${id}`, rolePermissionData),
  delete: (id) => api.delete(`/role-permissions/${id}`),
};

// User Status API
export const userStatusAPI = {
  getAll: () => api.get('/user-status').then(normalizeData),
  getById: (id) => api.get(`/user-status/${id}`).then(normalizeData),
  create: (statusData) => api.post('/user-status', statusData),
  update: (id, statusData) => api.put(`/user-status/${id}`, statusData),
  delete: (id) => api.delete(`/user-status/${id}`),
};

// Modules API
export const modulesAPI = {
  getAll: () => api.get('/modules').then(normalizeData),
  getById: (id) => api.get(`/modules/${id}`).then(normalizeData),
  create: (moduleData) => api.post('/modules', moduleData),
  update: (id, moduleData) => api.put(`/modules/${id}`, moduleData),
  delete: (id) => api.delete(`/modules/${id}`),
};

// Vehicles API
export const vehiclesAPI = {
  getAll: () => api.get('/vehicles').then(response => {
    if (response.data && response.data.vehicles) {
      return { data: response.data.vehicles };
    }
    return response;
  }),
  getAvailable: () => api.get('/vehicles/available').then(response => {
    if (response.data && response.data.vehicles) {
      return { data: response.data.vehicles };
    }
    return response;
  }),
  getById: (id) => api.get(`/vehicles/${id}`).then(normalizeData),
  getByOwner: (ownerId) => api.get(`/vehicles/owner/${ownerId}`).then(normalizeData),
  create: (vehicleData) => api.post('/vehicles', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

export default api; 