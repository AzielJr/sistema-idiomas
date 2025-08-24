import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id?: number;
  email: string;
  name: string;
  foto?: string;
  idUnidade?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  fetchWithAuthSafe: (url: string, options?: RequestInit) => Promise<Response>;
  updateUser: (userData: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'http://localhost:8080';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔍 Verificando localStorage:', { token: !!token, userData: !!userData });
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('👤 Usuário carregado do localStorage:', parsedUser);
        } else {
          console.log('❌ Token ou dados do usuário não encontrados no localStorage');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        console.log('✅ Carregamento inicial finalizado');
      }
    };

    // Pequeno delay para garantir que o localStorage esteja disponível
    setTimeout(loadUserFromStorage, 100);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🚀 Tentando login...', { email });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
      });

      console.log('Status da resposta:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        // Função para converter byte array para Base64 (igual ao Usuarios.tsx)
        const converterByteArrayParaBase64 = (foto: any): string => {
          if (!foto) return '';
          
          // Se já é uma string Base64 válida, retorna como está
          if (typeof foto === 'string' && foto.startsWith('data:image/')) {
            return foto;
          }
          
          // Se é um array de bytes, converte para Base64
          if (Array.isArray(foto)) {
            try {
              const uint8Array = new Uint8Array(foto);
              const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
              const base64 = btoa(binaryString);
              return `data:image/jpeg;base64,${base64}`;
            } catch (error) {
              console.error('Erro ao converter byte array para Base64:', error);
              return '';
            }
          }
          
          // Se é uma string Base64 sem o prefixo, adiciona o prefixo
          if (typeof foto === 'string' && /^[A-Za-z0-9+/]+=*$/.test(foto)) {
            return `data:image/jpeg;base64,${foto}`;
          }
          
          return '';
        };
        
        if (data.token && data.email && data.userName) {
          const userData = {
            email: data.email,
            name: data.userName,
            foto: converterByteArrayParaBase64(data.foto)
          };
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Buscar o ID e unidade do usuário após o login
          try {
            const usersResponse = await fetch(`${API_BASE_URL}/api/usuarios`, {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (usersResponse.ok) {
              const users = await usersResponse.json();
              console.log('🔍 Usuários encontrados:', users);
              
              const currentUser = users.find((u: any) => u.email === data.email);
              console.log('👤 Usuário atual encontrado:', currentUser);
              
              if (currentUser) {
                const completeUserData = {
                  ...userData,
                  id: currentUser.id,
                  idUnidade: currentUser.idUnidade
                };
                localStorage.setItem('user', JSON.stringify(completeUserData));
                setUser(completeUserData);
                console.log('✅ Usuário completo carregado:', completeUserData);
              } else {
                console.warn('⚠️ Usuário não encontrado na lista');
                setUser(userData);
              }
            } else {
              console.error('❌ Erro na resposta da API de usuários:', usersResponse.status);
              setUser(userData);
            }
          } catch (error) {
            console.error('❌ Erro ao buscar dados completos do usuário:', error);
            setUser(userData);
          }
          
          return true;
        } else {
          console.error('Estrutura de resposta inválida:', data);
          return false;
        }
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
        console.error('Erro na resposta:', errorMessage);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro na requisição de login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 Logout realizado');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('👤 Dados do usuário atualizados:', updatedUser);
    }
  };

  // Método para buscar dados completos do usuário (incluindo idUnidade)
  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const users = await response.json();
        const currentUser = users.find((u: any) => u.email === user?.email);
        
        if (currentUser && user) {
          const completeUserData = {
            ...user,
            id: currentUser.id,
            idUnidade: currentUser.idUnidade
          };
          setUser(completeUserData);
          localStorage.setItem('user', JSON.stringify(completeUserData));
          console.log('🔄 Dados do usuário atualizados com sucesso:', completeUserData);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar dados do usuário:', error);
    }
  };

  const fetchWithAuthSafe = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token não encontrado, redirecionando para login');
      logout();
      throw new Error('Token não encontrado');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Se receber 401 (Unauthorized), fazer logout
    if (response.status === 401) {
      console.error('Token expirado ou inválido, fazendo logout');
      logout();
      throw new Error('Token expirado ou inválido');
    }

    return response;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    fetchWithAuthSafe,
    updateUser,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export { AuthContext };