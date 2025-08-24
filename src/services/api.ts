import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:8080';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interfaces para tipagem
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  userName: string;
  tokenExpiration: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  senha: string;
  role?: string;
}

export interface UserData {
  email: string;
  userName: string;
  role: string;
}

// Serviços de autenticação
export const authService = {
  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', {
      email: email,
      senha: password // Backend usa 'senha' ao invés de 'password'
    });
    return response.data;
  },

  // Registro
  register: async (userData: RegisterRequest): Promise<{ username: string; email: string }> => {
    const response = await api.post('/auth/register', {
      userName: userData.userName,
      email: userData.email,
      senha: userData.senha, // Backend usa 'senha' ao invés de 'password'
      role: userData.role || 'USER'
    });
    return response.data;
  },

  // Obter dados do usuário
  getUserData: async (): Promise<LoginResponse> => {
    const response = await api.get('/auth/usuario');
    return response.data;
  },

  // Verificar se token é válido
  validateToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/usuario');
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default api;