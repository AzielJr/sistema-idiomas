import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Avatar
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  School
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  // Redirecionar se já estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard/default';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (field: keyof LoginData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(loginData.email, loginData.password);
      
      if (success) {
        // Redirecionar para a página de origem ou dashboard
        const from = location.state?.from?.pathname || '/dashboard/default';
        navigate(from, { replace: true });
      } else {
        setError('Email ou senha incorretos. Tente: admin@customidiomas.com / 123456');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  margin: '0 auto 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src="/logo.png"
                  alt="Custom Idiomas Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: -8 }}>
                Sistema de Gestão para Escolas de Idiomas
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Formulário de Login */}
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
                Acesso ao Sistema
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginData.email}
                onChange={handleChange('email')}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea'
                      }
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleChange('password')}
                required
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea'
                      }
                    }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                  },
                  '&:disabled': {
                    background: '#ccc'
                  }
                }}
              >
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </Button>
            </Box>

            {/* Informações de Acesso */}
            <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
                <strong>Acesso de Demonstração:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Email: admin@customidiomas.com<br />
                Senha: 123456
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mt: 3,
            color: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          © 2024 Custom Idiomas - Sistema de Gestão de Escolas de Idiomas
        </Typography>
      </Container>
    </Box>
  );
}