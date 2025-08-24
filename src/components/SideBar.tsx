import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  ListItemIcon
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarTodayIcon,
  ExitToApp as ExitToAppIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  Create as CreateIcon,
  AccountBalance as AccountBalanceIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  SupervisorAccount as SupervisorAccountIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  LocationCity as LocationCityIcon,
  Security as SecurityIcon
} from "@mui/icons-material";
import { useAuth } from '../contexts/AuthContextSimple';
import { useEffect } from 'react';

type Secoes =
  | "Dashboard"
  | "Cadastros"
  | "Mov"
  | "Projetos"
  | "SecretariaAdm"
  | "Financeiro"
  | "Administracao"
  | "Agenda"
  | "Logout";
  interface SideBarProps{
    mobileOpen?:boolean;
    onClose?:() => void;
    variant:'permanent' | 'temporary'
  }
export default function SideBar({mobileOpen=false, onClose, variant="permanent"}:SideBarProps) {
  const [expandir, setExpandir] = useState<Record<Secoes, boolean>>({
    Dashboard: false,
    Cadastros: false,
    Mov: false,
    Projetos: false,
    SecretariaAdm: false,
    Financeiro: false,
    Administracao: false,
    Agenda: false,
    Logout: false
  });
  
  const [unidade, setUnidade] = useState<{logomarca?: string, fantasia?: string}>({});
  const navigate = useNavigate();
  const { logout, user, fetchWithAuthSafe } = useAuth();
  const { t } = useTranslation();

  // Função para converter ByteArray para Base64 (igual a UnidadesCadastro.tsx)
  const converterByteArrayParaBase64 = (byteArray: string) => {
    if (!byteArray) return '';
    if (byteArray.startsWith('data:')) return byteArray;
    return `data:image/jpeg;base64,${byteArray}`;
  };

  // Carregar dados da unidade do usuário logado
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
                const logomarcaConvertida = unidadeData.logomarca ? converterByteArrayParaBase64(unidadeData.logomarca) : '';
                console.log('🖼️ Logomarca original:', unidadeData.logomarca);
                console.log('🖼️ Logomarca convertida:', logomarcaConvertida);
                setUnidade({
                  logomarca: logomarcaConvertida,
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

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const alterarExpandir = (secao: Secoes) => {
    setExpandir((prev) => {
      const novoEstado: Record<Secoes, boolean> = {
        Dashboard: false,
        Cadastros: false,
        Mov: false,
        Projetos: false,
        SecretariaAdm: false,
        Financeiro: false,
        Administracao: false,
        Agenda: false,
        Logout: false,
      };
      novoEstado[secao] = !prev[secao];
      return novoEstado;
    });
  };

  const itemStyle = {
    minHeight: 33,
    height: 33,
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      transform: 'translateX(4px)',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
      '& .MuiListItemIcon-root': {
        color: '#1976d2'
      },
      '& .MuiTypography-root': {
        fontWeight: 600,
        color: '#1976d2'
      }
    }
  };

  const subItemStyle = {
    pl: 4,
    minHeight: 29,
    height: 29,
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.05)',
      transform: 'translateX(6px)',
      '& .MuiListItemIcon-root': {
        color: '#1976d2'
      },
      '& .MuiTypography-root': {
        fontWeight: 500,
        color: '#1976d2'
      }
    }
  };

  const subItemTypographyStyle = {
    fontSize: "0.875rem",
    color: "#555",
    fontWeight: 400
  };

  const iconStyle = {
    color: '#666',
    minWidth: 40,
    transition: 'color 0.3s ease'
  };

  return (
    <Drawer
      variant={variant}
      open = {variant==='temporary'?mobileOpen:true}
      ModalProps={{keepMounted:true}}
      onClose={onClose}
      sx={{
            width: 290,
        flexShrink: 0,
        display:{xs:variant==='permanent'?'none':'block',md:'block'},
        [`& .MuiDrawer-paper`]: {
              width: 290,
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          color: "text.primary",
          borderRight: "1px solid #e0e0e0",
          boxSizing: "border-box",
          boxShadow: '0 0 20px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "16px 12px",
          gap: 1
        }}
      >
        <Box
          sx={{
              width: 200,
              height: 120,
              border: unidade.logomarca ? 'none' : '2px dashed #ccc',
            borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: unidade.logomarca ? `url(${unidade.logomarca})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: unidade.logomarca ? 'transparent' : '#f5f5f5',
              marginBottom: 3,
              mx: 2,
              boxShadow: unidade.logomarca ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none'
            }}
            onClick={() => console.log('🖼️ Estado atual da imagem:', unidade.logomarca)}
          >
                         {!unidade.logomarca && (
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 700,
                letterSpacing: '0.5px',
                textAlign: 'center',
                   color: '#999'
              }}
            >
                 {unidade.fantasia || 'Custom Idiomas'}
            </Typography>
             )}
        </Box>

        <List sx={{ padding: 0 }}>
          <ListItemButton
            sx={itemStyle}
            onClick={() => navigate("/dashboard/default")}
          >
            <ListItemIcon sx={iconStyle}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText 
              primary={t('menu.dashboard')} 
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            />
          </ListItemButton>

          {[
            {
              secao: "Cadastros",
              label: t('menu.cadastros'),
              icon: <PersonAddIcon />,
              items: [
                { text: t('menu.alunos'), path: "/cadastros/alunos", icon: <PeopleIcon /> },
                { text: t('menu.professores'), path: "/cadastros/professores", icon: <SchoolIcon /> },
                { text: t('menu.materialDidatico'), path: "/cadastros/material-didatico", icon: <MenuBookIcon /> },
                { text: t('menu.turmas'), path: "/cadastros/turmas", icon: <GroupIcon /> },
                { text: t('menu.aulas'), path: "/cadastros/aulas", icon: <AssignmentIcon /> }
              ]
            },
            {
              secao: "Mov",
              label: t('menu.academico'),
              icon: <SchoolIcon />,
              items: [
                { text: t('menu.planoAulas'), path: "/movimentacoes/plano-aulas", icon: <AssignmentIcon /> },
                { text: t('menu.presencaFaltas'), path: "/movimentacoes/presenca-faltas", icon: <SupervisorAccountIcon /> }
              ]
            },
            {
              secao: "Projetos",
              label: t('menu.projetos'),
              icon: <CreateIcon />,
              items: [
                { text: t('menu.leitura'), path: "/projetos/leitura", icon: <MenuBookIcon /> },
                { text: t('menu.escrita'), path: "/projetos/escrita", icon: <CreateIcon /> }
              ]
            },
            {
              secao: "SecretariaAdm",
              label: t('menu.secretariaAdm'),
              icon: <BusinessIcon />,
              items: [
                { text: t('menu.matriculas'), path: "/secretaria-adm/matriculas", icon: <PersonAddIcon /> },
                { text: t('menu.solicitacoes'), path: "/secretaria-adm/solicitacoes", icon: <AssignmentIcon /> },
                { text: t('menu.estoqueMaterial'), path: "/secretaria-adm/estoque-material", icon: <InventoryIcon /> },
                { text: t('menu.pedidosMaterial'), path: "/secretaria-adm/pedidos-material", icon: <ShoppingCartIcon /> }
              ]
            },
            {
              secao: "Financeiro",
              label: t('menu.financeiro'),
              icon: <AttachMoneyIcon />,
              items: [
                { text: t('menu.mensalidades'), path: "/financeiro/mensalidades", icon: <ReceiptIcon /> },
                { text: t('menu.despesas'), path: "/financeiro/despesas", icon: <AttachMoneyIcon /> },
                { text: t('menu.tiposDespesa'), path: "/financeiro/tipos-despesa", icon: <CategoryIcon /> }
              ]
            },
            {
              secao: "Administracao",
              label: t('menu.administracao'),
              icon: <SettingsIcon />,
              items: [
                { text: t('menu.unidade'), path: "/administracao/unidade", icon: <LocationCityIcon /> },
                { text: t('menu.niveisAcesso'), path: "/administracao/grupos-acesso", icon: <SecurityIcon /> },
                { text: t('menu.usuarios'), path: "/administracao/usuarios", icon: <PeopleIcon /> },
                { text: t('menu.logSistema'), path: "/administracao/log-sistema", icon: <HistoryIcon /> }
              ]
            }
            
          ].map(({ secao, label, icon, items }) => (
            <Box
              key={secao}
              sx={{
                backgroundColor: expandir[secao as Secoes] ? "rgba(25, 118, 210, 0.05)" : "inherit",
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                transition: 'all 0.3s ease'
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    ...itemStyle,
                    backgroundColor: expandir[secao as Secoes] ? "rgba(25, 118, 210, 0.08)" : "inherit",
                    mx: 0
                  }}
                  onClick={() => alterarExpandir(secao as Secoes)}
                >
                  <ListItemIcon sx={{
                    ...iconStyle,
                    color: expandir[secao as Secoes] ? "#1976d2" : "#666"
                  }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: expandir[secao as Secoes] ? 600 : 500,
                      color: expandir[secao as Secoes] ? "#1976d2" : "inherit",
                      fontSize: '0.95rem'
                    }}
                  />
                  {expandir[secao as Secoes] ? (
                    <ExpandLessIcon sx={{ color: '#1976d2' }} />
                  ) : (
                    <ExpandMoreIcon sx={{ color: '#666' }} />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandir[secao as Secoes]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pb: 1 }}>
                  {items.map((item) => (
                    <ListItemButton
                      key={item.text}
                      sx={{
                        ...subItemStyle,
                        mx: 0,
                        ml: 1,
                        mr: 1
                      }}
                      onClick={() => navigate(item.path)}
                    >
                      <ListItemIcon sx={{
                        ...iconStyle,
                         minWidth: 32,
                         ml: 0.5
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={subItemTypographyStyle}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}

          <ListItemButton
            sx={{
              ...itemStyle,
              mt: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                transform: 'translateX(4px)',
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.2)',
                '& .MuiListItemIcon-root': {
                  color: '#f44336'
                },
                '& .MuiTypography-root': {
                  fontWeight: 600,
                  color: '#f44336'
                }
              }
            }}
            onClick={handleLogout}
          >
            <ListItemIcon sx={{
              ...iconStyle,
              color: '#d32f2f'
            }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#d32f2f'
              }}
            />
          </ListItemButton>

        </List>
      </Box>
    </Drawer>
  );
}
