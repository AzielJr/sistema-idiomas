import { Box, Grid, Paper, Typography, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Container com largura fixa para todos os blocos */}
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
        
        {/* BLOCO 1: Estatísticas Gerais */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 2, 
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%'
        }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              📊 Estatísticas Gerais
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{xs:12, sm:6, md:3}}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.totalAlunos}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Total de Alunos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{xs:12, sm:6, md:3}}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="success.main" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.turmasAtivas}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Turmas Ativas
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="warning.main" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.professores}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Professores
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="secondary.main" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.coordenadores}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Coordenadores
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

        {/* BLOCO 2: Status Financeiro */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 2, 
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%'
        }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              💰 Status Financeiro
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{xs:12, sm:6, md:3}}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="info.main" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.matriculasNovas}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Novas Matrículas
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="success.main" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.mensalidadesEmDia}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Mensalidades em Dia
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="error.main" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.mensalidadesAtrasadas}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Mensalidades Atrasadas
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '140px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                      {estatisticas.alunosAtivos}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Alunos Ativos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

        {/* BLOCO 3: Gráficos e Relatórios */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 2, 
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%'
        }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              📈 Gráficos e Relatórios
            </Typography>
            
            <Grid container spacing={3}>
              {/* Gráfico de Barras */}
              <Grid item xs={12} sm={12} md={6}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '400px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Alunos por Nível
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distribuição por nível de ensino
                    </Typography>
                  </Box>
                  <CardContent sx={{ height: 'calc(100% - 80px)', p: 2 }}>
                    <BarChart data={dadosBarras} />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Gráfico de Rosca */}
              <Grid item xs={12} sm={12} md={6}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '400px',
                    width: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Distribuição por Faixa Etária
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Alunos por categoria de idade
                    </Typography>
                  </Box>
                  <CardContent sx={{ height: 'calc(100% - 80px)', p: 2 }}>
                    <RoscaChart data={dadosRosca} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

        {/* BLOCO 4: Comunicações */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 2, 
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%'
        }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            💬 Comunicações
          </Typography>
          
          <Grid container spacing={3}>
             {/* Comentários e Avisos */}
             <Grid item xs={12}>
               <Card 
                 elevation={2} 
                 sx={{ 
                   height: '400px',
                   width: '100%',
                   transition: 'transform 0.2s, box-shadow 0.2s',
                   '&:hover': {
                     transform: 'translateY(-2px)',
                     boxShadow: 4
                   }
                 }}
               >
                 <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
                     Comentários e Avisos Recentes
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                     Últimas atualizações e comunicados importantes
                   </Typography>
                 </Box>
                 <CardContent sx={{ height: 'calc(100% - 80px)', p: 0 }}>
                   <Box sx={{ height: '100%', overflow: 'auto' }}>
                     <ListaComentarios />
                   </Box>
                 </CardContent>
               </Card>
             </Grid>
           </Grid>
        </Box>
      </Box>
    </Box>
  );
}