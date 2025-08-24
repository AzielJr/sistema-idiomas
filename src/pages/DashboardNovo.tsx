import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  useTheme,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Badge
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
  MoreVert,
  BookOnline,
  Schedule,
  Payment,
  Warning,
  CalendarToday,
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Area,
  AreaChart
} from 'recharts';

const DashboardNovo = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Dados simulados
  const estatisticas = {
    totalAlunos: 1247,
    turmasAtivas: 32,
    professores: 18,
    receitaMensal: 89500
  };

  const dadosNiveis = [
    { name: t('dashboard.niveis.basico'), value: 320, color: '#2196F3' },
    { name: t('dashboard.niveis.intermediario'), value: 450, color: '#4CAF50' },
    { name: t('dashboard.niveis.avancado'), value: 280, color: '#FF9800' },
    { name: t('dashboard.niveis.conversacao'), value: 197, color: '#F44336' }
  ];

  const dadosFaixaEtaria = [
    { name: t('dashboard.faixaEtaria.6a12'), value: 285, color: '#9C27B0' },
    { name: t('dashboard.faixaEtaria.13a17'), value: 420, color: '#673AB7' },
    { name: t('dashboard.faixaEtaria.18a25'), value: 380, color: '#3F51B5' },
    { name: t('dashboard.faixaEtaria.26a35'), value: 162, color: '#2196F3' },
    { name: t('dashboard.faixaEtaria.35mais'), value: 195, color: '#00BCD4' }
  ];

  const dadosReceita = [
    { mes: t('dashboard.meses.jan'), valor: 75000 },
    { mes: t('dashboard.meses.fev'), valor: 82000 },
    { mes: t('dashboard.meses.mar'), valor: 78000 },
    { mes: t('dashboard.meses.abr'), valor: 85000 },
    { mes: t('dashboard.meses.mai'), valor: 89500 },
    { mes: t('dashboard.meses.jun'), valor: 92000 }
  ];

  const atividadesRecentes = [
    { id: 1, tipo: 'aula', descricao: t('dashboard.atividades.aula'), horario: '09:00', status: 'concluida' },
    { id: 2, tipo: 'pagamento', descricao: t('dashboard.atividades.pagamento'), horario: '10:30', status: 'concluida' },
    { id: 3, tipo: 'matricula', descricao: t('dashboard.atividades.matricula'), horario: '14:00', status: 'pendente' },
    { id: 4, tipo: 'reuniao', descricao: t('dashboard.atividades.reuniao'), horario: '16:00', status: 'agendada' }
  ];

  const avisos = [
    { id: 1, titulo: t('dashboard.avisos.reuniaoPedagogica'), descricao: t('dashboard.avisos.descricaoReuniao'), tipo: 'urgente', icon: <CalendarToday /> },
    { id: 2, titulo: t('dashboard.avisos.vencimentoMensalidades'), descricao: t('dashboard.avisos.descricaoVencimento'), tipo: 'atencao', icon: <Payment /> },
    { id: 3, titulo: t('dashboard.avisos.materialDidatico'), descricao: t('dashboard.avisos.descricaoMaterial'), tipo: 'info', icon: <BookOnline /> }
  ];

  // Componente de card de estatística equilibrado
  const StatCard = ({ title, value, icon, color, trend, trendValue }: any) => (
    <Card 
      elevation={0} 
      sx={{ 
        height: '120px',
        width: '100%',
        background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: color, 
              mb: 0.5,
              fontSize: '1.75rem'
            }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography variant="body1" sx={{ 
              fontWeight: 500, 
              color: 'text.primary',
              fontSize: '0.875rem'
            }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ 
            bgcolor: `${color}20`, 
            width: 44, 
            height: 44,
            color: color
          }}>
            {icon}
          </Avatar>
        </Box>
        
        {trend && (
          <Box display="flex" alignItems="center" gap={1}>
            {trend === 'up' ? (
              <TrendingUp sx={{ color: '#4CAF50', fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ color: '#F44336', fontSize: 16 }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                color: trend === 'up' ? '#4CAF50' : '#F44336',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              {trendValue}% este mês
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Componente de card de gráfico equilibrado
  const ChartCard = ({ title, children, height = '350px' }: any) => (
    <Card 
      elevation={0} 
      sx={{ 
        height,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          p: 2.5, 
          pb: 2, 
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            fontSize: '1rem'
          }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2
        }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );

  // Componente de métrica rápida equilibrado
  const QuickMetric = ({ icon, value, label, color, bgColor }: any) => (
    <Paper sx={{ 
      p: 2, 
      textAlign: 'center', 
      bgcolor: bgColor, 
      border: `1px solid ${color}20`,
      borderRadius: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: `0 4px 15px ${color}15`
      },
      transition: 'all 0.2s ease'
    }}>
      <Box sx={{ color, mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ 
        fontWeight: 700, 
        color, 
        mb: 0.5,
        fontSize: '1.5rem'
      }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ 
        fontWeight: 500,
        fontSize: '0.8rem'
      }}>
        {label}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 }, 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header do Dashboard */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#1a1a1a', 
              mb: 0.5,
              fontSize: '1.75rem'
            }}>
              {t('dashboard.header.titulo')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
              {t('dashboard.header.subtitulo')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={t('dashboard.tooltips.notificacoes')}>
              <IconButton sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={t('dashboard.tooltips.maisOpcoes')}>
              <IconButton sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider sx={{ opacity: 0.3 }} />
      </Box>

      {/* Cards de Estatísticas Principais */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 0,
        mb: 3, 
        width: '100%' 
      }}>
        <Box sx={{ 
          flex: 1,
          p: 0.5
        }}>
          <StatCard
            title={t('dashboard.statCards.totalAlunos')}
            value={estatisticas.totalAlunos}
            icon={<School sx={{ fontSize: 22 }} />}
            color="#2196F3"
            trend="up"
            trendValue={12}
          />
        </Box>
        <Box sx={{ 
          flex: 1,
          p: 0.5
        }}>
          <StatCard
            title={t('dashboard.statCards.turmasAtivas')}
            value={estatisticas.turmasAtivas}
            icon={<Group sx={{ fontSize: 22 }} />}
            color="#4CAF50"
            trend="up"
            trendValue={8}
          />
        </Box>
        <Box sx={{ 
          flex: 1,
          p: 0.5
        }}>
          <StatCard
            title={t('dashboard.statCards.professores')}
            value={estatisticas.professores}
            icon={<Person sx={{ fontSize: 22 }} />}
            color="#FF9800"
            trend="down"
            trendValue={3}
          />
        </Box>
        <Box sx={{ 
          flex: 1,
          p: 0.5
        }}>
          <StatCard
            title={t('dashboard.statCards.receitaMensal')}
            value={`R$ ${(estatisticas.receitaMensal/1000).toFixed(0)}k`}
            icon={<AttachMoney sx={{ fontSize: 22 }} />}
            color="#9C27B0"
            trend="up"
            trendValue={15}
          />
        </Box>
      </Box>

      {/* Primeira Linha de Gráficos - Alinhamento Perfeito */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 0,
        mb: 3, 
        width: '100%' 
      }}>
        {/* Gráfico de Receita */}
        <Box sx={{ 
          flex: 1,
          p: 0.5
        }}>
          <ChartCard title={`📈 ${t('dashboard.titles.evolucaoReceita')}`} height="350px">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosReceita} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2196F3" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                <RechartsTooltip 
                  formatter={(value: any) => [`R$ ${value.toLocaleString()}`, t('dashboard.chartLabels.receita')]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#2196F3" 
                  strokeWidth={2}
                  fill="url(#colorReceita)"
                  dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#2196F3', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* Gráfico de Níveis */}
        <Box sx={{ 
          flex: 1,
          p: 0.5
        }}>
          <ChartCard title={`📚 ${t('dashboard.titles.distribuicaoNivel')}`} height="350px">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosNiveis}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dadosNiveis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: any) => [`${value} ${t('dashboard.chartLabels.alunos')}`, t('dashboard.chartLabels.quantidade')]} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ 
              mt: 1.5, 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 1,
              px: 1
            }}>
              {dadosNiveis.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    bgcolor: item.color, 
                    borderRadius: '50%' 
                  }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}>
                    {item.name}: {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Box>
      </Box>

      {/* Segunda Linha - Métricas e Gráficos */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 0,
        mb: 3, 
        width: '100%' 
      }}>
        {/* Gráfico de Faixa Etária */}
        <Box sx={{ 
          flex: '0 0 40%',
          p: 0.5
        }}>
          <ChartCard title={`👥 ${t('dashboard.titles.distribuicaoFaixaEtaria')}`} height="350px">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFaixaEtaria} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <RechartsTooltip formatter={(value: any) => [`${value} ${t('dashboard.chartLabels.alunos')}`, t('dashboard.chartLabels.quantidade')]} />
                <Bar 
                  dataKey="value" 
                  fill="#9C27B0" 
                  radius={[4, 4, 0, 0]}
                  stroke="#9C27B0"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* Métricas Rápidas */}
        <Box sx={{ 
          flex: '0 0 60%',
          p: 0.5
        }}>
          <ChartCard title={`⚡ ${t('dashboard.titles.metricasRapidas')}`} height="350px">
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5 
            }}>
              <Box sx={{ width: '100%' }}>
                <QuickMetric
                  icon={<BookOnline sx={{ fontSize: 32 }} />}
                  value="156"
                  label="Aulas Hoje"
                  color="#2196F3"
                  bgColor="#e3f2fd"
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <QuickMetric
                  icon={<Schedule sx={{ fontSize: 32 }} />}
                  value="89%"
                  label="Taxa de Presença"
                  color="#4CAF50"
                  bgColor="#e8f5e8"
                />
              </Box>
              <Box sx={{ 
                display: 'flex', 
                gap: 1.5 
              }}>
                <Box sx={{ flex: 1 }}>
                  <QuickMetric
                    icon={<Payment sx={{ fontSize: 24 }} />}
                    value="92%"
                    label="Pagamentos em Dia"
                    color="#FF9800"
                    bgColor="#fff3e0"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <QuickMetric
                    icon={<Warning sx={{ fontSize: 24 }} />}
                    value="7"
                    label="Pendências"
                    color="#F44336"
                    bgColor="#ffebee"
                  />
                </Box>
              </Box>
            </Box>
          </ChartCard>
        </Box>
      </Box>

      {/* Terceira Linha - Atividades e Avisos */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 0,
        width: '100%' 
      }}>
        {/* Atividades Recentes */}
        <Box sx={{ 
          flex: '0 0 50%',
          p: 0.5
        }}>
          <ChartCard title={`🕒 ${t('dashboard.titles.atividadesRecentes')}`} height="280px">
            <Box sx={{ 
              height: '100%', 
              overflow: 'auto',
              pr: 1
            }}>
              {atividadesRecentes.map((atividade, index) => (
                <Box key={atividade.id} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  p: 1.5, 
                  mb: 1,
                  bgcolor: index % 2 === 0 ? '#fafafa' : 'transparent',
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: '#f5f5f5' },
                  transition: 'background-color 0.2s'
                }}>
                  <Avatar sx={{ 
                    bgcolor: atividade.status === 'concluida' ? '#4CAF50' : 
                             atividade.status === 'pendente' ? '#FF9800' : '#2196F3',
                    width: 32,
                    height: 32
                  }}>
                    {atividade.status === 'concluida' ? <CheckCircle /> :
                     atividade.status === 'pendente' ? <Error /> : <Info />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      fontSize: '0.8rem'
                    }}>
                      {atividade.descricao}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {atividade.horario}
                    </Typography>
                  </Box>
                  <Chip 
                    label={atividade.status === 'concluida' ? t('dashboard.status.concluida') : 
                           atividade.status === 'pendente' ? t('dashboard.status.pendente') : t('dashboard.status.agendada')}
                    size="small"
                    color={atividade.status === 'concluida' ? 'success' : 
                           atividade.status === 'pendente' ? 'warning' : 'info'}
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Box>

        {/* Avisos Importantes */}
        <Box sx={{ 
          flex: '0 0 50%',
          p: 0.5
        }}>
          <ChartCard title={`🚨 ${t('dashboard.avisos.titulo')}`} height="280px">
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              overflow: 'auto',
              pr: 1
            }}>
              {avisos.map((aviso) => (
                <Paper key={aviso.id} sx={{ 
                  p: 2, 
                  border: `1px solid ${
                    aviso.tipo === 'urgente' ? '#F44336' : 
                    aviso.tipo === 'atencao' ? '#FF9800' : '#2196F3'
                  }20`,
                  borderRadius: 2,
                  bgcolor: aviso.tipo === 'urgente' ? '#ffebee' : 
                           aviso.tipo === 'atencao' ? '#fff3e0' : '#e3f2fd',
                  '&:hover': {
                    transform: 'translateX(2px)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.2s ease'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ 
                      color: aviso.tipo === 'urgente' ? '#F44336' : 
                             aviso.tipo === 'atencao' ? '#FF9800' : '#2196F3',
                      mt: 0.25
                    }}>
                      {aviso.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 600, 
                        color: aviso.tipo === 'urgente' ? '#F44336' : 
                               aviso.tipo === 'atencao' ? '#FF9800' : '#2196F3',
                        mb: 0.5,
                        fontSize: '0.8rem'
                      }}>
                        {aviso.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        fontSize: '0.75rem',
                        lineHeight: 1.3
                      }}>
                        {aviso.descricao}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </ChartCard>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardNovo;