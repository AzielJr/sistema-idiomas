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
  Rating,
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
  Create as CreateIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CloudUpload as CloudUploadIcon,
  Star as StarIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface ProjetoEscrita {
  id: number;
  turmas_id: number;
  professores_id: number;
  titulo: string;
  status: string;
  descricao: string;
  arquivo_url: string;
  data_entrega: string;
  nota: number;
  // Campos auxiliares para exibição
  turma_nome?: string;
  professor_nome?: string;
}

const statusOptions = [
  'Pendente',
  'Em Andamento',
  'Entregue',
  'Avaliado',
  'Atrasado'
];

export default function ProjetoEscrita() {
  const [projetos, setProjetos] = useState<ProjetoEscrita[]>([
    {
      id: 1,
      turmas_id: 1,
      professores_id: 1,
      titulo: "Essay sobre 'Environmental Issues'",
      status: "Avaliado",
      descricao: "Redação argumentativa sobre problemas ambientais contemporâneos, com foco em soluções sustentáveis.",
      arquivo_url: "essay_environment.docx",
      data_entrega: "2024-01-28",
      nota: 8.5,
      turma_nome: "Intermediário A",
      professor_nome: "Maria Silva"
    },
    {
      id: 2,
      turmas_id: 2,
      professores_id: 2,
      titulo: "Creative Writing - Short Story",
      status: "Em Andamento",
      descricao: "Criação de um conto original em inglês, explorando técnicas narrativas e desenvolvimento de personagens.",
      arquivo_url: "",
      data_entrega: "2024-02-15",
      nota: 0,
      turma_nome: "Avançado B",
      professor_nome: "João Santos"
    },
    {
      id: 3,
      turmas_id: 3,
      professores_id: 1,
      titulo: "Carta Formal - Job Application",
      status: "Entregue",
      descricao: "Redação de carta formal para candidatura a emprego, seguindo estrutura e linguagem apropriadas.",
      arquivo_url: "job_application_letter.pdf",
      data_entrega: "2024-02-01",
      nota: 9.0,
      turma_nome: "Básico C",
      professor_nome: "Maria Silva"
    }
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState<ProjetoEscrita | null>(null);

  const [novoProjeto, setNovoProjeto] = useState<Omit<ProjetoEscrita, 'id'>>({
    turmas_id: 0,
    professores_id: 0,
    titulo: '',
    status: 'Pendente',
    descricao: '',
    arquivo_url: '',
    data_entrega: '',
    nota: 0,
    turma_nome: '',
    professor_nome: ''
  });

  // Dados mockados para turmas e professores
  const turmas = [
    { id: 1, nome: "Intermediário A" },
    { id: 2, nome: "Avançado B" },
    { id: 3, nome: "Básico C" },
    { id: 4, nome: "Conversação D" }
  ];

  const professores = [
    { id: 1, nome: "Maria Silva" },
    { id: 2, nome: "João Santos" },
    { id: 3, nome: "Ana Costa" },
    { id: 4, nome: "Pedro Lima" }
  ];

  const abrirDialog = (projeto?: ProjetoEscrita) => {
    if (projeto) {
      setProjetoEditando(projeto);
      setNovoProjeto(projeto);
    } else {
      setProjetoEditando(null);
      setNovoProjeto({
        turmas_id: 0,
        professores_id: 0,
        titulo: '',
        status: 'Pendente',
        descricao: '',
        arquivo_url: '',
        data_entrega: '',
        nota: 0,
        turma_nome: '',
        professor_nome: ''
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setProjetoEditando(null);
  };

  const salvarProjeto = () => {
    const turmaSelecionada = turmas.find(t => t.id === novoProjeto.turmas_id);
    const professorSelecionado = professores.find(p => p.id === novoProjeto.professores_id);
    
    const projetoCompleto = {
      ...novoProjeto,
      turma_nome: turmaSelecionada?.nome || '',
      professor_nome: professorSelecionado?.nome || ''
    };

    if (projetoEditando) {
      setProjetos(prev => 
        prev.map(p => p.id === projetoEditando.id ? { ...projetoCompleto, id: projetoEditando.id } : p)
      );
    } else {
      const novoId = Math.max(...projetos.map(p => p.id), 0) + 1;
      setProjetos(prev => [...prev, { ...projetoCompleto, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirProjeto = (id: number) => {
    setProjetos(prev => prev.filter(p => p.id !== id));
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'Avaliado': return 'success';
      case 'Entregue': return 'info';
      case 'Em Andamento': return 'warning';
      case 'Atrasado': return 'error';
      default: return 'default';
    }
  };

  const totalProjetos = projetos.length;
  const projetosAvaliados = projetos.filter(p => p.status === 'Avaliado').length;
  const projetosAndamento = projetos.filter(p => p.status === 'Em Andamento').length;
  const mediaNotas = projetos.filter(p => p.nota > 0).reduce((acc, p) => acc + p.nota, 0) / projetos.filter(p => p.nota > 0).length || 0;

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="Projetos de Escrita" 
        subtitulo="Gerencie os projetos de escrita das turmas"
      />

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalProjetos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Projetos
                  </Typography>
                </Box>
                <CreateIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {projetosAvaliados}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avaliados
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {projetosAndamento}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Em Andamento
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {mediaNotas.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Média das Notas
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
          Novo Projeto de Escrita
        </Button>
      </Box>

      {/* Tabela de Projetos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Título</strong></TableCell>
              <TableCell><strong>Turma</strong></TableCell>
              <TableCell><strong>Professor</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Data Entrega</strong></TableCell>
              <TableCell><strong>Nota</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projetos.map((projeto) => (
              <TableRow key={projeto.id} hover>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {projeto.titulo}
                  </Typography>
                </TableCell>
                <TableCell>{projeto.turma_nome}</TableCell>
                <TableCell>{projeto.professor_nome}</TableCell>
                <TableCell>
                  <Chip 
                    label={projeto.status} 
                    size="small" 
                    color={obterCorStatus(projeto.status)}
                  />
                </TableCell>
                <TableCell>{formatarData(projeto.data_entrega)}</TableCell>
                <TableCell>
                  {projeto.nota > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {projeto.nota.toFixed(1)}
                      </Typography>
                      <Rating 
                        value={projeto.nota / 2} 
                        readOnly 
                        size="small" 
                        max={5}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Não avaliado
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ maxWidth: 250 }}>
                  <Typography variant="body2" noWrap>
                    {projeto.descricao}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => abrirDialog(projeto)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirProjeto(projeto.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {projetos.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <CreateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum projeto de escrita encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece adicionando um novo projeto de escrita
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Adicionar Projeto
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

      {/* Dialog para adicionar/editar projeto */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {projetoEditando ? 'Editar Projeto de Escrita' : 'Novo Projeto de Escrita'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={novoProjeto.titulo}
                onChange={(e) => setNovoProjeto(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ex: Essay sobre 'Technology and Society'"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Turma</InputLabel>
                <Select
                  value={novoProjeto.turmas_id}
                  label="Turma"
                  onChange={(e) => setNovoProjeto(prev => ({ ...prev, turmas_id: Number(e.target.value) }))}
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
              <FormControl fullWidth>
                <InputLabel>Professor</InputLabel>
                <Select
                  value={novoProjeto.professores_id}
                  label="Professor"
                  onChange={(e) => setNovoProjeto(prev => ({ ...prev, professores_id: Number(e.target.value) }))}
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={novoProjeto.status}
                  label="Status"
                  onChange={(e) => setNovoProjeto(prev => ({ ...prev, status: e.target.value }))}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Entrega"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={novoProjeto.data_entrega}
                onChange={(e) => setNovoProjeto(prev => ({ ...prev, data_entrega: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={4}
                value={novoProjeto.descricao}
                onChange={(e) => setNovoProjeto(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva os objetivos, tipo de texto e critérios de avaliação..."
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="URL do Arquivo"
                value={novoProjeto.arquivo_url}
                onChange={(e) => setNovoProjeto(prev => ({ ...prev, arquivo_url: e.target.value }))}
                InputProps={{
                  startAdornment: <CloudUploadIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                placeholder="Link para o arquivo do projeto..."
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nota"
                type="number"
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                value={novoProjeto.nota}
                onChange={(e) => setNovoProjeto(prev => ({ ...prev, nota: Number(e.target.value) }))}
                placeholder="0.0 - 10.0"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarProjeto} variant="contained">
            {projetoEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}