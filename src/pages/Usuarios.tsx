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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  Phone as PhoneIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as CloudUploadIcon,
  Print as PrintIcon,
  WhatsApp as WhatsAppIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextSimple";
import PageHeader from "../components/PageHeader";
import { useTranslation } from 'react-i18next';

interface Usuario {
  id: number;
  userName: string;
  email: string;
  senha?: string;
  celular: string;
  foto?: string;
  idNivelAcesso: number;
  idUnidade?: number;
  ativo: boolean;
  ultimoLogin?: string;
  role?: string;
  nivelAcesso?: {
    id: number;
    grupo: string;
    detalhes?: string;
    nivelAcesso?: string;
    ativo: boolean;
  };
  unidade?: {
    id: number;
    razaoSocial: string;
    fantasia: string;
    instancia?: string;
    token?: string;
  };
}

export default function Usuarios() {
  const { t } = useTranslation();
  const { fetchWithAuthSafe, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [niveisAcesso, setNiveisAcesso] = useState<{id: number, grupo: string, detalhes?: string, nivelAcesso?: string, ativo: boolean}[]>([]);
  const [unidades, setUnidades] = useState<{id: number, razaoSocial: string, fantasia: string, instancia?: string, token?: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [novoUsuario, setNovoUsuario] = useState<Partial<Usuario>>({
    userName: '',
    email: '',
    senha: '',
    celular: '',
    foto: '',
    idNivelAcesso: undefined,
    idUnidade: undefined,
    ativo: true
  });
  const [imagemPreview, setImagemPreview] = useState<string>('');

  // Carregar dados da API
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Verificar se há token antes de fazer requisições
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        console.log('Iniciando carregamento de dados da API...');
        
        // Fazer requisição para usuários
        console.log('Fazendo requisição para /api/usuarios');
        const usuariosResponse = await fetchWithAuthSafe('http://localhost:8080/api/usuarios');
        console.log('Resposta usuários:', usuariosResponse.status, usuariosResponse.statusText);
        
        // Fazer requisição para níveis de acesso
        console.log('Fazendo requisição para /api/nivel-acesso');
        const niveisResponse = await fetchWithAuthSafe('http://localhost:8080/api/nivel-acesso');
        console.log('Resposta níveis:', niveisResponse.status, niveisResponse.statusText);
        
        // Fazer requisição para unidades
        console.log('Fazendo requisição para /api/unidades');
        const unidadesResponse = await fetchWithAuthSafe('http://localhost:8080/api/unidades');
        console.log('Resposta unidades:', unidadesResponse.status, unidadesResponse.statusText);
        
        if (usuariosResponse.ok && niveisResponse.ok && unidadesResponse.ok) {
          const usuariosData = await usuariosResponse.json();
          const niveisData = await niveisResponse.json();
          const unidadesData = await unidadesResponse.json();
          
          console.log('Dados de usuários recebidos:', usuariosData);
          console.log('Dados de níveis recebidos:', niveisData);
          console.log('Dados de unidades recebidos:', unidadesData);
          
          // Verificar se as unidades têm os campos instancia e token
          if (unidadesData.length > 0) {
            const primeiraUnidade = unidadesData[0];
            console.log('🔍 Primeira unidade (verificar campos):', {
              id: primeiraUnidade.id,
              fantasia: primeiraUnidade.fantasia,
              temInstancia: !!primeiraUnidade.instancia,
              temToken: !!primeiraUnidade.token,
              instancia: primeiraUnidade.instancia,
              token: primeiraUnidade.token ? '***' : 'NÃO TEM'
            });
          }
          
          // Verificar se os dados são válidos
          if (Array.isArray(usuariosData) && Array.isArray(niveisData) && Array.isArray(unidadesData)) {
            setUsuarios(usuariosData);
            setNiveisAcesso(niveisData.filter(nivel => nivel.ativo));
            setUnidades(unidadesData);
            console.log('Dados reais carregados com sucesso!');
          } else {
            throw new Error('Dados da API não estão no formato esperado');
          }
        } else {
          throw new Error(`Erro nas requisições da API - Usuários: ${usuariosResponse.status}, Níveis: ${niveisResponse.status}`);
        }
      } catch (apiError) {
        console.error('Erro ao carregar dados da API:', apiError);
        // Não carregar dados simulados - mostrar erro real
        setUsuarios([]);
        setNiveisAcesso([]);
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  // Função para converter byte array para Base64
  const converterByteArrayParaBase64 = (foto: string | null | undefined): string => {
    if (!foto) return '';
    
    // Se já é uma string Base64 válida, retorna como está
    if (foto.startsWith('data:image/')) {
      return foto;
    }
    
    // Se é um array de bytes (string de números separados por vírgula), converte para Base64
    if (foto.includes(',') && /^[0-9,\s-]+$/.test(foto)) {
      try {
        const byteArray = foto.split(',').map(num => parseInt(num.trim()));
        const uint8Array = new Uint8Array(byteArray);
        const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
        const base64 = btoa(binaryString);
        return `data:image/jpeg;base64,${base64}`;
      } catch (error) {
        console.error('Erro ao converter byte array para Base64:', error);
        return '';
      }
    }
    
    // Se é uma string Base64 sem o prefixo, adiciona o prefixo
    if (/^[A-Za-z0-9+/]+=*$/.test(foto)) {
      return `data:image/jpeg;base64,${foto}`;
    }
    
    return foto;
  };

  const abrirDialog = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      const fotoConvertida = converterByteArrayParaBase64(usuario.foto);
      setImagemPreview(fotoConvertida);
      // Atualiza o novoUsuario com todos os dados do usuário, incluindo a foto convertida
      setNovoUsuario({
        ...usuario,
        foto: fotoConvertida
      });
    } else {
      setUsuarioEditando(null);
      const primeiroNivel = niveisAcesso.length > 0 ? niveisAcesso[0] : null;
      setNovoUsuario({
        userName: '',
        email: '',
        senha: '',
        celular: '',
        foto: '',
        idNivelAcesso: primeiroNivel ? primeiroNivel.id : undefined,
        idUnidade: undefined,
        ativo: true
      });
      setImagemPreview('');
    }
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setUsuarioEditando(null);
    setNovoUsuario({
      userName: '',
      email: '',
      senha: '',
      celular: '',
      foto: '',
      idNivelAcesso: undefined,
      idUnidade: undefined,
      ativo: true
    });
    setImagemPreview('');
  };

  // Função para formatar celular
  const formatarCelular = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 11) {
      return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return valor;
  };

  // Função para lidar com upload de imagem
  const handleImagemUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho do arquivo (máximo 1MB)
      const maxSize = 1 * 1024 * 1024; // 1MB em bytes
      if (file.size > maxSize) {
        alert('A imagem é muito grande. O tamanho máximo permitido é 1MB.');
        event.target.value = ''; // Limpar o input
        return;
      }
      
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Formato de imagem não suportado. Use: JPEG ou PNG.');
        event.target.value = ''; // Limpar o input
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setImagemPreview(base64);
        setNovoUsuario(prev => ({ ...prev, foto: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para buscar foto do WhatsApp
  const buscarFotoWhatsApp = async () => {
    try {
      if (!novoUsuario.celular || !novoUsuario.idUnidade) {
        alert('Por favor, preencha o celular e selecione uma unidade primeiro.');
        return;
      }

      // Buscar dados da unidade para obter instancia e token
      const unidade = unidades.find(u => u.id === novoUsuario.idUnidade);
      if (!unidade) {
        alert('Unidade não encontrada.');
        return;
      }

      // Verificar se a unidade tem instancia e token configurados
      if (!unidade.instancia || !unidade.token) {
        alert('Esta unidade não tem instancia e token do WhatsApp configurados. Configure na tela de Unidades > Configurações.');
        return;
      }

      // Formatar número para padrão W-API (igual ao JavaFX)
      const formatarNumeroParaWAPI = (telefone: string) => {
        if (!telefone || telefone.trim() === '') {
          return null;
        }

        // Remove todos os caracteres não numéricos
        let numeroLimpo = telefone.replace(/\D/g, '');

        // Remove códigos de país se presentes
        if (numeroLimpo.startsWith('55') && numeroLimpo.length > 11) {
          numeroLimpo = numeroLimpo.substring(2);
        }

        // Verificar se o número tem tamanho válido (10 ou 11 dígitos)
        if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
          return null;
        }

        // Adicionar código do país (Brasil = 55)
        return '55' + numeroLimpo;
      };

      const numeroFormatado = formatarNumeroParaWAPI(novoUsuario.celular);
      if (!numeroFormatado) {
        alert('Formato de número inválido! Use: (11) 98765-4321');
        return;
      }

      console.log('🔍 Buscando foto do WhatsApp:', {
        instanceId: unidade.instancia,
        phoneNumber: numeroFormatado,
        token: unidade.token ? '***' : 'NÃO CONFIGURADO'
      });

      console.log('🔑 Token completo (para debug):', unidade.token);
      console.log('📱 URL da requisição:', `https://api.w-api.app/v1/contacts/profile-picture?instanceId=${unidade.instancia}&phoneNumber=${numeroFormatado}`);

      // Fazer requisição para a API do WhatsApp usando fetch direto
      console.log('🌐 Fazendo requisição para API WhatsApp...');
      
      const response = await fetch(`https://api.w-api.app/v1/contacts/profile-picture?instanceId=${unidade.instancia}&phoneNumber=${numeroFormatado}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${unidade.token}`
        }
      });

      console.log('📡 Headers da requisição:', {
        'Authorization': `Bearer ${unidade.token ? '***' : 'NÃO TEM'}`,
        'Accept': 'application/json'
      });

      console.log('📡 Resposta da API WhatsApp:', response.status, response.statusText);

      if (response.ok) {
        const resultado = await response.json();
        console.log('📱 Resultado da API:', resultado);
        
        // A API retorna a URL no campo "link" (igual ao JavaFX)
        if (resultado.link && !resultado.link.isNull) {
          console.log('✅ Foto encontrada: ' + resultado.link);
          
          // Baixar a imagem da URL retornada
          try {
            const imagemResponse = await fetch(resultado.link);
            if (imagemResponse.ok) {
              const blob = await imagemResponse.blob();
              const reader = new FileReader();
              reader.onload = (e) => {
                const fotoBase64 = e.target?.result as string;
                setImagemPreview(fotoBase64);
                setNovoUsuario(prev => ({ ...prev, foto: fotoBase64 }));
                alert('Foto do WhatsApp carregada com sucesso!');
              };
              reader.readAsDataURL(blob);
            } else {
              alert('Erro ao baixar a imagem do WhatsApp.');
            }
          } catch (error) {
            console.error('❌ Erro ao baixar imagem:', error);
            alert('Erro ao baixar a imagem do WhatsApp.');
          }
        } else {
          alert('Nenhuma foto encontrada para este número no WhatsApp.');
        }
      } else {
        // Tratamento de erro igual ao JavaFX
        let mensagemErro = '';
        if (response.status === 401) {
          mensagemErro = 'Token inválido ou expirado - Verifique configuração';
        } else if (response.status === 400) {
          mensagemErro = 'Instância não encontrada ou inválida - Verifique configuração';
        } else if (response.status === 500) {
          mensagemErro = 'Erro interno da API - usuário pode ter bloqueado a captura da foto';
        } else {
          const errorText = await response.text();
          mensagemErro = `Erro HTTP ${response.status}: ${errorText}`;
        }
        
        console.error('❌ Erro na resposta:', response.status, mensagemErro);
        alert(`Erro ao buscar foto do WhatsApp: ${mensagemErro}`);
      }
    } catch (error) {
      console.error('💥 Erro ao buscar foto do WhatsApp:', error);
      alert('Erro ao buscar foto do WhatsApp. Verifique o console para mais detalhes.');
    }
  };

  const salvarUsuario = async () => {
    try {
      console.log('=== INÍCIO DO SALVAMENTO ===');
      console.log('Estado novoUsuario:', novoUsuario);
      console.log('usuarioEditando:', usuarioEditando);
      
      // Validar campos obrigatórios
      if (!novoUsuario.userName || !novoUsuario.email) {
        alert('Por favor, preencha todos os campos obrigatórios (Nome e Email).');
        return;
      }
      
      if (!usuarioEditando && !novoUsuario.senha) {
        alert('Por favor, informe uma senha para o novo usuário.');
        return;
      }
      
      if (!novoUsuario.idNivelAcesso) {
        alert('Por favor, selecione um nível de acesso para o usuário.');
        return;
      }
      
      // Preparar dados completos do usuário incluindo todos os campos
      const dadosUsuario = {
        userName: novoUsuario.userName,
        email: novoUsuario.email,
        senha: novoUsuario.senha,
        celular: novoUsuario.celular,
        foto: novoUsuario.foto || null,
        idNivelAcesso: novoUsuario.idNivelAcesso,
        idUnidade: novoUsuario.idUnidade,
        ativo: novoUsuario.ativo
      };

      console.log('Dados sendo enviados:', dadosUsuario);
      console.log('Foto presente:', !!dadosUsuario.foto);
      console.log('Tamanho da foto:', dadosUsuario.foto ? dadosUsuario.foto.length : 0);
      console.log('Tipo da foto:', typeof dadosUsuario.foto);

      if (usuarioEditando) {
        // Editar usuário existente
        console.log('=== EDITANDO USUÁRIO ===');
        console.log('ID do usuário:', usuarioEditando.id);
        console.log('URL da requisição:', `http://localhost:8080/api/usuarios/${usuarioEditando.id}`);
        
        const response = await fetchWithAuthSafe(`http://localhost:8080/api/usuarios/${usuarioEditando.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosUsuario),
        });
        
        console.log('Resposta recebida (PUT):', response);
        console.log('Status da resposta:', response?.status);
        console.log('Response OK:', response?.ok);
        
        if (response && response.ok) {
          const resultado = await response.json();
          console.log('Resposta do servidor (PUT):', resultado);
          console.log('=== SALVAMENTO CONCLUÍDO COM SUCESSO ===');
          
          // Verificar se é o usuário logado sendo editado
          if (usuarioEditando.id === user?.id) {
            console.log('🔄 Atualizando contexto do usuário logado...');
            updateUser({
              name: dadosUsuario.userName,
              foto: dadosUsuario.foto || undefined
            });
          }
          
          await carregarDados();
          fecharDialog();
        } else {
          console.error('Erro na resposta PUT:', response?.status, response?.statusText);
          if (response) {
            const errorText = await response.text();
            console.error('Detalhes do erro:', errorText);
            alert(`Erro ao salvar usuário: ${response.status} - ${errorText}`);
          }
        }
      } else {
        // Criar novo usuário
        console.log('=== CRIANDO NOVO USUÁRIO ===');
        console.log('URL da requisição:', 'http://localhost:8080/api/usuarios');
        
        const response = await fetchWithAuthSafe('http://localhost:8080/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosUsuario),
        });
        
        console.log('Resposta recebida (POST):', response);
        console.log('Status da resposta:', response?.status);
        console.log('Response OK:', response?.ok);
        
        if (response && response.ok) {
          const resultado = await response.json();
          console.log('Resposta do servidor (POST):', resultado);
          console.log('=== SALVAMENTO CONCLUÍDO COM SUCESSO ===');
          await carregarDados();
          fecharDialog();
        } else {
          console.error('Erro na resposta POST:', response?.status, response?.statusText);
          if (response) {
            const errorText = await response.text();
            console.error('Detalhes do erro:', errorText);
            alert(`Erro ao criar usuário: ${response.status} - ${errorText}`);
          }
        }
      }
    } catch (error) {
      console.error('=== ERRO CAPTURADO NO CATCH ===');
      console.error('Erro ao salvar usuário:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      alert(`Erro inesperado ao salvar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const excluirUsuario = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const response = await fetchWithAuthSafe(`http://localhost:8080/api/usuarios/${id}`, {
          method: 'DELETE',
        });
        
        if (response && response.ok) {
          await carregarDados();
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    }
  };

  const gerarRelatorio = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    const nomeUsuario = user?.email || 'Admin';
    const ipMaquina = window.location.hostname || 'localhost';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório - Usuários</title>
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
            padding: 6px 12px;
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
          <h1>Relatório - Usuários</h1>
        </div>
        
        <div class="info">
          <div class="info-item"><strong>Usuário:</strong> ${nomeUsuario}</div>
          <div class="info-item"><strong>IP:</strong> ${ipMaquina}</div>
          <div class="info-item"><strong>Data:</strong> ${dataAtual}</div>
          <div class="info-item"><strong>Hora:</strong> ${horaAtual}</div>
          <div class="info-item"><strong>Total de registros:</strong> ${usuarios.length}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Celular</th>
              <th>Nível de Acesso</th>
              <th>Unidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${usuarios.map(usuario => {
              const fotoSrc = usuario.foto ? 
                (usuario.foto.startsWith('data:') ? usuario.foto : `data:image/jpeg;base64,${usuario.foto}`) : 
                '';
              return `
                <tr>
                  <td>${usuario.id}</td>
                  <td style="display: flex; align-items: center; gap: 8px;">
                    ${fotoSrc ? 
                      `<img src="${fotoSrc}" alt="Foto" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;">` : 
                      `<div style="width: 32px; height: 32px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; font-size: 14px; color: #666;">👤</div>`
                    }
                    <span>${usuario.userName}</span>
                  </td>
                  <td>${usuario.email}</td>
                  <td>${usuario.celular}</td>
                  <td>${getNivelAcessoNome(usuario.idNivelAcesso, usuario.nivelAcesso)}</td>
                  <td>${getUnidadeNome(usuario.idUnidade, usuario.unidade)}</td>
                  <td class="${usuario.ativo ? 'status-ativo' : 'status-inativo'}">
                    ${usuario.ativo ? 'Ativo' : 'Inativo'}
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

  const getNivelAcessoNome = (idNivelAcesso: number, usuarioNivelAcesso?: { grupo: string }) => {
    // Primeiro tenta usar o nível de acesso do próprio usuário (se vier da API)
    if (usuarioNivelAcesso?.grupo) {
      return usuarioNivelAcesso.grupo;
    }
    // Caso contrário, busca no array de níveis de acesso
    const nivel = niveisAcesso.find(n => n.id === idNivelAcesso);
    return nivel ? nivel.grupo : 'Desconhecido';
  };
  
  const getUnidadeNome = (idUnidade?: number, usuarioUnidade?: { razaoSocial: string, fantasia: string }) => {
    // Primeiro tenta usar a unidade do próprio usuário (se vier da API)
    if (usuarioUnidade?.fantasia) {
      return usuarioUnidade.fantasia;
    }
    if (usuarioUnidade?.razaoSocial) {
      return usuarioUnidade.razaoSocial;
    }
    // Caso contrário, busca no array de unidades
    if (idUnidade) {
      const unidade = unidades.find(u => u.id === idUnidade);
      return unidade ? (unidade.fantasia || unidade.razaoSocial) : 'Desconhecida';
    }
    return 'Não definida';
  };

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'success' : 'error';
  };

  const getStatusLabel = (ativo: boolean) => {
    return ativo ? 'Ativo' : 'Inativo';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>{t('usuarios.carregandoUsuarios')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0.5 }}>
      <PageHeader 
        title={t('usuarios.titulo')} 
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
                  {usuarios.length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                  {t('usuarios.total')}
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
                  {usuarios.filter(u => u.ativo).length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                  {t('usuarios.ativos')}
                </Typography>
              </Box>
            </Box>
        }
      />

      {/* Botões */}
      <Box sx={{ mb: 3, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={gerarRelatorio}
          size="large"
        >
          {t('usuarios.imprimir')}
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirDialog()}
          size="large"
          sx={{ backgroundColor: '#1565c0', '&:hover': { backgroundColor: '#0d47a1' } }}
        >
          {t('usuarios.cadastrar')}
        </Button>
      </Box>

      {/* Tabela de Usuários */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>{t('usuarios.id')}</strong></TableCell>
              <TableCell><strong>{t('usuarios.nome')}</strong></TableCell>
              <TableCell><strong>{t('usuarios.celular')}</strong></TableCell>
              <TableCell><strong>{t('usuarios.nivelAcesso')}</strong></TableCell>
              <TableCell><strong>Unidade</strong></TableCell>
              <TableCell><strong>{t('usuarios.status')}</strong></TableCell>
              <TableCell align="center"><strong>{t('usuarios.acoes')}</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    {loading ? t('usuarios.carregandoUsuarios') : t('usuarios.nenhumUsuarioEncontrado')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id} hover sx={{ '& td': { py: 1.125 } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {usuario.id}
                    </Typography>
                  </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {usuario.foto ? (
                      <Avatar
                        src={converterByteArrayParaBase64(usuario.foto)}
                        alt={usuario.userName}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          '& img': {
                            objectFit: 'cover'
                          }
                        }}
                      />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                    <Typography variant="body2" fontWeight="medium">
                      {usuario.userName}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" fontFamily="monospace">
                      {usuario.celular}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getNivelAcessoNome(usuario.idNivelAcesso, usuario.nivelAcesso)}
                    size="small"
                    sx={{ 
                      backgroundColor: '#2196f3',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getUnidadeNome(usuario.idUnidade, usuario.unidade)}
                    size="small"
                    sx={{ 
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(usuario.ativo)}
                    color={getStatusColor(usuario.ativo)}
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    onClick={() => abrirDialog(usuario)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => excluirUsuario(usuario.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              ))
            )}
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

      {/* Dialog para Adicionar/Editar Usuário */}
      <Dialog open={dialogAberto} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        
        {/* Linha divisória cinza */}
        <Divider sx={{ mx: 3, mb: 2 }} />
        
        <DialogContent sx={{ pt: 0, height: 'calc(100% + 40px)' }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            {/* Lado Esquerdo - Formulário */}
            <Box sx={{ flex: 1, pr: { xs: 0, md: 3 }, mt: -4.375 }}>
              {/* 1ª Linha: Nome do Usuário */}
                <TextField
                 label="Nome do Usuário"
                 value={novoUsuario.userName || ''}
                 onChange={(e) => setNovoUsuario(prev => ({ ...prev, userName: e.target.value }))}
                 required
                 fullWidth
                 sx={{ mb: 2, mt: 5.375 }}
               />
               
               {/* 2ª Linha: Email */}
               <TextField
                 label={t('usuarios.email')}
                 type="email"
                 value={novoUsuario.email || ''}
                 onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                 required
                 fullWidth
                 sx={{ mb: 2 }}
               />
               
               {/* 3ª Linha: Senha e Celular (50% cada) */}
               <Box sx={{ 
                 display: 'flex', 
                 gap: 2, 
                 mb: 2,
                 flexDirection: { xs: 'column', md: 'row' }
               }}>
                 <Box sx={{ width: { xs: '100%', md: '50%' } }}>
               <TextField
                 label={t('usuarios.senha')}
                 type="password"
                 value={novoUsuario.senha || ''}
                 onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                 required={!usuarioEditando}
                 fullWidth
                   />
                 </Box>
                 <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                 <TextField
                   label={t('usuarios.celular')}
                   value={novoUsuario.celular || ''}
                   onChange={(e) => {
                     const valorFormatado = formatarCelular(e.target.value);
                     setNovoUsuario(prev => ({ ...prev, celular: valorFormatado }));
                   }}
                   placeholder="(11) 99999-9999"
                     fullWidth
                     InputProps={{
                       endAdornment: (
                         <Tooltip title="Buscar foto no Whatsapp">
                           <IconButton
                             onClick={buscarFotoWhatsApp}
                             size="small"
                             sx={{ color: '#25D366' }}
                           >
                             <WhatsAppIcon />
                           </IconButton>
                         </Tooltip>
                       )
                     }}
                   />
                 </Box>
               </Box>
               
               {/* 4ª Linha: Nível de Acesso (100%) */}
               <FormControl fullWidth sx={{ mb: 2 }}>
                   <InputLabel>{t('usuarios.nivelAcesso')}</InputLabel>
                   <Select
                     value={novoUsuario.idNivelAcesso || 1}
                     label={t('usuarios.nivelAcesso')}
                     onChange={(e) => setNovoUsuario(prev => ({ ...prev, idNivelAcesso: Number(e.target.value) }))}
                     disabled={loading || niveisAcesso.length === 0}
                   >
                     {niveisAcesso.filter(nivel => nivel.ativo).map(nivel => (
                       <MenuItem key={nivel.id} value={nivel.id}>
                         {nivel.grupo}
                       </MenuItem>
                     ))}
                     {niveisAcesso.filter(nivel => nivel.ativo).length === 0 && (
                       <MenuItem value="" disabled>
                         {loading ? t('usuarios.carregandoNiveis') : t('usuarios.nenhumNivelEncontrado')}
                       </MenuItem>
                     )}
                   </Select>
                 </FormControl>
               
               {/* 5ª Linha: Unidade (100%) */}
               <FormControl fullWidth sx={{ mb: 2 }}>
                 <InputLabel>Unidade</InputLabel>
                 <Select
                   value={novoUsuario.idUnidade || ''}
                   label="Unidade"
                   onChange={(e) => setNovoUsuario(prev => ({ ...prev, idUnidade: e.target.value ? Number(e.target.value) : undefined }))}
                   disabled={loading || unidades.length === 0}
                 >
                   <MenuItem value="">
                     <em>Selecione uma unidade</em>
                   </MenuItem>
                   {unidades.map(unidade => (
                     <MenuItem key={unidade.id} value={unidade.id}>
                       {unidade.fantasia || unidade.razaoSocial}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>
               
               {/* 5ª Linha: Ativo */}
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={novoUsuario.ativo || false}
                      onChange={(e) => setNovoUsuario(prev => ({ ...prev, ativo: e.target.checked }))}
                      color={novoUsuario.ativo ? "primary" : "error"}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: novoUsuario.ativo ? '#1976d2' : '#d32f2f',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: novoUsuario.ativo ? '#1976d2' : '#d32f2f',
                        },
                        '& .MuiSwitch-switchBase': {
                          color: novoUsuario.ativo ? '#1976d2' : '#d32f2f',
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: novoUsuario.ativo ? '#1976d2' : '#d32f2f',
                        }
                      }}
                    />
                  }
                  label={novoUsuario.ativo ? t('usuarios.ativo') : t('usuarios.inativo')}
                />
            </Box>
            
            {/* Lado Direito - Upload de Imagem */}
            <Box sx={{ 
              width: { xs: '100%', md: '300px' }, 
              pl: { xs: 0, md: 3 }, 
              pt: { xs: 2, md: 0 },
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
              borderTop: { xs: '1px solid #e0e0e0', md: 'none' },
              mt: { xs: 2, md: -4.375 }
            }}>
                <Typography variant="h6" sx={{ mb: { xs: 1, md: 4 } }}>
                  Foto do Usuário
                </Typography>
                
                {/* Preview da Imagem */}
                <Box
                  sx={{
                    width: 190,
                    height: 190,
                    border: '2px dashed #ccc',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    overflow: 'hidden',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  {imagemPreview ? (
                    <img
                      src={imagemPreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', color: '#999' }}>
                      <PhotoCameraIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="body2">
                        Nenhuma imagem selecionada
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Botão para Upload */}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-button"
                  type="file"
                  onChange={handleImagemUpload}
                />
                <label htmlFor="upload-button">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 1 }}
                  >
                    {t('usuarios.escolherFoto')}
                  </Button>
                </label>
                
                {imagemPreview && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                      setImagemPreview('');
                      setNovoUsuario(prev => ({ ...prev, foto: '' }));
                    }}
                    size="small"
                    sx={{ mt: -1.875 }}
                  >
                    {t('usuarios.removerFoto')}
                  </Button>
                )}
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Formatos aceitos: JPEG, PNG<br />
                  Tamanho máximo: 1MB
                </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>{t('usuarios.cancelar')}</Button>
          <Button onClick={salvarUsuario} variant="contained">
            {usuarioEditando ? t('usuarios.salvar') : t('usuarios.adicionar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}