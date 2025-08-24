import { 
  Box, 
  Button, 
  IconButton, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography, 
  Paper,
  Avatar,
  Chip,
  Tooltip,
  CircularProgress,
  Alert
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Search as SearchIcon,
  Book as BookIcon,
  Print as PrintIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useAuth } from "../contexts/AuthContextSimple";

interface MaterialDidatico {
  id: number;
  nome: string;
  editora: string;
  autor: string;
  obs: string;
  fotoCapa?: string;
  status: number;
  idUnidade: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

export default function MaterialDidatico() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, fetchWithAuthSafe, refreshUserData } = useAuth();

  const [pesquisa, setPesquisa] = useState("");
  const [materiais, setMateriais] = useState<MaterialDidatico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logomarcaUnidade, setLogomarcaUnidade] = useState<string>("");
  const [fantasiaUnidade, setFantasiaUnidade] = useState<string>("");

  useEffect(() => {
    if (user?.idUnidade) {
      carregarMateriais();
      carregarLogomarcaUnidade();
    } else if (user && !user.idUnidade) {
      refreshUserData();
    }
  }, [user?.idUnidade, user, refreshUserData]);

  const carregarLogomarcaUnidade = async () => {
    if (!user?.idUnidade) return;
    
    try {
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/unidades/${user.idUnidade}`);
      if (response.ok) {
        const unidade = await response.json();
        setLogomarcaUnidade(unidade.logomarca || "");
        setFantasiaUnidade(unidade.fantasia || `Unidade ${user.idUnidade}`);
      }
    } catch (error) {
      console.error('Erro ao carregar logomarca da unidade:', error);
      setFantasiaUnidade(`Unidade ${user.idUnidade}`);
    }
  };

  const carregarMateriais = async () => {
    if (!user?.idUnidade) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/material-didatico/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`📚 Materiais carregados para unidade ${user.idUnidade}:`, data.length, 'registros');
        setMateriais(data);
      } else {
        throw new Error('Erro ao carregar materiais');
      }
    } catch (error) {
      console.error('Erro ao carregar materiais:', error);
      setError('Erro ao carregar materiais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const buscarMateriais = async () => {
    if (!user?.idUnidade) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const url = pesquisa.trim() 
        ? `/api/material-didatico/unidade/${user.idUnidade}/busca?termo=${encodeURIComponent(pesquisa.trim())}`
        : `/api/material-didatico/unidade/${user.idUnidade}`;
      
      const response = await fetchWithAuthSafe(`http://localhost:8080${url}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`🔍 Busca realizada para unidade ${user.idUnidade}, termo: "${pesquisa.trim() || 'todos'}", encontrados:`, data.length, 'registros');
        setMateriais(data);
      } else {
        throw new Error('Erro ao buscar materiais');
      }
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      setError('Erro ao buscar materiais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!user?.idUnidade) return;
    
    if (!window.confirm(t('materialDidatico.confirmarExclusao'))) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/material-didatico/${id}/unidade/${user.idUnidade}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMateriais(prev => prev.filter(material => material.id !== id));
      } else {
        throw new Error('Erro ao excluir material');
      }
    } catch (error) {
      console.error('Erro ao excluir material:', error);
      alert('Erro ao excluir material. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/material-didatico/cadastro/${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/material-didatico/cadastro");
  };

  const handlePesquisar = () => {
    buscarMateriais();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      buscarMateriais();
    }
  };

  const imprimirMateriais = () => {
    console.log(`🖨️ Gerando relatório para unidade ${user?.idUnidade}, total de materiais:`, materiais.length);
    const conteudoHTML = gerarHTMLImpressao();
    const janelaImpressao = window.open('', '_blank');
    if (janelaImpressao) {
      janelaImpressao.document.write(conteudoHTML);
      janelaImpressao.document.close();
    }
  };

  const getClientIP = () => {
    return '127.0.0.1';
  };

  const gerarHTMLImpressao = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    return `
      <!DOCTYPE html>
      <html lang="${i18n.language || 'pt'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório - Material Didático</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.6;
          }
          .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 20px;
          }
          .header-content {
            display: flex;
            align-items: flex-start;
            gap: 20px;
          }
          .header-left {
            flex: 0 0 auto;
          }
          .header-right {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .logo {
            max-width: 120px;
            max-height: 80px;
            border-radius: 15px;
            border: 2px solid #1976d2;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .nome-unidade {
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: -10px !important;
          }
          .titulo {
            font-size: 18px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 0px !important;
          }
          .subtitulo {
            font-size: 14px;
            color: #666;
            margin: 0;
            margin-top: -2px !important;
          }
          .info-relatorio {
            margin-bottom: 20px;
            font-size: 12px;
            color: #666;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }
          .info-item {
            flex: 1;
            min-width: 150px;
            text-align: center;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            font-size: 12px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background-color: #f5f5f5; 
            font-weight: bold;
            color: #1976d2;
          }
          .capa { 
            width: 40px; 
            height: 40px; 
            object-fit: cover;
          }
          .status-ativo { color: #4caf50; font-weight: bold; }
          .status-inativo { color: #f44336; font-weight: bold; }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            line-height: 1.2;
          }
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
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">🖨️ Imprimir</button>
        
        <div class="header">
          <div class="header-content">
            <div class="header-left">
              ${logomarcaUnidade ? `<img src="${logomarcaUnidade}" alt="Logomarca" class="logo" onerror="this.style.display='none'">` : ''}
            </div>
            <div class="header-right">
              <div class="nome-unidade">${fantasiaUnidade || `Unidade ${user?.idUnidade || ''}`}</div>
              <div class="titulo">Lista de Material Didático</div>
              <div class="subtitulo">Sistema de Gestão para Escolas de Idiomas</div>
            </div>
          </div>
        </div>
        
        <div class="info-relatorio">
          <div class="info-row">
            <div class="info-item"><strong>Data:</strong> ${dataAtual}</div>
            <div class="info-item"><strong>Hora:</strong> ${horaAtual}</div>
            <div class="info-item"><strong>Usuário:</strong> ${user?.name || 'N/A'}</div>
            <div class="info-item"><strong>IP:</strong> ${getClientIP()}</div>
            <div class="info-item"><strong>Total de Materiais:</strong> ${materiais.length}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Capa</th>
              <th style="width: 60px;">ID</th>
              <th>Nome do Material</th>
              <th>Editora</th>
              <th>Autor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${materiais.map(material => `
              <tr>
                <td style="text-align: center;">
                  ${material.fotoCapa ? 
                    `<img src="${material.fotoCapa}" alt="Capa" class="capa">` : 
                    '📚'
                  }
                </td>
                <td style="text-align: center;">${material.id}</td>
                <td><strong>${material.nome}</strong></td>
                <td>${material.editora}</td>
                <td>${material.autor || '-'}</td>
                <td class="${material.status === 1 ? 'status-ativo' : 'status-inativo'}">
                  ${material.status === 1 ? 'Ativo' : 'Inativo'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Relatório gerado automaticamente pelo sistema</p>
          <p>© ${new Date().getFullYear()} - Sistema customidiomas.com.br</p>
        </div>
      </body>
      </html>
    `;
  };

  if (!user?.idUnidade) {
    return (
      <Box p={2}>
        <Alert severity="warning">
          <Typography variant="h6" gutterBottom>
            Usuário não possui unidade associada
          </Typography>
          <Typography variant="body2" paragraph>
            Dados do usuário logado: {JSON.stringify(user, null, 2)}
          </Typography>
          <Typography variant="body2">
            Entre em contato com o administrador para associar uma unidade ao seu usuário.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" sx={{ mt: -2.125, mb: 1.75 }}>{t('materialDidatico.titulo')}</Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            label={t('materialDidatico.pesquisarMaterial')}
            variant="outlined"
            size="small"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('materialDidatico.placeholderPesquisa')}
            sx={{ minWidth: 300 }}
          />
          <Button 
            variant="outlined" 
            startIcon={<SearchIcon />} 
            onClick={handlePesquisar}
            disabled={loading}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {t('common.pesquisar')}
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={() => imprimirMateriais()}
            sx={{ textTransform: 'none' }}
          >
            {t('materialDidatico.imprimir')}
          </Button>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleCadastrar}
          sx={{ textTransform: 'none' }}
        >
          {t('common.cadastrar')}
        </Button>
      </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ height: 40 }}>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('materialDidatico.capa')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('common.nome')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('materialDidatico.editora')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('materialDidatico.autor')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('common.status')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('common.acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('messages.carregando')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : materiais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('materialDidatico.nenhumMaterialCadastrado', { unidade: user?.idUnidade || 'atual' })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              materiais.map((material) => (
                <TableRow key={material.id} hover>
                <TableCell>
                  <Avatar 
                      src={material.fotoCapa}
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                  >
                      📚
                  </Avatar>
                </TableCell>
                <TableCell>{material.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {material.nome}
                  </Typography>
                </TableCell>
                <TableCell>{material.editora}</TableCell>
                  <TableCell>{material.autor || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={material.status === 1 ? t('common.ativo') : t('common.inativo')} 
                      color={material.status === 1 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title={t('common.visualizar')}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/cadastros/material-didatico/${material.id}`)}
                        >
                          <BookIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.editar')}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditar(material.id)}
                        >
                          <EditIcon />
                  </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.excluir')}>
                        <IconButton
                          size="small"
                          onClick={() => handleExcluir(material.id)}
                          color="error"
                        >
                          <DeleteIcon />
                  </IconButton>
                      </Tooltip>
                    </Stack>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
