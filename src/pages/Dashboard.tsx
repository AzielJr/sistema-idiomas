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
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      {/* Header do Dashboard */}
      <Box sx={{ mb: 4 }}>
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
        gap: 3
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
            <Card elevation={0} sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
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
            <Card elevation={0} sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
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
            <Card elevation={0} sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
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
            <Card elevation={0} sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
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

        {/* BLOCO 3: Gráficos e Relatórios */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={{ p: 4, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                    Distribuição por Nível
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alunos matriculados por nível de ensino
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: '320px' }}>
                <BarChart data={dadosBarras} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ p: 4, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                    Faixa Etária
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distribuição por idade
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RoscaChart data={dadosRosca} />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* BLOCO 4: Comunicações */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ p: 4, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                    Comentários Recentes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Feedback dos alunos
                  </Typography>
                </Box>
                <Chip label="3 novos" size="small" color="primary" />
              </Box>
              <Box sx={{ height: '320px', overflow: 'auto' }}>
                <ListaComentarios />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ p: 4, backgroundColor: 'white', borderRadius: 3, border: '1px solid #e8eaed' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                    Avisos Importantes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comunicados da coordenação
                  </Typography>
                </Box>
                <Notifications color="primary" />
              </Box>
              <Box sx={{ p: 0 }}>
                <Box sx={{ px: 0, py: 2, borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#1976d2', 
                    mr: 2, 
                    mt: 1 
                  }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Reunião pedagógica - 15/12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Todos os professores devem participar
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ px: 0, py: 2, borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#ed6c02', 
                    mr: 2, 
                    mt: 1 
                  }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Recesso de fim de ano
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aulas suspensas de 20/12 a 05/01
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ px: 0, py: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#2e7d32', 
                    mr: 2, 
                    mt: 1 
                  }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Nova turma de alemão
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inscrições abertas até 30/11
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}