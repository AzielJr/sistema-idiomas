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
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface PedidoMaterial {
  id: number;
  id_usuario: number;
  nome_usuario: string;
  id_material: number;
  nome_material: string;
  data_pedido: string;
  quantidade: number;
  status: 'Pendente' | 'Atendido' | 'Negado';
  aprovador_id?: number;
  nome_aprovador?: string;
}

interface Usuario {
  id: number;
  nome: string;
  tipo: string;
}

interface Material {
  id: number;
  nome: string;
  estoque: number;
}

export default function PedidosMaterial() {
  const { t } = useTranslation();
  const [pedidos, setPedidos] = useState<PedidoMaterial[]>([
    {
      id: 1,
      id_usuario: 1,
      nome_usuario: "Maria Silva",
      id_material: 1,
      nome_material: "Papel A4",
      data_pedido: "2024-01-15",
      quantidade: 100,
      status: "Atendido",
      aprovador_id: 3,
      nome_aprovador: "João Santos"
    },
    {
      id: 2,
      id_usuario: 2,
      nome_usuario: "Carlos Oliveira",
      id_material: 2,
      nome_material: "Caneta Azul",
      data_pedido: "2024-01-16",
      quantidade: 10,
      status: "Pendente"
    },
    {
      id: 3,
      id_usuario: 4,
      nome_usuario: "Ana Costa",
      id_material: 3,
      nome_material: "Toner Impressora HP",
      data_pedido: "2024-01-14",
      quantidade: 1,
      status: "Negado",
      aprovador_id: 3,
      nome_aprovador: "João Santos"
    },
    {
      id: 4,
      id_usuario: 5,
      nome_usuario: "Pedro Lima",
      id_material: 4,
      nome_material: "Grampeador",
      data_pedido: "2024-01-17",
      quantidade: 1,
      status: "Pendente"
    }
  ]);

  const [usuarios] = useState<Usuario[]>([
    { id: 1, nome: "Maria Silva", tipo: "Professor" },
    { id: 2, nome: "Carlos Oliveira", tipo: "Coordenador" },
    { id: 3, nome: "João Santos", tipo: "Administrador" },
    { id: 4, nome: "Ana Costa", tipo: "Professor" },
    { id: 5, nome: "Pedro Lima", tipo: "Secretário" }
  ]);

  const [materiais] = useState<Material[]>([
    { id: 1, nome: "Papel A4", estoque: 500 },
    { id: 2, nome: "Caneta Azul", estoque: 25 },
    { id: 3, nome: "Toner Impressora HP", estoque: 3 },
    { id: 4, nome: "Grampeador", estoque: 2 },
    { id: 5, nome: "Clips", estoque: 100 },
    { id: 6, nome: "Pasta Arquivo", estoque: 15 }
  ]);

  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    usuario: "",
    dataInicio: "",
    dataFim: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState<PedidoMaterial | null>(null);
  const [novoPedido, setNovoPedido] = useState<Partial<PedidoMaterial>>({
    id_usuario: 0,
    id_material: 0,
    data_pedido: new Date().toISOString().split('T')[0],
    quantidade: 1,
    status: "Pendente"
  });

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchBusca = pedido.nome_usuario.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      pedido.nome_material.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchStatus = !filtros.status || pedido.status === filtros.status;
    const matchUsuario = !filtros.usuario || pedido.id_usuario.toString() === filtros.usuario;
    
    let matchData = true;
    if (filtros.dataInicio && filtros.dataFim) {
      const dataPedido = new Date(pedido.data_pedido);
      const dataInicio = new Date(filtros.dataInicio);
      const dataFim = new Date(filtros.dataFim);
      matchData = dataPedido >= dataInicio && dataPedido <= dataFim;
    }
    
    return matchBusca && matchStatus && matchUsuario && matchData;
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
      usuario: "",
      dataInicio: "",
      dataFim: ""
    });
    setPage(0);
  };

  const abrirDialog = (pedido?: PedidoMaterial) => {
    if (pedido) {
      setPedidoEditando(pedido);
      setNovoPedido(pedido);
    } else {
      setPedidoEditando(null);
      setNovoPedido({
        id_usuario: 0,
        id_material: 0,
        data_pedido: new Date().toISOString().split('T')[0],
        quantidade: 1,
        status: "Pendente"
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setPedidoEditando(null);
  };

  const salvarPedido = () => {
    const usuarioSelecionado = usuarios.find(u => u.id === novoPedido.id_usuario);
    const materialSelecionado = materiais.find(m => m.id === novoPedido.id_material);

    if (pedidoEditando) {
      setPedidos(prev => prev.map(p => 
        p.id === pedidoEditando.id ? { 
          ...novoPedido,
          nome_usuario: usuarioSelecionado?.nome || '',
          nome_material: materialSelecionado?.nome || ''
        } as PedidoMaterial : p
      ));
    } else {
      const novoId = Math.max(...pedidos.map(p => p.id)) + 1;
      setPedidos(prev => [...prev, {
        ...novoPedido,
        id: novoId,
        nome_usuario: usuarioSelecionado?.nome || '',
        nome_material: materialSelecionado?.nome || ''
      } as PedidoMaterial]);
    }
    fecharDialog();
  };

  const excluirPedido = (id: number) => {
    setPedidos(prev => prev.filter(p => p.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Atendido': return 'success';
      case 'Pendente': return 'warning';
      case 'Negado': return 'error';
      default: return 'default';
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Pedidos de Material
      </Typography>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingCartIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {pedidos.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Pedidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {pedidos.filter(p => p.status === 'Pendente').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {pedidos.filter(p => p.status === 'Atendido').length}
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
              <Typography variant="h4" color="error.main">
                {pedidos.filter(p => p.status === 'Negado').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Negados
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
                label={t('common.buscar')}
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
                  <MenuItem value="Em aberto">Em aberto</MenuItem>
                  <MenuItem value="Atendido">Atendido</MenuItem>
                  <MenuItem value="Parcial">Parcial</MenuItem>
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
              {pedidosFiltrados.length} registro(s)
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
                <TableCell>Usuário</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Data Pedido</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aprovador</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <PersonIcon />
                        </Avatar>
                        {pedido.nome_usuario}
                      </Box>
                    </TableCell>
                    <TableCell>{pedido.nome_material}</TableCell>
                    <TableCell>{formatarData(pedido.data_pedido)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={pedido.quantidade} 
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pedido.status} 
                        color={getStatusColor(pedido.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {pedido.nome_aprovador || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => abrirDialog(pedido)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => excluirPedido(pedido.id)}
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
          count={pedidosFiltrados.length}
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
          {pedidoEditando ? 'Editar Pedido' : 'Novo Pedido'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Usuário</InputLabel>
                <Select
                  value={novoPedido.id_usuario || ''}
                  label="Usuário"
                  onChange={(e) => setNovoPedido(prev => ({ ...prev, id_usuario: Number(e.target.value) }))}
                >
                  {usuarios.map(usuario => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome} - {usuario.tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Material</InputLabel>
                <Select
                  value={novoPedido.id_material || ''}
                  label="Material"
                  onChange={(e) => setNovoPedido(prev => ({ ...prev, id_material: Number(e.target.value) }))}
                >
                  {materiais.map(material => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.nome} (Estoque: {material.estoque})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data do Pedido"
                type="date"
                value={novoPedido.data_pedido || ''}
                onChange={(e) => setNovoPedido(prev => ({ ...prev, data_pedido: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={novoPedido.quantidade || ''}
                onChange={(e) => setNovoPedido(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={novoPedido.status || ''}
                  label="Status"
                  onChange={(e) => setNovoPedido(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Atendido">Atendido</MenuItem>
                  <MenuItem value="Negado">Negado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {(novoPedido.status === 'Atendido' || novoPedido.status === 'Negado') && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Aprovador</InputLabel>
                  <Select
                    value={novoPedido.aprovador_id || ''}
                    label="Aprovador"
                    onChange={(e) => setNovoPedido(prev => ({ ...prev, aprovador_id: Number(e.target.value) }))}
                  >
                    {usuarios.filter(u => u.tipo === 'Coordenador' || u.tipo === 'Administrador').map(usuario => (
                      <MenuItem key={usuario.id} value={usuario.id}>
                        {usuario.nome} - {usuario.tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarPedido} variant="contained">
            {pedidoEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}