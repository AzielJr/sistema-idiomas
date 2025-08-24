import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  foto?: string;
}

interface NivelAcesso {
  id: number;
  grupo: string;
  detalhes: string;
  nivelAcesso: string;
  ativo: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  fetchWithAuthSafe: (url: string, options?: RequestInit) => Promise<Response>;
  
  // Funções para níveis de acesso
  niveisAcesso: NivelAcesso[];
  loadingNiveisAcesso: boolean;
  listarNiveisAcesso: () => Promise<void>;
  criarNivelAcesso: (nivel: Omit<NivelAcesso, 'id'>) => Promise<boolean>;
  atualizarNivelAcesso: (id: number, nivel: Omit<NivelAcesso, 'id'>) => Promise<boolean>;
  excluirNivelAcesso: (id: number) => Promise<boolean>;
  alternarStatusNivelAcesso: (id: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// URL do seu backend Spring Boot
const API_BASE_URL = 'http://localhost:8080';

// Função para converter byte array para base64
const converterByteArrayParaBase64 = (foto: any): string => {
  if (!foto) return '';
  
  try {
    // Se já é uma string base64
    if (typeof foto === 'string') {
      // Se já tem o prefixo data:image
      if (foto.startsWith('data:image/')) {
        return foto;
      }
      // Se é base64 puro, adiciona o prefixo
      return `data:image/jpeg;base64,${foto}`;
    }
    
    // Se é um array de bytes
    if (Array.isArray(foto)) {
      const uint8Array = new Uint8Array(foto);
      let binary = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64 = btoa(binary);
      return `data:image/jpeg;base64,${base64}`;
    }
    
    return '';
  } catch (error) {
    console.error('Erro ao converter byte array para base64:', error);
    return '';
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [niveisAcesso, setNiveisAcesso] = useState<NivelAcesso[]>([]);
  const [loadingNiveisAcesso, setLoadingNiveisAcesso] = useState(false);

  useEffect(() => {
    // Verificar se há um token salvo no localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/usuario`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.id,
          email: data.email,
          name: data.userName,
          foto: converterByteArrayParaBase64(data.foto)
        });
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Iniciando login...', { email });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
      });

      console.log('📥 Resposta recebida:', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login bem-sucedido');
        
        const { token, email: userEmail, userName, foto, id } = data;
        
        const userData = {
          id: id,
          email: userEmail,
          name: userName,
          foto: converterByteArrayParaBase64(foto)
        };
        
        setUser(userData);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', userEmail);
        
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro no login:', errorData);
        return false;
      }
    } catch (error) {
      console.error('💥 Erro na requisição de login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setNiveisAcesso([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  };

  // Função auxiliar para fazer requisições autenticadas
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      logout();
      window.location.href = '/login';
      return Promise.reject(new Error('Token não encontrado'));
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Se o token for inválido, fazer logout e redirecionar
      if (response.status === 401 || response.status === 403) {
        logout();
        window.location.href = '/login';
        return Promise.reject(new Error('Token inválido'));
      }

      return response;
    } catch (error) {
      // Se houver erro de rede, não redirecionar automaticamente
      console.error('Erro na requisição:', error);
      throw error;
    }
  };

  // Função auxiliar para fazer requisições autenticadas sem logout automático
  const fetchWithAuthSafe = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return Promise.reject(new Error('Token não encontrado'));
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      return response;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  };

  // Listar todos os níveis de acesso
  const listarNiveisAcesso = async (): Promise<void> => {
    try {
      setLoadingNiveisAcesso(true);
      
      const response = await fetchWithAuth(`${API_BASE_URL}/api/nivel-acesso`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Converter os dados do backend para o formato do frontend
        const niveisFormatados = data.map((nivel: any) => ({
          id: nivel.id,
          grupo: nivel.grupo,
          detalhes: nivel.detalhes,
          nivelAcesso: nivel.nivelAcesso,
          ativo: nivel.ativo
        }));
        
        setNiveisAcesso(niveisFormatados);
      } else {
        console.error('Erro ao carregar níveis de acesso');
      }
    } catch (error) {
      console.error('Erro na requisição de níveis de acesso:', error);
    } finally {
      setLoadingNiveisAcesso(false);
    }
  };

  // Criar novo nível de acesso
  const criarNivelAcesso = async (nivel: Omit<NivelAcesso, 'id'>): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/nivel-acesso`, {
        method: 'POST',
        body: JSON.stringify({
          grupo: nivel.grupo,
          detalhes: nivel.detalhes,
          nivelAcesso: nivel.nivelAcesso,
          ativo: nivel.ativo
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Adicionar o novo nível à lista local
        const novoNivel: NivelAcesso = {
          id: data.id,
          grupo: data.grupo,
          detalhes: data.detalhes,
          nivelAcesso: data.nivelAcesso,
          ativo: data.ativo
        };
        
        setNiveisAcesso(prev => [...prev, novoNivel]);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao criar nível de acesso:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição de criação:', error);
      return false;
    }
  };

  // Atualizar nível de acesso
  const atualizarNivelAcesso = async (id: number, nivel: Omit<NivelAcesso, 'id'>): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/nivel-acesso/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          grupo: nivel.grupo,
          detalhes: nivel.detalhes,
          nivelAcesso: nivel.nivelAcesso,
          ativo: nivel.ativo
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Atualizar o nível na lista local
        setNiveisAcesso(prev => 
          prev.map(n => n.id === id ? {
            id: data.id,
            grupo: data.grupo,
            detalhes: data.detalhes,
            nivelAcesso: data.nivelAcesso,
            ativo: data.ativo
          } : n)
        );
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao atualizar nível de acesso:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição de atualização:', error);
      return false;
    }
  };

  // Excluir nível de acesso
  const excluirNivelAcesso = async (id: number): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/nivel-acesso/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remover o nível da lista local
        setNiveisAcesso(prev => prev.filter(n => n.id !== id));
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao excluir nível de acesso:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição de exclusão:', error);
      return false;
    }
  };

  // Alternar status ativo/inativo
  const alternarStatusNivelAcesso = async (id: number): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/nivel-acesso/${id}/toggle-status`, {
        method: 'PATCH',
      });

      if (response.ok) {
        const data = await response.json();
        
        // Atualizar o status na lista local
        setNiveisAcesso(prev => 
          prev.map(n => n.id === id ? { ...n, ativo: data.ativo } : n)
        );
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao alternar status:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição de alternar status:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    fetchWithAuth,
    fetchWithAuthSafe,
    
    // Níveis de acesso
    niveisAcesso,
    loadingNiveisAcesso,
    listarNiveisAcesso,
    criarNivelAcesso,
    atualizarNivelAcesso,
    excluirNivelAcesso,
    alternarStatusNivelAcesso
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}