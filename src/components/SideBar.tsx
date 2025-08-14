import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import { useAuth } from '../contexts/AuthContext';

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
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover .MuiTypography-root': { fontWeight: 'bold' }
  };

  const subItemStyle = {
    pl: 4,
    minHeight: 33,
    height: 33,
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover .MuiTypography-root': { fontWeight: 'bold' }
  };

  const subItemTypographyStyle = {
    fontSize: "0.875rem",
    color: "#004080"
  };

  return (
    <Drawer
      variant={variant}
      open = {variant==='temporary'?mobileOpen:true}
      ModalProps={{keepMounted:true}}
      onClose={onClose}
      sx={{
        width: 300,
        flexShrink: 0,
        display:{xs:variant==='permanent'?'none':'block',md:'block'},
        [`& .MuiDrawer-paper`]: {
          width: 300,
          backgroundColor: "#f5f5f5",
          color: "text.primary",
          borderRight: "none",
          boxSizing: "border-box"
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 16px",
            marginBottom: 2
          }}
        >
          {/* Espaço para logomarca da empresa */}
          <Box 
            sx={{ 
              width: '200px', 
              height: '80px', 
              border: '2px dashed #ccc', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9f9f9'
            }}
          >
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Logo da<br />Empresa
            </Typography>
          </Box>
        </Box>

        <List sx={{ padding: 0 }}>
          <ListItemButton
            sx={itemStyle}
            onClick={() => navigate("/dashboard/default")}
          >
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {[
            {
              secao: "Cadastros",
              label: "Cadastros",
              items: [
                { text: "Alunos", path: "/cadastros/alunos" },
                { text: "Professores", path: "/cadastros/professores" },
                { text: "Material Didático", path: "/cadastros/material-didatico" },
                { text: "Turmas", path: "/cadastros/turmas" },
                { text: "Aulas", path: "/cadastros/aulas" }
              ]
            },
            {
              secao: "Mov",
              label: "Movimentações",
              items: [
                { text: "Planos de Aula", path: "/movimentacoes/plano-aulas" },
                { text: "Presença / Faltas", path: "/movimentacoes/presenca-faltas" }
              ]
            },
            {
              secao: "Projetos",
              label: "Projetos",
              items: [
                { text: "Leitura", path: "/projetos/leitura" },
                { text: "Escrita", path: "/projetos/escrita" }
              ]
            },
            {
              secao: "SecretariaAdm",
              label: "Secretaria e ADM",
              items: [
                { text: "Matrículas", path: "/secretaria-adm/matriculas" },
                { text: "Solicitações", path: "/secretaria-adm/solicitacoes" },
                { text: "Estoque Material ADM", path: "/secretaria-adm/estoque-material" },
                { text: "Pedidos Material", path: "/secretaria-adm/pedidos-material" }
              ]
            },
            {
              secao: "Financeiro",
              label: "Financeiro",
              items: [
                { text: "Mensalidades", path: "/financeiro/mensalidades" },
                { text: "Despesas", path: "/financeiro/despesas" },
                { text: "Tipos de Despesa", path: "/financeiro/tipos-despesa" }
              ]
            },
            {
              secao: "Administracao",
              label: "Administração",
              items: [
                { text: "Unidade", path: "/administracao/unidade" },
                { text: "Grupos de Acesso", path: "/administracao/grupos-acesso" },
                { text: "Usuários", path: "/administracao/usuarios" },
                { text: "LOG do Sistema", path: "/administracao/log-sistema" }
              ]
            }
            
          ].map(({ secao, label, items }) => (
            <Box
              key={secao}
              sx={{
                backgroundColor: expandir[secao as Secoes] ? "#e0e0e0" : "inherit"
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={itemStyle}
                  onClick={() => alterarExpandir(secao as Secoes)}
                >
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: expandir[secao as Secoes] ? "bold" : "normal",
                      color: expandir[secao as Secoes] ? "black" : "inherit"
                    }}
                  />
                  {expandir[secao as Secoes] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandir[secao as Secoes]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {items.map((item) => (
                    <ListItemButton
                      key={item.text}
                      sx={subItemStyle}
                      onClick={() => navigate(item.path)}
                    >
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
            sx={itemStyle}
            onClick={() => navigate("/agenda/default")}
          >
            <ListItemText primary="Minha Agenda" />
          </ListItemButton>

          <ListItemButton
            sx={itemStyle}
            onClick={handleLogout}
          >
            <ListItemText primary="Logout" />
          </ListItemButton>

        </List>
      </Box>
    </Drawer>
  );
}
