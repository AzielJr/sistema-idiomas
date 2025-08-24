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
  Person as PersonIcon,
  Print as PrintIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useAuth } from "../contexts/AuthContextSimple";

interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  nivelEnsino: string;
  idMaterialDidatico: number;
  filiacaoPai: string;
  filiacaoMae: string;
  responsavel: string;
  responsavelCelular: string;
  emergenciaLigarPara: string;
  emergenciaLevarPara: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  celular: string;
  email: string;
  foto?: string;
  vlrMensalidade: number | null;
  status: number;
  idUnidade: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

export default function Alunos() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, fetchWithAuthSafe, refreshUserData } = useAuth();

  const [pesquisa, setPesquisa] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logomarcaUnidade, setLogomarcaUnidade] = useState<string>("");
  const [fantasiaUnidade, setFantasiaUnidade] = useState<string>("");
  const [materiaisDidaticos, setMateriaisDidaticos] = useState<Array<{id: number, nome: string}>>([]);

  useEffect(() => {
    if (user?.idUnidade) {
      carregarAlunos();
      carregarLogomarcaUnidade();
      carregarMateriaisDidaticos();
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

  const carregarMateriaisDidaticos = async () => {
    if (!user?.idUnidade) return;
    
    try {
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/material-didatico/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        setMateriaisDidaticos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar materiais didáticos:', error);
    }
  };

  const carregarAlunos = async () => {
    if (!user?.idUnidade) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/alunos/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`👥 Alunos carregados para unidade ${user.idUnidade}:`, data.length, 'registros');
        setAlunos(data);
      } else {
        throw new Error('Erro ao carregar alunos');
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setError('Erro ao carregar alunos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const buscarAlunos = async () => {
    if (!user?.idUnidade) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const url = pesquisa.trim() 
        ? `/api/alunos/unidade/${user.idUnidade}/busca?termo=${encodeURIComponent(pesquisa.trim())}`
        : `/api/alunos/unidade/${user.idUnidade}`;
      
      const response = await fetchWithAuthSafe(`http://localhost:8080${url}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`🔍 Busca realizada para unidade ${user.idUnidade}, termo: "${pesquisa.trim() || 'todos'}", encontrados:`, data.length, 'registros');
        setAlunos(data);
      } else {
        throw new Error('Erro ao buscar alunos');
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setError('Erro ao buscar alunos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!user?.idUnidade) return;
    
    if (!window.confirm(t('alunos.confirmarExclusao'))) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/alunos/${id}/unidade/${user.idUnidade}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAlunos(prev => prev.filter(aluno => aluno.id !== id));
      } else {
        throw new Error('Erro ao excluir aluno');
      }
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      alert('Erro ao excluir aluno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/alunos/cadastro/${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/alunos/cadastro");
  };

  const handlePesquisar = () => {
    buscarAlunos();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      buscarAlunos();
    }
  };

  const imprimirAlunos = () => {
    console.log(`🖨️ Gerando relatório para unidade ${user?.idUnidade}, total de alunos:`, alunos.length);
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

  // Função para obter o nome do material didático
  const getNomeMaterialDidatico = (idMaterial: number) => {
    if (!idMaterial) return '-';
    // Buscar o nome do material no array de materiais didáticos
    const material = materiaisDidaticos.find(m => m.id === idMaterial);
    return material ? material.nome : `Material ${idMaterial}`;
  };

  const gerarHTMLImpressao = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Função para obter o nome do material didático
    const getNomeMaterialDidatico = (idMaterial: number) => {
      if (!idMaterial) return '-';
      // Buscar o nome do material no array de materiais didáticos
      const material = materiaisDidaticos.find(m => m.id === idMaterial);
      return material ? material.nome : `Material ${idMaterial}`;
    };
    
    // Obter traduções para o idioma atual
    const currentLang = i18n.language || 'pt';
    const translations = {
      pt: {
        foto: 'Foto',
        nome: 'Nome do Aluno',
        nivel: 'Nível',
        cpf: 'CPF',
        email: 'Email',
        celular: 'Celular',
        mensalidade: 'Mensalidade',
        status: 'Status',
        ativo: 'Ativo',
        inativo: 'Inativo',
        imprimir: 'Imprimir',
        listaAlunos: 'Lista de Alunos',
        sistemaGestao: 'Sistema de Gestão para Escolas de Idiomas',
        data: 'Data',
        hora: 'Hora',
        usuario: 'Usuário',
        totalAlunos: 'Total de Alunos',
        relatorioGerado: 'Relatório gerado automaticamente pelo sistema',
        copyright: '© {{ano}} - Sistema customidiomas.com.br'
      },
      en: {
        foto: 'Photo',
        nome: 'Student Name',
        nivel: 'Level',
        cpf: 'CPF',
        email: 'Email',
        celular: 'Mobile',
        mensalidade: 'Monthly Fee',
        status: 'Status',
        ativo: 'Active',
        inativo: 'Inactive',
        imprimir: 'Print',
        listaAlunos: 'Student List',
        sistemaGestao: 'School Management System for Language Schools',
        data: 'Date',
        hora: 'Time',
        usuario: 'User',
        totalAlunos: 'Total Students',
        relatorioGerado: 'Report automatically generated by the system',
        copyright: '© {{ano}} - customidiomas.com.br System'
      },
      es: {
        foto: 'Foto',
        nome: 'Nombre del Estudiante',
        nivel: 'Nivel',
        cpf: 'CPF',
        email: 'Email',
        celular: 'Móvil',
        mensalidade: 'Cuota Mensual',
        status: 'Estado',
        ativo: 'Activo',
        inativo: 'Inactivo',
        imprimir: 'Imprimir',
        listaAlunos: 'Lista de Estudiantes',
        sistemaGestao: 'Sistema de Gestión para Escuelas de Idiomas',
        data: 'Fecha',
        hora: 'Hora',
        usuario: 'Usuario',
        totalAlunos: 'Total de Estudiantes',
        relatorioGerado: 'Reporte generado automáticamente por el sistema',
        copyright: '© {{ano}} - Sistema customidiomas.com.br'
      }
    };
    
    const currentTranslations = translations[currentLang as keyof typeof translations] || translations.pt;
    
    return `
      <!DOCTYPE html>
      <html lang="${i18n.language || 'pt'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório - Alunos</title>
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
        <button class="print-button" onclick="window.print()">🖨️ ${currentTranslations.imprimir}</button>
        
        <div class="header">
          <div class="header-content">
            <div class="header-left">
              ${logomarcaUnidade ? `<img src="${logomarcaUnidade}" alt="Logomarca" class="logo" onerror="this.style.display='none'">` : ''}
            </div>
            <div class="header-right">
              <div class="nome-unidade">${fantasiaUnidade || `Unidade ${user?.idUnidade || ''}`}</div>
              <div class="titulo">${currentTranslations.listaAlunos}</div>
              <div class="subtitulo">${currentTranslations.sistemaGestao}</div>
            </div>
          </div>
        </div>
        
        <div class="info-relatorio">
          <div class="info-row">
            <div class="info-item"><strong>${currentTranslations.data}:</strong> ${dataAtual}</div>
            <div class="info-item"><strong>${currentTranslations.hora}:</strong> ${horaAtual}</div>
            <div class="info-item"><strong>${currentTranslations.usuario}:</strong> ${user?.name || 'N/A'}</div>
            <div class="info-item"><strong>IP:</strong> ${getClientIP()}</div>
            <div class="info-item"><strong>${currentTranslations.totalAlunos}:</strong> ${alunos.length}</div>
          </div>
        </div>
        
                 <table>
           <thead>
             <tr>
                               <th style="width: 50px;">${currentTranslations.foto}</th>
                <th>${currentTranslations.nome}</th>
                <th>${currentTranslations.nivel}</th>
                 <th>${currentTranslations.cpf}</th>
                 <th>${currentTranslations.email}</th>
                 <th>${currentTranslations.celular}</th>
                 <th style="text-align: right;">${currentTranslations.mensalidade}</th>
                 <th>${currentTranslations.status}</th>
             </tr>
           </thead>
          <tbody>
                         ${alunos.map(aluno => `
               <tr>
                 <td style="text-align: center;">
                   ${aluno.foto ? 
                     `<img src="${aluno.foto}" alt="Foto" class="foto">` : 
                     '👤'
                   }
                 </td>
                                   <td><strong>${aluno.nome}</strong></td>
                                   <td>${aluno.nivelEnsino || '-'}</td>
                  <td>${aluno.cpf || '-'}</td>
                  <td>${aluno.email || '-'}</td>
                  <td>${aluno.celular || '-'}</td>
                  <td style="text-align: right;">R$ ${aluno.vlrMensalidade ? aluno.vlrMensalidade.toFixed(2) : '0,00'}</td>
                  <td class="${aluno.status === 1 ? 'status-ativo' : 'status-inativo'}">
                   ${aluno.status === 1 ? currentTranslations.ativo : currentTranslations.inativo}
                 </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>${currentTranslations.relatorioGerado}</p>
          <p>${currentTranslations.copyright.replace('{{ano}}', new Date().getFullYear().toString())}</p>
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
      <Typography variant="h5" fontWeight="bold" sx={{ mt: -2.125, mb: 1.75 }}>{t('alunos.titulo')}</Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            label={t('alunos.pesquisarAluno')}
            variant="outlined"
            size="small"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('alunos.placeholderPesquisa')}
            sx={{ minWidth: 300 }}
          />
          <Button 
            variant="outlined" 
            startIcon={<SearchIcon />} 
            onClick={handlePesquisar}
            disabled={loading}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {t('alunos.pesquisar')}
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />} 
            onClick={() => imprimirAlunos()}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {t('alunos.imprimir')}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleCadastrar}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {t('alunos.cadastrar')}
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
              <TableCell sx={{ fontWeight: 'bold' }}>{t('alunos.foto')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('alunos.nome')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('alunos.nivelEnsino')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('alunos.celular')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('alunos.mensalidade')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('alunos.status')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('alunos.acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('alunos.carregando')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : alunos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('alunos.nenhumAlunoCadastrado', { unidade: fantasiaUnidade || 'atual' })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              alunos.map((aluno) => (
                                 <TableRow key={aluno.id} hover>
                   <TableCell>
                     <Avatar
                       src={aluno.foto}
                       variant="circular"
                       sx={{ width: 40, height: 40 }}
                     >
                       {aluno.foto ? null : <PersonIcon />}
                     </Avatar>
                   </TableCell>
                                       <TableCell>
                     <Typography variant="body2" fontWeight="bold">
                       {aluno.nome}
                     </Typography>
                   </TableCell>
                  <TableCell>{aluno.nivelEnsino || '-'}</TableCell>
                  <TableCell>{aluno.celular || '-'}</TableCell>
                                     <TableCell>
                     <Typography variant="body2" fontWeight="medium">
                       R$ {aluno.vlrMensalidade ? aluno.vlrMensalidade.toFixed(2) : '0,00'}
                     </Typography>
                   </TableCell>
                  <TableCell>
                    <Chip
                      label={aluno.status === 1 ? t('alunos.ativo') : t('alunos.inativo')}
                      color={aluno.status === 1 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title={t('alunos.editarAluno')}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditar(aluno.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('alunos.excluir')}>
                        <IconButton
                          size="small"
                          onClick={() => handleExcluir(aluno.id)}
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
