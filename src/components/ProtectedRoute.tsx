import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextSimple';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: 'white',
            mb: 2
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            textAlign: 'center'
          }}
        >
          Carregando...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Verificar se há token no localStorage antes de redirecionar
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // Se há dados mas isAuthenticated é false, pode ser um problema de sincronização
      console.warn('Dados encontrados no localStorage mas isAuthenticated é false');
      // Aguardar um pouco mais antes de redirecionar
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: 'white',
              mb: 2
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              textAlign: 'center'
            }}
          >
            Verificando autenticação...
          </Typography>
        </Box>
      );
    }
    
    // Redirecionar para login, salvando a localização atual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}