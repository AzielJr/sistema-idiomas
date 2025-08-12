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
  Clear as ClearIcon,
  Inventory as InventoryIcon
} from "@mui/icons-material";
import { useState } from "react";

interface EstoqueMaterial {
  id: number;
  material: string;
  quantidade: number;
  unidade: string;
  localizacao: string;
  observacao: string;
  status_pedido: 'Em aberto' | 'Atendido' | 'Parcial';
}

export default function EstoqueMaterial() {
  const [materiais, setMateriais] = useState<EstoqueMaterial[]>([
    {
      id: 1,
      material: "Papel A4",
      quantidade: 500,
      unidade: "Folhas",
      localizacao: "Almoxarifado - Prateleira A1",
      observacao: "Material para impressões gerais",
      status_pedido: "Atendido"
    },
    {
      id: 2,
      material: "Caneta Azul",
      quantidade: 25,
      unidade: "Unidades",
      localizacao: "Secretaria - Gaveta 2",
      observacao: "Canetas para uso administrativo",
      status_pedido: "Parcial"
    },
    {
      id: 3,
      material: "Toner Impressora HP",
      quantidade: 3,
      unidade: "Cartuchos",
      localizacao: "Almoxarifado - Prateleira B2",
      observacao: "Toner para impressora da secretaria",
      status_pedido: "Em aberto"
    },
    {
      id: 4,
      material: "Grampeador",
      quantidade: 2,
      unidade: "Unidades",
      localizacao: "Secretaria - Mesa Principal",
      observacao: "Grampeadores para uso geral",
      status_pedido: "Atendido"
    }
  ]);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    localizacao: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [materialEditando, setMaterialEditando] = useState<EstoqueMaterial | null>(null);
  const [novoMaterial, setNovoMaterial] = useState<Partial<EstoqueMaterial>>({
    material: "",
    quantidade: 0,
    unidade: "",
    localizacao: "",
    observacao: "",
    status_pedido: "Em aberto"
  });

  const unidades = [
    "Unidades",
    "Folhas",
    "Cartuchos",
    "Caixas",
    "Pacotes",
    "Metros",
    "Litros",
    "Quilos"
  ];

  const localizacoes = [
    "Almoxarifado - Prateleira A1",
    "Almoxarifado - Prateleira A2",
    "Almoxarifado - Prateleira B1",
    "Almoxarifado - Prateleira B2",
    "Secretaria - Gaveta 1",
    "Secretaria - Gaveta 2",
    "Secretaria - Mesa Principal",
    "Coordenação - Armário",
    "Sala dos Professores"
  ];

  const materiaisFiltrados = materiais.filter(material => {
    const matchBusca = material.material.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      material.observacao.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchStatus = !filtros.status || material.status_pedido === filtros.status;
    const matchLocalizacao = !filtros.localizacao || material.localizacao.includes(filtros.localizacao);
    
    return matchBusca && matchStatus && matchLocalizacao;
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
      localizacao: ""
    });
    setPage(0);
  };

  const abrirDialog = (material?: EstoqueMaterial) => {
    if (material) {
      setMaterialEditando(material);
      setNovoMaterial(material);
    } else {
      setMaterialEditando(null);
      setNovoMaterial({
        material: "",
        quantidade: 0,
        unidade: "",
        localizacao: "",
        observacao: "",
        status_pedido: "Em aberto"
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setMaterialEditando(null);
  };

  const salvarMaterial = () => {
    if (materialEditando) {
      setMateriais(prev => prev.map(m => 
        m.id === materialEditando.id ? { ...novoMaterial as EstoqueMaterial } : m
      ));
    } else {
      const novoId = Math.max(...materiais.map(m => m.id)) + 1;
      setMateriais(prev => [...prev, {
        ...novoMaterial,
        id: novoId
      } as EstoqueMaterial]);
    }
    fecharDialog();
  };

  const excluirMaterial = (id: number) => {
    setMateriais(prev => prev.filter(m => m.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Atendido': return 'success';
      case 'Parcial': return 'warning';
      case 'Em aberto': return 'error';
      default: return 'default';
    }
  };

  const getQuantidadeColor = (quantidade: number) => {
    if (quantidade === 0) return 'error';
    if (quantidade <= 5) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Estoque Material ADM
      </Typography>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {materiais.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Itens
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {materiais.filter(m => m.status_pedido === 'Atendido').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atendidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {materiais.filter(m => m.status_pedido === 'Parcial').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Parciais
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {materiais.filter(m => m.status_pedido === 'Em aberto').length}
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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar Material"
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filtros.status}
                  label="Status"
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Em aberto">Em aberto</MenuItem>
                  <MenuItem value="Atendido">Atendido</MenuItem>
                  <MenuItem value="Parcial">Parcial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Localização</InputLabel>
                <Select
                  value={filtros.localizacao}
                  label="Localização"
                  onChange={(e) => setFiltros(prev => ({ ...prev, localizacao: e.target.value }))}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="Almoxarifado">Almoxarifado</MenuItem>
                  <MenuItem value="Secretaria">Secretaria</MenuItem>
                  <MenuItem value="Coordenação">Coordenação</MenuItem>
                  <MenuItem value="Sala dos Professores">Sala dos Professores</MenuItem>
                </Select>
              </FormControl>
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
            <Grid item xs={12} sm={6} md={1}>
              <Typography variant="body2" color="text.secondary">
                {materiaisFiltrados.length} item(s)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Unidade</TableCell>
                <TableCell>Localização</TableCell>
                <TableCell>Observação</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materiaisFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.id}</TableCell>
                    <TableCell>{material.material}</TableCell>
                    <TableCell>
                      <Chip 
                        label={material.quantidade} 
                        color={getQuantidadeColor(material.quantidade) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{material.unidade}</TableCell>
                    <TableCell>{material.localizacao}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {material.observacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={material.status_pedido} 
                        color={getStatusColor(material.status_pedido) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => abrirDialog(material)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => excluirMaterial(material.id)}
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
          count={materiaisFiltrados.length}
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
          {materialEditando ? 'Editar Material' : 'Novo Material'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Material"
                value={novoMaterial.material || ''}
                onChange={(e) => setNovoMaterial(prev => ({ ...prev, material: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={novoMaterial.quantidade || ''}
                onChange={(e) => setNovoMaterial(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Unidade</InputLabel>
                <Select
                  value={novoMaterial.unidade || ''}
                  label="Unidade"
                  onChange={(e) => setNovoMaterial(prev => ({ ...prev, unidade: e.target.value }))}
                >
                  {unidades.map(unidade => (
                    <MenuItem key={unidade} value={unidade}>
                      {unidade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Localização</InputLabel>
                <Select
                  value={novoMaterial.localizacao || ''}
                  label="Localização"
                  onChange={(e) => setNovoMaterial(prev => ({ ...prev, localizacao: e.target.value }))}
                >
                  {localizacoes.map(localizacao => (
                    <MenuItem key={localizacao} value={localizacao}>
                      {localizacao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={novoMaterial.status_pedido || ''}
                  label="Status"
                  onChange={(e) => setNovoMaterial(prev => ({ ...prev, status_pedido: e.target.value as any }))}
                >
                  <MenuItem value="Em aberto">Em aberto</MenuItem>
                  <MenuItem value="Atendido">Atendido</MenuItem>
                  <MenuItem value="Parcial">Parcial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observação"
                multiline
                rows={3}
                value={novoMaterial.observacao || ''}
                onChange={(e) => setNovoMaterial(prev => ({ ...prev, observacao: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarMaterial} variant="contained">
            {materialEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}