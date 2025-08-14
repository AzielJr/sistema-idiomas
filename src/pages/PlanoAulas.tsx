import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  EmojiObjects as EmojiObjectsIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface PlanoAula {
  id: number;
  // Cabeçalho inicial
  lesson_plan: string;
  main_aim: string;
  subsidiary_aim: string;
  professor: string;
  data: string;
  hora: string;
  // Estágios da aula
  warm_up: EstagioAula;
  lead_in: EstagioAula;
  controlled_practice_1: EstagioAula;
  clarification: EstagioAula;
  controlled_practice_2: EstagioAula;
  semi_controlled: EstagioAula;
  free_practice: EstagioAula;
  further_practice: EstagioAula;
  extra_15_minutes: EstagioAula;
  // Metadados
  data_criacao: string;
  status: 'Rascunho' | 'Aprovado' | 'Em Revisão';
}

interface EstagioAula {
  activity_description: string;
  instructions_icqs: string;
  duration: string;
  interaction: string;
  anticipated_problems: string;
}

const estagiosAula = [
  { key: 'warm_up', nome: 'Warm up', cor: '#e3f2fd' },
  { key: 'lead_in', nome: 'Lead-in', cor: '#e8f5e8' },
  { key: 'controlled_practice_1', nome: 'Controlled practice 1', cor: '#fff3e0' },
  { key: 'clarification', nome: 'Clarification', cor: '#f3e5f5' },
  { key: 'controlled_practice_2', nome: 'Controlled Practice 2', cor: '#e1f5fe' },
  { key: 'semi_controlled', nome: 'Semi Controlled', cor: '#fce4ec' },
  { key: 'free_practice', nome: 'Free Practice', cor: '#f1f8e9' },
  { key: 'further_practice', nome: 'Further practice', cor: '#fff8e1' },
  { key: 'extra_15_minutes', nome: 'Extra 15 minutes', cor: '#fafafa' }
];

const interactionTypes = [
  'T-S (Teacher-Student)',
  'S-T (Student-Teacher)',
  'S-S (Student-Student)',
  'Individual',
  'Pair work',
  'Group work',
  'Whole class'
];

const createEmptyEstagio = (): EstagioAula => ({
  activity_description: '',
  instructions_icqs: '',
  duration: '',
  interaction: '',
  anticipated_problems: ''
});

