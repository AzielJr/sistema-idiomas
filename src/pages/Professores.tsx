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
  Print as PrintIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContextSimple";

interface Professor {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  dataAdmissao: string;
  formacaoAcademica: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  celular: string;
  email: string;
  foto: string;
  salario: number;
  status: number;
  coordenador: boolean;
  idUnidade: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

export default function Professores() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, fetchWithAuthSafe } = useAuth();

  const [pesquisa, setPesquisa] = useState("");
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logomarcaUnidade, setLogomarcaUnidade] = useState<string>("");
  const [fantasiaUnidade, setFantasiaUnidade] = useState<string>("");

  useEffect(() => {
    if (user?.idUnidade) {
      carregarProfessores();
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

  const carregarProfessores = async () => {
    if (!user?.idUnidade) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/professores/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        setProfessores(data);
      } else {
        throw new Error('Erro ao carregar professores');
      }
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
      setError('Erro ao carregar professores. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const buscarProfessores = async () => {
    if (!user?.idUnidade || !pesquisa.trim()) {
      carregarProfessores();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuthSafe(
        `http://localhost:8080/api/professores/unidade/${user.idUnidade}/busca?termo=${encodeURIComponent(pesquisa)}`
      );
      if (response.ok) {
        const data = await response.json();
        setProfessores(data);
      } else {
        throw new Error('Erro na busca');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setError('Erro na busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!user?.idUnidade) return;
    
    if (window.confirm("Confirma a exclusão deste professor?")) {
      try {
        const response = await fetchWithAuthSafe(
          `http://localhost:8080/api/professores/${id}/unidade/${user.idUnidade}`,
          { method: 'DELETE' }
        );
        
        if (response.ok) {
      setProfessores(professores.filter((professor) => professor.id !== id));
        } else {
          throw new Error('Erro ao excluir professor');
        }
      } catch (error) {
        console.error('Erro ao excluir professor:', error);
        alert('Erro ao excluir professor. Tente novamente.');
      }
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/professores/cadastro/${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/professores/cadastro");
  };

  const formatarSalario = (salario: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salario);
  };

  const formatarData = (data: string) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const imprimirProfessores = () => {
    console.log(`🖨️ Gerando relatório para unidade ${user?.idUnidade}, total de professores:`, professores.length);
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
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório - Professores</title>
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
          .foto { 
            width: 40px; 
            height: 40px; 
            object-fit: cover;
            border-radius: 50%;
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
              <div class="titulo">Lista de Professores</div>
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
            <div class="info-item"><strong>Total de Professores:</strong> ${professores.length}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 50px;">Foto</th>
              <th>Nome do Professor</th>
              <th>CPF</th>
              <th>Admissão</th>
              <th>Coordenador</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${professores.map(professor => `
              <tr>
                <td style="text-align: center;">
                  ${professor.foto ? 
                    `<img src="${professor.foto}" alt="Foto" class="foto">` : 
                    '👤'
                  }
                </td>
                <td><strong>${professor.nome}</strong></td>
                <td>${professor.cpf || '-'}</td>
                <td>${formatarData(professor.dataAdmissao)}</td>
                <td>${professor.coordenador ? 'Sim' : 'Não'}</td>
                <td class="${professor.status === 1 ? 'status-ativo' : 'status-inativo'}">
                  ${professor.status === 1 ? 'Ativo' : 'Inativo'}
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

  const professoresFiltrados = professores.filter((professor) =>
    professor.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    professor.cpf.includes(pesquisa) ||
    professor.email.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" sx={{ mt: -2.125, mb: 1.75 }}>
        {t('professores.titulo') || 'Professores'}
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
        <TextField
            label={t('professores.pesquisarProfessor')}
          variant="outlined"
          size="small"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                buscarProfessores();
              }
            }}
            placeholder={t('professores.placeholderPesquisa')}
            sx={{ minWidth: 300 }}
        />
        <Button 
          variant="outlined" 
          startIcon={<SearchIcon />} 
            onClick={buscarProfessores}
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
                  carregarProfessores();
                }}
                sx={{ textTransform: 'none', height: 40 }}
              >
                {t('common.limpar')}
              </Button>
          )}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={() => imprimirProfessores()}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {t('professores.imprimir')}
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

      {/* Tabela de professores */}
      <Paper>
        <TableContainer>
          <Table>
          <TableHead>
              <TableRow sx={{ height: 40 }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('professores.foto')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('professores.nome')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('professores.cpf')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Admissão</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('professores.coordenador')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('professores.status')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('professores.acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {t('common.carregando') || 'Carregando...'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : professoresFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {pesquisa ? t('professores.nenhumProfessorEncontrado') : t('professores.nenhumProfessorCadastrado')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                professoresFiltrados.map((professor) => (
                  <TableRow key={professor.id} hover>
                    <TableCell>
                      <Avatar
                        src={professor.foto}
                        variant="circular"
                        sx={{ width: 40, height: 40 }}
                      >
                        {professor.foto ? null : <PersonIcon />}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {professor.nome}
                      </Typography>
                    </TableCell>
                    <TableCell>{professor.cpf || '-'}</TableCell>
                    <TableCell>{formatarData(professor.dataAdmissao)}</TableCell>
                <TableCell>
                  <Chip 
                        label={professor.coordenador ? t('professores.sim') : t('professores.nao')}
                        color={professor.coordenador ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                        label={professor.status === 1 ? t('professores.ativo') : t('professores.inativo')}
                        color={professor.status === 1 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title={t('common.editar') || 'Editar'}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditar(professor.id)}
                          >
                            <EditIcon />
                  </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.excluir') || 'Excluir'}>
                          <IconButton
                            size="small"
                            onClick={() => handleExcluir(professor.id)}
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