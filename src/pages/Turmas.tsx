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
  Chip,
  CircularProgress,
  Alert,
  Tooltip
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Search as SearchIcon,
  Group as GroupIcon,
  Print as PrintIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContextSimple";

interface Turma {
  id: number;
  nomeTurma: string;
  nivel: string;
  ano: string;
  horaInicio: string;
  horaFim: string;
  aulaSeg: boolean;
  aulaTer: boolean;
  aulaQua: boolean;
  aulaQui: boolean;
  aulaSex: boolean;
  aulaSab: boolean;
  idProfessor: number;
  professorNome: string;
  idCoordenador: number;
  coordenadorNome: string;
  idMaterialDidatico: number;
  materialNome: string;
  sala: string;
  capacidadeMaxima: number;
  numeroAlunos: number;
  observacoes: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export default function Turmas() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, fetchWithAuthSafe } = useAuth();

  const [pesquisa, setPesquisa] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logomarcaUnidade, setLogomarcaUnidade] = useState<string>("");
  const [fantasiaUnidade, setFantasiaUnidade] = useState<string>("");

  useEffect(() => {
    if (user?.idUnidade) {
      carregarTurmas();
      carregarLogomarcaUnidade();
    }
  }, [user?.idUnidade]);

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
    }
  };

  const carregarTurmas = async () => {
    if (!user?.idUnidade) return;
    
    try {
      setLoading(true);
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/turmas/unidade/${user.idUnidade}`);
      
      if (response.ok) {
        const data = await response.json();
        setTurmas(data);
        setError(null);
      } else {
        setError('Erro ao carregar turmas');
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      setError('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const handlePesquisar = async () => {
    if (!user?.idUnidade) return;
    
    if (!pesquisa.trim()) {
      carregarTurmas();
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/turmas/unidade/${user.idUnidade}/pesquisa?termo=${encodeURIComponent(pesquisa)}`);
      
      if (response.ok) {
        const data = await response.json();
        setTurmas(data);
        setError(null);
      } else {
        setError('Erro na pesquisa');
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      setError('Erro na pesquisa');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrar = () => {
    navigate("/cadastros/turmas/cadastro");
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/turmas/cadastro/${id}`);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta turma?')) {
      return;
    }

    try {
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/turmas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await carregarTurmas();
      } else {
        setError('Erro ao excluir turma');
      }
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      setError('Erro ao excluir turma');
    }
  };

  const formatarHorario = (inicio: string, fim: string) => {
    return `${inicio} - ${fim}`;
  };

  const formatarData = (data: string) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getClientIP = () => {
    return '127.0.0.1';
  };

  const gerarHTMLImpressao = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório - Turmas</title>
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
              <div class="titulo">Lista de Turmas</div>
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
            <div class="info-item"><strong>Total de Turmas:</strong> ${turmas.length}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Turma</th>
              <th>Nível</th>
              <th>Ano</th>
              <th>Horário</th>
              <th>Professor</th>
              <th>Sala</th>
              <th>Alunos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${turmas.map(turma => `
              <tr>
                <td><strong>${turma.nomeTurma}</strong></td>
                <td>${turma.nivel}</td>
                <td>${turma.ano}</td>
                <td>${formatarHorario(turma.horaInicio, turma.horaFim)}</td>
                <td>${turma.professorNome || '-'}</td>
                <td>${turma.sala}</td>
                <td>${turma.numeroAlunos || 0}/${turma.capacidadeMaxima}</td>
                <td class="${turma.ativo ? 'status-ativo' : 'status-inativo'}">
                  ${turma.ativo ? 'Ativa' : 'Inativa'}
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

  const imprimirTurmas = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(gerarHTMLImpressao());
      printWindow.document.close();
      printWindow.focus();
    }
  };

  const turmasFiltradas = turmas.filter((turma) =>
    turma.nomeTurma.toLowerCase().includes(pesquisa.toLowerCase()) ||
    turma.nivel.toLowerCase().includes(pesquisa.toLowerCase()) ||
    turma.sala.toLowerCase().includes(pesquisa.toLowerCase()) ||
    (turma.professorNome && turma.professorNome.toLowerCase().includes(pesquisa.toLowerCase()))
  );

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" sx={{ mt: -2.125, mb: 1.75 }}>
        {t('turmas.titulo') || 'Turmas'}
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            label={t('turmas.pesquisarTurma') || 'Pesquisar turmas'}
            variant="outlined"
            size="small"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePesquisar();
              }
            }}
            placeholder={t('turmas.placeholderPesquisa') || 'Nome, nível, sala...'}
            sx={{ minWidth: 300 }}
          />
          <Button 
            variant="outlined" 
            startIcon={<SearchIcon />} 
            onClick={handlePesquisar}
            disabled={loading}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {t('common.pesquisar') || 'Pesquisar'}
          </Button>
          {pesquisa && (
            <Button
              variant="text"
              onClick={() => {
                setPesquisa('');
                carregarTurmas();
              }}
              sx={{ textTransform: 'none', height: 40 }}
            >
              {t('common.limpar') || 'Limpar'}
            </Button>
          )}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={imprimirTurmas}
            sx={{ textTransform: 'none', height: 40 }}
          >
            Imprimir
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleCadastrar}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {t('common.cadastrar') || 'Cadastrar'}
          </Button>
        </Stack>
      </Stack>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabela de turmas */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ height: 40 }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Turma</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nível</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ano</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Sala</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Alunos</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Carregando...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : turmasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma turma encontrada
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                turmasFiltradas.map((turma) => (
                  <TableRow key={turma.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {turma.nomeTurma}
                      </Typography>
                    </TableCell>
                    <TableCell>{turma.nivel}</TableCell>
                    <TableCell>{turma.ano}</TableCell>
                    <TableCell>{formatarHorario(turma.horaInicio, turma.horaFim)}</TableCell>
                    <TableCell>{turma.professorNome || '-'}</TableCell>
                    <TableCell>{turma.sala}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {turma.numeroAlunos || 0}/{turma.capacidadeMaxima}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={turma.ativo ? 'Ativa' : 'Inativa'}
                        color={turma.ativo ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Editar Turma">
                          <IconButton
                            size="small"
                            onClick={() => handleEditar(turma.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleExcluir(turma.id)}
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
      </Paper>
    </Box>
  );
}