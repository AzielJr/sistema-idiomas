import { Box, List, ListItem, ListItemText, Paper, Typography, Avatar, ListItemAvatar, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Comentario } from "../interface/ComentarioData";

interface ListaComentariosProps {
  comentarios?: Comentario[];
}

export default function ListaComentarios({ comentarios }: ListaComentariosProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Dados de exemplo para avisos recentes
  const [avisosExemplo] = useState<Comentario[]>([
    {
      id: 1,
      titulo: "Reunião de Professores",
      texto: "Reunião pedagógica marcada para 15/06 às 14h",
      data: "10/06/2023",
      tipo: "aviso"
    },
    {
      id: 2,
      titulo: "Entrega de Notas",
      texto: "Prazo final para entrega das avaliações do bimestre",
      data: "05/06/2023",
      tipo: "lembrete"
    },
    {
      id: 3,
      titulo: "Festa Junina",
      texto: "Preparativos para a festa junina da escola começam na próxima semana",
      data: "01/06/2023",
      tipo: "comunicado"
    }
  ]);

  // Usa os comentários passados como prop ou os exemplos
  const dadosExibidos = comentarios || avisosExemplo;

  return (
    <Box>
      <List disablePadding sx={{ maxHeight: isSmallScreen ? 200 : 300, overflow: "auto" }}>
        {dadosExibidos.map((aviso) => (
          <Paper 
            key={aviso.id} 
            elevation={0} 
            sx={{
              p: isSmallScreen ? 1.5 : 2, 
              mb: 2, 
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider"
            }}
          >
            <ListItem alignItems="flex-start" disableGutters>
              <ListItemAvatar>
                <Avatar sx={{ 
                  bgcolor: "primary.main",
                  width: isSmallScreen ? 30 : 40,
                  height: isSmallScreen ? 30 : 40
                }}>
                  <NotificationsIcon sx={{ fontSize: isSmallScreen ? 16 : 24 }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={
                  <Typography variant={isSmallScreen ? "subtitle2" : "subtitle1"} fontWeight="medium">
                    {aviso.titulo}
                  </Typography>
                } 
                secondary={
                  <>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                      {aviso.texto}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: isSmallScreen ? 0.5 : 1, display: "block" }}>
                      {aviso.data}
                    </Typography>
                  </>
                } 
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
}