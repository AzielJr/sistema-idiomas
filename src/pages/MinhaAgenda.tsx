import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
  Alert,
  ButtonBase
} from "@mui/material";
import {
  Add as AddIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface Compromisso {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  tipo: 'aula' | 'reuniao' | 'evento' | 'pessoal';
  participantes: string;
  local: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
}

const tiposCompromisso = [
  { value: 'aula', label: 'Aula', color: '#2196F3' },
  { value: 'reuniao', label: 'Reunião', color: '#FF9800' },
  { value: 'evento', label: 'Evento', color: '#4CAF50' },
  { value: 'pessoal', label: 'Pessoal', color: '#9C27B0' }
];

const statusCompromisso = [
  { value: 'agendado', label: 'Agendado', color: '#2196F3' },
  { value: 'confirmado', label: 'Confirmado', color: '#4CAF50' },
  { value: 'cancelado', label: 'Cancelado', color: '#F44336' },
  { value: 'concluido', label: 'Concluído', color: '#9E9E9E' }
];

export default function MinhaAgenda() {
  const [compromissos, setCompromissos] = useState<Compromisso[]>([
    {
      id: 1,
      titulo: "Aula de Inglês - Turma Intermediário",
      descricao: "Revisão de Present Perfect e exercícios práticos",
      data: "2024-01-15",
      hora: "14:00",
      tipo: "aula",
      participantes: "Turma INT-001 (15 alunos)",
      local: "Sala 201",
      status: "confirmado"
    },
    {
      id: 2,
      titulo: "Reunião Pedagógica",
      descricao: "Planejamento do próximo semestre",
      data: "2024-01-16",
      hora: "10:00",
      tipo: "reuniao",
      participantes: "Coordenação Pedagógica",
      local: "Sala de Reuniões",
      status: "agendado"
    },
    {
      id: 3,
      titulo: "Workshop de Conversação",
      descricao: "Atividade especial para alunos avançados",
      data: "2024-01-17",
      hora: "16:00",
      tipo: "evento",
      participantes: "Alunos Avançados",
      local: "Auditório",
      status: "agendado"
    }
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [compromissoEditando, setCompromissoEditando] = useState<Compromisso | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [mesAtual, setMesAtual] = useState(new Date());
  const [dataSelecionada, setDataSelecionada] = useState<string>('');

  const [novoCompromisso, setNovoCompromisso] = useState<Omit<Compromisso, 'id'>>({
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    tipo: 'aula',
    participantes: '',
    local: '',
    status: 'agendado'
  });

  const abrirDialog = (compromisso?: Compromisso, dataPreSelecionada?: string) => {
    if (compromisso) {
      setCompromissoEditando(compromisso);
      setNovoCompromisso(compromisso);
      setDialogAberto(true);
    } else {
      setCompromissoEditando(null);
      setNovoCompromisso({
        titulo: '',
        descricao: '',
        data: dataPreSelecionada || '',
        hora: '',
        tipo: 'aula',
        participantes: '',
        local: '',
        status: 'agendado'
      });
      if (dataPreSelecionada) {
        setDialogAberto(true);
      } else {
        setCalendarioAberto(true);
      }
    }
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setCompromissoEditando(null);
  };

  const salvarCompromisso = () => {
    if (compromissoEditando) {
      setCompromissos(prev => 
        prev.map(c => c.id === compromissoEditando.id ? { ...novoCompromisso, id: compromissoEditando.id } : c)
      );
    } else {
      const novoId = Math.max(...compromissos.map(c => c.id), 0) + 1;
      setCompromissos(prev => [...prev, { ...novoCompromisso, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirCompromisso = (id: number) => {
    setCompromissos(prev => prev.filter(c => c.id !== id));
  };

  const compromissosFiltrados = compromissos.filter(compromisso => {
    const filtroTipoOk = filtroTipo === 'todos' || compromisso.tipo === filtroTipo;
    const filtroStatusOk = filtroStatus === 'todos' || compromisso.status === filtroStatus;
    return filtroTipoOk && filtroStatusOk;
  });

  const getCorTipo = (tipo: string) => {
    return tiposCompromisso.find(t => t.value === tipo)?.color || '#2196F3';
  };

  const getCorStatus = (status: string) => {
    return statusCompromisso.find(s => s.value === status)?.color || '#2196F3';
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  // Funções do calendário
  const obterDiasDoMes = (data: Date) => {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasDoMes = [];
    
    // Adicionar dias vazios do início
    const diaSemanaInicio = primeiroDia.getDay();
    for (let i = 0; i < diaSemanaInicio; i++) {
      diasDoMes.push(null);
    }
    
    // Adicionar todos os dias do mês
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      diasDoMes.push(new Date(ano, mes, dia));
    }
    
    return diasDoMes;
  };

  const formatarDataParaInput = (data: Date) => {
    return data.toISOString().split('T')[0];
  };

  const mudarMes = (direcao: number) => {
    setMesAtual(prev => {
      const novaData = new Date(prev);
      novaData.setMonth(prev.getMonth() + direcao);
      return novaData;
    });
  };

  const selecionarData = (data: Date) => {
    const dataFormatada = formatarDataParaInput(data);
    setDataSelecionada(dataFormatada);
    setCalendarioAberto(false);
    abrirDialog(undefined, dataFormatada);
  };

  const fecharCalendario = () => {
    setCalendarioAberto(false);
  };

  const proximosCompromissos = compromissos
    .filter(c => new Date(c.data) >= new Date())
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 3);

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="Minha Agenda" 
        subtitulo="Gerencie seus compromissos e atividades"
      />

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {compromissos.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Compromissos
                  </Typography>
                </Box>
                <CalendarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {compromissos.filter(c => new Date(c.data) >= new Date()).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Próximos
                  </Typography>
                </Box>
                <TodayIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {compromissos.filter(c => c.status === 'confirmado').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Confirmados
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {compromissos.filter(c => c.tipo === 'aula').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Aulas
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Próximos Compromissos */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TodayIcon color="primary" />
            Próximos Compromissos
          </Typography>
          {proximosCompromissos.length > 0 ? (
            <Grid container spacing={2}>
              {proximosCompromissos.map((compromisso) => (
                <Grid item xs={12} md={4} key={compromisso.id}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      borderLeft: `4px solid ${getCorTipo(compromisso.tipo)}`,
                      '&:hover': { boxShadow: 3 }
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {compromisso.titulo}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatarData(compromisso.data)} às {compromisso.hora}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">{compromisso.local}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Nenhum compromisso próximo encontrado.</Alert>
          )}
        </CardContent>
      </Card>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Tipo</InputLabel>
              <Select
                value={filtroTipo}
                label="Filtrar por Tipo"
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <MenuItem value="todos">Todos os Tipos</MenuItem>
                {tiposCompromisso.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Status</InputLabel>
              <Select
                value={filtroStatus}
                label="Filtrar por Status"
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <MenuItem value="todos">Todos os Status</MenuItem>
                {statusCompromisso.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => abrirDialog()}
              fullWidth
              sx={{ height: 40 }}
            >
              Novo Compromisso
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Compromissos */}
      <Grid container spacing={3}>
        {compromissosFiltrados.map((compromisso) => (
          <Grid item xs={12} md={6} lg={4} key={compromisso.id}>
            <Card 
              sx={{ 
                height: '100%',
                '&:hover': { 
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                    {compromisso.titulo}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => abrirDialog(compromisso)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => excluirCompromisso(compromisso.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {compromisso.descricao}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatarData(compromisso.data)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">{compromisso.hora}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">{compromisso.local}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">{compromisso.participantes}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={tiposCompromisso.find(t => t.value === compromisso.tipo)?.label}
                    size="small"
                    sx={{ 
                      backgroundColor: getCorTipo(compromisso.tipo),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    label={statusCompromisso.find(s => s.value === compromisso.status)?.label}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderColor: getCorStatus(compromisso.status),
                      color: getCorStatus(compromisso.status)
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {compromissosFiltrados.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum compromisso encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ajuste os filtros ou adicione um novo compromisso
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Adicionar Compromisso
          </Button>
        </Paper>
      )}

      {/* FAB para adicionar */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => abrirDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Dialog do Calendário */}
      <Dialog open={calendarioAberto} onClose={fecharCalendario} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={() => mudarMes(-1)}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6">
              {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={() => mudarMes(1)}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            {/* Cabeçalho dos dias da semana */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                <Grid item xs key={dia} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary">
                    {dia}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            {/* Dias do calendário */}
            <Grid container spacing={1}>
              {obterDiasDoMes(mesAtual).map((dia, index) => (
                <Grid item xs key={index} sx={{ aspectRatio: '1', minHeight: 40 }}>
                  {dia ? (
                    <ButtonBase
                      onClick={() => selecionarData(dia)}
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                        backgroundColor: 
                          dia.toDateString() === new Date().toDateString() 
                            ? '#1976d2' 
                            : 'white',
                        color: 
                          dia.toDateString() === new Date().toDateString() 
                            ? 'white' 
                            : 'text.primary',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          color: 'text.primary'
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2">
                        {dia.getDate()}
                      </Typography>
                    </ButtonBase>
                  ) : (
                    <Box sx={{ width: '100%', height: '100%' }} />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharCalendario}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para adicionar/editar compromisso */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {compromissoEditando ? 'Editar Compromisso' : 'Novo Compromisso'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={novoCompromisso.titulo}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, titulo: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={novoCompromisso.descricao}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, descricao: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={novoCompromisso.data}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, data: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hora"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={novoCompromisso.hora}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, hora: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={novoCompromisso.tipo}
                  label="Tipo"
                  onChange={(e) => setNovoCompromisso(prev => ({ ...prev, tipo: e.target.value as any }))}
                >
                  {tiposCompromisso.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={novoCompromisso.status}
                  label="Status"
                  onChange={(e) => setNovoCompromisso(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  {statusCompromisso.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Participantes"
                value={novoCompromisso.participantes}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, participantes: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Local"
                value={novoCompromisso.local}
                onChange={(e) => setNovoCompromisso(prev => ({ ...prev, local: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarCompromisso} variant="contained">
            {compromissoEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}