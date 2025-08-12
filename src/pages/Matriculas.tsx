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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from "@mui/icons-material";
import { useState } from "react";

interface Matricula {
  id: number;
  id_aluno: number;
  nome_aluno: string;
  data_matricula: string;
  data_cancelamento?: string;
  status: 'Ativo' | 'Cancelado' | 'Trancado' | 'Transferido';
  id_usuario: number;
  nome_usuario: string;
  ip_cadastro: string;
}

export default function Matriculas() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([
    {
      id: 1,
      id_aluno: 1,
      nome_aluno: "João Silva",
      data_matricula: "2024-01-15",
      status: "Ativo",
      id_usuario: 1,
      nome_usuario: "Admin",
      ip_cadastro: "192.168.1.100"
    },
    {
      id: 2,
      id_aluno: 2,
      nome_aluno: "Maria Santos",
      data_matricula: "2024-02-10",
      data_cancelamento: "2024-11-01",
      status: "Cancelado",
      id_usuario: 2,
      nome_usuario: "Secretária",
      ip_cadastro: "192.168.1.101"
    },
    {
      id: 3,
      id_aluno: 3,
      nome_aluno: "Pedro Costa",
      data_matricula: "2024-03-05",
      status: "Trancado",
      id_usuario: 1,
      nome_usuario: "Admin",
      ip_cadastro: "192.168.1.102"
    }
  ]);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    dataInicial: "",
    dataFinal: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [matriculaEditando, setMatriculaEditando] = useState<Matricula | null>(null);
  const [novaMatricula, setNovaMatricula] = useState<Partial<Matricula>>({
    id_aluno: 0,
    data_matricula: new Date().toISOString().split('T')[0],
    status: "Ativo",
    id_usuario: 1,
    ip_cadastro: "192.168.1.100"
  });

  const alunos = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Costa" },
    { id: 4, nome: "Ana Oliveira" },
    { id: 5, nome: "Carlos Ferreira" }
  ];

  const usuarios = [
    { id: 1, nome: "Admin" },
    { id: 2, nome: "Secretária" },
    { id: 3, nome: "Coordenador" }
  ];

  const matriculasFiltradas = matriculas.filter(matricula => {
    const matchBusca = matricula.nome_aluno.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      matricula.nome_usuario.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchStatus = !filtros.status || matricula.status === filtros.status;
    const matchDataInicial = !filtros.dataInicial || matricula.data_matricula >= filtros.dataInicial;
    const matchDataFinal = !filtros.dataFinal || matricula.data_matricula <= filtros.dataFinal;
    
    return matchBusca && matchStatus && matchDataInicial && matchDataFinal;
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
      busca: "",
      status: "",
      dataInicial: "",
      dataFinal: ""
    });
    setPage(0);
  };

  const abrirDialog = (matricula?: Matricula) => {
    if (matricula) {
      setMatriculaEditando(matricula);
      setNovaMatricula(matricula);
    } else {
      setMatriculaEditando(null);
      setNovaMatricula({
        id_aluno: 0,
        data_matricula: new Date().toISOString().split('T')[0],
        status: "Ativo",
        id_usuario: 1,
        ip_cadastro: "192.168.1.100"
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setMatriculaEditando(null);
  };

  const salvarMatricula = () => {
    if (matriculaEditando) {
      setMatriculas(prev => prev.map(m => 
        m.id === matriculaEditando.id ? { ...novaMatricula as Matricula } : m
      ));
    } else {
      const novoId = Math.max(...matriculas.map(m => m.id)) + 1;
      const alunoSelecionado = alunos.find(a => a.id === novaMatricula.id_aluno);
      const usuarioSelecionado = usuarios.find(u => u.id === novaMatricula.id_usuario);
      
      setMatriculas(prev => [...prev, {
        ...novaMatricula,
        id: novoId,
        nome_aluno: alunoSelecionado?.nome || "",
        nome_usuario: usuarioSelecionado?.nome || ""
      } as Matricula]);
    }
    fecharDialog();
  };

  const excluirMatricula = (id: number) => {
    setMatriculas(prev => prev.filter(m => m.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'success';
      case 'Cancelado': return 'error';
      case 'Trancado': return 'warning';
      case 'Transferido': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Matrículas
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar"
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: '56px',
                    fontSize: '16px'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '16px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Status</InputLabel>
                <Select
                  value={filtros.status}
                  label="Status"
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '16px',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                  <MenuItem value="Trancado">Trancado</MenuItem>
                  <MenuItem value="Transferido">Transferido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Data Inicial"
                type="date"
                value={filtros.dataInicial}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicial: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Data Final"
                type="date"
                value={filtros.dataFinal}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataFinal: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={limparFiltros}
                startIcon={<ClearIcon />}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
          
          {/* Botões de ação */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {matriculasFiltradas.length} registro(s)
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => abrirDialog()}
              sx={{ ml: 2 }}
            >
              Cadastrar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Aluno</TableCell>
                <TableCell>Data Matrícula</TableCell>
                <TableCell>Data Cancelamento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>IP Cadastro</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matriculasFiltradas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((matricula) => (
                  <TableRow key={matricula.id}>
                    <TableCell>{matricula.id}</TableCell>
                    <TableCell>{matricula.nome_aluno}</TableCell>
                    <TableCell>{new Date(matricula.data_matricula).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      {matricula.data_cancelamento 
                        ? new Date(matricula.data_cancelamento).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={matricula.status} 
                        color={getStatusColor(matricula.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{matricula.nome_usuario}</TableCell>
                    <TableCell>{matricula.ip_cadastro}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => abrirDialog(matricula)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => excluirMatricula(matricula.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={matriculasFiltradas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* FAB para adicionar */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => abrirDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Dialog para adicionar/editar */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {matriculaEditando ? 'Editar Matrícula' : 'Nova Matrícula'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Aluno</InputLabel>
                <Select
                  value={novaMatricula.id_aluno || ''}
                  label="Aluno"
                  onChange={(e) => setNovaMatricula(prev => ({ 
                    ...prev, 
                    id_aluno: Number(e.target.value),
                    nome_aluno: alunos.find(a => a.id === Number(e.target.value))?.nome || ''
                  }))}
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '16px',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione um aluno</em>
                  </MenuItem>
                  {alunos.map(aluno => (
                    <MenuItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Matrícula"
                type="date"
                value={novaMatricula.data_matricula || ''}
                onChange={(e) => setNovaMatricula(prev => ({ ...prev, data_matricula: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Cancelamento"
                type="date"
                value={novaMatricula.data_cancelamento || ''}
                onChange={(e) => setNovaMatricula(prev => ({ ...prev, data_cancelamento: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Status</InputLabel>
                <Select
                  value={novaMatricula.status || ''}
                  label="Status"
                  onChange={(e) => setNovaMatricula(prev => ({ ...prev, status: e.target.value as any }))}
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '16px',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione o status</em>
                  </MenuItem>
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                  <MenuItem value="Trancado">Trancado</MenuItem>
                  <MenuItem value="Transferido">Transferido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Usuário</InputLabel>
                <Select
                  value={novaMatricula.id_usuario || ''}
                  label="Usuário"
                  onChange={(e) => setNovaMatricula(prev => ({ 
                    ...prev, 
                    id_usuario: Number(e.target.value),
                    nome_usuario: usuarios.find(u => u.id === Number(e.target.value))?.nome || ''
                  }))}
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '16px',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione um usuário</em>
                  </MenuItem>
                  {usuarios.map(usuario => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IP Cadastro"
                value={novaMatricula.ip_cadastro || ''}
                onChange={(e) => setNovaMatricula(prev => ({ ...prev, ip_cadastro: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarMatricula} variant="contained">
            {matriculaEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}