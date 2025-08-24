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
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Category as CategoryIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Despesa {
  id: number;
  id_grupo_despesa: number;
  nome_grupo_despesa: string;
  data_despesa: string;
  data_vencimento: string;
  descricao: string;
  valor: number;
  status: 'Pago' | 'Em aberto' | 'Vencido' | 'Negociado';
  id_usuario: number;
  nome_usuario: string;
}

interface GrupoDespesa {
  id: number;
  descricao: string;
}

interface Usuario {
  id: number;
  nome: string;
  tipo: string;
}

export default function Despesas() {
  const { t } = useTranslation();
  const [despesas, setDespesas] = useState<Despesa[]>([
    {
      id: 1,
      id_grupo_despesa: 1,
      nome_grupo_despesa: "Aluguel",
      data_despesa: "2024-01-01",
      data_vencimento: "2024-01-10",
      descricao: "Aluguel do prédio - Janeiro 2024",
      valor: 3500.00,
      status: "Pago",
      id_usuario: 1,
      nome_usuario: "Maria Santos"
    },
    {
      id: 2,
      id_grupo_despesa: 2,
      nome_grupo_despesa: "Energia Elétrica",
      data_despesa: "2024-01-05",
      data_vencimento: "2024-01-15",
      descricao: "Conta de energia elétrica - Dezembro 2023",
      valor: 850.00,
      status: "Vencido",
      id_usuario: 1,
      nome_usuario: "Maria Santos"
    },
    {
      id: 3,
      id_grupo_despesa: 3,
      nome_grupo_despesa: "Material de Escritório",
      data_despesa: "2024-01-08",
      data_vencimento: "2024-01-20",
      descricao: "Compra de papel, canetas e material administrativo",
      valor: 320.00,
      status: "Em aberto",
      id_usuario: 2,
      nome_usuario: "Pedro Lima"
    },
    {
      id: 4,
      id_grupo_despesa: 4,
      nome_grupo_despesa: "Salários",
      data_despesa: "2024-01-01",
      data_vencimento: "2024-01-05",
      descricao: "Folha de pagamento - Janeiro 2024",
      valor: 15000.00,
      status: "Pago",
      id_usuario: 3,
      nome_usuario: "João Administrador"
    },
    {
      id: 5,
      id_grupo_despesa: 5,
      nome_grupo_despesa: "Internet",
      data_despesa: "2024-01-10",
      data_vencimento: "2024-01-25",
      descricao: "Plano de internet empresarial",
      valor: 180.00,
      status: "Negociado",
      id_usuario: 1,
      nome_usuario: "Maria Santos"
    }
  ]);

  const [gruposDespesa] = useState<GrupoDespesa[]>([
    { id: 1, descricao: "Aluguel" },
    { id: 2, descricao: "Energia Elétrica" },
    { id: 3, descricao: "Material de Escritório" },
    { id: 4, descricao: "Salários" },
    { id: 5, descricao: "Internet" },
    { id: 6, descricao: "Telefone" },
    { id: 7, descricao: "Água" },
    { id: 8, descricao: "Limpeza" },
    { id: 9, descricao: "Manutenção" },
    { id: 10, descricao: "Marketing" }
  ]);

  const [usuarios] = useState<Usuario[]>([
    { id: 1, nome: "Maria Santos", tipo: "Secretário" },
    { id: 2, nome: "Pedro Lima", tipo: "Coordenador" },
    { id: 3, nome: "João Administrador", tipo: "Administrador" }
  ]);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    grupo: "",
    dataInicio: "",
    dataFim: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [despesaEditando, setDespesaEditando] = useState<Despesa | null>(null);
  const [novaDespesa, setNovaDespesa] = useState<Partial<Despesa>>({
    id_grupo_despesa: 0,
    data_despesa: new Date().toISOString().split('T')[0],
    data_vencimento: new Date().toISOString().split('T')[0],
    descricao: "",
    valor: 0,
    status: "Em aberto",
    id_usuario: 0
  });

  const despesasFiltradas = despesas.filter(despesa => {
    const matchBusca = despesa.descricao.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      despesa.nome_grupo_despesa.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      despesa.id.toString().includes(filtros.busca);
    const matchStatus = !filtros.status || despesa.status === filtros.status;
    const matchGrupo = !filtros.grupo || despesa.id_grupo_despesa.toString() === filtros.grupo;
    
    let matchData = true;
    if (filtros.dataInicio && filtros.dataFim) {
      const dataVencimento = new Date(despesa.data_vencimento);
      const dataInicio = new Date(filtros.dataInicio);
      const dataFim = new Date(filtros.dataFim);
      matchData = dataVencimento >= dataInicio && dataVencimento <= dataFim;
    }
    
    return matchBusca && matchStatus && matchGrupo && matchData;
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
      grupo: "",
      dataInicio: "",
      dataFim: ""
    });
    setPage(0);
  };

  const abrirDialog = (despesa?: Despesa) => {
    if (despesa) {
      setDespesaEditando(despesa);
      setNovaDespesa(despesa);
    } else {
      setDespesaEditando(null);
      setNovaDespesa({
        id_grupo_despesa: 0,
        data_despesa: new Date().toISOString().split('T')[0],
        data_vencimento: new Date().toISOString().split('T')[0],
        descricao: "",
        valor: 0,
        status: "Em aberto",
        id_usuario: 0
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setDespesaEditando(null);
  };

  const salvarDespesa = () => {
    const grupoSelecionado = gruposDespesa.find(g => g.id === novaDespesa.id_grupo_despesa);
    const usuarioSelecionado = usuarios.find(u => u.id === novaDespesa.id_usuario);

    if (despesaEditando) {
      setDespesas(prev => prev.map(d => 
        d.id === despesaEditando.id ? { 
          ...novaDespesa,
          nome_grupo_despesa: grupoSelecionado?.descricao || '',
          nome_usuario: usuarioSelecionado?.nome || ''
        } as Despesa : d
      ));
    } else {
      const novoId = Math.max(...despesas.map(d => d.id)) + 1;
      setDespesas(prev => [...prev, {
        ...novaDespesa,
        id: novoId,
        nome_grupo_despesa: grupoSelecionado?.descricao || '',
        nome_usuario: usuarioSelecionado?.nome || ''
      } as Despesa]);
    }
    fecharDialog();
  };

  const excluirDespesa = (id: number) => {
    setDespesas(prev => prev.filter(d => d.id !== id));
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
    return despesas.reduce((total, d) => total + d.valor, 0);
  };

  const calcularValorPago = () => {
    return despesas
      .filter(d => d.status === 'Pago')
      .reduce((total, d) => total + d.valor, 0);
  };

  const calcularValorVencido = () => {
    return despesas
      .filter(d => d.status === 'Vencido')
      .reduce((total, d) => total + d.valor, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Despesas
      </Typography>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
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
                Pago ({despesas.filter(d => d.status === 'Pago').length})
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
                Vencido ({despesas.filter(d => d.status === 'Vencido').length})
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {despesas.filter(d => d.status === 'Em aberto').length}
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
                label={t('common.buscar')}
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
            <Grid item xs={12} sm={6} md={2}>
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
                  <MenuItem value="Pago">Pago</MenuItem>
                  <MenuItem value="Em aberto">Em aberto</MenuItem>
                  <MenuItem value="Vencido">Vencido</MenuItem>
                  <MenuItem value="Negociado">Negociado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Grupo</InputLabel>
                <Select
                  value={filtros.grupo}
                  label="Grupo"
                  onChange={(e) => setFiltros(prev => ({ ...prev, grupo: e.target.value }))}
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
                  {gruposDespesa.map(grupo => (
                    <MenuItem key={grupo.id} value={grupo.id.toString()}>
                      {grupo.descricao}
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
          
          {/* Botões de ação */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {despesasFiltradas.length} registro(s)
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
                <TableCell>Grupo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data Despesa</TableCell>
                <TableCell>Data Vencimento</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {despesasFiltradas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell>{despesa.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon color="primary" fontSize="small" />
                        {despesa.nome_grupo_despesa}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
                      <Typography variant="body2" noWrap>
                        {despesa.descricao}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatarData(despesa.data_despesa)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {formatarData(despesa.data_vencimento)}
                        {despesa.status === 'Vencido' && (
                          <WarningIcon color="error" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatarMoeda(despesa.valor)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={despesa.status} 
                        color={getStatusColor(despesa.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        {despesa.nome_usuario}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => abrirDialog(despesa)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => excluirDespesa(despesa.id)}
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
          count={despesasFiltradas.length}
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
          {despesaEditando ? 'Editar Despesa' : 'Nova Despesa'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Grupo de Despesa</InputLabel>
                <Select
                  value={novaDespesa.id_grupo_despesa || ''}
                  label="Grupo de Despesa"
                  onChange={(e) => setNovaDespesa(prev => ({ ...prev, id_grupo_despesa: Number(e.target.value) }))}
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '16px',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione um grupo</em>
                  </MenuItem>
                  {gruposDespesa.map(grupo => (
                    <MenuItem key={grupo.id} value={grupo.id}>
                      {grupo.descricao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Responsável</InputLabel>
                <Select
                  value={novaDespesa.id_usuario || ''}
                  label="Responsável"
                  onChange={(e) => setNovaDespesa(prev => ({ ...prev, id_usuario: Number(e.target.value) }))}
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '16px',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione um responsável</em>
                  </MenuItem>
                  {usuarios.map(usuario => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome} - {usuario.tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={2}
                value={novaDespesa.descricao || ''}
                onChange={(e) => setNovaDespesa(prev => ({ ...prev, descricao: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data da Despesa"
                type="date"
                value={novaDespesa.data_despesa || ''}
                onChange={(e) => setNovaDespesa(prev => ({ ...prev, data_despesa: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data Vencimento"
                type="date"
                value={novaDespesa.data_vencimento || ''}
                onChange={(e) => setNovaDespesa(prev => ({ ...prev, data_vencimento: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '16px' }}>Status</InputLabel>
                <Select
                  value={novaDespesa.status || ''}
                  label="Status"
                  onChange={(e) => setNovaDespesa(prev => ({ ...prev, status: e.target.value as any }))}
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
                  <MenuItem value="Pago">Pago</MenuItem>
                  <MenuItem value="Em aberto">Em aberto</MenuItem>
                  <MenuItem value="Vencido">Vencido</MenuItem>
                  <MenuItem value="Negociado">Negociado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                value={novaDespesa.valor || ''}
                onChange={(e) => setNovaDespesa(prev => ({ ...prev, valor: Number(e.target.value) }))}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarDespesa} variant="contained">
            {despesaEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}