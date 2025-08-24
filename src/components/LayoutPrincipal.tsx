import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography, Container, Avatar, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, Divider, Tooltip } from "@mui/material";
import SideBar from "./SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import logoSvg from '../assets/logo.svg';
import { useAuth } from '../contexts/AuthContextSimple';
import LanguageSelector from './LanguageSelector';

export default function LayoutPrincipal() {
    // Contexto de autenticação
    const { user, logout, fetchWithAuthSafe, updateUser } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    // Estado para controlar a abertura do menu em dispositivos móveis
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [meusDadosAberto, setMeusDadosAberto] = useState(false);
    const [dadosUsuario, setDadosUsuario] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [imagemPreview, setImagemPreview] = useState<string>('');
    const [unidade, setUnidade] = useState<{fantasia?: string}>({});
    
    // useEffect para carregar dados quando o modal abrir
    useEffect(() => {
        if (meusDadosAberto && user?.id) {
            carregarDadosUsuario();
        }
    }, [meusDadosAberto, user?.id]);
    
    // useEffect para carregar dados da unidade
    useEffect(() => {
        const carregarUnidade = async () => {
            if (user?.id) {
                try {
                    const response = await fetchWithAuthSafe(`http://localhost:8080/api/usuarios/${user.id}`);
                    if (response.ok) {
                        const userData = await response.json();
                        if (userData.idUnidade) {
                            const unidadeResponse = await fetchWithAuthSafe(`http://localhost:8080/api/unidades/${userData.idUnidade}`);
                            if (unidadeResponse.ok) {
                                const unidadeData = await unidadeResponse.json();
                                setUnidade({
                                    fantasia: unidadeData.fantasia
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error('Erro ao carregar dados da unidade:', error);
                }
            }
        };

        carregarUnidade();
    }, [user?.id, fetchWithAuthSafe]);
    
    // Função separada para carregar dados
    const carregarDadosUsuario = async () => {
        if (!user?.id) return;
        
        setLoading(true);
        try {
            console.log('🔄 Carregando dados do usuário ID:', user.id);
            const response = await fetchWithAuthSafe(`http://localhost:8080/api/usuarios/${user.id}`);
            
            if (response.ok) {
                const userData = await response.json();
                console.log('✅ Dados carregados:', userData);
                
                setDadosUsuario({
                    id: userData.id,
                    userName: userData.userName || '',
                    email: userData.email || '',
                    celular: userData.celular || '',
                    senha: '', // Não carregar senha por segurança
                    foto: userData.foto || null,
                    idNivelAcesso: userData.idNivelAcesso,
                    ativo: userData.ativo
                });
                
                // Converter foto se existir
                if (userData.foto) {
                    const fotoBase64 = converterByteArrayParaBase64(userData.foto);
                    setImagemPreview(fotoBase64);
                } else {
                    setImagemPreview('');
                }
            } else {
                console.error('❌ Erro ao carregar dados:', response.status);
                alert('Erro ao carregar dados do usuário');
            }
        } catch (error) {
            console.error('💥 Erro:', error);
            alert('Erro de conexão ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    
    // Função para alternar a abertura do menu em dispositivos móveis
    const drawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    // Função para abrir menu do usuário
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    // Função para fechar menu do usuário
    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };
    
    // Função para fazer logout
    const handleLogout = () => {
        handleUserMenuClose();
        logout();
        // Forçar redirecionamento para login
        window.location.href = '/login';
    };
    
    // Função para abrir modal Meus Dados
    const handleMeusDados = () => {
        console.log('🔍 Abrindo modal Meus Dados');
        handleUserMenuClose();
        setMeusDadosAberto(true);
        // O carregamento será feito automaticamente pelo useEffect
    };
    
    // Função para fechar modal Meus Dados
    const fecharMeusDados = () => {
        setMeusDadosAberto(false);
        setDadosUsuario({});
        setImagemPreview('');
    };

    // Função para salvar dados do usuário
    const salvarDadosUsuario = async () => {
        if (!dadosUsuario.userName || !dadosUsuario.email) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const dadosParaEnvio = {
                userName: dadosUsuario.userName,
                email: dadosUsuario.email,
                senha: dadosUsuario.senha,
                celular: dadosUsuario.celular,
                foto: imagemPreview || null // Envia a imagem completa com prefixo data:image
            };

            const response = await fetchWithAuthSafe(`http://localhost:8080/api/usuarios/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaEnvio)
            });

            if (response.ok) {
                // Atualizar dados do usuário no contexto
                updateUser({
                    name: dadosUsuario.userName,
                    foto: imagemPreview || user?.foto
                });
                
                alert('Dados atualizados com sucesso!');
                fecharMeusDados();
            } else {
                const errorData = await response.text();
                alert(`Erro ao salvar dados: ${errorData}`);
            }
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
            alert('Erro ao salvar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para manipular mudanças nos campos de input
    const handleInputChange = (field: string, value: any) => {
        setDadosUsuario(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Função para manipular mudança de imagem
    const handleImagemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImagemPreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Função para converter ByteArray para Base64
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

    // Função para upload de imagem
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
                alert('Formato de imagem não suportado. Use apenas: JPEG ou PNG.');
                event.target.value = ''; // Limpar o input
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                // Definir a imagem para preview e no estado do usuário
                setImagemPreview(base64);
                setDadosUsuario(prev => ({ ...prev, foto: base64 }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Função para salvar dados do usuário
    const salvarMeusDados = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuthSafe(`http://localhost:8080/api/usuarios/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: dadosUsuario.userName,
                    email: dadosUsuario.email,
                    senha: dadosUsuario.senha,
                    celular: dadosUsuario.celular,
                    foto: dadosUsuario.foto
                }),
            });
            
            if (response.ok) {
                alert('Dados atualizados com sucesso!');
                fecharMeusDados();
            } else {
                const errorData = await response.text();
                console.error('Erro na resposta:', errorData);
                alert('Erro ao atualizar dados. Verifique os campos e tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            alert('Erro de conexão. Verifique se o backend está funcionando.');
        } finally {
            setLoading(false);
        }
    };
    
    // Função para formatar celular
    const formatarCelular = (valor: string) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length <= 11) {
            return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return valor;
    };

    // Função para buscar foto do WhatsApp
    const buscarFotoWhatsApp = async () => {
        try {
            if (!dadosUsuario.celular) {
                alert('Por favor, preencha o campo celular primeiro.');
                return;
            }

            // Buscar dados da unidade para obter instancia e token
            if (!user?.id) {
                alert('Usuário não identificado.');
                return;
            }

            const response = await fetchWithAuthSafe(`http://localhost:8080/api/usuarios/${user.id}`);
            if (!response.ok) {
                alert('Erro ao buscar dados do usuário.');
                return;
            }

            const userData = await response.json();
            if (!userData.idUnidade) {
                alert('Usuário não está associado a uma unidade.');
                return;
            }

            const unidadeResponse = await fetchWithAuthSafe(`http://localhost:8080/api/unidades/${userData.idUnidade}`);
            if (!unidadeResponse.ok) {
                alert('Erro ao buscar dados da unidade.');
                return;
            }

            const unidade = await unidadeResponse.json();

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

            const numeroFormatado = formatarNumeroParaWAPI(dadosUsuario.celular);
            if (!numeroFormatado) {
                alert('Formato de número inválido! Use: (11) 98765-4321');
                return;
            }

            console.log('🔍 Buscando foto do WhatsApp:', {
                instanceId: unidade.instancia,
                phoneNumber: numeroFormatado,
                token: unidade.token ? '***' : 'NÃO CONFIGURADO'
            });

            // Fazer requisição para a API do WhatsApp usando fetch direto
            console.log('🌐 Fazendo requisição para API WhatsApp...');

            const wapiResponse = await fetch(`https://api.w-api.app/v1/contacts/profile-picture?instanceId=${unidade.instancia}&phoneNumber=${numeroFormatado}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${unidade.token}`
                }
            });

            console.log('📡 Resposta da API WhatsApp:', wapiResponse.status, wapiResponse.statusText);

            if (wapiResponse.ok) {
                const resultado = await wapiResponse.json();
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
                                setDadosUsuario(prev => ({ ...prev, foto: fotoBase64 }));
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
                if (wapiResponse.status === 401) {
                    mensagemErro = 'Token inválido ou expirado - Verifique configuração';
                } else if (wapiResponse.status === 400) {
                    mensagemErro = 'Instância não encontrada ou inválida - Verifique configuração';
                } else if (wapiResponse.status === 500) {
                    mensagemErro = 'Erro interno da API - usuário pode ter bloqueado a captura da foto';
                } else {
                    const errorText = await wapiResponse.text();
                    mensagemErro = `Erro HTTP ${wapiResponse.status}: ${errorText}`;
                }
                
                console.error('❌ Erro na resposta:', wapiResponse.status, mensagemErro);
                alert(`Erro ao buscar foto do WhatsApp: ${mensagemErro}`);
            }
        } catch (error) {
            console.error('💥 Erro ao buscar foto do WhatsApp:', error);
            alert('Erro ao buscar foto do WhatsApp. Verifique o console para mais detalhes.');
        }
    };
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            
            {/* AppBar para dispositivos móveis */}
            <AppBar 
                position="fixed" 
                sx={{
                    display: { xs: 'block', md: 'none' },
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center">
                        <IconButton 
                            color="inherit" 
                            edge="start" 
                            onClick={drawerToggle} 
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Espaço para logomarca da empresa */}
                        {unidade.fantasia ? (
                            <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                textAlign="center" 
                                fontSize="10px"
                                sx={{ fontWeight: 500 }}
                            >
                                {unidade.fantasia}
                            </Typography>
                        ) : (
                        <Box 
                            sx={{ 
                                width: '120px', 
                                height: '40px', 
                                border: '2px dashed #ccc', 
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" textAlign="center" fontSize="10px">
                                Logo da<br />Empresa
                            </Typography>
                        </Box>
                        )}
                    
                    {/* Seletor de idioma para mobile */}
                    <LanguageSelector />
                    </Box>
                </Toolbar>
            </AppBar>
            
            {/* AppBar para desktop */}
            <AppBar 
                position="fixed" 
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: { md: 'calc(100% - 290px)' },
                    ml: { md: '290px' },
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '60px !important' }}>
                    {/* Nome da empresa */}
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {unidade.fantasia || 'Custom Idiomas'}
                    </Typography>
                    
                    {/* Seletor de idioma e usuário logado */}
                    <Box display="flex" alignItems="center" gap={2}>
                        <LanguageSelector />
                        <Button
                            onClick={handleUserMenuOpen}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                textTransform: 'none',
                                color: 'text.primary',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            {user?.foto ? (
                                <Avatar 
                                    src={user.foto} 
                                    alt={user.name}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                    <PersonIcon />
                                </Avatar>
                            )}
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {user?.name || t('user.nome')}
                            </Typography>
                            <ExpandMoreIcon />
                        </Button>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleUserMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleMeusDados}>
                                <AccountCircleIcon sx={{ mr: 1 }} />
                                {t('user.meusDados')}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} />
                                {t('user.sair')}
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menu lateral */}
            <SideBar variant="temporary" mobileOpen={mobileOpen} onClose={drawerToggle} />
            <SideBar variant="permanent" />
            
            {/* Conteúdo principal */}
            <Box 
                component="main" 
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: { xs: '100%', md: 'calc(100% - 290px)' },
                    backgroundColor: '#f5f5f5',
                    overflow: 'hidden'
                }}
            >
                {/* Espaçador para compensar a altura da AppBar */}
                <Box sx={{ height: { xs: '56px', md: '70px' } }} />
                
                {/* Container para o conteúdo */}
                <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 }, overflow: 'auto' }}>
                    {/* Conteúdo da página */}
                    <Box 
                        sx={{ 
                            minHeight: '70vh'
                        }}
                    >
                        <Outlet />
                    </Box>
                </Container>
                
                {/* Rodapé */}
                <Box 
                    component="footer" 
                    sx={{ 
                        py: { xs: 2, md: 3 }, 
                        px: { xs: 2, md: 3 },
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        mt: 'auto',
                        backgroundColor: 'white',
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 1
                    }}
                >
                    <Container maxWidth="xl">
                        <Box 
                            display="flex" 
                            flexDirection={{ xs: 'column', md: 'row' }}
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                <img src={logoSvg} alt="Custom Idiomas" style={{ height: '24px' }} />
                                <Typography variant="body2" color="text.secondary">
                                    © {new Date().getFullYear()} {unidade.fantasia || 'Custom Idiomas'}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'center', md: 'right' }}>
                                Sistema de Gestão de Idiomas - Versão 1.0
                            </Typography>
                        </Box>
                    </Container>
                </Box>
            </Box>
            
            {/* Modal Meus Dados */}
            <Dialog 
                open={meusDadosAberto} 
                onClose={fecharMeusDados} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        width: 'calc(100% - 70px)',
                        maxWidth: '610px'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    {t('user.meusDados')}
                </DialogTitle>
                
                <Divider sx={{ mx: 3, mb: 2 }} />
                
                <DialogContent sx={{ pt: 0 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3,
                        pt: 1
                    }}>
                        {/* Seção de Campos */}
                        <Box sx={{ 
                            flex: 1,
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2
                        }}>
                        {/* Campos em coluna única */}
                        <TextField
                            label={t('user.nomeCompleto')}
                            value={dadosUsuario.userName || ''}
                            onChange={(e) => handleInputChange('userName', e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2, '& .MuiInputBase-root': { minWidth: 'calc(100% - 40px)' } }}
                        />
                        
                        <TextField
                            label={t('user.email')}
                            type="email"
                            value={dadosUsuario.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2, '& .MuiInputBase-root': { minWidth: 'calc(100% - 40px)' } }}
                        />
                        
                        <TextField
                            label={t('user.senha')}
                            type="password"
                            value={dadosUsuario.senha || ''}
                            onChange={(e) => handleInputChange('senha', e.target.value)}
                            fullWidth
                            placeholder={t('user.digiteSuaSenha')}
                            sx={{ mb: 2, '& .MuiInputBase-root': { minWidth: 'calc(100% - 40px)' } }}
                        />
                        
                        <TextField
                            label={t('user.celular')}
                            value={dadosUsuario.celular || ''}
                            onChange={(e) => {
                                const valorFormatado = formatarCelular(e.target.value);
                                handleInputChange('celular', valorFormatado);
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
                            sx={{ mb: 2, '& .MuiInputBase-root': { minWidth: 'calc(100% - 40px)' } }}
                        />
                        </Box>
                        
                        {/* Seção de Foto */}
                        <Box sx={{
                            width: { xs: '100%', md: '250px' },
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
                                {t('user.fotoUsuario')}
                            </Typography>
                            
                            {/* Preview da Imagem */}
                            <Box
                                sx={{
                                    width: 190,
                                    height: 190,
                                    border: '2px dashed #ccc',
                                    borderRadius: '50%', // Mudou para redondo
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
                                            borderRadius: '50%' // Mudou para redondo
                                        }}
                                    />
                                ) : (
                                    <Box sx={{ textAlign: 'center', color: '#999' }}>
                                        <PhotoCameraIcon sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="body2">
                                            {t('user.nenhumaImagem')}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            
                            {/* Botão para Upload */}
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-button-meus-dados"
                                type="file"
                                onChange={handleImagemChange}
                            />
                            <label htmlFor="upload-button-meus-dados">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ mb: 1 }}
                                >
                                    {t('user.escolherFoto')}
                                </Button>
                            </label>
                            
                            {imagemPreview && (
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={() => {
                                        setImagemPreview('');
                                        setDadosUsuario(prev => ({ ...prev, foto: '' }));
                                    }}
                                    size="small"
                                    sx={{ mt: -1.875 }}
                                >
                                    {t('user.removerFoto')}
                                </Button>
                            )}
                            
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                {t('user.formatosAceitos')}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={fecharMeusDados} disabled={loading}>
                        {t('common.cancelar')}
                    </Button>
                    <Button 
                        onClick={salvarDadosUsuario} 
                        variant="contained" 
                        disabled={loading}
                        sx={{ 
                            backgroundColor: '#1565c0', 
                            '&:hover': { backgroundColor: '#0d47a1' } 
                        }}
                    >
                        {loading ? t('common.salvando') : t('common.salvar')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}