export default function PlanoAulas() {
  const [planos, setPlanos] = useState<PlanoAula[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<PlanoAula | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState(false);

  const [novoPlano, setNovoPlano] = useState<Omit<PlanoAula, 'id'>>({
    lesson_plan: '',
    main_aim: '',
    subsidiary_aim: '',
    professor: '',
    data: '',
    hora: '',
    warm_up: createEmptyEstagio(),
    lead_in: createEmptyEstagio(),
    controlled_practice_1: createEmptyEstagio(),
    clarification: createEmptyEstagio(),
    controlled_practice_2: createEmptyEstagio(),
    semi_controlled: createEmptyEstagio(),
    free_practice: createEmptyEstagio(),
    further_practice: createEmptyEstagio(),
    extra_15_minutes: createEmptyEstagio(),
    data_criacao: new Date().toISOString().split('T')[0],
    status: 'Rascunho'
  });

  // Dados mockados
  const professores = [
    'Maria Silva',
    'João Santos', 
    'Ana Costa',
    'Pedro Lima',
    'Carlos Oliveira'
  ];

  const turmas = [
    'Inglês Básico - Turma A',
    'Inglês Básico - Turma B',
    'Inglês Intermediário - Turma A',
    'Inglês Intermediário - Turma B',
    'Inglês Avançado - Turma A',
    'Espanhol Básico - Turma A',
    'Conversação - Turma A'
  ];

  const abrirDialog = (plano?: PlanoAula, visualizar = false) => {
    if (plano) {
      setPlanoEditando(plano);
      setNovoPlano(plano);
    } else {
      setPlanoEditando(null);
      setNovoPlano({
        lesson_plan: '',
        main_aim: '',
        subsidiary_aim: '',
        professor: '',
        data: '',
        hora: '',
        warm_up: createEmptyEstagio(),
        lead_in: createEmptyEstagio(),
        controlled_practice_1: createEmptyEstagio(),
        clarification: createEmptyEstagio(),
        controlled_practice_2: createEmptyEstagio(),
        semi_controlled: createEmptyEstagio(),
        free_practice: createEmptyEstagio(),
        further_practice: createEmptyEstagio(),
        extra_15_minutes: createEmptyEstagio(),
        data_criacao: new Date().toISOString().split('T')[0],
        status: 'Rascunho'
      });
    }
    setModoVisualizacao(visualizar);
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setPlanoEditando(null);
    setModoVisualizacao(false);
  };

  const salvarPlano = () => {
    if (planoEditando) {
      setPlanos(prev => 
        prev.map(p => p.id === planoEditando.id ? { ...novoPlano, id: planoEditando.id } : p)
      );
    } else {
      const novoId = Math.max(...planos.map(p => p.id), 0) + 1;
      setPlanos(prev => [...prev, { ...novoPlano, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirPlano = (id: number) => {
    setPlanos(prev => prev.filter(p => p.id !== id));
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'success';
      case 'Em Revisão': return 'warning';
      default: return 'default';
    }
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
                    {planos.filter(p => new Date(p.data) >= new Date()).length}
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
                    {planos.filter(p => p.status === 'Aprovado').length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Aprovados
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {new Set(planos.map(p => p.professor)).size}
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
              <TableCell><strong>Lesson Plan</strong></TableCell>
              <TableCell><strong>Professor</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Hora</strong></TableCell>
              <TableCell><strong>Main Aim</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planos.map((plano) => (
              <TableRow key={plano.id} hover>
                <TableCell>{plano.lesson_plan}</TableCell>
                <TableCell>{plano.professor}</TableCell>
                <TableCell>{formatarData(plano.data)}</TableCell>
                <TableCell>{plano.hora}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap>
                    {plano.main_aim}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={plano.status} 
                    size="small" 
                    color={getStatusColor(plano.status) as any}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => abrirDialog(plano, true)} title="Visualizar">
                    <DescriptionIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => abrirDialog(plano)} title="Editar">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirPlano(plano.id)} title="Excluir">
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

      {/* Dialog para adicionar/editar plano */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon />
          {modoVisualizacao ? 'Visualizar Plano de Aula' : 
           planoEditando ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {/* Cabeçalho Inicial */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
              📋 LESSON PLAN
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                   <FormControl fullWidth disabled={modoVisualizacao}>
                     <InputLabel>TURMA</InputLabel>
                     <Select
                       value={novoPlano.lesson_plan}
                       onChange={(e) => setNovoPlano(prev => ({ ...prev, lesson_plan: e.target.value }))}
                       variant={modoVisualizacao ? 'standard' : 'outlined'}
                       sx={{ 
                         '& .MuiInputBase-root': { 
                           height: '60px !important',
                           bgcolor: 'white',
                           fontSize: '14px'
                         },
                         '& .MuiSelect-select': {
                           fontSize: '14px'
                         }
                       }}
                     >
                       <MenuItem value="Turma A - Básico">Turma A - Básico</MenuItem>
                       <MenuItem value="Turma B - Intermediário">Turma B - Intermediário</MenuItem>
                       <MenuItem value="Turma C - Avançado">Turma C - Avançado</MenuItem>
                       <MenuItem value="Turma D - Conversação">Turma D - Conversação</MenuItem>
                       <MenuItem value="Turma E - Business">Turma E - Business</MenuItem>
                       <MenuItem value="Turma F - Preparatório">Turma F - Preparatório</MenuItem>
                     </Select>
                   </FormControl>
                 </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={{ 
                    '& .MuiInputBase-root': { height: '60px', bgcolor: 'white' },
                    '& .MuiSelect-select': { fontSize: '14px' }
                  }}>
                    <InputLabel>Professor:</InputLabel>
                    <Select
                      value={novoPlano.professor}
                      onChange={(e) => setNovoPlano(prev => ({ ...prev, professor: e.target.value }))}
                      disabled={modoVisualizacao}
                    >
                      {professores.map((professor) => (
                        <MenuItem key={professor} value={professor}>
                          {professor}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Data:"
                    type="date"
                    value={novoPlano.data}
                    onChange={(e) => setNovoPlano(prev => ({ ...prev, data: e.target.value }))}
                    disabled={modoVisualizacao}
                    variant={modoVisualizacao ? 'standard' : 'outlined'}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiInputBase-root': { height: '60px', bgcolor: 'white' },
                      '& .MuiInputBase-input': { fontSize: '14px' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="MAIN AIM:"
                    multiline
                    rows={2}
                    value={novoPlano.main_aim}
                    onChange={(e) => setNovoPlano(prev => ({ ...prev, main_aim: e.target.value }))}
                    disabled={modoVisualizacao}
                    variant={modoVisualizacao ? 'standard' : 'outlined'}
                    sx={{ 
                      '& .MuiInputBase-root': { bgcolor: 'white' },
                      '& .MuiInputBase-input': { fontSize: '14px' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SUBSIDIARY AIM:"
                    multiline
                    rows={2}
                    value={novoPlano.subsidiary_aim}
                    onChange={(e) => setNovoPlano(prev => ({ ...prev, subsidiary_aim: e.target.value }))}
                    disabled={modoVisualizacao}
                    variant={modoVisualizacao ? 'standard' : 'outlined'}
                    sx={{ 
                      '& .MuiInputBase-root': { bgcolor: 'white' },
                      '& .MuiInputBase-input': { fontSize: '14px' }
                    }}
                  />
                </Grid>
               </Grid>
           </Paper>

          {/* Estágios da Aula */}
          <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
            🎯 ESTÁGIOS DA AULA
          </Typography>
          {estagiosAula.map((estagio, index) => {
            const estagioData = novoPlano[estagio.key as keyof PlanoAula] as EstagioAula;
            
            return (
              <Accordion key={estagio.key} sx={{ 
                mb: 2, 
                border: '2px solid #e0e0e0',
                borderRadius: '12px !important',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:before': { display: 'none' }
              }}>
                <AccordionSummary 
                   expandIcon={<ExpandMoreIcon />} 
                   sx={{ 
                     bgcolor: estagio.cor, 
                     borderRadius: '10px 10px 0 0',
                     minHeight: '64px',
                     '&:hover': { bgcolor: estagio.cor },
                     '& .MuiAccordionSummary-content': { alignItems: 'center' }
                   }}
                 >
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Chip 
                       label={index + 1} 
                       size="small" 
                       sx={{ 
                         bgcolor: 'white', 
                         color: '#1976d2', 
                         fontWeight: 'bold',
                         minWidth: '32px'
                       }} 
                     />
                     <AccessTimeIcon sx={{ color: '#1976d2' }} />
                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                       {estagio.nome}
                     </Typography>
                   </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#fafafa', p: 3 }}>
                  <Grid container spacing={2}>
                     {/* Primeira linha - Campos principais */}
                     <Grid item xs={12} md={6}>
                       <TextField
                         fullWidth
                         label="📝 ACTIVITY/DESCRIPTION"
                         multiline
                         rows={4}
                         value={estagioData.activity_description}
                         onChange={(e) => setNovoPlano(prev => ({
                           ...prev,
                           [estagio.key]: {
                             ...estagioData,
                             activity_description: e.target.value
                           }
                         }))}
                         disabled={modoVisualizacao}
                         variant={modoVisualizacao ? 'standard' : 'outlined'}
                         placeholder="Descreva a atividade principal..."
                         sx={{ 
                           height: '140px',
                           '& .MuiInputBase-root': { 
                             height: '140px',
                             bgcolor: 'white'
                           }
                         }}
                       />
                     </Grid>
                     <Grid item xs={12} md={6}>
                       <TextField
                         fullWidth
                         label="💬 INSTRUCTIONS / ICQS"
                         multiline
                         rows={4}
                         value={estagioData.instructions_icqs}
                         onChange={(e) => setNovoPlano(prev => ({
                           ...prev,
                           [estagio.key]: {
                             ...estagioData,
                             instructions_icqs: e.target.value
                           }
                         }))}
                         disabled={modoVisualizacao}
                         variant={modoVisualizacao ? 'standard' : 'outlined'}
                         placeholder="Instruções e perguntas de verificação..."
                         sx={{ 
                           height: '140px',
                           '& .MuiInputBase-root': { 
                             height: '140px',
                             bgcolor: 'white'
                           }
                         }}
                       />
                     </Grid>
                     
                     {/* Segunda linha - Campos secundários */}
                     <Grid item xs={12} md={4}>
                       <TextField
                         fullWidth
                         label="⏱️ DURATION"
                         value={estagioData.duration}
                         onChange={(e) => setNovoPlano(prev => ({
                           ...prev,
                           [estagio.key]: {
                             ...estagioData,
                             duration: e.target.value
                           }
                         }))}
                         disabled={modoVisualizacao}
                         variant={modoVisualizacao ? 'standard' : 'outlined'}
                         placeholder="ex: 10 min"
                         sx={{ 
                           height: '80px',
                           '& .MuiInputBase-root': { 
                             height: '80px',
                             bgcolor: 'white'
                           }
                         }}
                       />
                     </Grid>
                     <Grid item xs={12} md={4}>
                       <FormControl fullWidth disabled={modoVisualizacao} sx={{ height: '80px' }}>
                         <InputLabel>👥 INTERACTION</InputLabel>
                         <Select
                           value={estagioData.interaction}
                           onChange={(e) => setNovoPlano(prev => ({
                             ...prev,
                             [estagio.key]: {
                               ...estagioData,
                               interaction: e.target.value
                             }
                           }))}
                           sx={{ 
                             height: '80px',
                             '& .MuiInputBase-root': { 
                               height: '80px',
                               bgcolor: 'white'
                             }
                           }}
                         >
                           {interactionTypes.map((type) => (
                             <MenuItem key={type} value={type}>
                               {type}
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     </Grid>
                     <Grid item xs={12} md={4}>
                       <TextField
                         fullWidth
                         label="⚠️ ANTICIPATED PROBLEMS?"
                         multiline
                         rows={2}
                         value={estagioData.anticipated_problems}
                         onChange={(e) => setNovoPlano(prev => ({
                           ...prev,
                           [estagio.key]: {
                             ...estagioData,
                             anticipated_problems: e.target.value
                           }
                         }))}
                         disabled={modoVisualizacao}
                         variant={modoVisualizacao ? 'standard' : 'outlined'}
                         placeholder="Possíveis dificuldades..."
                         sx={{ 
                           height: '80px',
                           '& .MuiInputBase-root': { 
                             height: '80px',
                             bgcolor: 'white'
                           }
                         }}
                       />
                     </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          <Stack direction="row" spacing={2}>
            <Button onClick={fecharDialog}>
              {modoVisualizacao ? 'Fechar' : 'Cancelar'}
            </Button>
            {modoVisualizacao && (
              <Button 
                variant="outlined" 
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
              >
                Imprimir
              </Button>
            )}
            {!modoVisualizacao && (
              <Button 
                onClick={salvarPlano} 
                variant="contained" 
                startIcon={<SaveIcon />}
                sx={{ bgcolor: '#1976d2' }}
              >
                {planoEditando ? 'Atualizar' : 'Salvar'}
              </Button>
            )}
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}