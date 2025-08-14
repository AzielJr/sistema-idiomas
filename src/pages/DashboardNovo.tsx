import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  Paper,
  IconButton,
  Divider
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
  Warning
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const DashboardNovo = () => {
  const theme = useTheme();

  // Dados simulados
  const estatisticas = {
    totalAlunos: 1247,
    turmasAtivas: 32,
    professores: 18,
    receitaMensal: 89500
  };

  const dadosNiveis = [
    { name: 'Básico', value: 320, color: '#1976d2' },
    { name: 'Intermediário', value: 450, color: '#2196f3' },
    { name: 'Avançado', value: 280, color: '#42a5f5' },
    { name: 'Conversação', value: 197, color: '#64b5f6' }
  ];

  const dadosFaixaEtaria = [
    { name: '6-12 anos', value: 285, color: '#9c27b0' },
    { name: '13-17 anos', value: 420, color: '#ba68c8' },
    { name: '18-25 anos', value: 380, color: '#ce93d8' },
    { name: '26-35 anos', value: 162, color: '#e1bee7' }
  ];

  const dadosReceita = [
    { mes: 'Jan', valor: 75000 },
    { mes: 'Fev', valor: 82000 },
    { mes: 'Mar', valor: 78000 },
    { mes: 'Abr', valor: 85000 },
    { mes: 'Mai', valor: 89500 },
    { mes: 'Jun', valor: 92000 }
  ];

  const StatCard = ({ title, value, icon, color, trend, trendValue }: any) => (
    <Card 
      elevation={0} 
      sx={{ 
        height: '140px',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: color, mb: 0.5 }}>
              {value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
        
        {trend && (
          <Box display="flex" alignItems="center" gap={1}>
            {trend === 'up' ? (
              <TrendingUp sx={{ color: '#4caf50', fontSize: 18 }} />
            ) : (
              <TrendingDown sx={{ color: '#f44336', fontSize: 18 }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                color: trend === 'up' ? '#4caf50' : '#f44336',
                fontWeight: 'bold'
              }}
            >
              {trendValue}% este mês
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, children, height = '400px' }: any) => (
    <Card 
      elevation={0} 
      sx={{ 
        height,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1a1a1a' }}>
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 1 }}>
          Dashboard Executivo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral completa do sistema Custom Idiomas
        </Typography>
      </Box>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Alunos"
            value={estatisticas.totalAlunos}
            icon={<School />}
            color="#1976d2"
            trend="up"
            trendValue={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Turmas Ativas"
            value={estatisticas.turmasAtivas}
            icon={<Group />}
            color="#2e7d32"
            trend="up"
            trendValue={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Professores"
            value={estatisticas.professores}
            icon={<Person />}
            color="#ed6c02"
            trend="down"
            trendValue={3}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Receita Mensal"
            value={estatisticas.receitaMensal}
            icon={<AttachMoney />}
            color="#9c27b0"
            trend="up"
            trendValue={15}
          />
        </Grid>
      </Grid>

      {/* Gráficos Principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Receita */}
        <Grid item xs={12} lg={8}>
          <ChartCard title="📈 Evolução da Receita (6 meses)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosReceita}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mes" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#1976d2" 
                  strokeWidth={3}
                  dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#1976d2', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Distribuição por Nível */}
        <Grid item xs={12} lg={4}>
          <ChartCard title="📚 Alunos por Nível">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosNiveis}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosNiveis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} alunos`, 'Quantidade']} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {dadosNiveis.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Segunda linha de gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Faixa Etária */}
        <Grid item xs={12} lg={8}>
          <ChartCard title="👥 Distribuição por Faixa Etária">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFaixaEtaria} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip formatter={(value: any) => [`${value} alunos`, 'Quantidade']} />
                <Bar 
                  dataKey="value" 
                  fill="#9c27b0" 
                  radius={[8, 8, 0, 0]}
                  stroke="#9c27b0"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Métricas Rápidas */}
        <Grid item xs={12} lg={4}>
          <ChartCard title="⚡ Métricas Rápidas">
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                  <BookOnline sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>156</Typography>
                  <Typography variant="body2" color="text.secondary">Aulas Hoje</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                  <Schedule sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>89%</Typography>
                  <Typography variant="body2" color="text.secondary">Presença</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                  <Payment sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>92%</Typography>
                  <Typography variant="body2" color="text.secondary">Pagamentos</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fce4ec' }}>
                  <Warning sx={{ fontSize: 40, color: '#c2185b', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>7</Typography>
                  <Typography variant="body2" color="text.secondary">Pendências</Typography>
                </Paper>
              </Grid>
            </Grid>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Avisos Importantes */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ 
            background: 'linear-gradient(135deg, #ffebee 0%, #f8bbd9 100%)',
            border: '1px solid #f48fb1',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b', mb: 3, textAlign: 'center' }}>
                🚨 Avisos Importantes
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                      📢 Reunião Pedagógica
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Todos os professores - 15/12 às 14h
                    </Typography>
                    <Chip label="Hoje" size="small" color="error" />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                      💰 Vencimento Mensalidades
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      91 alunos com pendências
                    </Typography>
                    <Chip label="Urgente" size="small" color="warning" />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                      📚 Material Didático
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estoque baixo - 5 itens
                    </Typography>
                    <Chip label="Atenção" size="small" color="info" />
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardNovo;