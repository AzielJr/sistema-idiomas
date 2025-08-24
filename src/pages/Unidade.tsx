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
  CircularProgress,
  Avatar
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextSimple";
import PageHeader from "../components/PageHeader";

interface Unidade {
  id: number;
  razaoSocial: string;
  fantasia: string;
  cnpj: string;
  contato: string;
  celular_contato: string;
  logomarca?: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  uf: string;
  complemento: string;
  bairro: string;
  cidade: string;
  ativo: boolean;
}

export default function Unidade() {
  const navigate = useNavigate();
  const { fetchWithAuthSafe } = useAuth();
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState<Unidade | null>(null);

  useEffect(() => {
    carregarUnidades();
  }, []);

  const carregarUnidades = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuthSafe('http://localhost:8080/api/unidades');
      if (response && response.ok) {
        const data = await response.json();
        setUnidades(data);
      } else {
        console.error('Erro ao carregar unidades:', response?.status);
      }
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const [novaUnidade, setNovaUnidade] = useState<Omit<Unidade, 'id'>>({
    razaoSocial: '',
    fantasia: '',
    cnpj: '',
    contato: '',
    celular_contato: '',
    logomarca: '',
    email: '',
    cep: '',
    endereco: '',
    numero: '',
    uf: '',
    complemento: '',
    bairro: '',
    cidade: '',
    ativo: true
  });

  const abrirDialog = (unidade?: Unidade) => {
    if (unidade) {
      setUnidadeEditando(unidade);
      setNovaUnidade(unidade);
    } else {
      setUnidadeEditando(null);
      setNovaUnidade({
        razaoSocial: '',
        fantasia: '',
        cnpj: '',
        contato: '',
        celular_contato: '',
        logomarca: '',
        email: '',
        cep: '',
        endereco: '',
        numero: '',
        uf: '',
        complemento: '',
        bairro: '',
        cidade: '',
        ativo: true
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
    setNovaUnidade(prev => ({ ...prev, celular_contato: celularFormatado }));
  };

  const validarCNPJ = (cnpj: string) => {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.length === 14;
  };

  return (
    <Box sx={{ p: 0.5 }}>
      <PageHeader 
        title="Unidades" 
        rightContent={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', height: '100%' }}>
              <Box sx={{ 
                 textAlign: 'center', 
                 backgroundColor: '#42a5f5', 
                 color: 'white', 
                 px: 1.5, 
                 py: 0.3, 
                 borderRadius: 2,
                 minWidth: 70,
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 alignItems: 'center'
               }}>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: -0.625 }}>
                  {unidades.length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                  Total
                </Typography>
              </Box>
              <Box sx={{ 
                 textAlign: 'center', 
                 backgroundColor: 'success.main', 
                 color: 'white', 
                 px: 1.5, 
                 py: 0.3, 
                 borderRadius: 2,
                 minWidth: 70,
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 alignItems: 'center'
               }}>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: -0.625 }}>
                  {unidades.filter(u => u.ativo).length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                  Ativas
                </Typography>
              </Box>
            </Box>
        }
      />

      {/* Botões */}
      <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<BusinessIcon />}
          size="large"
        >
          Relatório
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/administracao/unidade/cadastro')}
          size="large"
          sx={{ backgroundColor: '#1565c0', '&:hover': { backgroundColor: '#0d47a1' } }}
        >
          Cadastrar
        </Button>
      </Box>

      {/* Tabela de Unidades */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Logo</strong></TableCell>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nome Fantasia</strong></TableCell>
              <TableCell><strong>Contato</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>Carregando unidades...</Typography>
                </TableCell>
              </TableRow>
            ) : unidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">Nenhuma unidade encontrada</Typography>
                </TableCell>
              </TableRow>
            ) : (
              unidades.map((unidade) => (
                <TableRow key={unidade.id} hover>
                <TableCell sx={{ py: 1 }}>
                  <Box
                    sx={{
                      width: 62,
                      height: 40,
                      borderRadius: 1,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: unidade.logomarca ? 'transparent' : 'primary.main',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    {unidade.logomarca ? (
                      <img
                        src={unidade.logomarca.startsWith('data:') ? unidade.logomarca : `data:image/jpeg;base64,${unidade.logomarca}`}
                        alt="Logo"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          // Se a imagem falhar ao carregar, mostra o ícone padrão
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const icon = parent.querySelector('svg');
                            if (icon) {
                              (icon as HTMLElement).style.display = 'block';
                            }
                          }
                        }}
                      />
                    ) : (
                      <BusinessIcon sx={{ fontSize: 18, color: 'white' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {unidade.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {unidade.fantasia}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" fontFamily="monospace">
                      {unidade.celular_contato}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={unidade.ativo ? 'Ativo' : 'Inativo'}
                    size="small" 
                    color={unidade.ativo ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => navigate(`/administracao/unidade/cadastro/${unidade.id}`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => excluirUnidade(unidade.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para adicionar/editar unidade - Será substituído por navegação */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {unidadeEditando ? 'Editar Unidade' : 'Nova Unidade'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Esta funcionalidade será implementada em uma tela separada.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}