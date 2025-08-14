import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um token salvo no localStorage
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userEmail) {
      // Simular validação do token
      setUser({
        email: userEmail,
        name: 'Administrador'
      });
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulação de autenticação - substituir por API real
      if (email === 'admin@customidiomas.com' && password === '123456') {
        const userData = {
          email,
          name: 'Administrador'
        };
        
        setUser(userData);
        localStorage.setItem('authToken', 'fake-jwt-token');
        localStorage.setItem('userEmail', email);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
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