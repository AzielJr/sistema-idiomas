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
import { useAuth } from '../contexts/AuthContextSimple';

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
        setError('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
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
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.8) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.6) 0%, transparent 50%),
          radial-gradient(circle at 60% 80%, rgba(118, 75, 162, 0.7) 0%, transparent 40%),
          linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #4a6fa5 50%, #6c7b95 75%, #8e9aaf 100%)
        `,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.14) 2px, transparent 4px),
             linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.14) 2px, transparent 4px),
             radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.168) 3px, transparent 3px),
             radial-gradient(circle at 85% 75%, rgba(255, 255, 255, 0.14) 2px, transparent 2px),
             radial-gradient(circle at 45% 15%, rgba(255, 255, 255, 0.112) 2px, transparent 2px),
             radial-gradient(circle at 75% 45%, rgba(255, 255, 255, 0.123) 2px, transparent 2px),
             linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.084) 49%, rgba(255, 255, 255, 0.084) 51%, transparent 52%),
             linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.067) 49%, rgba(255, 255, 255, 0.067) 51%, transparent 52%)
          `,
          backgroundSize: '80px 80px, 80px 80px, 120px 120px, 80px 80px, 150px 150px, 100px 100px, 60px 60px, 40px 40px',
          pointerEvents: 'none',
          opacity: 0.56,
          animation: 'circuitPulse 4s ease-in-out infinite'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(45deg, 
               transparent 30%, 
               rgba(255, 255, 255, 0.112) 32%, 
               rgba(255, 255, 255, 0.112) 34%, 
               transparent 36%
             ),
             linear-gradient(-45deg, 
               transparent 30%, 
               rgba(255, 255, 255, 0.101) 32%, 
               rgba(255, 255, 255, 0.101) 34%, 
               transparent 36%
             ),
             conic-gradient(from 0deg at 20% 30%, transparent 0deg, rgba(255, 255, 255, 0.084) 45deg, transparent 90deg),
             conic-gradient(from 180deg at 80% 70%, transparent 0deg, rgba(255, 255, 255, 0.067) 60deg, transparent 120deg),
             conic-gradient(from 90deg at 30% 70%, transparent 0deg, rgba(255, 255, 255, 0.056) 45deg, transparent 90deg),
             linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.045) 50%, transparent 100%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 150px,
              rgba(255, 255, 255, 0.028) 151px,
               rgba(255, 255, 255, 0.028) 153px,
              transparent 154px
            )
          `,
          pointerEvents: 'none',
          opacity: 0.56,
          animation: 'techFlow 6s linear infinite'
        },
        '@keyframes circuitPulse': {
          '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1)'
          },
          '50%': {
            opacity: 1,
            transform: 'scale(1.02)'
          }
        },
        '@keyframes techFlow': {
          '0%': {
            backgroundPosition: '0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%'
          },
          '100%': {
            backgroundPosition: '100% 100%, -100% -100%, 50% 50%, -50% -50%, 25% 75%, 75% 25%, 200px 200px'
          }
        }
      }}
    >
      <Container maxWidth="xs">
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            minHeight: '480px'
          }}
        >
          <CardContent sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: '25px', mt: '-35px' }}>
              <Box
                sx={{
                  width: 180,
                  height: 180,
                  margin: '0 auto -40px',
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: '-15px' }}>
                Sistema de Gestão para Escolas de Idiomas
              </Typography>
            </Box>

            <Divider sx={{ mb: '25px' }} />

            {/* Formulário de Login */}
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" sx={{ mb: '25px', textAlign: 'center', fontWeight: 600 }}>
                Acesso ao Sistema
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: '25px', borderRadius: 2 }}>
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
                sx={{ mb: '25px' }}
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
                        borderColor: '#2a5298'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3c72'
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
                sx={{ mb: '25px' }}
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
                        borderColor: '#2a5298'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3c72'
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
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a6fa5 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(30, 60, 114, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a3461 0%, #245187 50%, #3f5e94 100%)',
                    boxShadow: '0 6px 20px rgba(30, 60, 114, 0.6)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: '#8e9aaf'
                  }
                }}
              >
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </Button>
              
              {/* Link Esqueci Senha */}
              <Box sx={{ textAlign: 'center', mt: '25px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1e3c72',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: '#2a5298'
                    }
                  }}
                  onClick={() => {
                    // Aqui você pode implementar a funcionalidade de recuperação de senha
                    alert('Funcionalidade de recuperação de senha será implementada em breve!');
                  }}
                >
                  Esqueci minha senha
                </Typography>
              </Box>
            </Box>


          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '15px' }}>
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.7rem',
              maxWidth: '400px'
            }}
          >
            © 2024 Custom Idiomas - Todos os direitos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}