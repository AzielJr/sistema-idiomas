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
  Chip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

interface Unidade {
  id: number;
  unidade: string;
  cnpj: string;
  contato: string;
  celular: string;
  imagem: string;
}

export default function Unidade() {
  const [unidades, setUnidades] = useState<Unidade[]>([
    {
      id: 1,
      unidade: "Centro de Idiomas - Unidade Centro",
      cnpj: "12.345.678/0001-90",
      contato: "Maria Silva",
      celular: "(11) 99999-1234",
      imagem: ""
    },
    {
      id: 2,
      unidade: "Centro de Idiomas - Unidade Norte",
      cnpj: "12.345.678/0002-71",
      contato: "João Santos",
      celular: "(11) 98888-5678",
      imagem: ""
    },
    {
      id: 3,
      unidade: "Centro de Idiomas - Unidade Sul",
      cnpj: "12.345.678/0003-52",
      contato: "Ana Costa",
      celular: "(11) 97777-9012",
      imagem: ""
    }
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState<Unidade | null>(null);

  const [novaUnidade, setNovaUnidade] = useState<Omit<Unidade, 'id'>>({
    unidade: '',
    cnpj: '',
    contato: '',
    celular: '',
    imagem: ''
  });

  const abrirDialog = (unidade?: Unidade) => {
    if (unidade) {
      setUnidadeEditando(unidade);
      setNovaUnidade(unidade);
    } else {
      setUnidadeEditando(null);
      setNovaUnidade({
        unidade: '',
        cnpj: '',
        contato: '',
        celular: '',
        imagem: ''
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setUnidadeEditando(null);
  };

  const salvarUnidade = () => {
    if (unidadeEditando) {
      setUnidades(prev => 
        prev.map(u => u.id === unidadeEditando.id ? { ...novaUnidade, id: unidadeEditando.id } : u)
      );
    } else {
      const novoId = Math.max(...unidades.map(u => u.id), 0) + 1;
      setUnidades(prev => [...prev, { ...novaUnidade, id: novoId }]);
    }
    fecharDialog();
  };

  const excluirUnidade = (id: number) => {
    setUnidades(prev => prev.filter(u => u.id !== id));
  };

  const formatarCNPJ = (cnpj: string) => {
    // Remove caracteres não numéricos
    const numeros = cnpj.replace(/\D/g, '');
    
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (numeros.length <= 14) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
  };

  const handleCNPJChange = (value: string) => {
    const cnpjFormatado = formatarCNPJ(value);
    setNovaUnidade(prev => ({ ...prev, cnpj: cnpjFormatado }));
  };

  const formatarCelular = (celular: string) => {
    // Remove caracteres não numéricos
    const numeros = celular.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return celular;
  };

  const handleCelularChange = (value: string) => {
    const celularFormatado = formatarCelular(value);
    setNovaUnidade(prev => ({ ...prev, celular: celularFormatado }));
  };

  const validarCNPJ = (cnpj: string) => {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.length === 14;
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        titulo="Unidades" 
        subtitulo="Gerencie as unidades da instituição"
      />

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {unidades.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total de Unidades
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {unidades.filter(u => validarCNPJ(u.cnpj)).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    CNPJs Válidos
                  </Typography>
                </Box>
                <DescriptionIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {unidades.length > 0 ? '100%' : '0%'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Cobertura
                  </Typography>
                </Box>
                <LocationOnIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
          Nova Unidade
        </Button>
      </Box>

      {/* Tabela de Unidades */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nome da Unidade</strong></TableCell>
              <TableCell><strong>CNPJ</strong></TableCell>
              <TableCell><strong>Contato</strong></TableCell>
              <TableCell><strong>Celular</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unidades.map((unidade) => (
              <TableRow key={unidade.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {unidade.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {unidade.unidade}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {unidade.cnpj}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {unidade.contato}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {unidade.celular}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={validarCNPJ(unidade.cnpj) ? 'Ativo' : 'CNPJ Inválido'}
                    size="small" 
                    color={validarCNPJ(unidade.cnpj) ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => abrirDialog(unidade)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirUnidade(unidade.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {unidades.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma unidade encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece adicionando uma nova unidade
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Adicionar Unidade
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

      {/* Dialog para adicionar/editar unidade */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {unidadeEditando ? 'Editar Unidade' : 'Nova Unidade'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Unidade"
                value={novaUnidade.unidade}
                onChange={(e) => setNovaUnidade(prev => ({ ...prev, unidade: e.target.value }))}
                placeholder="Ex: Centro de Idiomas - Unidade Centro"
                required
                InputProps={{
                  startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CNPJ"
                value={novaUnidade.cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                placeholder="XX.XXX.XXX/XXXX-XX"
                required
                inputProps={{ maxLength: 18 }}
                error={novaUnidade.cnpj !== '' && !validarCNPJ(novaUnidade.cnpj)}
                helperText={
                  novaUnidade.cnpj !== '' && !validarCNPJ(novaUnidade.cnpj) 
                    ? 'CNPJ deve ter 14 dígitos' 
                    : 'Formato: XX.XXX.XXX/XXXX-XX'
                }
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contato Responsável"
                value={novaUnidade.contato}
                onChange={(e) => setNovaUnidade(prev => ({ ...prev, contato: e.target.value }))}
                placeholder="Ex: Maria Silva"
                required
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Celular"
                value={novaUnidade.celular}
                onChange={(e) => handleCelularChange(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
                required
                inputProps={{ maxLength: 15 }}
                InputProps={{
                  startAdornment: <PhoneAndroidIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL da Logomarca"
                value={novaUnidade.imagem}
                onChange={(e) => setNovaUnidade(prev => ({ ...prev, imagem: e.target.value }))}
                placeholder="https://exemplo.com/logo.png"
                InputProps={{
                  startAdornment: <ImageIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                helperText="URL da imagem da logomarca da unidade (opcional)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button 
            onClick={salvarUnidade} 
            variant="contained"
            disabled={!novaUnidade.unidade || !validarCNPJ(novaUnidade.cnpj) || !novaUnidade.contato || !novaUnidade.celular}
          >
            {unidadeEditando ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}