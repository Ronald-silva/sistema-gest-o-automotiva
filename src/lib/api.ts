// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para garantir que o token seja sempre enviado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@AutoGestao:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa os dados de autenticação
      localStorage.removeItem('@AutoGestao:token');
      localStorage.removeItem('@AutoGestao:user');
      
      // Redireciona para o login apenas se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Configura o token inicial se existir
const token = localStorage.getItem('@AutoGestao:token');
if (token) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

export { api };