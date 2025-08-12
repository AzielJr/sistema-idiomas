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
  Chip,
  Avatar
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import { useState } from "react";

interface Mensalidade {
  id: number;
  id_aluno: number;
  nome_aluno: string;
  data_emissao: string;
  data_vencimento: string;
  valor_mensalidade: number;
  juros_atraso: number;
  status: 'Pago' | 'Em aberto' | 'Vencido' | 'Negociado';
  id_usuario: number;
  nome_usuario: string;
}

interface Aluno {
  id: number;
  nome: string;
  nivel: string;
}

interface Usuario {
  id: number;
  nome: string;
  tipo: string;
}

export default function Mensalidades() {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([
    {
      id: 1,
      id_aluno: 1,
      nome_aluno: "João Silva",
      data_emissao: "2024-01-01",
      data_vencimento: "2024-01-10",
      valor_mensalidade: 350.00,
      juros_atraso: 2.5,
      status: "Pago",
      id_usuario: 1,
      nome_usuario: "Maria Santos"
    },
    {
      id: 2,
      id_aluno: 2,
      nome_aluno: "Ana Costa",
      data_emissao: "2024-01-01",
      data_vencimento: "2024-01-15",
      valor_mensalidade: 280.00,
      juros_atraso: 2.0,
      status: "Vencido",
      id_usuario: 1,
      nome_usuario: "Maria Santos"
    },
    {
      id: 3,
      id_aluno: 3,
      nome_aluno: "Carlos Oliveira",
      data_emissao: "2024-01-01",
      data_vencimento: "2024-01-20",
      valor_mensalidade: 420.00,
      juros_atraso: 3.0,
      status: "Em aberto",
      id_usuario: 2,
      nome_usuario: "Pedro Lima"
    },
    {
      id: 4,
      id_aluno: 4,
      nome_aluno: "Lucia Ferreira",
      data_emissao: "2024-01-01",
      data_vencimento: "2024-01-25",
      valor_mensalidade: 380.00,
      juros_atraso: 2.5,
      status: "Negociado",
      id_usuario: 1,
      nome_usuario: "Maria Santos"
    }
  ]);

  const [alunos] = useState<Aluno[]>([
    { id: 1, nome: "João Silva", nivel: "Intermediário" },
    { id: 2, nome: "Ana Costa", nivel: "Básico" },
    { id: 3, nome: "Carlos Oliveira", nivel: "Avançado" },
    { id: 4, nome: "Lucia Ferreira", nivel: "Intermediário" },
    { id: 5, nome: "Roberto Santos", nivel: "Básico" }
  ]);

  const [usuarios] = useState<Usuario[]>([
    { id: 1, nome: "Maria Santos", tipo: "Secretário" },
    { id: 2, nome: "Pedro Lima", tipo: "Coordenador" },
    { id: 3, nome: "João Administrador", tipo: "Administrador" }
  ]);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    aluno: "",
    dataInicio: "",
    dataFim: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [mensalidadeEditando, setMensalidadeEditando] = useState<Mensalidade | null>(null);
  const [novaMensalidade, setNovaMensalidade] = useState<Partial<Mensalidade>>({
    id_aluno: 0,
    data_emissao: new Date().toISOString().split('T')[0],
    data_vencimento: new Date().toISOString().split('T')[0],
    valor_mensalidade: 0,
    juros_atraso: 2.0,
    status: "Em aberto",
    id_usuario: 0
  });

  const mensalidadesFiltradas = mensalidades.filter(mensalidade => {
    const matchBusca = mensalidade.nome_aluno.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      mensalidade.id.toString().includes(filtros.busca);
    const matchStatus = !filtros.status || mensalidade.status === filtros.status;
    const matchAluno = !filtros.aluno || mensalidade.id_aluno.toString() === filtros.aluno;
    
    let matchData = true;
    if (filtros.dataInicio && filtros.dataFim) {
      const dataVencimento = new Date(mensalidade.data_vencimento);
      const dataInicio = new Date(filtros.dataInicio);
      const dataFim = new Date(filtros.dataFim);
      matchData = dataVencimento >= dataInicio && dataVencimento <= dataFim;
    }
    
    return matchBusca && matchStatus && matchAluno && matchData;
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
      aluno: "",
      dataInicio: "",
      dataFim: ""
    });
    setPage(0);
  };

  const abrirDialog = (mensalidade?: Mensalidade) => {
    if (mensalidade) {
      setMensalidadeEditando(mensalidade);
      setNovaMensalidade(mensalidade);
    } else {
      setMensalidadeEditando(null);
      setNovaMensalidade({
        id_aluno: 0,
        data_emissao: new Date().toISOString().split('T')[0],
        data_vencimento: new Date().toISOString().split('T')[0],
        valor_mensalidade: 0,
        juros_atraso: 2.0,
        status: "Em aberto",
        id_usuario: 0
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setMensalidadeEditando(null);
  };

  const salvarMensalidade = () => {
    const alunoSelecionado = alunos.find(a => a.id === novaMensalidade.id_aluno);
    const usuarioSelecionado = usuarios.find(u => u.id === novaMensalidade.id_usuario);

    if (mensalidadeEditando) {
      setMensalidades(prev => prev.map(m => 
        m.id === mensalidadeEditando.id ? { 
          ...novaMensalidade,
          nome_aluno: alunoSelecionado?.nome || '',
          nome_usuario: usuarioSelecionado?.nome || ''
        } as Mensalidade : m
      ));
    } else {
      const novoId = Math.max(...mensalidades.map(m => m.id)) + 1;
      setMensalidades(prev => [...prev, {
        ...novaMensalidade,
        id: novoId,
        nome_aluno: alunoSelecionado?.nome || '',
        nome_usuario: usuarioSelecionado?.nome || ''
      } as Mensalidade]);
    }
    fecharDialog();
  };

  const excluirMensalidade = (id: number) => {
    setMensalidades(prev => prev.filter(m => m.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'success';
      case 'Em aberto': return 'info';
      case 'Vencido': return 'error';
      case 'Negociado': return 'warning';
      default: return 'default';
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularValorTotal = () => {
    return mensalidades.reduce((total, m) => total + m.valor_mensalidade, 0);
  };

  const calcularValorPago = () => {
    return mensalidades
      .filter(m => m.status === 'Pago')
      .reduce((total, m) => total + m.valor_mensalidade, 0);
  };

  const calcularValorVencido = () => {
    return mensalidades
      .filter(m => m.status === 'Vencido')
      .reduce((total, m) => total + m.valor_mensalidade, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Mensalidades
      </Typography>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h6" color="primary">
                {formatarMoeda(calcularValorTotal())}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Geral
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {formatarMoeda(calcularValorPago())}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recebido ({mensalidades.filter(m => m.status === 'Pago').length})
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                {formatarMoeda(calcularValorVencido())}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vencido ({mensalidades.filter(m => m.status === 'Vencido').length})
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {mensalidades.filter(m => m.status === 'Em aberto').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Em Aberto
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtros.status}
                  label="Status"
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Pago">Pago</MenuItem>
                  <MenuItem value="Em aberto">Em aberto</MenuItem>
                  <MenuItem value="Vencido">Vencido</MenuItem>
                  <MenuItem value="Negociado">Negociado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Aluno</InputLabel>
                <Select
                  value={filtros.aluno}
                  label="Aluno"
                  onChange={(e) => setFiltros(prev => ({ ...prev, aluno: e.target.value }))}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {alunos.map(aluno => (
                    <MenuItem key={aluno.id} value={aluno.id.toString()}>
                      {aluno.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Data Início"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Data Fim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {mensalidadesFiltradas.length} mensalidade(s) encontrada(s)
          </Typography>
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
                <TableCell>Data Emissão</TableCell>
                <TableCell>Data Vencimento</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Juros (%)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mensalidadesFiltradas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((mensalidade) => (
                  <TableRow key={mensalidade.id}>
                    <TableCell>{mensalidade.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <PersonIcon />
                        </Avatar>
                        {mensalidade.nome_aluno}
                      </Box>
                    </TableCell>
                    <TableCell>{formatarData(mensalidade.data_emissao)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formatarData(mensalidade.data_vencimento)}
                        {mensalidade.status === 'Vencido' && (
                          <WarningIcon color="error" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatarMoeda(mensalidade.valor_mensalidade)}
                      </Typography>
                    </TableCell>
                    <TableCell>{mensalidade.juros_atraso}%</TableCell>
                    <TableCell>
                      <Chip 
                        label={mensalidade.status} 
                        color={getStatusColor(mensalidade.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{mensalidade.nome_usuario}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => abrirDialog(mensalidade)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => excluirMensalidade(mensalidade.id)}
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
          count={mensalidadesFiltradas.length}
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
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {mensalidadeEditando ? 'Editar Mensalidade' : 'Nova Mensalidade'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Aluno</InputLabel>
                <Select
                  value={novaMensalidade.id_aluno || ''}
                  label="Aluno"
                  onChange={(e) => setNovaMensalidade(prev => ({ ...prev, id_aluno: Number(e.target.value) }))}
                >
                  {alunos.map(aluno => (
                    <MenuItem key={aluno.id} value={aluno.id}>
                      {aluno.nome} - {aluno.nivel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Responsável</InputLabel>
                <Select
                  value={novaMensalidade.id_usuario || ''}
                  label="Responsável"
                  onChange={(e) => setNovaMensalidade(prev => ({ ...prev, id_usuario: Number(e.target.value) }))}
                >
                  {usuarios.map(usuario => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome} - {usuario.tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data Emissão"
                type="date"
                value={novaMensalidade.data_emissao || ''}
                onChange={(e) => setNovaMensalidade(prev => ({ ...prev, data_emissao: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data Vencimento"
                type="date"
                value={novaMensalidade.data_vencimento || ''}
                onChange={(e) => setNovaMensalidade(prev => ({ ...prev, data_vencimento: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={novaMensalidade.status || ''}
                  label="Status"
                  onChange={(e) => setNovaMensalidade(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <MenuItem value="Pago">Pago</MenuItem>
                  <MenuItem value="Em aberto">Em aberto</MenuItem>
                  <MenuItem value="Vencido">Vencido</MenuItem>
                  <MenuItem value="Negociado">Negociado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor da Mensalidade"
                type="number"
                value={novaMensalidade.valor_mensalidade || ''}
                onChange={(e) => setNovaMensalidade(prev => ({ ...prev, valor_mensalidade: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Juros de Atraso (%)"
                type="number"
                value={novaMensalidade.juros_atraso || ''}
                onChange={(e) => setNovaMensalidade(prev => ({ ...prev, juros_atraso: Number(e.target.value) }))}
                inputProps={{ step: 0.1, min: 0, max: 100 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarMensalidade} variant="contained">
            {mensalidadeEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}