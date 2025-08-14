import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  useTheme, 
  useMediaQuery,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  School,
  Group,
  Person,
  AttachMoney,
  Assessment,
  Notifications,
  MoreVert
} from '@mui/icons-material';
import BarChart from '../components/BarChart';
import RoscaChart from '../components/RoscaChart';
import ListaComentarios from '../components/ListaComentarios';
import { useState } from 'react';

export default function Dashboard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Dados simulados para os gráficos e estatísticas
  const [estatisticas] = useState({
    totalAlunos: 1247,
    turmasAtivas: 32,
    professores: 18,
    coordenadores: 5,
    matriculasNovas: 89,
    mensalidadesEmDia: 1156,
    mensalidadesAtrasadas: 91,
    alunosAtivos: 1198
  });

  // Dados para os gráficos
  const dadosBarras = [
    { label: 'Básico', value: 320 },
    { label: 'Intermediário', value: 450 },
    { label: 'Avançado', value: 280 },
    { label: 'Conversação', value: 197 }
  ];

  const dadosRosca = [
    { label: '6-12 anos', value: 285 },
    { label: '13-17 anos', value: 420 },
    { label: '18-25 anos', value: 380 },
    { label: '26-35 anos', value: 162 }
  ];



  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      width: '100%',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.02) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }
    }}>
      {/* Header do Dashboard */}
      <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral do sistema de gestão escolar
        </Typography>
      </Box>

      {/* Container principal */}
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1400px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* BLOCO 1: Cards de Estatísticas Principais */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{ 
                height: '160px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {estatisticas.totalAlunos}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Total de Alunos
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <School sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <Typography variant="caption">+12% este mês</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{ 
                height: '160px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)'
                }
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {estatisticas.turmasAtivas}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Turmas Ativas
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <Group sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <Typography variant="caption">+5% este mês</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{ 
                height: '160px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
                }
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {estatisticas.professores}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Professores
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <Person sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <Typography variant="caption">+2 novos</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              elevation={0}
              sx={{ 
                height: '160px',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(250, 112, 154, 0.3)'
                }
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      R$ 89.5K
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Receita Mensal
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <AttachMoney sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ fontSize: 16 }} />
                  <Typography variant="caption">+8% este mês</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* BLOCO 2: Métricas Secundárias */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ 
              height: '160px',
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 3, 
              border: '1px solid #e8eaed',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Matrículas
                </Typography>
                <Chip label="+12%" size="small" color="success" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {estatisticas.matriculasNovas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Novas este mês
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ 
              height: '160px',
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 3, 
              border: '1px solid #e8eaed',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Pagamentos
                </Typography>
                <Chip label="92%" size="small" color="success" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {estatisticas.mensalidadesEmDia}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Em dia
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={92} 
                color="success"
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ 
              height: '160px',
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 3, 
              border: '1px solid #e8eaed',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Pendências
                </Typography>
                <Chip label="8%" size="small" color="warning" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02', mb: 1 }}>
                {estatisticas.mensalidadesAtrasadas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Em atraso
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={8} 
                color="warning"
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ 
              height: '160px',
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 3, 
              border: '1px solid #e8eaed',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Ativos
                </Typography>
                <Chip label="96%" size="small" color="info" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0288d1', mb: 1 }}>
                {estatisticas.alunosAtivos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alunos ativos
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={96} 
                color="info"
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
              />
            </Card>
          </Grid>
        </Grid>

        {/* BLOCO 3: Dashboard Perfeitamente Alinhado */}
        <Grid container spacing={3}>
          {/* Gráfico de Barras - 40% da largura */}
          <Grid item xs={12} md={5}>
            <Card elevation={0} sx={{ 
              height: '420px',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              border: '1px solid #e1f5fe',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#0d47a1',
                  textAlign: 'center',
                  mb: 2,
                  fontSize: '1.1rem'
                }}>
                  📊 Distribuição de Alunos por Nível
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart data={dadosBarras} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Rosca - 35% da largura */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ 
              height: '420px',
              background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
              border: '1px solid #f8bbd9',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#4a148c',
                  textAlign: 'center',
                  mb: 2,
                  fontSize: '1.1rem'
                }}>
                  🎂 Faixa Etária
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <RoscaChart data={dadosRosca} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Comentários - 25% da largura */}
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ 
              height: '420px',
              background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
              border: '1px solid #ffcc02',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#e65100',
                    fontSize: '1.2rem'
                  }}>
                    💬 Comentários
                  </Typography>
                  <Chip label="3 novos" size="small" sx={{ bgcolor: '#ff9800', color: 'white' }} />
                </Box>
                <Box sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#ff9800',
                    borderRadius: '10px',
                  },
                }}>
                  <ListaComentarios />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* BLOCO 4: Avisos Importantes - Largura Total Redesenhada */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={0} sx={{ 
              background: 'linear-gradient(135deg, #ffebee 0%, #f8bbd9 100%)',
              border: '1px solid #f48fb1',
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: '#c2185b', 
                  mb: 4,
                  textAlign: 'center',
                  fontSize: '1.3rem'
                }}>
                  🚨 Avisos Importantes
                </Typography>
                
                {/* Grid interno com 3 colunas perfeitamente alinhadas */}
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={4}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(255,255,255,0.95)', 
                      borderRadius: 3,
                      border: '2px solid rgba(194, 24, 91, 0.2)',
                      minHeight: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: '#c2185b',
                        fontSize: '1.1rem',
                        mb: 1
                      }}>
                        📢 Reunião pedagógica - 15/12
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#880e4f', 
                        flexGrow: 1, 
                        mt: 1,
                        lineHeight: 1.4,
                        fontSize: '0.9rem'
                      }}>
                        Todos os professores devem participar
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#ad1457', 
                        mt: 2,
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        📅 Obrigatório
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(255,255,255,0.95)', 
                      borderRadius: 3,
                      border: '2px solid rgba(194, 24, 91, 0.2)',
                      minHeight: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: '#c2185b',
                        fontSize: '1.1rem',
                        mb: 1
                      }}>
                        📢 Recesso de fim de ano
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#880e4f', 
                        flexGrow: 1, 
                        mt: 1,
                        lineHeight: 1.4,
                        fontSize: '0.9rem'
                      }}>
                        Aulas suspensas de 20/12 a 05/01
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#ad1457', 
                        mt: 2,
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        📅 Período de férias
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: 'rgba(255,255,255,0.95)', 
                      borderRadius: 3,
                      border: '2px solid rgba(194, 24, 91, 0.2)',
                      minHeight: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: '#c2185b',
                        fontSize: '1.1rem',
                        mb: 1
                      }}>
                        📢 Nova turma de alemão
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#880e4f', 
                        flexGrow: 1, 
                        mt: 1,
                        lineHeight: 1.4,
                        fontSize: '0.9rem'
                      }}>
                        Inscrições abertas até 30/11
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: '#ad1457', 
                        mt: 2,
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        📅 Vagas limitadas
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}