import {
  Box,
  Button,
  Card,
  CardContent,
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
  Chip,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Event as EventIcon,
  AttachFile as AttachFileIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface PresencaFalta {
  id: number;
  aulas_id: number;
  alunos_id: number;
  presenca: boolean;
  tipo_falta: string;
  justificativa: string;
  anexo_atestado_url: string;
  data: string;
  ano_letivo: number;
  detalhes: string;
  // Campos auxiliares para exibição
  aluno_nome?: string;
  aula_descricao?: string;
}

const tiposFalta = [
  'Falta Justificada',
  'Falta Médica',
  'Falta Familiar',
  'Falta por Viagem',
  'Falta Injustificada',
  'Atraso',
  'Saída Antecipada'
];

export default function PresencaFaltas() {
  const [registros, setRegistros] = useState<PresencaFalta[]>([
    {
      id: 1,
      aulas_id: 1,
      alunos_id: 1,
      presenca: true,
      tipo_falta: '',
      justificativa: '',
      anexo_atestado_url: '',
      data: "2024-01-20",
      ano_letivo: 2024,
      detalhes: 'Presente',
      aluno_nome: "João Silva",
      aula_descricao: "Inglês - Intermediário A"
    },
    {
      id: 2,
      aulas_id: 2,
      alunos_id: 2,
      presenca: false,
      tipo_falta: 'Falta Médica',
      justificativa: 'Consulta médica agendada',
      anexo_atestado_url: 'atestado_medico.pdf',
      data: "2024-01-22",
      ano_letivo: 2024,
      detalhes: 'Atestado médico',
      aluno_nome: "Maria Santos",
      aula_descricao: "Inglês - Avançado B"
    },
    {
      id: 3,
      aulas_id: 3,
      alunos_id: 3,
      presenca: false,
      tipo_falta: 'Falta Injustificada',
      justificativa: '',
      anexo_atestado_url: '',
      data: "2024-01-23",
      ano_letivo: 2024,
      detalhes: 'Sem justificativa',
      aluno_nome: "Pedro Costa",
      aula_descricao: "Inglês - Básico C"
    }
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<PresencaFalta | null>(null);

  const [novoRegistro, setNovoRegistro] = useState<Omit<PresencaFalta, 'id'>>({
    aulas_id: 0,
    alunos_id: 0,
    presenca: true,
    tipo_falta: '',
    justificativa: '',
    anexo_atestado_url: '',
    data: '',
    ano_letivo: new Date().getFullYear(),
    detalhes: '',
    aluno_nome: '',
    aula_descricao: ''
  });

  // Dados mockados para aulas e alunos
  const aulas = [
    { id: 1, descricao: "Inglês - Intermediário A" },
    { id: 2, descricao: "Inglês - Avançado B" },
    { id: 3, descricao: "Inglês - Básico C" },
    { id: 4, descricao: "Inglês - Conversação D" }
  ];

  const alunos = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Costa" },
    { id: 4, nome: "Ana Lima" },
    { id: 5, nome: "Carlos Oliveira" }
  ];

  const abrirDialog = (registro?: PresencaFalta) => {
    if (registro) {
      setRegistroEditando(registro);
      setNovoRegistro(registro);
    } else {
      setRegistroEditando(null);
      setNovoRegistro({
        aulas_id: 0,
        alunos_id: 0,
        presenca: true,
        tipo_falta: '',
        justificativa: '',
        anexo_atestado_url: '',
        data: new Date().toISOString().split('T')[0],
        ano_letivo: new Date().getFullYear(),
        detalhes: '',
        aluno_nome: '',
        aula_descricao: ''
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setRegistroEditando(null);
  };

  const salvarRegistro = () => {
    const aulasSelecionada = aulas.find(a => a.id === novoRegistro.aulas_id);
    const alunoSelecionado = alunos.find(a => a.id === novoRegistro.alunos_id);
    
    const registroCompleto = {
      ...novoRegistro,
      aula_descricao: aulasSelecionada?.descricao || '',
      aluno_nome: alunoSelecionado?.nome || ''
    };

    if (registroEditando) {
      setRegistros(prev => 
        prev.map(r => r.id === registroEditando.id ? { ...registroCompleto, id: registroEditando.id } : r)
      );
    } else {
      const novoId = Math.max(...registros.map(r => r.id), 0) + 1;
      setRegistros(prev => [...prev, { ...registroCompleto, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirRegistro = (id: number) => {
    setRegistros(prev => prev.filter(r => r.id !== id));
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const obterCorStatus = (presenca: boolean, tipoFalta: string) => {
    if (presenca) return 'success';
    if (tipoFalta.includes('Médica') || tipoFalta.includes('Justificada')) return 'warning';
    return 'error';
  };

  const obterTextoStatus = (presenca: boolean, tipoFalta: string) => {
    if (presenca) return 'Presente';
    return tipoFalta || 'Falta';
  };

  const totalPresencas = registros.filter(r => r.presenca).length;
  const totalFaltas = registros.filter(r => !r.presenca).length;
  const faltasJustificadas = registros.filter(r => !r.presenca && (r.tipo_falta.includes('Justificada') || r.tipo_falta.includes('Médica'))).length;

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="Presença / Faltas" 
        subtitulo="Controle de frequência dos alunos"
      />

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalPresencas}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Presenças
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {totalFaltas}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Faltas
                  </Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {faltasJustificadas}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Faltas Justificadas
                  </Typography>
                </Box>
                <AttachFileIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {totalPresencas > 0 ? Math.round((totalPresencas / registros.length) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Taxa de Presença
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botão Adicionar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirDialog()}
          size="large"
        >
          Novo Registro
        </Button>
      </Box>

      {/* Tabela de Registros */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Aluno</strong></TableCell>
              <TableCell><strong>Aula</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Tipo de Falta</strong></TableCell>
              <TableCell><strong>Justificativa</strong></TableCell>
              <TableCell><strong>Ano Letivo</strong></TableCell>
              <TableCell><strong>Detalhes</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((registro) => (
              <TableRow key={registro.id} hover>
                <TableCell>{registro.aluno_nome}</TableCell>
                <TableCell>{registro.aula_descricao}</TableCell>
                <TableCell>{formatarData(registro.data)}</TableCell>
                <TableCell>
                  <Chip 
                    label={obterTextoStatus(registro.presenca, registro.tipo_falta)}
                    size="small" 
                    color={obterCorStatus(registro.presenca, registro.tipo_falta)}
                    icon={registro.presenca ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                </TableCell>
                <TableCell>
                  {!registro.presenca && registro.tipo_falta ? (
                    <Chip 
                      label={registro.tipo_falta} 
                      size="small" 
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  {registro.justificativa ? (
                    <Typography variant="body2" noWrap>
                      {registro.justificativa}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell>{registro.ano_letivo}</TableCell>
                <TableCell sx={{ maxWidth: 150 }}>
                  <Typography variant="body2" noWrap>
                    {registro.detalhes}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => abrirDialog(registro)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirRegistro(registro.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {registros.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum registro encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece adicionando um novo registro de presença
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Adicionar Registro
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

      {/* Dialog para adicionar/editar registro */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {registroEditando ? 'Editar Registro' : 'Novo Registro de Presença'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Aluno</InputLabel>
                <Select
                  value={novoRegistro.alunos_id}
                  label="Aluno"
                  onChange={(e) => setNovoRegistro(prev => ({ ...prev, alunos_id: Number(e.target.value) }))}
                >
                  {alunos.map((aluno) => (
                    <MenuItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Aula</InputLabel>
                <Select
                  value={novoRegistro.aulas_id}
                  label="Aula"
                  onChange={(e) => setNovoRegistro(prev => ({ ...prev, aulas_id: Number(e.target.value) }))}
                >
                  {aulas.map((aula) => (
                    <MenuItem key={aula.id} value={aula.id}>
                      {aula.descricao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={novoRegistro.data}
                onChange={(e) => setNovoRegistro(prev => ({ ...prev, data: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ano Letivo"
                type="number"
                value={novoRegistro.ano_letivo}
                onChange={(e) => setNovoRegistro(prev => ({ ...prev, ano_letivo: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={novoRegistro.presenca}
                    onChange={(e) => setNovoRegistro(prev => ({ ...prev, presenca: e.target.checked }))}
                  />
                }
                label="Presente"
              />
            </Grid>
            {!novoRegistro.presenca && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Falta</InputLabel>
                    <Select
                      value={novoRegistro.tipo_falta}
                      label="Tipo de Falta"
                      onChange={(e) => setNovoRegistro(prev => ({ ...prev, tipo_falta: e.target.value }))}
                    >
                      {tiposFalta.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Anexo/Atestado URL"
                    value={novoRegistro.anexo_atestado_url}
                    onChange={(e) => setNovoRegistro(prev => ({ ...prev, anexo_atestado_url: e.target.value }))}
                    InputProps={{
                      startAdornment: <AttachFileIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Justificativa"
                    multiline
                    rows={3}
                    value={novoRegistro.justificativa}
                    onChange={(e) => setNovoRegistro(prev => ({ ...prev, justificativa: e.target.value }))}
                    placeholder="Descreva a justificativa para a falta..."
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Detalhes"
                value={novoRegistro.detalhes}
                onChange={(e) => setNovoRegistro(prev => ({ ...prev, detalhes: e.target.value }))}
                placeholder="Informações adicionais..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarRegistro} variant="contained">
            {registroEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}