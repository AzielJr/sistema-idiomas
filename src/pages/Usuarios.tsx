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
  InputLabel,
  Avatar,
  Switch,
  FormControlLabel,
  InputAdornment
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  AccountCircle as AccountIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  login: string;
  senha: string;
  celular: string;
  foto: string;
  grupoAcesso: string;
  ativo: boolean;
  dataUltimoLogin?: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@escola.com",
      login: "joao.silva",
      senha: "123456",
      celular: "(11) 99999-1234",
      foto: "",
      grupoAcesso: "Administrador",
      ativo: true,
      dataUltimoLogin: "2024-01-15 14:30"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@escola.com",
      login: "maria.santos",
      senha: "123456",
      celular: "(11) 98888-5678",
      foto: "",
      grupoAcesso: "Professor",
      ativo: true,
      dataUltimoLogin: "2024-01-14 09:15"
    },
    {
      id: 3,
      nome: "Ana Costa",
      email: "ana.costa@escola.com",
      login: "ana.costa",
      senha: "123456",
      celular: "(11) 97777-9012",
      foto: "",
      grupoAcesso: "Secretaria",
      ativo: true,
      dataUltimoLogin: "2024-01-13 16:45"
    },
    {
      id: 4,
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@escola.com",
      login: "carlos.oliveira",
      senha: "123456",
      celular: "(11) 96666-3456",
      foto: "",
      grupoAcesso: "Gerente",
      ativo: false
    }
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [novoUsuario, setNovoUsuario] = useState<Omit<Usuario, 'id'>>({
    nome: '',
    email: '',
    login: '',
    senha: '',
    celular: '',
    foto: '',
    grupoAcesso: 'Visualizador',
    ativo: true
  });

  const gruposAcesso = [
    'Administrador',
    'Gerente', 
    'Professor',
    'Secretaria',
    'Visualizador'
  ];

  const abrirDialog = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setNovoUsuario(usuario);
    } else {
      setUsuarioEditando(null);
      setNovoUsuario({
        nome: '',
        email: '',
        login: '',
        senha: '',
        celular: '',
        foto: '',
        grupoAcesso: 'Visualizador',
        ativo: true
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setUsuarioEditando(null);
    setMostrarSenha(false);
  };

  const salvarUsuario = () => {
    if (usuarioEditando) {
      setUsuarios(prev => 
        prev.map(u => u.id === usuarioEditando.id ? { ...novoUsuario, id: usuarioEditando.id } : u)
      );
    } else {
      const novoId = Math.max(...usuarios.map(u => u.id), 0) + 1;
      setUsuarios(prev => [...prev, { ...novoUsuario, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirUsuario = (id: number) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const toggleStatus = (id: number) => {
    setUsuarios(prev => 
      prev.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u)
    );
  };

  const formatarCelular = (celular: string) => {
    const numeros = celular.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return celular;
  };

  const handleCelularChange = (value: string) => {
    const celularFormatado = formatarCelular(value);
    setNovoUsuario(prev => ({ ...prev, celular: celularFormatado }));
  };

  const gerarLogin = (nome: string) => {
    return nome.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
  };

  const handleNomeChange = (nome: string) => {
    setNovoUsuario(prev => ({ 
      ...prev, 
      nome,
      login: prev.login === '' ? gerarLogin(nome) : prev.login
    }));
  };

  const getCorGrupo = (grupo: string) => {
    switch (grupo) {
      case 'Administrador': return 'error';
      case 'Gerente': return 'warning';
      case 'Professor': return 'info';
      case 'Secretaria': return 'primary';
      default: return 'default';
    }
  };

  const usuariosAtivos = usuarios.filter(u => u.ativo).length;
  const usuariosInativos = usuarios.filter(u => !u.ativo).length;

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="Usuários" 
        subtitulo="Gerencie os usuários do sistema"
      />

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {usuarios.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Usuários
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {usuariosAtivos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Usuários Ativos
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {usuariosInativos}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Usuários Inativos
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
                    {usuarios.filter(u => u.dataUltimoLogin).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Logados Recentemente
                  </Typography>
                </Box>
                <AccountIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
          Novo Usuário
        </Button>
      </Box>

      {/* Tabela de Usuários */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Foto</strong></TableCell>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Login</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Celular</strong></TableCell>
              <TableCell><strong>Grupo</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} hover>
                <TableCell>
                  <Avatar 
                    src={usuario.foto} 
                    sx={{ width: 40, height: 40 }}
                  >
                    {usuario.nome.charAt(0).toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {usuario.nome}
                  </Typography>
                  {usuario.dataUltimoLogin && (
                    <Typography variant="caption" color="text.secondary">
                      Último login: {usuario.dataUltimoLogin}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {usuario.login}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {usuario.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {usuario.celular}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.grupoAcesso}
                    size="small" 
                    color={getCorGrupo(usuario.grupoAcesso) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.ativo ? 'Ativo' : 'Inativo'}
                    size="small" 
                    color={usuario.ativo ? 'success' : 'default'}
                    onClick={() => toggleStatus(usuario.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => abrirDialog(usuario)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirUsuario(usuario.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {usuarios.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum usuário encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece adicionando um novo usuário
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Adicionar Usuário
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

      {/* Dialog para adicionar/editar usuário */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={novoUsuario.nome}
                onChange={(e) => handleNomeChange(e.target.value)}
                placeholder="Ex: João Silva"
                required
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Login"
                value={novoUsuario.login}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, login: e.target.value }))}
                placeholder="Ex: joao.silva"
                required
                InputProps={{
                  startAdornment: <AccountIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="Login será gerado automaticamente baseado no nome"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                placeholder="joao.silva@escola.com"
                required
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Celular"
                value={novoUsuario.celular}
                onChange={(e) => handleCelularChange(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
                required
                inputProps={{ maxLength: 15 }}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Senha"
                type={mostrarSenha ? 'text' : 'password'}
                value={novoUsuario.senha}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                placeholder="Digite a senha"
                required
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        edge="end"
                      >
                        {mostrarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Grupo de Acesso</InputLabel>
                <Select
                  value={novoUsuario.grupoAcesso}
                  label="Grupo de Acesso"
                  onChange={(e) => setNovoUsuario(prev => ({ ...prev, grupoAcesso: e.target.value }))}
                >
                  {gruposAcesso.map((grupo) => (
                    <MenuItem key={grupo} value={grupo}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon fontSize="small" />
                        {grupo}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL da Foto"
                value={novoUsuario.foto}
                onChange={(e) => setNovoUsuario(prev => ({ ...prev, foto: e.target.value }))}
                placeholder="https://exemplo.com/foto.jpg"
                helperText="URL da foto do usuário (opcional)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={novoUsuario.ativo}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, ativo: e.target.checked }))}
                  />
                }
                label="Usuário Ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button 
            onClick={salvarUsuario} 
            variant="contained"
            disabled={!novoUsuario.nome || !novoUsuario.email || !novoUsuario.login || !novoUsuario.senha || !novoUsuario.celular}
          >
            {usuarioEditando ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}