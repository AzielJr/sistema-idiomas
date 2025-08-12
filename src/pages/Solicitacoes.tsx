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
  Link
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon
} from "@mui/icons-material";
import { useState } from "react";

interface Solicitacao {
  id: number;
  id_aluno: number;
  nome_aluno: string;
  tipo_solicitacao: 'Atestado' | 'Declaração' | 'Histórico' | 'Rematricula';
  descricao: string;
  data_solicitacao: string;
  status: 'Aguardando' | 'Em andamento' | 'Finalizado';
  anexo_url?: string;
  data_finalizacao?: string;
  id_usuario: number;
  nome_usuario: string;
}

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([
    {
      id: 1,
      id_aluno: 1,
      nome_aluno: "João Silva",
      tipo_solicitacao: "Atestado",
      descricao: "Atestado de matrícula para desconto no transporte público",
      data_solicitacao: "2024-11-01",
      status: "Finalizado",
      anexo_url: "atestado_joao.pdf",
      data_finalizacao: "2024-11-03",
      id_usuario: 1,
      nome_usuario: "João Silva"
    },
    {
      id: 2,
      id_aluno: 2,
      nome_aluno: "Maria Santos",
      tipo_solicitacao: "Declaração",
      descricao: "Declaração de conclusão do curso básico",
      data_solicitacao: "2024-11-05",
      status: "Em andamento",
      id_usuario: 2,
      nome_usuario: "Maria Santos"
    },
    {
      id: 3,
      id_aluno: 3,
      nome_aluno: "Pedro Costa",
      tipo_solicitacao: "Histórico",
      descricao: "Histórico escolar completo para transferência",
      data_solicitacao: "2024-11-10",
      status: "Aguardando",
      id_usuario: 3,
      nome_usuario: "Pedro Costa"
    }
  ]);

  const [filtros, setFiltros] = useState({
    busca: "",
    tipo: "",
    status: "",
    dataInicial: "",
    dataFinal: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [solicitacaoEditando, setSolicitacaoEditando] = useState<Solicitacao | null>(null);
  const [novaSolicitacao, setNovaSolicitacao] = useState<Partial<Solicitacao>>({
    id_aluno: 0,
    tipo_solicitacao: "Atestado",
    descricao: "",
    data_solicitacao: new Date().toISOString().split('T')[0],
    status: "Aguardando",
    id_usuario: 1
  });

  const alunos = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Costa" },
    { id: 4, nome: "Ana Oliveira" },
    { id: 5, nome: "Carlos Ferreira" }
  ];

  const usuarios = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Costa" },
    { id: 4, nome: "Ana Oliveira" },
    { id: 5, nome: "Carlos Ferreira" }
  ];

  const solicitacoesFiltradas = solicitacoes.filter(solicitacao => {
    const matchBusca = solicitacao.nome_aluno.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      solicitacao.descricao.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchTipo = !filtros.tipo || solicitacao.tipo_solicitacao === filtros.tipo;
    const matchStatus = !filtros.status || solicitacao.status === filtros.status;
    const matchDataInicial = !filtros.dataInicial || solicitacao.data_solicitacao >= filtros.dataInicial;
    const matchDataFinal = !filtros.dataFinal || solicitacao.data_solicitacao <= filtros.dataFinal;
    
    return matchBusca && matchTipo && matchStatus && matchDataInicial && matchDataFinal;
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
      tipo: "",
      status: "",
      dataInicial: "",
      dataFinal: ""
    });
    setPage(0);
  };

  const abrirDialog = (solicitacao?: Solicitacao) => {
    if (solicitacao) {
      setSolicitacaoEditando(solicitacao);
      setNovaSolicitacao(solicitacao);
    } else {
      setSolicitacaoEditando(null);
      setNovaSolicitacao({
        id_aluno: 0,
        tipo_solicitacao: "Atestado",
        descricao: "",
        data_solicitacao: new Date().toISOString().split('T')[0],
        status: "Aguardando",
        id_usuario: 1
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setSolicitacaoEditando(null);
  };

  const salvarSolicitacao = () => {
    if (solicitacaoEditando) {
      setSolicitacoes(prev => prev.map(s => 
        s.id === solicitacaoEditando.id ? { ...novaSolicitacao as Solicitacao } : s
      ));
    } else {
      const novoId = Math.max(...solicitacoes.map(s => s.id)) + 1;
      const alunoSelecionado = alunos.find(a => a.id === novaSolicitacao.id_aluno);
      const usuarioSelecionado = usuarios.find(u => u.id === novaSolicitacao.id_usuario);
      
      setSolicitacoes(prev => [...prev, {
        ...novaSolicitacao,
        id: novoId,
        nome_aluno: alunoSelecionado?.nome || "",
        nome_usuario: usuarioSelecionado?.nome || ""
      } as Solicitacao]);
    }
    fecharDialog();
  };

  const excluirSolicitacao = (id: number) => {
    setSolicitacoes(prev => prev.filter(s => s.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado': return 'success';
      case 'Em andamento': return 'warning';
      case 'Aguardando': return 'info';
      default: return 'default';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Atestado': return 'primary';
      case 'Declaração': return 'secondary';
      case 'Histórico': return 'info';
      case 'Rematricula': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Solicitações
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {/* Campo de Busca */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar Solicitação"
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ 
                  '& .MuiInputBase-root': { minHeight: '56px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                }}
              />
            </Grid>

            {/* Campo Select Tipo - Maior */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Filtrar por Tipo</InputLabel>
                <Select
                  value={filtros.tipo}
                  label="Filtrar por Tipo"
                  onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '1rem',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">Todos os tipos</MenuItem>
                  <MenuItem value="Atestado">Atestado</MenuItem>
                  <MenuItem value="Declaração">Declaração</MenuItem>
                  <MenuItem value="Histórico">Histórico</MenuItem>
                  <MenuItem value="Rematricula">Rematrícula</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Campo Select Status - Maior */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Filtrar por Status</InputLabel>
                <Select
                  value={filtros.status}
                  label="Filtrar por Status"
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '1rem',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">Todos os status</MenuItem>
                  <MenuItem value="Aguardando">Aguardando</MenuItem>
                  <MenuItem value="Em andamento">Em andamento</MenuItem>
                  <MenuItem value="Finalizado">Finalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Campos de Data */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Data Inicial"
                type="date"
                value={filtros.dataInicial}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicial: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputBase-root': { minHeight: '56px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Data Final"
                type="date"
                value={filtros.dataFinal}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataFinal: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputBase-root': { minHeight: '56px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={limparFiltros}
                startIcon={<ClearIcon />}
                sx={{ minHeight: '56px' }}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
          
          {/* Botões de ação */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {solicitacoesFiltradas.length} registro(s)
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
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data Solicitação</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Anexo</TableCell>
                <TableCell>Data Finalização</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitacoesFiltradas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((solicitacao) => (
                  <TableRow key={solicitacao.id}>
                    <TableCell>{solicitacao.id}</TableCell>
                    <TableCell>{solicitacao.nome_aluno}</TableCell>
                    <TableCell>
                      <Chip 
                        label={solicitacao.tipo_solicitacao} 
                        color={getTipoColor(solicitacao.tipo_solicitacao) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {solicitacao.descricao}
                      </Typography>
                    </TableCell>
                    <TableCell>{new Date(solicitacao.data_solicitacao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={solicitacao.status} 
                        color={getStatusColor(solicitacao.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {solicitacao.anexo_url ? (
                        <Link href="#" onClick={(e) => e.preventDefault()}>
                          <IconButton size="small" color="primary">
                            <DownloadIcon />
                          </IconButton>
                        </Link>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {solicitacao.data_finalizacao 
                        ? new Date(solicitacao.data_finalizacao).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => abrirDialog(solicitacao)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => excluirSolicitacao(solicitacao.id)}
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
          count={solicitacoesFiltradas.length}
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
          {solicitacaoEditando ? 'Editar Solicitação' : 'Nova Solicitação'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Campo Select Aluno - Largura Total */}
            <Grid item xs={12}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Aluno Solicitante</InputLabel>
                <Select
                  value={novaSolicitacao.id_aluno || ''}
                  label="Aluno Solicitante"
                  onChange={(e) => setNovaSolicitacao(prev => ({ 
                    ...prev, 
                    id_aluno: Number(e.target.value),
                    nome_aluno: alunos.find(a => a.id === Number(e.target.value))?.nome || ''
                  }))}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '1rem',
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

            {/* Campo Select Tipo de Solicitação - Largura Total */}
            <Grid item xs={12}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Tipo de Solicitação</InputLabel>
                <Select
                  value={novaSolicitacao.tipo_solicitacao || ''}
                  label="Tipo de Solicitação"
                  onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, tipo_solicitacao: e.target.value as any }))}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '1rem',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione o tipo</em>
                  </MenuItem>
                  <MenuItem value="Atestado">Atestado</MenuItem>
                  <MenuItem value="Declaração">Declaração</MenuItem>
                  <MenuItem value="Histórico">Histórico</MenuItem>
                  <MenuItem value="Rematricula">Rematrícula</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Campo Descrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição da Solicitação"
                multiline
                rows={3}
                value={novaSolicitacao.descricao || ''}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, descricao: e.target.value }))}
                sx={{ 
                  '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                }}
              />
            </Grid>

            {/* Campos de Data */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data da Solicitação"
                type="date"
                value={novaSolicitacao.data_solicitacao || ''}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, data_solicitacao: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputBase-root': { minHeight: '56px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Finalização"
                type="date"
                value={novaSolicitacao.data_finalizacao || ''}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, data_finalizacao: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputBase-root': { minHeight: '56px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                }}
              />
            </Grid>

            {/* Campo Select Status - Largura Total */}
            <Grid item xs={12}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Status da Solicitação</InputLabel>
                <Select
                  value={novaSolicitacao.status || ''}
                  label="Status da Solicitação"
                  onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, status: e.target.value as any }))}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '1rem',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione o status</em>
                  </MenuItem>
                  <MenuItem value="Aguardando">Aguardando</MenuItem>
                  <MenuItem value="Em andamento">Em andamento</MenuItem>
                  <MenuItem value="Finalizado">Finalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Campo Select Usuário - Largura Total */}
            <Grid item xs={12}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontSize: '1.1rem' }}>Usuário Responsável</InputLabel>
                <Select
                  value={novaSolicitacao.id_usuario || ''}
                  label="Usuário Responsável"
                  onChange={(e) => setNovaSolicitacao(prev => ({ 
                    ...prev, 
                    id_usuario: Number(e.target.value),
                    nome_usuario: usuarios.find(u => u.id === Number(e.target.value))?.nome || ''
                  }))}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      fontSize: '1rem',
                      padding: '16px 14px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione o usuário</em>
                  </MenuItem>
                  {usuarios.map(usuario => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Campo URL do Anexo */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL do Anexo (Opcional)"
                value={novaSolicitacao.anexo_url || ''}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, anexo_url: e.target.value }))}
                InputProps={{
                  startAdornment: <AttachFileIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ 
                  '& .MuiInputBase-root': { minHeight: '56px' },
                  '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarSolicitacao} variant="contained">
            {solicitacaoEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}