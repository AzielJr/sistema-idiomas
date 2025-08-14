import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography, Container, Avatar, Button, Menu, MenuItem } from "@mui/material";
import SideBar from "./SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import logoSvg from '../assets/logo.svg';
import { useAuth } from '../contexts/AuthContext';

export default function LayoutPrincipal() {
    // Estado para controlar a abertura do menu em dispositivos móveis
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
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
                    </Box>
                </Toolbar>
            </AppBar>
            
            {/* AppBar para desktop */}
            <AppBar 
                position="fixed" 
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: { md: 'calc(100% - 300px)' },
                    ml: { md: '300px' },
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '70px !important' }}>
                    {/* Nome da empresa */}
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Custom Idiomas
                    </Typography>
                    
                    {/* Usuário logado */}
                    <Box display="flex" alignItems="center" gap={2}>
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
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                <PersonIcon />
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {user?.name || 'Usuário'}
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
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} />
                                Sair do Sistema
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
                    width: { xs: '100%', md: 'calc(100% - 300px)' },
                    backgroundColor: '#f8f9fa',
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
                                    © {new Date().getFullYear()} Custom Idiomas
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'center', md: 'right' }}>
                                Sistema de Gestão de Idiomas - Versão 1.0
                            </Typography>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </Box>
    )
}