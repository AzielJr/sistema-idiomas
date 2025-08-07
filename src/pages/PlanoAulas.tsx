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
  Alert,
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
  School as SchoolIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Feedback as FeedbackIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface PlanoAula {
  id: number;
  professores_id: number;
  turmas_id: number;
  data_aula: string;
  tipo_modelo: string;
  arquivo_url: string;
  detalhes: string;
  data_envio: string;
  feedback: string;
  // Campos auxiliares para exibição
  professor_nome?: string;
  turma_nome?: string;
}

const tiposModelo = [
  'Aula Expositiva',
  'Aula Prática',
  'Seminário',
  'Workshop',
  'Revisão',
  'Avaliação',
  'Projeto',
  'Dinâmica de Grupo'
];

export default function PlanoAulas() {
  const [planos, setPlanos] = useState<PlanoAula[]>([
    {
      id: 1,
      professores_id: 1,
      turmas_id: 1,
      data_aula: "2024-01-20",
      tipo_modelo: "Aula Expositiva",
      arquivo_url: "plano_aula_01.pdf",
      detalhes: "Present Perfect - Teoria e Exercícios",
      data_envio: "2024-01-15T10:30:00",
      feedback: "Excelente estruturação do conteúdo",
      professor_nome: "Maria Silva",
      turma_nome: "Intermediário A"
    },
    {
      id: 2,
      professores_id: 2,
      turmas_id: 2,
      data_aula: "2024-01-22",
      tipo_modelo: "Aula Prática",
      arquivo_url: "plano_aula_02.pdf",
      detalhes: "Conversação - Role Play",
      data_envio: "2024-01-16T14:20:00",
      feedback: "",
      professor_nome: "João Santos",
      turma_nome: "Avançado B"
    }
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<PlanoAula | null>(null);

  const [novoPlano, setNovoPlano] = useState<Omit<PlanoAula, 'id'>>({
    professores_id: 0,
    turmas_id: 0,
    data_aula: '',
    tipo_modelo: '',
    arquivo_url: '',
    detalhes: '',
    data_envio: '',
    feedback: '',
    professor_nome: '',
    turma_nome: ''
  });

  // Dados mockados para professores e turmas
  const professores = [
    { id: 1, nome: "Maria Silva" },
    { id: 2, nome: "João Santos" },
    { id: 3, nome: "Ana Costa" },
    { id: 4, nome: "Pedro Lima" }
  ];

  const turmas = [
    { id: 1, nome: "Intermediário A" },
    { id: 2, nome: "Avançado B" },
    { id: 3, nome: "Básico C" },
    { id: 4, nome: "Conversação D" }
  ];

  const abrirDialog = (plano?: PlanoAula) => {
    if (plano) {
      setPlanoEditando(plano);
      setNovoPlano(plano);
    } else {
      setPlanoEditando(null);
      setNovoPlano({
        professores_id: 0,
        turmas_id: 0,
        data_aula: '',
        tipo_modelo: '',
        arquivo_url: '',
        detalhes: '',
        data_envio: new Date().toISOString().slice(0, 16),
        feedback: '',
        professor_nome: '',
        turma_nome: ''
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setPlanoEditando(null);
  };

  const salvarPlano = () => {
    const professorSelecionado = professores.find(p => p.id === novoPlano.professores_id);
    const turmaSelecionada = turmas.find(t => t.id === novoPlano.turmas_id);
    
    const planoCompleto = {
      ...novoPlano,
      professor_nome: professorSelecionado?.nome || '',
      turma_nome: turmaSelecionada?.nome || ''
    };

    if (planoEditando) {
      setPlanos(prev => 
        prev.map(p => p.id === planoEditando.id ? { ...planoCompleto, id: planoEditando.id } : p)
      );
    } else {
      const novoId = Math.max(...planos.map(p => p.id), 0) + 1;
      setPlanos(prev => [...prev, { ...planoCompleto, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirPlano = (id: number) => {
    setPlanos(prev => prev.filter(p => p.id !== id));
  };

  const formatarDataHora = (dataHora: string) => {
    return new Date(dataHora).toLocaleString('pt-BR');
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="Plano de Aulas" 
        subtitulo="Gerencie os planos de aula dos professores"
      />

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {planos.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Planos
                  </Typography>
                </Box>
                <DescriptionIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {planos.filter(p => new Date(p.data_aula) >= new Date()).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Próximas Aulas
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {planos.filter(p => p.feedback).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Com Feedback
                  </Typography>
                </Box>
                <FeedbackIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {new Set(planos.map(p => p.professores_id)).size}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Professores
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
          Novo Plano de Aula
        </Button>
      </Box>

      {/* Tabela de Planos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Professor</strong></TableCell>
              <TableCell><strong>Turma</strong></TableCell>
              <TableCell><strong>Data da Aula</strong></TableCell>
              <TableCell><strong>Tipo/Modelo</strong></TableCell>
              <TableCell><strong>Detalhes</strong></TableCell>
              <TableCell><strong>Data Envio</strong></TableCell>
              <TableCell><strong>Feedback</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planos.map((plano) => (
              <TableRow key={plano.id} hover>
                <TableCell>{plano.professor_nome}</TableCell>
                <TableCell>{plano.turma_nome}</TableCell>
                <TableCell>{formatarData(plano.data_aula)}</TableCell>
                <TableCell>
                  <Chip 
                    label={plano.tipo_modelo} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap>
                    {plano.detalhes}
                  </Typography>
                </TableCell>
                <TableCell>{formatarDataHora(plano.data_envio)}</TableCell>
                <TableCell sx={{ maxWidth: 150 }}>
                  {plano.feedback ? (
                    <Typography variant="body2" noWrap color="success.main">
                      {plano.feedback}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sem feedback
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => abrirDialog(plano)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirPlano(plano.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {planos.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum plano de aula encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece adicionando um novo plano de aula
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Adicionar Plano de Aula
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

      {/* Dialog para adicionar/editar plano */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {planoEditando ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Professor</InputLabel>
                <Select
                  value={novoPlano.professores_id}
                  label="Professor"
                  onChange={(e) => setNovoPlano(prev => ({ ...prev, professores_id: Number(e.target.value) }))}
                >
                  {professores.map((professor) => (
                    <MenuItem key={professor.id} value={professor.id}>
                      {professor.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Turma</InputLabel>
                <Select
                  value={novoPlano.turmas_id}
                  label="Turma"
                  onChange={(e) => setNovoPlano(prev => ({ ...prev, turmas_id: Number(e.target.value) }))}
                >
                  {turmas.map((turma) => (
                    <MenuItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data da Aula"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={novoPlano.data_aula}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, data_aula: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo/Modelo</InputLabel>
                <Select
                  value={novoPlano.tipo_modelo}
                  label="Tipo/Modelo"
                  onChange={(e) => setNovoPlano(prev => ({ ...prev, tipo_modelo: e.target.value }))}
                >
                  {tiposModelo.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Detalhes"
                multiline
                rows={3}
                value={novoPlano.detalhes}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, detalhes: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL do Arquivo"
                value={novoPlano.arquivo_url}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, arquivo_url: e.target.value }))}
                InputProps={{
                  startAdornment: <CloudUploadIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Envio"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={novoPlano.data_envio}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, data_envio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Feedback"
                multiline
                rows={3}
                value={novoPlano.feedback}
                onChange={(e) => setNovoPlano(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Feedback sobre o plano de aula..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarPlano} variant="contained">
            {planoEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}