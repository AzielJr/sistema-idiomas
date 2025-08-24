import {
  Box,
  Button,
  TextField, 
  Typography, 
  Stack, 
  Paper,
  Avatar,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Tooltip
} from "@mui/material";
import { 
  Camera as CameraIcon,
  PhotoCamera as PhotoCameraIcon,
  WhatsApp as WhatsAppIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  FolderOpen as FolderOpenIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContextSimple";

interface Professor {
  id?: number;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  dataAdmissao: string;
  experienciaAnos: number;
  qtdAlunos: number;
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
  foto?: string;
  salario: string;
  status: number;
  coordenador: boolean;
  idUnidade: number;
}

export default function ProfessoresCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { user, fetchWithAuthSafe, refreshUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [professor, setProfessor] = useState<Professor>({
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    dataAdmissao: '',
    experienciaAnos: 0,
    qtdAlunos: 0,
    formacaoAcademica: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    celular: '',
    email: '',
    foto: '',
    salario: '0.00',
    status: 1,
    coordenador: false,
    idUnidade: 0
  });

  // Log do estado inicial
  console.log('Estado inicial do professor:', professor);

  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [carregandoCEP, setCarregandoCEP] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalFoto, setModalFoto] = useState(false);
  const [fotoTemporaria, setFotoTemporaria] = useState<string>('');
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [streamCamera, setStreamCamera] = useState<MediaStream | null>(null);
  const [unidades, setUnidades] = useState<{id: number, razaoSocial: string, fantasia: string, instancia?: string, token?: string}[]>([]);

  const isEditando = Boolean(id);

  // Opções para estados
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  useEffect(() => {
    console.log('useEffect executado:', { 
      user: user, 
      idUnidade: user?.idUnidade, 
      isEditando: isEditando 
    });
    
    // Carregar unidades sempre (independente do idUnidade)
    carregarUnidades();
    
    if (user?.idUnidade) {
      console.log('Definindo idUnidade do professor:', user.idUnidade);
      setProfessor(prev => ({ ...prev, idUnidade: user.idUnidade || 0 }));
      if (isEditando) {
        carregarProfessor();
      }
    } else if (user && !user.idUnidade) {
      console.log('Usuário logado mas sem idUnidade, chamando refreshUserData');
      refreshUserData();
    } else {
      console.log('Usuário ainda não carregado');
    }
  }, [user?.idUnidade, user, refreshUserData, id, isEditando]);

  const carregarUnidades = async () => {
    try {
      const response = await fetchWithAuthSafe('http://localhost:8080/api/unidades');
      if (response.ok) {
        const data = await response.json();
        setUnidades(data);
      }
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    }
  };

  // Função para buscar foto do WhatsApp (replicada da tela AlunosCadastro.tsx)
  const buscarFotoWhatsApp = async () => {
    try {
      if (!professor.celular || !user?.idUnidade) {
        alert('Por favor, preencha o celular e selecione uma unidade primeiro.');
        return;
      }

      // Buscar dados da unidade para obter instancia e token
      const unidade = unidades.find(u => u.id === user.idUnidade);
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

      const numeroFormatado = formatarNumeroParaWAPI(professor.celular);
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
                setProfessor(prev => ({ ...prev, foto: fotoBase64 }));
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

  const carregarProfessor = async () => {
    if (!id || !user?.idUnidade) return;
    
    try {
      setCarregando(true);
      setError(null);
      
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/professores/${id}/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos do backend:', data);
        console.log('Campo telefone:', data.telefone);
        console.log('Campo salario:', data.salario);
        setProfessor(data);
      } else {
        throw new Error('Erro ao carregar professor');
      }
    } catch (error) {
      console.error('Erro ao carregar professor:', error);
      setError('Erro ao carregar professor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (field: keyof Professor, value: any) => {
    console.log(`handleInputChange - Campo: ${field}, Valor: ${value}, Tipo: ${typeof value}`);
    setProfessor(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setProfessor(prev => ({ ...prev, status: checked ? 1 : 0 }));
  };

  const handleCoordenadorChange = (checked: boolean) => {
    setProfessor(prev => ({ ...prev, coordenador: checked }));
  };

  // Formatação de Data de Nascimento
  const formatarDataNascimento = (value: string) => {
    const data = value.replace(/\D/g, '');
    if (data.length <= 8) {
      if (data.length >= 4) {
        return data.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
      } else if (data.length >= 2) {
        return data.replace(/(\d{2})(\d{0,2})/, '$1/$2');
      }
    }
    return data;
  };

  const handleDataNascimentoChange = (value: string) => {
    const dataLimpa = value.replace(/\D/g, '');
    if (dataLimpa.length <= 8) {
      const dataFormatada = formatarDataNascimento(dataLimpa);
      handleInputChange('dataNascimento', dataFormatada);
    }
  };

  // Formatação de Data de Admissão
  const formatarDataAdmissao = (value: string) => {
    const data = value.replace(/\D/g, '');
    if (data.length <= 8) {
      if (data.length >= 4) {
        return data.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
      } else if (data.length >= 2) {
        return data.replace(/(\d{2})(\d{0,2})/, '$1/$2');
      }
    }
    return data;
  };

  const handleDataAdmissaoChange = (value: string) => {
    const dataLimpa = value.replace(/\D/g, '');
    if (dataLimpa.length <= 8) {
      const dataFormatada = formatarDataAdmissao(dataLimpa);
      handleInputChange('dataAdmissao', dataFormatada);
    }
  };

  // Formatação de CPF
  const formatarCPF = (value: string) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (value: string) => {
    const cpfLimpo = value.replace(/\D/g, '');
    if (cpfLimpo.length <= 11) {
      const cpfFormatado = formatarCPF(cpfLimpo);
      handleInputChange('cpf', cpfFormatado);
    }
  };

  // Formatação de CEP
  const formatarCEP = (value: string) => {
    const cep = value.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCEPChange = (value: string) => {
    const cepLimpo = value.replace(/\D/g, '');
    if (cepLimpo.length <= 8) {
      const cepFormatado = formatarCEP(cepLimpo);
      handleInputChange('cep', cepFormatado);
    }
  };

  // Formatação de Celular
  const formatarCelular = (value: string) => {
    const celular = value.replace(/\D/g, '');
    if (celular.length === 11) {
      return celular.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (celular.length === 10) {
      return celular.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return celular;
  };

  const handleCelularChange = (value: string) => {
    const celularLimpo = value.replace(/\D/g, '');
    if (celularLimpo.length <= 11) {
      const celularFormatado = formatarCelular(celularLimpo);
      handleInputChange('celular', celularFormatado);
    }
  };

  // Formatação de Telefone
  const formatarTelefone = (value: string) => {
    const telefone = value.replace(/\D/g, '');
    if (telefone.length === 10) {
      return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  const handleTelefoneChange = (value: string) => {
    const telefoneLimpo = value.replace(/\D/g, '');
    if (telefoneLimpo.length <= 11) {
      const telefoneFormatado = formatarTelefone(telefoneLimpo);
      handleInputChange('telefone', telefoneFormatado);
    }
  };

  // Formatação de Valor Salário - ULTRA SIMPLES
  const handleSalarioChange = (value: string) => {
    // Aceita apenas números e ponto
    const valor = value.replace(/[^\d.]/g, '');
    handleInputChange('salario', valor || '0.00');
  };

  // Função para buscar endereço pelo CEP usando a API ViaCEP
  const buscarEnderecoPorCEP = async () => {
    if (!professor.cep) {
      alert('Por favor, informe o CEP primeiro.');
      return;
    }

    const cepLimpo = professor.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      alert('CEP deve ter 8 dígitos.');
      return;
    }

    try {
      // Mostrar loading
      setCarregandoCEP(true);
      
      // Limpar campos de endereço antes de buscar
      setProfessor(prev => ({
        ...prev,
        endereco: '',
        bairro: '',
        cidade: '',
        estado: ''
      }));
      
      // Fazer requisição para a API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }

      const dados = await response.json();
      
      if (dados.erro) {
        alert('CEP não encontrado. Verifique se o CEP está correto.');
        return;
      }

      // Preencher os campos com os dados retornados
      setProfessor(prev => ({
        ...prev,
        cep: dados.cep || prev.cep,
        endereco: dados.logradouro || '',
        bairro: dados.bairro || '',
        cidade: dados.localidade || '',
        estado: dados.uf || ''
      }));

      // Mensagem de sucesso mais informativa
      const mensagem = `Endereço carregado com sucesso!\n\nCEP: ${dados.cep}\nLogradouro: ${dados.logradouro}\nBairro: ${dados.bairro}\nCidade: ${dados.localidade}\nEstado: ${dados.uf}`;
      alert(mensagem);
      
      // Colocar foco no campo Número após um pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        const numeroField = document.querySelector('input[name="numero"]') as HTMLInputElement;
        if (numeroField) {
          numeroField.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      alert('Erro ao buscar endereço. Verifique sua conexão com a internet e tente novamente.');
    } finally {
      setCarregandoCEP(false);
    }
  };

  const abrirModalFoto = () => {
    setModalFoto(true);
  };

  const fecharModalFoto = () => {
    pararCamera();
    setModalFoto(false);
    setFotoTemporaria('');
  };

  const capturarFotoCamera = async () => {
    try {
      setCameraAtiva(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // Usar câmera frontal
        } 
      });
      
      setStreamCamera(stream);
      
      // Aguardar um pouco para a câmera inicializar
      setTimeout(() => {
        const video = document.getElementById('camera-video') as HTMLVideoElement;
        if (video) {
          video.srcObject = stream;
          video.play().catch(e => {
            console.error('Erro ao reproduzir vídeo:', e);
          });
        }
      }, 200);
      
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Erro ao acessar câmera. Verifique as permissões do navegador.');
      setCameraAtiva(false);
    }
  };

  const pararCamera = () => {
    if (streamCamera) {
      streamCamera.getTracks().forEach(track => track.stop());
      setStreamCamera(null);
    }
    setCameraAtiva(false);
  };

  const tirarFoto = () => {
    const video = document.getElementById('camera-video') as HTMLVideoElement;
    const canvas = document.getElementById('camera-canvas') as HTMLCanvasElement;
    
    if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
      const context = canvas.getContext('2d');
      if (context) {
        // Configurar dimensões do canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Desenhar o frame atual do vídeo no canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Converter para JPEG com qualidade 0.8
        const fotoData = canvas.toDataURL('image/jpeg', 0.8);
        setFotoTemporaria(fotoData);
        pararCamera();
        
        console.log('Foto capturada com sucesso!');
      } else {
        console.error('Não foi possível obter o contexto 2D do canvas');
        alert('Erro ao capturar foto. Tente novamente.');
      }
    } else {
      console.error('Vídeo não está pronto ou canvas não encontrado');
      alert('Câmera não está pronta. Aguarde um momento e tente novamente.');
    }
  };

  const aplicarFoto = () => {
    if (fotoTemporaria) {
      setProfessor(prev => ({ ...prev, foto: fotoTemporaria }));
      fecharModalFoto();
    }
  };

  const selecionarArquivo = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFotoTemporaria(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validarFormulario = (): boolean => {
    console.log('Validando formulário...');
    console.log('Professor completo:', professor);
    console.log('Salário:', professor.salario, 'Tipo:', typeof professor.salario);
    
    const camposObrigatorios = [];
    const camposInvalidos = [];
    
    // Validação dos campos obrigatórios
    if (!professor.nome || typeof professor.nome !== 'string' || !professor.nome.trim()) {
      camposObrigatorios.push('Nome Completo');
    }
    
    if (!professor.cpf || typeof professor.cpf !== 'string' || !professor.cpf.trim()) {
      camposObrigatorios.push('CPF');
    } else if (professor.cpf.replace(/\D/g, '').length !== 11) {
      camposInvalidos.push('CPF (deve ter 11 dígitos)');
    }
    
    if (!professor.celular || typeof professor.celular !== 'string' || !professor.celular.trim()) {
      camposObrigatorios.push('Celular');
    } else if (professor.celular.replace(/\D/g, '').length !== 10 && professor.celular.replace(/\D/g, '').length !== 11) {
      camposInvalidos.push('Celular (deve ter 10 ou 11 dígitos)');
    }
    
    // Validações adicionais para campos não obrigatórios mas que devem ser válidos se preenchidos
    if (professor.telefone && (professor.telefone.replace(/\D/g, '').length !== 10 && professor.telefone.replace(/\D/g, '').length !== 11)) {
      camposInvalidos.push('Telefone (deve ter 10 ou 11 dígitos)');
    }
    
    if (professor.cep && professor.cep.replace(/\D/g, '').length !== 8) {
      camposInvalidos.push('CEP (deve ter 8 dígitos)');
    }
    
    if (professor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professor.email)) {
      camposInvalidos.push('Email (formato inválido)');
    }
    
    if (professor.dataNascimento && professor.dataNascimento.replace(/\D/g, '').length !== 8) {
      camposInvalidos.push('Data de Nascimento (deve ter 8 dígitos)');
    }
    
    if (professor.dataAdmissao && professor.dataAdmissao.replace(/\D/g, '').length !== 8) {
      camposInvalidos.push('Data de Admissão (deve ter 8 dígitos)');
    }
    
    // Garantir que o salário seja válido (NÃO ZERAR!)
    if (!professor.salario) {
      setProfessor(prev => ({ ...prev, salario: '0.00' }));
    } else if (typeof professor.salario !== 'string') {
      // Converter para string se não for (ex: BigDecimal do backend)
      setProfessor(prev => ({ ...prev, salario: String(professor.salario) }));
    }
    
    console.log('Campos obrigatórios vazios:', camposObrigatorios);
    console.log('Campos com formato inválido:', camposInvalidos);
    console.log('Salário após validação:', professor.salario, 'Tipo:', typeof professor.salario);
    
    // Construir mensagem de erro detalhada
    let mensagemErro = '';
    
    if (camposObrigatorios.length > 0) {
      mensagemErro += `📋 **Campos obrigatórios não preenchidos:**\n${camposObrigatorios.join('\n')}\n\n`;
    }
    
    if (camposInvalidos.length > 0) {
      mensagemErro += `⚠️ **Campos com formato incorreto:**\n${camposInvalidos.join('\n')}\n\n`;
    }
    
    if (mensagemErro) {
      mensagemErro += '🔧 **Dica:** Preencha todos os campos obrigatórios e verifique se os formatos estão corretos.';
      alert(mensagemErro);
      return false;
    }
    
    // Verificar se idUnidade está definido
    if (!professor.idUnidade || professor.idUnidade === 0) {
      alert('❌ **Erro de Sistema:** Unidade não está definida.\n\nEntre em contato com o administrador para resolver este problema.');
      return false;
    }
    
    console.log('✅ Formulário válido!');
    return true;
  };

  const handleSalvar = async () => {
    if (!validarFormulario() || !user?.idUnidade) {
      console.error('Validação falhou ou idUnidade não encontrado:', { 
        validacao: validarFormulario(), 
        user: user, 
        idUnidade: user?.idUnidade 
      });
      if (!user?.idUnidade) {
        setError('Usuário não possui unidade associada. Entre em contato com o administrador.');
      }
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Garantir que o idUnidade está correto e o salário seja válido
      const dadosParaSalvar = {
        ...professor,
        idUnidade: user.idUnidade || 0,
        salario: professor.salario ? String(professor.salario) : '0.00'
      };
      
      console.log('🔍 Dados sendo enviados para salvar:', dadosParaSalvar);
      console.log('🔍 idUnidade sendo enviado:', user.idUnidade);
      console.log('🔍 Salário sendo enviado:', dadosParaSalvar.salario, 'Tipo:', typeof dadosParaSalvar.salario);
      
      const url = isEditando 
        ? `http://localhost:8080/api/professores/${id}/unidade/${user.idUnidade}`
        : 'http://localhost:8080/api/professores';
      
      const method = isEditando ? 'PUT' : 'POST';
      
      const response = await fetchWithAuthSafe(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaSalvar)
      });

      if (response.ok) {
        console.log('Professor salvo com sucesso. idUnidade:', user.idUnidade);
        navigate('/cadastros/professores');
      } else {
        // Capturar detalhes do erro da resposta
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, response.statusText, errorText);
        
        let mensagemErro = '';
        if (response.status === 400) {
          mensagemErro = 'Dados inválidos. Verifique os campos obrigatórios.';
        } else if (response.status === 401) {
          mensagemErro = 'Não autorizado. Faça login novamente.';
        } else if (response.status === 403) {
          mensagemErro = 'Acesso negado. Verifique suas permissões.';
        } else if (response.status === 404) {
          mensagemErro = 'API não encontrada. Verifique se o backend está rodando.';
        } else if (response.status === 500) {
          mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          mensagemErro = `Erro HTTP ${response.status}: ${errorText || response.statusText}`;
        }
        
        throw new Error(mensagemErro);
      }
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
      if (error instanceof Error) {
        setError(`Erro ao salvar professor: ${error.message}`);
      } else {
        setError('Erro ao salvar professor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/cadastros/professores');
  };

  if (carregando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Typography variant="h5" fontWeight="bold" mb={2} sx={{ mt: -5 }}>
        {isEditando ? t('professores.editar') : t('professores.novo')}
      </Typography>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          {/* Primeira linha - Foto e Nome */}
          <Stack direction="row" spacing={3} alignItems="flex-start">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={professor.foto}
                variant="circular"
                sx={{ width: 120, height: 120, cursor: 'pointer' }}
                onClick={abrirModalFoto}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
                onClick={abrirModalFoto}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            
            <Stack spacing={2} sx={{ flex: 1 }}>
        <TextField
                label={`${t('professoresCadastro.nome')} *`}
          value={professor.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
          fullWidth
              />
              
              <Stack direction="row" spacing={2}>
                <TextField
                  label={`${t('professoresCadastro.cpf')} *`}
                  value={professor.cpf}
                  onChange={(e) => handleCPFChange(e.target.value)}
                  placeholder="000.000.000-00"
                  error={Boolean(professor.cpf && professor.cpf.replace(/\D/g, '').length > 0 && professor.cpf.replace(/\D/g, '').length < 11)}
                  helperText={professor.cpf && professor.cpf.replace(/\D/g, '').length > 0 && professor.cpf.replace(/\D/g, '').length < 11 ? 'CPF deve ter 11 dígitos' : undefined}
                  sx={{ 
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: professor.cpf && professor.cpf.replace(/\D/g, '').length > 0 && professor.cpf.replace(/\D/g, '').length < 11 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                      },
                      '&:hover fieldset': {
                        borderColor: professor.cpf && professor.cpf.replace(/\D/g, '').length > 0 && professor.cpf.replace(/\D/g, '').length < 11 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: professor.cpf && professor.cpf.replace(/\D/g, '').length > 0 && professor.cpf.replace(/\D/g, '').length < 11 ? '#d32f2f' : '#1976d2'
                      }
                    }
                  }}
                />
                <TextField
                  label={t('professoresCadastro.rg')}
                  value={professor.rg}
                  onChange={(e) => handleInputChange('rg', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Salário"
                  value={professor.salario}
                  onChange={(e) => {
                    console.log('Valor digitado:', e.target.value);
                    console.log('Tipo do valor digitado:', typeof e.target.value);
                    handleSalarioChange(e.target.value);
                  }}
                  placeholder="0.00"
                  InputProps={{
                    inputProps: {
                      style: { textAlign: 'right' }
                    }
                  }}
                  sx={{ flex: 1 }}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Segunda linha - Datas e Informações */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Data de Nascimento"
              value={professor.dataNascimento}
              onChange={(e) => handleDataNascimentoChange(e.target.value)}
              placeholder="DD/MM/AAAA"
              error={Boolean(professor.dataNascimento && professor.dataNascimento.replace(/\D/g, '').length > 0 && professor.dataNascimento.replace(/\D/g, '').length < 8)}
              helperText={professor.dataNascimento && professor.dataNascimento.replace(/\D/g, '').length > 0 && professor.dataNascimento.replace(/\D/g, '').length < 8 ? 'Data deve ter 8 dígitos' : undefined}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: professor.dataNascimento && professor.dataNascimento.replace(/\D/g, '').length > 0 && professor.dataNascimento.replace(/\D/g, '').length < 8 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: professor.dataNascimento && professor.dataNascimento.replace(/\D/g, '').length > 0 && professor.dataNascimento.replace(/\D/g, '').length < 8 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: professor.dataNascimento && professor.dataNascimento.replace(/\D/g, '').length > 0 && professor.dataNascimento.replace(/\D/g, '').length < 8 ? '#d32f2f' : '#1976d2'
                  }
                }
              }}
            />
            <TextField
              label="Data de Admissão"
              value={professor.dataAdmissao}
              onChange={(e) => handleDataAdmissaoChange(e.target.value)}
              placeholder="DD/MM/AAAA"
              error={Boolean(professor.dataAdmissao && professor.dataAdmissao.replace(/\D/g, '').length > 0 && professor.dataAdmissao.replace(/\D/g, '').length < 8)}
              helperText={professor.dataAdmissao && professor.dataAdmissao.replace(/\D/g, '').length > 0 && professor.dataAdmissao.replace(/\D/g, '').length < 8 ? 'Data deve ter 8 dígitos' : undefined}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: professor.dataAdmissao && professor.dataAdmissao.replace(/\D/g, '').length > 0 && professor.dataAdmissao.replace(/\D/g, '').length < 8 ? '#d32f2f' : '#1976d2'
                  },
                  '&:hover fieldset': {
                    borderColor: professor.dataAdmissao && professor.dataAdmissao.replace(/\D/g, '').length > 0 && professor.dataAdmissao.replace(/\D/g, '').length < 8 ? '#d32f2f' : '#1976d2'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: professor.dataAdmissao && professor.dataAdmissao.replace(/\D/g, '').length > 0 && professor.dataAdmissao.replace(/\D/g, '').length < 8 ? '#d32f2f' : '#1976d2'
                  }
                }
              }}
            />
            <TextField
              label="Experiência (Anos)"
              value={professor.experienciaAnos}
              onChange={(e) => handleInputChange('experienciaAnos', parseInt(e.target.value) || 0)}
              placeholder="0"
              type="number"
              inputProps={{ min: 0, max: 50 }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Qtde. de Alunos"
              value={professor.qtdAlunos}
              onChange={(e) => handleInputChange('qtdAlunos', parseInt(e.target.value) || 0)}
              placeholder="0"
              type="number"
              inputProps={{ min: 0, max: 1000 }}
              sx={{ flex: 1 }}
            />
          </Stack>

          {/* Terceira linha - Formação */}
          <TextField
            label="Formação Acadêmica"
            value={professor.formacaoAcademica}
            onChange={(e) => handleInputChange('formacaoAcademica', e.target.value)}
            placeholder="Ex: Letras - Inglês, Pedagogia, Licenciatura em..."
            multiline
            rows={3}
              fullWidth
          />



          {/* Quinta linha - Contatos */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Email"
              value={professor.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              type="email"
              error={Boolean(professor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professor.email))}
              helperText={professor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professor.email) ? 'Email deve ter formato válido' : undefined}
              sx={{ 
                flex: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: professor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professor.email) ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: professor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professor.email) ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: professor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(professor.email) ? '#d32f2f' : '#1976d2'
                  }
                }
              }}
            />
            <TextField
              label="Celular *"
              value={professor.celular}
              onChange={(e) => handleCelularChange(e.target.value)}
              placeholder="(00) 00000-0000"
              error={Boolean(professor.celular && (professor.celular.replace(/\D/g, '').length !== 10 && professor.celular.replace(/\D/g, '').length !== 11))}
              helperText={professor.celular && (professor.celular.replace(/\D/g, '').length !== 10 && professor.celular.replace(/\D/g, '').length !== 11) ? 'Celular deve ter 10 ou 11 dígitos' : undefined}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Buscar foto do WhatsApp">
                      <IconButton
                        size="small"
                        onClick={buscarFotoWhatsApp}
                        disabled={!professor.celular || carregando}
                        color="primary"
                      >
                        {carregando ? (
                          <CircularProgress size={16} color="primary" />
                        ) : (
                          <WhatsAppIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: professor.celular && (professor.celular.replace(/\D/g, '').length === 10 || professor.celular.replace(/\D/g, '').length === 11) ? '#1976d2' : (professor.celular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                  },
                  '&:hover fieldset': {
                    borderColor: professor.celular && (professor.celular.replace(/\D/g, '').length === 10 || professor.celular.replace(/\D/g, '').length === 11) ? '#1976d2' : (professor.celular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: professor.celular && (professor.celular.replace(/\D/g, '').length === 10 || professor.celular.replace(/\D/g, '').length === 11) ? '#1976d2' : (professor.celular ? '#d32f2f' : '#1976d2')
                  }
                }
              }}
            />
            <TextField
              label="Telefone"
              value={professor.telefone}
              onChange={(e) => handleTelefoneChange(e.target.value)}
              placeholder="(00) 0000-0000"
              error={Boolean(professor.telefone && (professor.telefone.replace(/\D/g, '').length !== 10 && professor.telefone.replace(/\D/g, '').length !== 11))}
              helperText={professor.telefone && (professor.telefone.replace(/\D/g, '').length !== 10 && professor.telefone.replace(/\D/g, '').length !== 11) ? 'Telefone deve ter 10 ou 11 dígitos' : undefined}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: professor.telefone && (professor.telefone.replace(/\D/g, '').length === 10 || professor.telefone.replace(/\D/g, '').length === 11) ? '#1976d2' : (professor.telefone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                  },
                  '&:hover fieldset': {
                    borderColor: professor.telefone && (professor.telefone.replace(/\D/g, '').length === 10 || professor.telefone.replace(/\D/g, '').length === 11) ? '#1976d2' : (professor.telefone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: professor.telefone && (professor.telefone.replace(/\D/g, '').length === 10 || professor.telefone.replace(/\D/g, '').length === 11) ? '#1976d2' : (professor.telefone ? '#d32f2f' : '#1976d2')
                  }
                }
              }}
            />
          </Stack>



          {/* Sétima linha - CEP */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="CEP"
              value={professor.cep}
              onChange={(e) => handleCEPChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && professor.cep && professor.cep.replace(/\D/g, '').length === 8) {
                  buscarEnderecoPorCEP();
                }
              }}
              placeholder="00000-000"
              error={Boolean(professor.cep && professor.cep.replace(/\D/g, '').length > 0 && professor.cep.replace(/\D/g, '').length < 8)}
              helperText={professor.cep && professor.cep.replace(/\D/g, '').length > 0 && professor.cep.replace(/\D/g, '').length < 8 ? 'CEP deve ter 8 dígitos' : undefined}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Buscar endereço pelo CEP (ou pressione Enter)">
                      <IconButton
                        size="small"
                        onClick={buscarEnderecoPorCEP}
                        disabled={!professor.cep || professor.cep.replace(/\D/g, '').length !== 8 || carregandoCEP}
                      >
                        {carregandoCEP ? (
                          <CircularProgress size={16} color="primary" />
                        ) : (
                          <SearchIcon color="primary" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            sx={{
                width: '20%',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: professor.cep && professor.cep.replace(/\D/g, '').length > 0 && professor.cep.replace(/\D/g, '').length < 8 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: professor.cep && professor.cep.replace(/\D/g, '').length > 0 && professor.cep.replace(/\D/g, '').length < 8 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: professor.cep && professor.cep.replace(/\D/g, '').length > 0 && professor.cep.replace(/\D/g, '').length < 8 ? '#d32f2f' : '#1976d2'
                  }
                }
              }}
            />
          </Stack>

          {/* Oitava linha - Endereço, Número e Complemento */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Endereço"
              value={professor.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              sx={{ flex: 7 }}
            />
            <TextField
              label="Número"
              name="numero"
              value={professor.numero}
              onChange={(e) => handleInputChange('numero', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Complemento"
              value={professor.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              sx={{ flex: 2 }}
            />
          </Stack>

          {/* Nona linha - Localização */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Bairro"
              value={professor.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              sx={{ flex: 4 }}
            />
            <TextField
              label="Cidade"
              value={professor.cidade}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              sx={{ flex: 4 }}
            />
            <TextField
              label="Estado"
              value={professor.estado}
              onChange={(e) => handleInputChange('estado', e.target.value)}
              select
              sx={{ flex: 2 }}
            >
              {estados.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {/* Status e Coordenador */}
          <Stack direction="row" spacing={4} alignItems="center">
          <FormControlLabel
              control={<Switch checked={professor.status === 1} onChange={(e) => handleStatusChange(e.target.checked)} color="primary" />}
              label={
                <Typography sx={{ color: professor.status === 1 ? '#1976d2' : '#d32f2f', fontWeight: 'bold' }}>
                  {professor.status === 1 ? 'Ativo' : 'Inativo'}
                </Typography>
              }
            />
            <FormControlLabel
              control={<Switch checked={professor.coordenador} onChange={(e) => handleCoordenadorChange(e.target.checked)} color="secondary" />}
              label={
                <Typography sx={{ color: professor.coordenador ? '#9c27b0' : '#666', fontWeight: 'bold' }}>
                  {professor.coordenador ? 'Coordenador' : 'Professor'}
                </Typography>
              }
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Botões */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleVoltar}
          disabled={loading}
          sx={{ textTransform: 'none', minWidth: 120 }}
        >
          Voltar
        </Button>
        <Button 
          variant="contained" 
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} 
          onClick={() => {
            console.log('🎯 Botão Salvar clicado!');
            console.log('Estado atual:', { loading, user, idUnidade: user?.idUnidade });
            handleSalvar();
          }}
          disabled={loading}
          sx={{ textTransform: 'none', minWidth: 120 }}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Stack>

      {/* Modal da Foto */}
      <Dialog open={modalFoto} onClose={fecharModalFoto} maxWidth="sm" fullWidth>
        <DialogTitle>Capturar Foto</DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems="center">
            {cameraAtiva && (
              <Alert severity="info" sx={{ width: '100%' }}>
                Câmera ativa - Capturando foto...
              </Alert>
            )}
            
            {fotoTemporaria && (
              <Avatar
                src={fotoTemporaria}
                variant="circular"
                sx={{ width: 200, height: 200 }}
              />
            )}
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                onClick={capturarFotoCamera}
                disabled={cameraAtiva}
                sx={{ textTransform: 'none' }}
              >
                {cameraAtiva ? 'Capturando...' : 'Câmera'}
              </Button>
              {cameraAtiva && (
          <Button 
            variant="contained" 
                  startIcon={<CameraIcon />}
                  onClick={tirarFoto}
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Tirar Foto
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<FolderOpenIcon />}
                onClick={selecionarArquivo}
                disabled={cameraAtiva}
            sx={{ textTransform: 'none' }}
          >
                Arquivo
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModalFoto} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button 
            onClick={aplicarFoto} 
            variant="contained"
            disabled={!fotoTemporaria}
            sx={{ textTransform: 'none' }}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Input file oculto */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileSelect}
      />

      {/* Elementos de câmera ocultos */}
      <video
        id="camera-video"
        style={{ display: 'none' }}
        autoPlay
        playsInline
        muted
      />
      <canvas
        id="camera-canvas"
        style={{ display: 'none' }}
      />
    </Box>
  );
}