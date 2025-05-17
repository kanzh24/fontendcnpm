
// import { api } from './api';


// export const login = async (credentials) => {
//   const response = await api.post('/api/v1/employees/login', credentials);
//   return response.data;
// };
// src/api/auth.js
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

export const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  export const isAuthenticated = () => {
    return !!getToken();
  };