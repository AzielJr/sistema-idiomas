import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Alert,
  FormControlLabel
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  Shield as ShieldIcon,
  Print as PrintIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContextSimple";
import PageHeader from "../components/PageHeader";

interface GrupoAcesso {
  id: number;
  grupo: string;
  nivelAcesso: string;
  detalhes?: string;
  ativo: boolean;
}

const niveisAcesso = [
  { value: 'ADMIN', label: 'Administrador', color: '#f44336', icon: AdminIcon },
  { value: 'PROFESSOR', label: 'Professor', color: '#2196f3', icon: VerifiedIcon },
  { value: 'COORDENADOR', label: 'Coordenador', color: '#ff9800', icon: ShieldIcon },
  { value: 'USUARIO', label: 'Usuário', color: '#4caf50', icon: GroupIcon }
];



export default function GruposAcesso() {
  const { fetchWithAuthSafe } = useAuth();
  const [grupos, setGrupos] = useState<GrupoAcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoAcesso | null>(null);
  const [novoGrupo, setNovoGrupo] = useState<Partial<GrupoAcesso>>({
    grupo: '',
    nivelAcesso: 'USUARIO',
    detalhes: '',
    ativo: true
  });

  useEffect(() => {
    carregarGrupos();
  }, []);

  const carregarGrupos = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuthSafe('http://localhost:8080/api/nivel-acesso');
      if (response.ok) {
        const data = await response.json();
        setGrupos(data);
        setErro('');
      } else {
        throw new Error('Erro ao carregar dados');
      }
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      setErro('Erro ao carregar grupos de acesso');
    } finally {
      setLoading(false);
    }
  };

  const abrirDialog = (grupo?: GrupoAcesso) => {
    if (grupo) {
      setGrupoEditando(grupo);
      setNovoGrupo({
        grupo: grupo.grupo,
        nivelAcesso: grupo.nivelAcesso,
        detalhes: grupo.detalhes || '',
        ativo: grupo.ativo
      });
    } else {
      setGrupoEditando(null);
      setNovoGrupo({
        grupo: '',
        nivelAcesso: 'USUARIO',
        detalhes: '',
        ativo: true
      });
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setGrupoEditando(null);
    setNovoGrupo({ grupo: '', nivelAcesso: 'USUARIO', detalhes: '', ativo: true });
  };

  const salvarGrupo = async () => {
    try {
      setLoading(true);
      
      console.log('Dados sendo enviados:', novoGrupo);
      
      const url = grupoEditando 
        ? `http://localhost:8080/api/nivel-acesso/${grupoEditando.id}`
        : 'http://localhost:8080/api/nivel-acesso';
      
      const method = grupoEditando ? 'PUT' : 'POST';
      
      const response = await fetchWithAuthSafe(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoGrupo),
      });
      
      if (response.ok) {
        await carregarGrupos();
        fecharDialog();
        setErro('');
      } else {
        throw new Error('Erro ao salvar dados');
      }
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
      setErro('Erro ao salvar grupo de acesso');
    } finally {
      setLoading(false);
    }
  };

  const excluirGrupo = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      try {
        setLoading(true);
        
        const response = await fetchWithAuthSafe(`http://localhost:8080/api/nivel-acesso/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await carregarGrupos();
          setErro('');
        } else {
          throw new Error('Erro ao excluir dados');
        }
      } catch (error) {
        console.error('Erro ao excluir grupo:', error);
        setErro('Erro ao excluir grupo de acesso');
      } finally {
        setLoading(false);
      }
    }
  };

  const alternarStatus = async (grupo: GrupoAcesso) => {
    try {
      setLoading(true);
      
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/nivel-acesso/${grupo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...grupo, ativo: !grupo.ativo }),
      });
      
      if (response.ok) {
        await carregarGrupos();
        setErro('');
      } else {
        throw new Error('Erro ao alterar status');
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      setErro('Erro ao alterar status do grupo');
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorio = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    const nomeUsuario = 'Admin'; // Aqui você pode pegar do contexto de autenticação
    const ipMaquina = window.location.hostname || 'localhost';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório - Níveis de Acesso</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1976d2;
            margin: 0;
          }
          .info {
            margin-bottom: 20px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
          }
          .info-item {
            flex: 1;
            min-width: 120px;
            text-align: center;
            font-size: 13px;
          }
          @media (max-width: 768px) {
            .info {
              flex-direction: column;
              text-align: center;
            }
            .info-item {
              min-width: auto;
            }
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .status-ativo {
            color: #4caf50;
            font-weight: bold;
          }
          .status-inativo {
            color: #f44336;
            font-weight: bold;
          }
          .nivel-admin { color: #f44336; }
          .nivel-professor { color: #2196f3; }
          .nivel-coordenador { color: #ff9800; }
          .nivel-usuario { color: #4caf50; }
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #1976d2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
          .print-button:hover {
            background-color: #1565c0;
          }
          @media print {
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">🖨️ Imprimir</button>
        
        <div class="header">
          <h1>Relatório - Níveis de Acesso</h1>
        </div>
        
        <div class="info">
          <div class="info-item"><strong>Usuário:</strong> ${nomeUsuario}</div>
          <div class="info-item"><strong>IP:</strong> ${ipMaquina}</div>
          <div class="info-item"><strong>Data:</strong> ${dataAtual}</div>
          <div class="info-item"><strong>Hora:</strong> ${horaAtual}</div>
          <div class="info-item"><strong>Total de registros:</strong> ${grupos.length}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Nível</th>
              <th>Nível de Acesso</th>
              <th>Detalhes do Nível de Acesso</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${grupos.map(grupo => {
              const nivelInfo = getNivelInfo(grupo.nivelAcesso);
              return `
                <tr>
                  <td>${grupo.id}</td>
                  <td>${grupo.grupo}</td>
                  <td class="nivel-${grupo.nivelAcesso.toLowerCase()}">${nivelInfo.label}</td>
                  <td>${grupo.detalhes || '-'}</td>
                  <td class="${grupo.ativo ? 'status-ativo' : 'status-inativo'}">
                    ${grupo.ativo ? 'Ativo' : 'Inativo'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;">
          <p>Relatório gerado automaticamente pelo sistema Custom Idiomas</p>
        </div>
      </body>
      </html>
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  const getNivelInfo = (nivel: string) => {
    return niveisAcesso.find(n => n.value === nivel) || niveisAcesso[3];
  };

  const obterCorStatus = (ativo: boolean) => {
    return ativo ? 'success' : 'default';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0.5 }}>
      <PageHeader 
        title="Níveis de Acesso" 
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
                  {grupos.length}
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
                  {grupos.filter(g => g.ativo).length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                  Ativos
                </Typography>
              </Box>
            </Box>
        }
      />

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      {/* Botões */}
      <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={gerarRelatorio}
          size="large"
        >
          Imprimir
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirDialog()}
          size="large"
          sx={{ backgroundColor: '#1565c0', '&:hover': { backgroundColor: '#0d47a1' } }}
        >
          Cadastrar
        </Button>
      </Box>

      {/* Tabela de Grupos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nome do Nível</strong></TableCell>
              <TableCell><strong>Nível de Acesso</strong></TableCell>
              <TableCell><strong>Detalhes do Nível de Acesso</strong></TableCell>
              <TableCell><strong>Registro Ativo</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grupos.map((grupo) => {
              const nivelInfo = getNivelInfo(grupo.nivelAcesso);
              const IconeNivel = nivelInfo.icon;
              
              return (
                <TableRow key={grupo.id} hover>
                  <TableCell>{grupo.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconeNivel fontSize="small" sx={{ color: nivelInfo.color }} />
                      <Typography variant="body2" fontWeight="medium">
                        {grupo.grupo}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={nivelInfo.label}
                      size="small"
                      sx={{ 
                        backgroundColor: nivelInfo.color,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>{grupo.detalhes || 'Sem detalhes'}</TableCell>
                  <TableCell>
                    <Chip
                      label={grupo.ativo ? "Ativo" : "Inativo"}
                      color={grupo.ativo ? "success" : "error"}
                      size="small"
                      onClick={() => alternarStatus(grupo)}
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {grupos.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <SecurityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum grupo de acesso encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece adicionando um novo grupo de acesso
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => abrirDialog()}>
            Adicionar Grupo
          </Button>
        </Paper>
      )}



      {/* Dialog para adicionar/editar */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          {grupoEditando ? 'Editar Grupo de Acesso' : 'Novo Grupo de Acesso'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nome do Grupo"
              value={novoGrupo.grupo || ''}
              onChange={(e) => setNovoGrupo(prev => ({ ...prev, grupo: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Nível de Acesso</InputLabel>
              <Select
                value={novoGrupo.nivelAcesso || 'USUARIO'}
                label="Nível de Acesso"
                onChange={(e) => setNovoGrupo(prev => ({ ...prev, nivelAcesso: e.target.value }))}
              >
                {niveisAcesso.map(nivel => {
                  const IconeNivel = nivel.icon;
                  return (
                    <MenuItem key={nivel.value} value={nivel.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconeNivel fontSize="small" sx={{ color: nivel.color }} />
                        {nivel.label}
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Detalhes do Nível de Acesso"
              value={novoGrupo.detalhes || ''}
              onChange={(e) => setNovoGrupo(prev => ({ ...prev, detalhes: e.target.value }))}
              sx={{ mb: 2 }}
              multiline
              rows={3}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={novoGrupo.ativo || false}
                  onChange={(e) => setNovoGrupo(prev => ({ ...prev, ativo: e.target.checked }))}
                  color={novoGrupo.ativo ? "primary" : "error"}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: novoGrupo.ativo ? '#1976d2' : '#d32f2f',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: novoGrupo.ativo ? '#1976d2' : '#d32f2f',
                    },
                    '& .MuiSwitch-switchBase': {
                      color: novoGrupo.ativo ? '#1976d2' : '#d32f2f',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: novoGrupo.ativo ? '#1976d2' : '#d32f2f',
                    }
                  }}
                />
              }
              label={novoGrupo.ativo ? "Ativo" : "Inativo"}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button onClick={salvarGrupo} variant="contained">
            {grupoEditando ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}