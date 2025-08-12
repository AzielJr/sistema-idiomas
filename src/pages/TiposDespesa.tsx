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
  Paper,
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
  Clear as ClearIcon,
  Category as CategoryIcon
} from "@mui/icons-material";
import { useState } from "react";

interface TipoDespesa {
  id: number;
  descricao: string;
  ativo: boolean;
  data_criacao: string;
  total_despesas?: number;
}

export default function TiposDespesa() {
  const [tiposDespesa, setTiposDespesa] = useState<TipoDespesa[]>([
    {
      id: 1,
      descricao: "Aluguel",
      ativo: true,
      data_criacao: "2024-01-01",
      total_despesas: 12
    },
    {
      id: 2,
      descricao: "Energia Elétrica",
      ativo: true,
      data_criacao: "2024-01-01",
      total_despesas: 8
    },
    {
      id: 3,
      descricao: "Material de Escritório",
      ativo: true,
      data_criacao: "2024-01-01",
      total_despesas: 15
    },
    {
      id: 4,
      descricao: "Salários",
      ativo: true,
      data_criacao: "2024-01-01",
      total_despesas: 24
    },
    {
      id: 5,
      descricao: "Internet",
      ativo: true,
      data_criacao: "2024-01-01",
      total_despesas: 6
    },
    {
      id: 6,
      descricao: "Telefone",
      ativo: true,
      data_criacao: "2024-01-02",
      total_despesas: 4
    },
    {
      id: 7,
      descricao: "Água",
      ativo: true,
      data_criacao: "2024-01-02",
      total_despesas: 3
    },
    {
      id: 8,
      descricao: "Limpeza",
      ativo: true,
      data_criacao: "2024-01-03",
      total_despesas: 7
    },
    {
      id: 9,
      descricao: "Manutenção",
      ativo: true,
      data_criacao: "2024-01-03",
      total_despesas: 9
    },
    {
      id: 10,
      descricao: "Marketing",
      ativo: false,
      data_criacao: "2024-01-04",
      total_despesas: 2
    }
  ]);

  const [filtros, setFiltros] = useState({
    busca: "",
    ativo: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<TipoDespesa | null>(null);
  const [novoTipo, setNovoTipo] = useState<Partial<TipoDespesa>>({
    descricao: "",
    ativo: true
  });

  const tiposFiltrados = tiposDespesa.filter(tipo => {
    const matchBusca = tipo.descricao.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      tipo.id.toString().includes(filtros.busca);
    const matchAtivo = filtros.ativo === "" || 
                      (filtros.ativo === "true" && tipo.ativo) ||
                      (filtros.ativo === "false" && !tipo.ativo);
    
    return matchBusca && matchAtivo;
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
      ativo: ""
    });
    setPage(0);
  };

  const abrirDialog = (tipo?: TipoDespesa) => {
    if (tipo) {
      setTipoEditando(tipo);
      setNovoTipo(tipo);
    } else {
      setTipoEditando(null);
      setNovoTipo({
        descricao: "",
        ativo: true
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setTipoEditando(null);
  };

  const salvarTipo = () => {
    if (tipoEditando) {
      setTiposDespesa(prev => prev.map(t => 
        t.id === tipoEditando.id ? { 
          ...novoTipo,
          id: tipoEditando.id,
          data_criacao: tipoEditando.data_criacao,
          total_despesas: tipoEditando.total_despesas
        } as TipoDespesa : t
      ));
    } else {
      const novoId = Math.max(...tiposDespesa.map(t => t.id)) + 1;
      setTiposDespesa(prev => [...prev, {
        ...novoTipo,
        id: novoId,
        data_criacao: new Date().toISOString().split('T')[0],
        total_despesas: 0
      } as TipoDespesa]);
    }
    fecharDialog();
  };

  const excluirTipo = (id: number) => {
    const tipo = tiposDespesa.find(t => t.id === id);
    if (tipo && tipo.total_despesas && tipo.total_despesas > 0) {
      alert('Não é possível excluir um tipo de despesa que possui despesas vinculadas.');
      return;
    }
    setTiposDespesa(prev => prev.filter(t => t.id !== id));
  };

  const alterarStatus = (id: number) => {
    setTiposDespesa(prev => prev.map(t => 
      t.id === id ? { ...t, ativo: !t.ativo } : t
    ));
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const tiposAtivos = tiposDespesa.filter(t => t.ativo).length;
  const tiposInativos = tiposDespesa.filter(t => !t.ativo).length;
  const totalDespesasVinculadas = tiposDespesa.reduce((total, t) => total + (t.total_despesas || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Tipos de Despesa
      </Typography>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CategoryIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {tiposDespesa.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Tipos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {tiposAtivos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipos Ativos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {tiposInativos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipos Inativos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {totalDespesasVinculadas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Despesas Vinculadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={filtros.ativo}
                onChange={(e) => setFiltros(prev => ({ ...prev, ativo: e.target.value }))}
                SelectProps={{
                  native: true,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: '56px',
                    fontSize: '16px'
                  }
                }}
              >
                <option value="">Todos</option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
              {tiposFiltrados.length} registro(s)
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
                <TableCell>Descrição</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data Criação</TableCell>
                <TableCell>Despesas Vinculadas</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tiposFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell>{tipo.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon color="primary" fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">
                          {tipo.descricao}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={tipo.ativo ? 'Ativo' : 'Inativo'} 
                        color={tipo.ativo ? 'success' : 'error'}
                        size="small"
                        onClick={() => alterarStatus(tipo.id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>{formatarData(tipo.data_criacao)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={tipo.total_despesas || 0} 
                        color={tipo.total_despesas && tipo.total_despesas > 0 ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => abrirDialog(tipo)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => excluirTipo(tipo.id)}
                          color="error"
                          disabled={tipo.total_despesas && tipo.total_despesas > 0}
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
          count={tiposFiltrados.length}
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
          {tipoEditando ? 'Editar Tipo de Despesa' : 'Novo Tipo de Despesa'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={novoTipo.descricao || ''}
                onChange={(e) => setNovoTipo(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Ex: Aluguel, Energia Elétrica, Material de Escritório..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={novoTipo.ativo ? 'true' : 'false'}
                onChange={(e) => setNovoTipo(prev => ({ ...prev, ativo: e.target.value === 'true' }))}
                SelectProps={{
                  native: true,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: '56px',
                    fontSize: '16px'
                  }
                }}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </TextField>
            </Grid>
            {tipoEditando && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data de Criação"
                    value={formatarData(tipoEditando.data_criacao)}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Despesas Vinculadas"
                    value={tipoEditando.total_despesas || 0}
                    disabled
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button 
            onClick={salvarTipo} 
            variant="contained"
            disabled={!novoTipo.descricao?.trim()}
          >
            {tipoEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}