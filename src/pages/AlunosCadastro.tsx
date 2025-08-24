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

interface Aluno {
  id?: number;
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
  vlrMensalidade: string;
  status: number;
  idUnidade: number;
}

export default function AlunosCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { user, fetchWithAuthSafe, refreshUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aluno, setAluno] = useState<Aluno>({
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    nivelEnsino: '',
    idMaterialDidatico: 0,
    filiacaoPai: '',
    filiacaoMae: '',
    responsavel: '',
    responsavelCelular: '',
    emergenciaLigarPara: '',
    emergenciaLevarPara: '',
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
    vlrMensalidade: '0.00',
    status: 1,
    idUnidade: 0
  });

  // Log do estado inicial
  console.log('Estado inicial do aluno:', aluno);

  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [carregandoCEP, setCarregandoCEP] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalFoto, setModalFoto] = useState(false);
  const [fotoTemporaria, setFotoTemporaria] = useState<string>('');
  const [materiaisDidaticos, setMateriaisDidaticos] = useState<Array<{id: number, nome: string}>>([]);
  const [carregandoMateriais, setCarregandoMateriais] = useState(false);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [streamCamera, setStreamCamera] = useState<MediaStream | null>(null);
  const [unidades, setUnidades] = useState<{id: number, razaoSocial: string, fantasia: string, instancia?: string, token?: string}[]>([]);

  const isEditando = Boolean(id);

  // Opções para nível de ensino
  const niveisEnsino = [
    'Básico',
    'Intermediário',
    'Avançado',
    'Conversação',
    'Preparatório'
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
      console.log('Definindo idUnidade do aluno:', user.idUnidade);
      setAluno(prev => ({ ...prev, idUnidade: user.idUnidade || 0 }));
      carregarMateriaisDidaticos();
      if (isEditando) {
        carregarAluno();
      }
    } else if (user && !user.idUnidade) {
      console.log('Usuário logado mas sem idUnidade, chamando refreshUserData');
      refreshUserData();
    } else {
      console.log('Usuário ainda não carregado');
    }
  }, [user?.idUnidade, user, refreshUserData, id, isEditando]);

  const carregarMateriaisDidaticos = async () => {
    if (!user?.idUnidade) return;
    
    try {
      setCarregandoMateriais(true);
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/material-didatico/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        setMateriaisDidaticos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar materiais didáticos:', error);
    } finally {
      setCarregandoMateriais(false);
    }
  };

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

  // Função para buscar foto do WhatsApp (replicada da tela Usuarios.tsx)
  const buscarFotoWhatsApp = async () => {
    try {
      if (!aluno.celular || !user?.idUnidade) {
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

      const numeroFormatado = formatarNumeroParaWAPI(aluno.celular);
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
                setAluno(prev => ({ ...prev, foto: fotoBase64 }));
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

  const carregarAluno = async () => {
    if (!id || !user?.idUnidade) return;
    
    try {
      setCarregando(true);
      setError(null);
      
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/alunos/${id}/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos do backend:', data);
        console.log('Campo telefone:', data.telefone);
        console.log('Campo vlrMensalidade:', data.vlrMensalidade);
        setAluno(data);
      } else {
        throw new Error('Erro ao carregar aluno');
      }
    } catch (error) {
      console.error('Erro ao carregar aluno:', error);
      setError('Erro ao carregar aluno. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleInputChange = (field: keyof Aluno, value: any) => {
    console.log(`handleInputChange - Campo: ${field}, Valor: ${value}, Tipo: ${typeof value}`);
    setAluno(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setAluno(prev => ({ ...prev, status: checked ? 1 : 0 }));
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

  const handleResponsavelCelularChange = (value: string) => {
    const celularLimpo = value.replace(/\D/g, '');
    if (celularLimpo.length <= 11) {
      const celularFormatado = formatarCelular(celularLimpo);
      handleInputChange('responsavelCelular', celularFormatado);
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

  // Formatação de Valor Mensalidade - ULTRA SIMPLES
  const handleValorMensalidadeChange = (value: string) => {
    // Aceita apenas números e ponto
    const valor = value.replace(/[^\d.]/g, '');
    handleInputChange('vlrMensalidade', valor || '0.00');
  };

  // Função para buscar endereço pelo CEP usando a API ViaCEP
  const buscarEnderecoPorCEP = async () => {
    if (!aluno.cep) {
      alert('Por favor, informe o CEP primeiro.');
      return;
    }

    const cepLimpo = aluno.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      alert('CEP deve ter 8 dígitos.');
      return;
    }

    try {
      // Mostrar loading
      setCarregandoCEP(true);
      
      // Limpar campos de endereço antes de buscar
      setAluno(prev => ({
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
       setAluno(prev => ({
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
      
      // Solicitar acesso à câmera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Câmera frontal
        } 
      });
      
      setStreamCamera(stream);
      
      // Criar elemento de vídeo para capturar frames
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Aguardar o vídeo carregar
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });
      
      // Aguardar um pouco para a câmera estabilizar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capturar a foto automaticamente após estabilizar
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Desenhar o frame atual do vídeo no canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Converter para base64
        const fotoData = canvas.toDataURL('image/jpeg', 0.8);
        setFotoTemporaria(fotoData);
      }
      
      // Parar a câmera
      stream.getTracks().forEach(track => track.stop());
      setStreamCamera(null);
      setCameraAtiva(false);
      
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      setCameraAtiva(false);
      setStreamCamera(null);
      
      // Fallback: mostrar mensagem de erro ou usar simulação
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('Permissão de câmera negada. Por favor, permita o acesso à câmera e tente novamente.');
      } else if (error instanceof Error && error.name === 'NotFoundError') {
        alert('Câmera não encontrada. Verifique se seu dispositivo possui uma câmera.');
      } else {
        alert('Erro ao acessar câmera. Verifique as permissões e tente novamente.');
      }
      
      // Fallback para simulação (como estava antes)
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(200, 200, 180, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#666';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Câmera não disponível', 200, 200);
        
        const fotoData = canvas.toDataURL('image/png');
        setFotoTemporaria(fotoData);
      }
    }
  };



  const pararCamera = () => {
    if (streamCamera) {
      streamCamera.getTracks().forEach(track => track.stop());
      setStreamCamera(null);
    }
    setCameraAtiva(false);
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

  const aplicarFoto = () => {
    if (fotoTemporaria) {
      setAluno(prev => ({ ...prev, foto: fotoTemporaria }));
      fecharModalFoto();
    }
  };

  const removerFoto = () => {
    setAluno(prev => ({ ...prev, foto: '' }));
  };

  const validarFormulario = (): boolean => {
    console.log('Validando formulário...');
    console.log('Aluno completo:', aluno);
    console.log('Valor mensalidade:', aluno.vlrMensalidade, 'Tipo:', typeof aluno.vlrMensalidade);
    
    const camposObrigatorios = [];
    
    // Validação segura dos campos
    if (!aluno.nome || typeof aluno.nome !== 'string' || !aluno.nome.trim()) {
      camposObrigatorios.push('Nome do Aluno');
    }
    
    if (!aluno.cpf || typeof aluno.cpf !== 'string' || !aluno.cpf.trim()) {
      camposObrigatorios.push('CPF');
    }
    
    if (!aluno.celular || typeof aluno.celular !== 'string' || !aluno.celular.trim()) {
      camposObrigatorios.push('Celular');
    }
    
    // Validação segura do valor mensalidade
    if (!aluno.vlrMensalidade || typeof aluno.vlrMensalidade !== 'string' || !aluno.vlrMensalidade.trim()) {
      camposObrigatorios.push('Valor Mensalidade');
    }
    
    // Garantir que o valor mensalidade seja válido (NÃO ZERAR!)
    if (!aluno.vlrMensalidade) {
      setAluno(prev => ({ ...prev, vlrMensalidade: '0.00' }));
    } else if (typeof aluno.vlrMensalidade !== 'string') {
      // Converter para string se não for (ex: BigDecimal do backend)
      setAluno(prev => ({ ...prev, vlrMensalidade: String(aluno.vlrMensalidade) }));
    }
    
    console.log('Campos obrigatórios vazios:', camposObrigatorios);
    console.log('Valor mensalidade após validação:', aluno.vlrMensalidade, 'Tipo:', typeof aluno.vlrMensalidade);
    
    if (camposObrigatorios.length > 0) {
      alert(`Os seguintes campos são obrigatórios:\n\n${camposObrigatorios.join('\n')}`);
      return false;
    }
    
    // Verificar se idUnidade está definido
    if (!aluno.idUnidade || aluno.idUnidade === 0) {
      alert('Unidade não está definida. Entre em contato com o administrador.');
      return false;
    }
    
    console.log('Formulário válido!');
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
      
            // Garantir que o idUnidade está correto e o valor mensalidade seja válido
      const dadosParaSalvar = {
        ...aluno,
        idUnidade: user.idUnidade,
        vlrMensalidade: aluno.vlrMensalidade ? String(aluno.vlrMensalidade) : '0.00'
      };
      
              console.log('🔍 Dados sendo enviados para salvar:', dadosParaSalvar);
        console.log('🔍 idUnidade sendo enviado:', user.idUnidade);
        console.log('🔍 Valor mensalidade sendo enviado:', dadosParaSalvar.vlrMensalidade, 'Tipo:', typeof dadosParaSalvar.vlrMensalidade);
        console.log('🔍 Valor mensalidade length:', dadosParaSalvar.vlrMensalidade ? dadosParaSalvar.vlrMensalidade.length : 'null/undefined');
        console.log('🔍 JSON stringify do valor mensalidade:', JSON.stringify(dadosParaSalvar.vlrMensalidade));
      
      const url = isEditando 
        ? `http://localhost:8080/api/alunos/${id}/unidade/${user.idUnidade}`
        : 'http://localhost:8080/api/alunos';
      
      const method = isEditando ? 'PUT' : 'POST';
      
      const response = await fetchWithAuthSafe(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaSalvar)
      });

      if (response.ok) {
        console.log('Aluno salvo com sucesso. idUnidade:', user.idUnidade);
        navigate('/cadastros/alunos');
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
      console.error('Erro ao salvar aluno:', error);
      
      // Mostrar mensagem de erro mais específica
      if (error instanceof Error) {
        setError(`Erro ao salvar aluno: ${error.message}`);
      } else {
        setError('Erro ao salvar aluno. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/cadastros/alunos');
  };

  if (carregando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: -3.75 }}>
        {isEditando ? 'Editar Aluno' : 'Novo Aluno'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
         {/* Seção da Foto */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Box position="relative">
            <Avatar
              src={aluno.foto}
              variant="circular"
              sx={{ 
                width: 150, 
                height: 150, 
                border: '3px solid #1976d2',
                cursor: 'pointer'
              }}
              onClick={abrirModalFoto}
            >
              {aluno.foto ? null : '👤'}
            </Avatar>
            <IconButton
              onClick={abrirModalFoto}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              <CameraIcon />
            </IconButton>
            {aluno.foto && (
              <IconButton
                onClick={removerFoto}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: '#f44336',
                  color: 'white',
                  '&:hover': { backgroundColor: '#d32f2f' }
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Formulário */}
        <Stack spacing={3}>
          {/* Primeira linha - Informações Básicas */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Nome do Aluno"
              value={aluno.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              required
              sx={{ 
                flex: 4, 
                '& .MuiOutlinedInput-input': { fontWeight: 'bold' }
              }}
            />
            <TextField
              label="Data de Nascimento"
              value={aluno.dataNascimento}
              onChange={(e) => handleDataNascimentoChange(e.target.value)}
              placeholder="DD/MM/AAAA"
                             sx={{ 
                 flex: 1,
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: aluno.dataNascimento && aluno.dataNascimento.replace(/\D/g, '').length === 8 ? '#1976d2' : (aluno.dataNascimento ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&:hover fieldset': {
                     borderColor: aluno.dataNascimento && aluno.dataNascimento.replace(/\D/g, '').length === 8 ? '#1976d2' : (aluno.dataNascimento ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: aluno.dataNascimento && aluno.dataNascimento.replace(/\D/g, '').length === 8 ? '#1976d2' : (aluno.dataNascimento ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   }
                 }
               }}
            />
          </Stack>

          {/* Segunda linha - Documentos e Nascimento */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Nível de Ensino"
              value={aluno.nivelEnsino}
              onChange={(e) => handleInputChange('nivelEnsino', e.target.value)}
              sx={{ flex: 2 }}
            >
              {niveisEnsino.map((nivel) => (
                <MenuItem key={nivel} value={nivel}>
                  {nivel}
                </MenuItem>
              ))}
            </TextField>
                         <TextField
               label="CPF"
               value={aluno.cpf}
               onChange={(e) => handleCPFChange(e.target.value)}
               placeholder="000.000.000-00"
               required
               sx={{ 
                 flex: 1,
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: aluno.cpf && aluno.cpf.replace(/\D/g, '').length === 11 ? '#1976d2' : (aluno.cpf ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&:hover fieldset': {
                     borderColor: aluno.cpf && aluno.cpf.replace(/\D/g, '').length === 11 ? '#1976d2' : (aluno.cpf ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: aluno.cpf && aluno.cpf.replace(/\D/g, '').length === 11 ? '#1976d2' : (aluno.cpf ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   }
                 }
               }}
             />
            <TextField
              label="RG"
              value={aluno.rg}
              onChange={(e) => handleInputChange('rg', e.target.value)}
              sx={{ flex: 1 }}
            />
          </Stack>

          {/* Terceira linha - Contatos (Email 50%, Telefone 25%, Celular 25%) */}
          <Stack direction="row" spacing={2}>
                         <TextField
               label="Email"
               type="email"
               value={aluno.email}
               onChange={(e) => handleInputChange('email', e.target.value)}
               sx={{ 
                 flex: 2,
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: aluno.email && aluno.email.includes('@') && aluno.email.includes('.') ? '#1976d2' : (aluno.email ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&:hover fieldset': {
                     borderColor: aluno.email && aluno.email.includes('@') && aluno.email.includes('.') ? '#1976d2' : (aluno.email ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: aluno.email && aluno.email.includes('@') && aluno.email.includes('.') ? '#1976d2' : (aluno.email ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   }
                 }
               }}
             />
                         <TextField
               label="Telefone"
               value={aluno.telefone}
               onChange={(e) => handleTelefoneChange(e.target.value)}
               placeholder="(00) 0000-0000"
               sx={{ 
                 flex: 1,
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: aluno.telefone && (aluno.telefone.replace(/\D/g, '').length === 10 || aluno.telefone.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.telefone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&:hover fieldset': {
                     borderColor: aluno.telefone && (aluno.telefone.replace(/\D/g, '').length === 10 || aluno.telefone.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.telefone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: aluno.telefone && (aluno.telefone.replace(/\D/g, '').length === 10 || aluno.telefone.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.telefone ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   }
                 }
               }}
             />
                         <TextField
               label="Celular"
               value={aluno.celular}
               onChange={(e) => handleCelularChange(e.target.value)}
               placeholder="(00) 00000-0000"
               required
               InputProps={{
                 endAdornment: (
                   <InputAdornment position="end">
                     <Tooltip title="Capturar foto Whatsapp">
                       <IconButton
                         size="small"
                         onClick={buscarFotoWhatsApp}
                       >
                         <WhatsAppIcon color="success" />
                       </IconButton>
                     </Tooltip>
                   </InputAdornment>
                 ),
               }}
               sx={{ 
                 flex: 1,
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: aluno.celular && (aluno.celular.replace(/\D/g, '').length === 10 || aluno.celular.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.celular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&:hover fieldset': {
                     borderColor: aluno.celular && (aluno.celular.replace(/\D/g, '').length === 10 || aluno.celular.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.celular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: aluno.celular && (aluno.celular.replace(/\D/g, '').length === 10 || aluno.celular.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.celular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                   }
                 }
               }}
             />
          </Stack>

          {/* Quarta linha - Material Didático e Valores */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Material Didático"
              value={aluno.idMaterialDidatico}
              onChange={(e) => handleInputChange('idMaterialDidatico', parseInt(e.target.value) || 0)}
              disabled={carregandoMateriais}
              sx={{ flex: 1 }}
            >
              {materiaisDidaticos.map((material) => (
                <MenuItem key={material.id} value={material.id}>
                  {material.nome}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Valor Mensalidade"
              value={aluno.vlrMensalidade}
              onChange={(e) => {
                console.log('Valor digitado:', e.target.value);
                console.log('Tipo do valor digitado:', typeof e.target.value);
                handleValorMensalidadeChange(e.target.value);
              }}
              placeholder="0.00"
              required
              InputProps={{
                inputProps: {
                  style: { textAlign: 'right' }
                }
              }}
              sx={{ minWidth: 200 }}
            />
          </Stack>

          {/* Quinta linha - Filiação */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Filiação Pai"
              value={aluno.filiacaoPai}
              onChange={(e) => handleInputChange('filiacaoPai', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Filiação Mãe"
              value={aluno.filiacaoMae}
              onChange={(e) => handleInputChange('filiacaoMae', e.target.value)}
              sx={{ flex: 1 }}
            />
          </Stack>

          {/* Sexta linha - Emergência */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Emergência: Ligar Para"
              value={aluno.emergenciaLigarPara}
              onChange={(e) => handleInputChange('emergenciaLigarPara', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Emergência: Levar Para"
              value={aluno.emergenciaLevarPara}
              onChange={(e) => handleInputChange('emergenciaLevarPara', e.target.value)}
              sx={{ flex: 1 }}
            />
          </Stack>

          {/* Sétima linha - Responsável */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Responsável"
              value={aluno.responsavel}
              onChange={(e) => handleInputChange('responsavel', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Responsável Celular"
              value={aluno.responsavelCelular}
              onChange={(e) => handleResponsavelCelularChange(e.target.value)}
              placeholder="(00) 00000-0000"
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: aluno.responsavelCelular && (aluno.responsavelCelular.replace(/\D/g, '').length === 10 || aluno.responsavelCelular.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.responsavelCelular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                  },
                  '&:hover fieldset': {
                    borderColor: aluno.responsavelCelular && (aluno.responsavelCelular.replace(/\D/g, '').length === 10 || aluno.responsavelCelular.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.responsavelCelular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: aluno.responsavelCelular && (aluno.responsavelCelular.replace(/\D/g, '').length === 10 || aluno.responsavelCelular.replace(/\D/g, '').length === 11) ? '#1976d2' : (aluno.responsavelCelular ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)')
                  }
                }
              }}
            />
          </Stack>

          {/* Oitava linha - CEP */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="CEP"
              value={aluno.cep}
              onChange={(e) => handleCEPChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && aluno.cep && aluno.cep.replace(/\D/g, '').length === 8) {
                  buscarEnderecoPorCEP();
                }
              }}
              placeholder="00000-000"
              error={Boolean(aluno.cep && aluno.cep.replace(/\D/g, '').length > 0 && aluno.cep.replace(/\D/g, '').length < 8)}
              helperText={aluno.cep && aluno.cep.replace(/\D/g, '').length > 0 && aluno.cep.replace(/\D/g, '').length < 8 ? 'CEP deve ter 8 dígitos' : undefined}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Buscar endereço pelo CEP (ou pressione Enter)">
                      <IconButton
                        size="small"
                        onClick={buscarEnderecoPorCEP}
                        disabled={!aluno.cep || aluno.cep.replace(/\D/g, '').length !== 8 || carregandoCEP}
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
                    borderColor: aluno.cep && aluno.cep.replace(/\D/g, '').length > 0 && aluno.cep.replace(/\D/g, '').length < 8 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: aluno.cep && aluno.cep.replace(/\D/g, '').length > 0 && aluno.cep.replace(/\D/g, '').length < 8 ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: aluno.cep && aluno.cep.replace(/\D/g, '').length > 0 && aluno.cep.replace(/\D/g, '').length < 8 ? '#d32f2f' : '#1976d2'
                  }
                }
              }}
            />
          </Stack>

          {/* Nona linha - Endereço, Número e Complemento */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Endereço"
              value={aluno.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              sx={{ flex: 7 }}
            />
                         <TextField
               label="Número"
               name="numero"
               value={aluno.numero}
               onChange={(e) => handleInputChange('numero', e.target.value)}
               sx={{ flex: 1 }}
             />
            <TextField
              label="Complemento"
              value={aluno.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              sx={{ flex: 2 }}
            />
          </Stack>

          {/* Décima linha - Localização */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Bairro"
              value={aluno.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              sx={{ flex: 4 }}
            />
            <TextField
              label="Cidade"
              value={aluno.cidade}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
              sx={{ flex: 4 }}
            />
            <TextField
              label="Estado"
              value={aluno.estado}
              onChange={(e) => handleInputChange('estado', e.target.value)}
              sx={{ flex: 2 }}
            />
          </Stack>

          {/* Status */}
          <Stack direction="row" spacing={4} alignItems="center">
            <FormControlLabel
              control={<Switch checked={aluno.status === 1} onChange={(e) => setAluno(prev => ({ ...prev, status: e.target.checked ? 1 : 0 }))} color="primary" />}
              label={
                <Typography sx={{ color: aluno.status === 1 ? '#1976d2' : '#d32f2f', fontWeight: 'bold' }}>
                  {aluno.status === 1 ? 'Ativo' : 'Inativo'}
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
    </Box>
  );
}
