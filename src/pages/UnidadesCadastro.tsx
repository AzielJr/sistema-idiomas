import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  IconButton,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import { CloudUpload, ArrowBack, Search } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../contexts/AuthContextSimple";

interface Unidade {
  id?: number;
  razaoSocial: string;
  fantasia: string;
  cnpj: string;
  contato: string;
  celular_contato: string;
  celular: string;
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
  instancia: string;
  token: string;
}

const estadosBrasil = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function UnidadesCadastro() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchWithAuthSafe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagemPreview, setImagemPreview] = useState('');
  const [abaAtiva, setAbaAtiva] = useState(0);

  const [unidade, setUnidade] = useState<Unidade>({
    razaoSocial: '',
    fantasia: '',
    cnpj: '',
    contato: '',
    celular_contato: '',
    celular: '',
    logomarca: '',
    email: '',
    cep: '',
    endereco: '',
    numero: '',
    uf: 'SP',
    complemento: '',
    bairro: '',
    cidade: '',
    ativo: true,
    instancia: '',
    token: ''
  });

  const isEdicao = Boolean(id);

  useEffect(() => {
    if (isEdicao) {
      carregarUnidade();
    }
  }, [id]);

  const carregarUnidade = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/unidades/${id}`);
      if (response && response.ok) {
        const data = await response.json();
        setUnidade(data);
        if (data.logomarca) {
          setImagemPreview(converterByteArrayParaBase64(data.logomarca));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar unidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const converterByteArrayParaBase64 = (byteArray: string) => {
    if (!byteArray) return '';
    if (byteArray.startsWith('data:')) return byteArray;
    return `data:image/jpeg;base64,${byteArray}`;
  };

  const formatarCNPJ = (cnpj: string) => {
    const numeros = cnpj.replace(/\D/g, '');
    if (numeros.length <= 14) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
  };

  const formatarCelular = (celular: string) => {
    const numeros = celular.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return celular;
  };

  const formatarCEP = (cep: string) => {
    const numeros = cep.replace(/\D/g, '');
    if (numeros.length <= 8) {
      return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  };

  const validarCNPJ = (cnpj: string) => {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.length === 14;
  };

  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleImagemUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho do arquivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        alert('A imagem é muito grande. O tamanho máximo permitido é 5MB.');
        event.target.value = '';
        return;
      }
      
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Formato de imagem não suportado. Use: JPEG, PNG, GIF, BMP ou WebP.');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setImagemPreview(base64);
        setUnidade(prev => ({ ...prev, logomarca: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const consultarCNPJ = async (cnpj: string) => {
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    console.log('🔍 Consultando CNPJ:', cnpjNumeros);
    
    if (cnpjNumeros.length === 14) {
      try {
        setLoading(true);
        // Usar o endpoint do backend para consultar a Receita Federal
        const url = `http://localhost:8080/api/unidades/consultar-cnpj/${cnpjNumeros}`;
        console.log('🌐 URL da requisição (via backend):', url);
        
        const response = await fetchWithAuthSafe(url);
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 Dados recebidos:', data);
        
        if (data.message && data.message.includes('sucesso')) {
          // Preencher automaticamente os campos com os dados da Receita
          setUnidade(prev => ({
            ...prev,
            razaoSocial: data.nome || '',
            fantasia: data.fantasia || '',
            endereco: data.logradouro || '',
            numero: data.numero || '',
            cep: data.cep ? data.cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2') : '',
            uf: data.uf || '',
            bairro: data.bairro || '',
            cidade: data.municipio || '',
            complemento: data.complemento || '',
            email: data.email || '',
            contato: data.contato || ''
          }));
          
          alert('Dados da empresa carregados automaticamente!');
        } else {
          console.error('❌ Erro na consulta:', data);
          alert(data.error || 'CNPJ não encontrado ou erro na consulta.');
        }
      } catch (error) {
        console.error('❌ Erro detalhado ao consultar CNPJ:', error);
        
        if (error instanceof Error) {
          alert(`Erro ao consultar CNPJ: ${error.message}`);
        } else {
          alert('Erro ao consultar CNPJ. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      alert('Por favor, informe um CNPJ válido antes de consultar.');
    }
  };

  const buscarCEP = async (cep: string) => {
    const cepNumeros = cep.replace(/\D/g, '');
    if (cepNumeros.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setUnidade(prev => ({
            ...prev,
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            uf: data.uf || 'SP'
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const salvarUnidade = async () => {
    try {
      // Validar campos obrigatórios
      const camposObrigatorios = [];
      if (!unidade.razaoSocial) camposObrigatorios.push('Razão Social');
      if (!unidade.fantasia) camposObrigatorios.push('Nome Fantasia');
      if (!unidade.cnpj) camposObrigatorios.push('CNPJ');
      if (!unidade.email) camposObrigatorios.push('Email');
      
      if (camposObrigatorios.length > 0) {
        alert(`Por favor, preencha os seguintes campos obrigatórios: ${camposObrigatorios.join(', ')}.`);
        return;
      }

      if (!validarCNPJ(unidade.cnpj)) {
        alert('Por favor, informe um CNPJ válido.');
        return;
      }

      if (!validarEmail(unidade.email)) {
        alert('Por favor, informe um email válido.');
        return;
      }

      setLoading(true);

      const dadosUnidade = {
        ...unidade,
        logomarca: unidade.logomarca ? unidade.logomarca : null
      };

      const url = isEdicao 
        ? `http://localhost:8080/api/unidades/${id}`
        : 'http://localhost:8080/api/unidades';
      
      const method = isEdicao ? 'PUT' : 'POST';

      const response = await fetchWithAuthSafe(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosUnidade),
      });

      if (response && response.ok) {
        alert(isEdicao ? 'Unidade atualizada com sucesso!' : 'Unidade cadastrada com sucesso!');
        navigate('/administracao/unidade');
      } else {
        let errorMessage = 'Erro desconhecido';
        if (response) {
          if (response.status === 403) {
            errorMessage = 'Acesso negado. Verifique se você está logado.';
          } else if (response.status === 400) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || 'Dados inválidos';
            } catch {
              errorMessage = await response.text() || 'Dados inválidos';
            }
          } else {
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || await response.text() || `Erro ${response.status}`;
            } catch {
              errorMessage = await response.text() || `Erro ${response.status}`;
            }
          }
        }
        alert(`Erro ao salvar unidade: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      alert('Erro ao salvar unidade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
    navigate('/administracao/unidade');
  };

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Typography variant="h5" fontWeight="bold" mb={2} sx={{ mt: '-80px' }}>
        Unidades
      </Typography>

      {/* Abas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={abaAtiva} onChange={(e, newValue) => setAbaAtiva(newValue)}>
          <Tab label="Dados Cadastrais" />
          <Tab label="Configurações" />
        </Tabs>
      </Box>

      {/* Conteúdo da Aba Dados Cadastrais */}
      {abaAtiva === 0 && (
        <Stack spacing={2}>
          {/* Upload de Logomarca */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Logomarca
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 200,
                  height: 120,
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: imagemPreview ? `url(${imagemPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#f5f5f5',
                  mb: 2
                }}
              >
                {!imagemPreview && (
                  <CloudUpload sx={{ fontSize: 40, color: '#999' }} />
                )}
              </Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="logomarca-upload"
                type="file"
                onChange={handleImagemUpload}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <label htmlFor="logomarca-upload">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <CloudUpload />
                  </IconButton>
                </label>
                <Typography variant="caption" color="textSecondary">
                  Clique no ícone para selecionar uma imagem
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* CNPJ */}
          <TextField
            label="CNPJ"
            value={unidade.cnpj}
            onChange={(e) => {
              const cnpjFormatado = formatarCNPJ(e.target.value);
              setUnidade(prev => ({ ...prev, cnpj: cnpjFormatado }));
            }}
            required
            disabled={loading}
            placeholder="XX.XXX.XXX/XXXX-XX"
            inputProps={{ maxLength: 18 }}
            error={unidade.cnpj !== '' && !validarCNPJ(unidade.cnpj)}
            helperText={unidade.cnpj !== '' && !validarCNPJ(unidade.cnpj) ? 'CNPJ inválido' : ''}
            sx={{ width: '250px' }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Pesquisar Empresa" arrow placement="top">
                  <IconButton
                    onClick={() => consultarCNPJ(unidade.cnpj)}
                    disabled={!unidade.cnpj || loading || !validarCNPJ(unidade.cnpj)}
                    size="small"
                    sx={{ mr: -1 }}
                  >
                    <Search />
                  </IconButton>
                </Tooltip>
              )
            }}
          />

          {/* Razão Social */}
          <TextField
            label="Razão Social"
            value={unidade.razaoSocial}
            onChange={(e) => setUnidade(prev => ({ ...prev, razaoSocial: e.target.value }))}
            fullWidth
            required
            disabled={loading}
          />

          {/* Nome Fantasia */}
          <TextField
            label="Nome Fantasia"
            value={unidade.fantasia}
            onChange={(e) => setUnidade(prev => ({ ...prev, fantasia: e.target.value }))}
            fullWidth
            disabled={loading}
          />

          {/* Linha Contato e Celular do Contato */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box sx={{ width: { xs: '100%', md: '70%' } }}>
              <TextField
                label="Contato"
                value={unidade.contato}
                onChange={(e) => setUnidade(prev => ({ ...prev, contato: e.target.value }))}
                fullWidth
                disabled={loading}
                placeholder="Nome da pessoa de contato"
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '30%' } }}>
              <TextField
                label="Celular do Contato"
                value={unidade.celular_contato}
                onChange={(e) => {
                  const celularFormatado = formatarCelular(e.target.value);
                  setUnidade(prev => ({ ...prev, celular_contato: celularFormatado }));
                }}
                fullWidth
                disabled={loading}
                placeholder="(XX) XXXXX-XXXX"
                inputProps={{ maxLength: 15 }}
              />
            </Box>
          </Box>

          {/* Linha Email e Celular */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box sx={{ width: { xs: '100%', md: '70%' } }}>
              <TextField
                label="Email"
                type="email"
                value={unidade.email}
                onChange={(e) => setUnidade(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
                disabled={loading}
                required
                error={unidade.email !== '' && !validarEmail(unidade.email)}
                helperText={unidade.email !== '' && !validarEmail(unidade.email) ? 'Email inválido' : ''}
                placeholder="exemplo@empresa.com"
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '30%' } }}>
              <TextField
                label="Celular"
                value={unidade.celular || ''}
                onChange={(e) => {
                  const celularFormatado = formatarCelular(e.target.value);
                  setUnidade(prev => ({ ...prev, celular: celularFormatado }));
                }}
                fullWidth
                disabled={loading}
                placeholder="(XX) XXXXX-XXXX"
                inputProps={{ maxLength: 15 }}
              />
            </Box>
          </Box>

          {/* Divisão de Endereço */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Endereço
            </Typography>
            <Divider />
          </Box>

          {/* CEP */}
          <TextField
            label="CEP"
            value={unidade.cep}
            onChange={(e) => {
              const cepFormatado = formatarCEP(e.target.value);
              setUnidade(prev => ({ ...prev, cep: cepFormatado }));
            }}
            onBlur={(e) => buscarCEP(e.target.value)}
            disabled={loading}
            placeholder="XXXXX-XXX"
            inputProps={{ maxLength: 9 }}
            sx={{ width: '200px' }}
          />

          {/* Endereço */}
          <TextField
            label="Endereço"
            value={unidade.endereco}
            onChange={(e) => setUnidade(prev => ({ ...prev, endereco: e.target.value }))}
            fullWidth
            disabled={loading}
          />

          {/* Linha Número, Complemento e UF */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box sx={{ width: { xs: '100%', md: '25%' } }}>
              <TextField
                label="Número"
                value={unidade.numero}
                onChange={(e) => setUnidade(prev => ({ ...prev, numero: e.target.value }))}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '65%' } }}>
              <TextField
                label="Complemento"
                value={unidade.complemento}
                onChange={(e) => setUnidade(prev => ({ ...prev, complemento: e.target.value }))}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '10%' } }}>
              <TextField
                label="UF"
                value={unidade.uf}
                onChange={(e) => setUnidade(prev => ({ ...prev, uf: e.target.value }))}
                fullWidth
                disabled={loading}
              />
            </Box>
          </Box>

          {/* Linha Bairro e Cidade */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <TextField
                label="Bairro"
                value={unidade.bairro}
                onChange={(e) => setUnidade(prev => ({ ...prev, bairro: e.target.value }))}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <TextField
                label="Cidade"
                value={unidade.cidade}
                onChange={(e) => setUnidade(prev => ({ ...prev, cidade: e.target.value }))}
                fullWidth
                disabled={loading}
              />
            </Box>
          </Box>

          {/* Campo Ativo */}
          <FormControlLabel
            control={
              <Switch
                checked={unidade.ativo || false}
                onChange={(e) => setUnidade(prev => ({ ...prev, ativo: e.target.checked }))}
                color={unidade.ativo ? "primary" : "error"}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: unidade.ativo ? '#1976d2' : '#d32f2f',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: unidade.ativo ? '#1976d2' : '#d32f2f',
                  },
                  '& .MuiSwitch-switchBase': {
                    color: unidade.ativo ? '#1976d2' : '#d32f2f',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: unidade.ativo ? '#1976d2' : '#d32f2f',
                  }
                }}
              />
            }
            label={unidade.ativo ? 'Unidade Ativa' : 'Unidade Inativa'}
          />
        </Stack>
      )}

      {/* Conteúdo da Aba Configurações */}
      {abaAtiva === 1 && (
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            Configurações da Unidade
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {/* Linha Instância Whatsapp e Token Whatsapp */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <TextField
                label="Instância Whatsapp"
                value={unidade.instancia}
                onChange={(e) => setUnidade(prev => ({ ...prev, instancia: e.target.value }))}
                fullWidth
                disabled={loading}
                placeholder="Nome da instância"
                inputProps={{ maxLength: 60 }}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <TextField
                label="Token Whatsapp"
                value={unidade.token}
                onChange={(e) => setUnidade(prev => ({ ...prev, token: e.target.value }))}
                fullWidth
                disabled={loading}
                placeholder="Token de acesso"
                inputProps={{ maxLength: 60 }}
              />
            </Box>
          </Box>
        </Stack>
      )}

      {/* Botões de Ação (sempre visíveis) */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={cancelar}
          disabled={loading}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          onClick={salvarUnidade}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Salvar')}
        </Button>
      </Box>
    </Box>
  );
}