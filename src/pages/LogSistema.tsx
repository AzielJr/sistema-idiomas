import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  TablePagination
} from "@mui/material";
import {
  Login as LoginIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface LogEntry {
  id: number;
  usuario: string;
  acao: 'LOGIN' | 'LOGOUT' | 'SALVAR' | 'EXCLUIR' | 'VISUALIZAR' | 'EDITAR';
  modulo: string;
  descricao: string;
  dataHora: string;
  ip: string;
  dispositivo: string;
  navegador: string;
  sucesso: boolean;
}

export default function LogSistema() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      usuario: "João Silva",
      acao: "LOGIN",
      modulo: "Sistema",
      descricao: "Login realizado com sucesso",
      dataHora: "2024-01-15 14:30:25",
      ip: "192.168.1.100",
      dispositivo: "Desktop",
      navegador: "Chrome 120.0",
      sucesso: true
    },
    {
      id: 2,
      usuario: "Maria Santos",
      acao: "SALVAR",
      modulo: "Alunos",
      descricao: "Cadastro do aluno 'Pedro Costa' criado",
      dataHora: "2024-01-15 14:25:10",
      ip: "192.168.1.105",
      dispositivo: "Mobile",
      navegador: "Safari 17.0",
      sucesso: true
    },
    {
      id: 3,
      usuario: "Ana Costa",
      acao: "EXCLUIR",
      modulo: "Turmas",
      descricao: "Turma 'Inglês Básico A1' removida",
      dataHora: "2024-01-15 14:20:45",
      ip: "192.168.1.102",
      dispositivo: "Desktop",
      navegador: "Firefox 121.0",
      sucesso: true
    },
    {
      id: 4,
      usuario: "Carlos Oliveira",
      acao: "LOGIN",
      modulo: "Sistema",
      descricao: "Tentativa de login com senha incorreta",
      dataHora: "2024-01-15 14:15:30",
      ip: "192.168.1.110",
      dispositivo: "Desktop",
      navegador: "Edge 120.0",
      sucesso: false
    },
    {
      id: 5,
      usuario: "João Silva",
      acao: "EDITAR",
      modulo: "Professores",
      descricao: "Dados do professor 'Maria Santos' atualizados",
      dataHora: "2024-01-15 14:10:15",
      ip: "192.168.1.100",
      dispositivo: "Desktop",
      navegador: "Chrome 120.0",
      sucesso: true
    },
    {
      id: 6,
      usuario: "Maria Santos",
      acao: "VISUALIZAR",
      modulo: "Relatórios",
      descricao: "Relatório de frequência acessado",
      dataHora: "2024-01-15 14:05:00",
      ip: "192.168.1.105",
      dispositivo: "Tablet",
      navegador: "Chrome 120.0",
      sucesso: true
    },
    {
      id: 7,
      usuario: "Ana Costa",
      acao: "SALVAR",
      modulo: "Unidades",
      descricao: "Nova unidade 'Filial Centro' cadastrada",
      dataHora: "2024-01-15 13:55:20",
      ip: "192.168.1.102",
      dispositivo: "Desktop",
      navegador: "Firefox 121.0",
      sucesso: true
    },
    {
      id: 8,
      usuario: "Carlos Oliveira",
      acao: "LOGOUT",
      modulo: "Sistema",
      descricao: "Logout realizado",
      dataHora: "2024-01-15 13:50:10",
      ip: "192.168.1.110",
      dispositivo: "Desktop",
      navegador: "Edge 120.0",
      sucesso: true
    }
  ]);

  const [filtros, setFiltros] = useState({
    usuario: '',
    acao: '',
    modulo: '',
    dataInicio: '',
    dataFim: '',
    sucesso: ''
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  const getIconeAcao = (acao: string) => {
    switch (acao) {
      case 'LOGIN': return <LoginIcon fontSize="small" />;
      case 'LOGOUT': return <LoginIcon fontSize="small" sx={{ transform: 'rotate(180deg)' }} />;
      case 'SALVAR': return <SaveIcon fontSize="small" />;
      case 'EXCLUIR': return <DeleteIcon fontSize="small" />;
      case 'EDITAR': return <SaveIcon fontSize="small" />;
      case 'VISUALIZAR': return <SearchIcon fontSize="small" />;
      default: return <SecurityIcon fontSize="small" />;
    }
  };

  const getCorAcao = (acao: string, sucesso: boolean) => {
    if (!sucesso) return 'error';
    
    switch (acao) {
      case 'LOGIN': return 'success';
      case 'LOGOUT': return 'info';
      case 'SALVAR': return 'primary';
      case 'EXCLUIR': return 'warning';
      case 'EDITAR': return 'secondary';
      case 'VISUALIZAR': return 'default';
      default: return 'default';
    }
  };

  const logsFiltrados = logs.filter(log => {
    const dataLog = log.dataHora.split(' ')[0]; // Extrai apenas a data (YYYY-MM-DD)
    
    const dentroDataInicio = !filtros.dataInicio || dataLog >= filtros.dataInicio;
    const dentroDataFim = !filtros.dataFim || dataLog <= filtros.dataFim;
    
    return dentroDataInicio && dentroDataFim;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const limparFiltros = () => {
    setFiltros({
      usuario: '',
      acao: '',
      modulo: '',
      dataInicio: '',
      dataFim: '',
      sucesso: ''
    });
    setPage(0);
  };

  // Estatísticas
  const totalLogs = logs.length;
  const logsHoje = logs.filter(log => log.dataHora.startsWith('2024-01-15')).length;
  const loginsSucesso = logs.filter(log => log.acao === 'LOGIN' && log.sucesso).length;
  const tentativasFalhas = logs.filter(log => !log.sucesso).length;

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="LOG do Sistema" 
        subtitulo="Monitore todas as atividades dos usuários"
      />

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalLogs}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Logs
                  </Typography>
                </Box>
                <SecurityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {logsHoje}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Atividades Hoje
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {loginsSucesso}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Logins Realizados
                  </Typography>
                </Box>
                <LoginIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {tentativasFalhas}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tentativas Falhas
                  </Typography>
                </Box>
                <SecurityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filtros</Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton onClick={limparFiltros} size="small">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Data Inicial"
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split('T')[0]
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Data Final"
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split('T')[0],
                min: filtros.dataInicio || undefined
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {logsFiltrados.length} de {totalLogs} registros encontrados
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 'medium' }}>
                {filtros.dataInicio || filtros.dataFim ? 'Filtros aplicados' : 'Todos os registros'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de Logs */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Data/Hora</strong></TableCell>
              <TableCell><strong>Usuário</strong></TableCell>
              <TableCell><strong>Ação</strong></TableCell>
              <TableCell><strong>Módulo</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell><strong>IP/Dispositivo</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logsFiltrados
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {log.dataHora}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {log.usuario.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2">
                      {log.usuario}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getIconeAcao(log.acao)}
                    label={log.acao}
                    size="small"
                    color={getCorAcao(log.acao, log.sucesso) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {log.modulo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {log.descricao}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="caption" display="block" fontFamily="monospace">
                      {log.ip}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.dispositivo} • {log.navegador}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.sucesso ? 'Sucesso' : 'Falha'}
                    size="small"
                    color={log.sucesso ? 'success' : 'error'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={logsFiltrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Registros por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </TableContainer>

      {logsFiltrados.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <SecurityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum log encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ajuste os filtros para visualizar os registros
          </Typography>
        </Paper>
      )}
    </Box>
  );
}