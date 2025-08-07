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
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface GrupoAcesso {
  id: number;
  nome: string;
  descricao: string;
  nivelAcesso: 'Administrador' | 'Gerente' | 'Professor' | 'Secretaria' | 'Visualizador';
  ativo: boolean;
}

export default function GruposAcesso() {
  const [grupos, setGrupos] = useState<GrupoAcesso[]>([
    {
      id: 1,
      nome: "Administradores",
      descricao: "Acesso total ao sistema, incluindo configurações e relatórios",
      nivelAcesso: "Administrador",
      ativo: true
    },
    {
      id: 2,
      nome: "Coordenadores",
      descricao: "Gerenciamento de turmas, professores e alunos",
      nivelAcesso: "Gerente",
      ativo: true
    },
    {
      id: 3,
      nome: "Professores",
      descricao: "Acesso a turmas, planos de aula e avaliações",
      nivelAcesso: "Professor",
      ativo: true
    },
    {
      id: 4,
      nome: "Secretaria",
      descricao: "Gestão de matrículas, mensalidades e comunicados",
      nivelAcesso: "Secretaria",
      ativo: true
    },
    {
      id: 5,
      nome: "Consultores",
      descricao: "Visualização de relatórios e dados estatísticos",
      nivelAcesso: "Visualizador",
      ativo: false
    }
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoAcesso | null>(null);

  const [novoGrupo, setNovoGrupo] = useState<Omit<GrupoAcesso, 'id'>>({
    nome: '',
    descricao: '',
    nivelAcesso: 'Visualizador',
    ativo: true
  });

  const niveisAcesso = [
    { valor: 'Administrador', label: 'Administrador', cor: 'error' },
    { valor: 'Gerente', label: 'Gerente', cor: 'warning' },
    { valor: 'Professor', label: 'Professor', cor: 'info' },
    { valor: 'Secretaria', label: 'Secretaria', cor: 'primary' },
    { valor: 'Visualizador', label: 'Visualizador', cor: 'default' }
  ];

  const abrirDialog = (grupo?: GrupoAcesso) => {
    if (grupo) {
      setGrupoEditando(grupo);
      setNovoGrupo(grupo);
    } else {
      setGrupoEditando(null);
      setNovoGrupo({
        nome: '',
        descricao: '',
        nivelAcesso: 'Visualizador',
        ativo: true
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setGrupoEditando(null);
  };

  const salvarGrupo = () => {
    if (grupoEditando) {
      setGrupos(prev => 
        prev.map(g => g.id === grupoEditando.id ? { ...novoGrupo, id: grupoEditando.id } : g)
      );
    } else {
      const novoId = Math.max(...grupos.map(g => g.id), 0) + 1;
      setGrupos(prev => [...prev, { ...novoGrupo, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirGrupo = (id: number) => {
    setGrupos(prev => prev.filter(g => g.id !== id));
  };

  const toggleStatus = (id: number) => {
    setGrupos(prev => 
      prev.map(g => g.id === id ? { ...g, ativo: !g.ativo } : g)
    );
  };

  const getCorNivel = (nivel: string) => {
    const nivelInfo = niveisAcesso.find(n => n.valor === nivel);
    return nivelInfo?.cor || 'default';
  };

  const gruposAtivos = grupos.filter(g => g.ativo).length;
  const gruposInativos = grupos.filter(g => !g.ativo).length;

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="Grupos de Acesso" 
        subtitulo="Gerencie os grupos de acesso e permissões do sistema"
      />

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {grupos.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Grupos
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {gruposAtivos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Grupos Ativos
                  </Typography>
                </Box>
                <SecurityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {gruposInativos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Grupos Inativos
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
                    {niveisAcesso.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Níveis Disponíveis
                  </Typography>
                </Box>
                <AdminIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
          Novo Grupo
        </Button>
      </Box>

      {/* Tabela de Grupos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nome do Grupo</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell><strong>Nível de Acesso</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grupos.map((grupo) => (
              <TableRow key={grupo.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {grupo.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {grupo.nome}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {grupo.descricao}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={grupo.nivelAcesso}
                    size="small" 
                    color={getCorNivel(grupo.nivelAcesso) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={grupo.ativo ? 'Ativo' : 'Inativo'}
                    size="small" 
                    color={grupo.ativo ? 'success' : 'default'}
                    onClick={() => toggleStatus(grupo.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => abrirDialog(grupo)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirGrupo(grupo.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {grupos.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum grupo encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece criando um novo grupo de acesso
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Criar Grupo
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

      {/* Dialog para adicionar/editar grupo */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {grupoEditando ? 'Editar Grupo de Acesso' : 'Novo Grupo de Acesso'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Grupo"
                value={novoGrupo.nome}
                onChange={(e) => setNovoGrupo(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Administradores"
                required
                InputProps={{
                  startAdornment: <GroupIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={novoGrupo.descricao}
                onChange={(e) => setNovoGrupo(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva as responsabilidades e permissões do grupo"
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Nível de Acesso</InputLabel>
                <Select
                  value={novoGrupo.nivelAcesso}
                  label="Nível de Acesso"
                  onChange={(e) => setNovoGrupo(prev => ({ ...prev, nivelAcesso: e.target.value as any }))}
                >
                  {niveisAcesso.map((nivel) => (
                    <MenuItem key={nivel.valor} value={nivel.valor}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon fontSize="small" />
                        {nivel.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button 
            onClick={salvarGrupo} 
            variant="contained"
            disabled={!novoGrupo.nome || !novoGrupo.descricao}
          >
            {grupoEditando ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}