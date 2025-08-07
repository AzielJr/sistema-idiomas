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
  Chip 
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Search as SearchIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Aula {
  id: number;
  turmas_id: number;
  turma_nome: string;
  data_aula: string;
  horario_inicio: string;
  horario_fim: string;
  professores_id: number;
  professor_nome: string;
  aulas: number;
  status: number;
}

export default function Aulas() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");

  const [aulas, setAulas] = useState<Aula[]>([
    { 
      id: 1, 
      turmas_id: 1,
      turma_nome: "Inglês Básico A1",
      data_aula: "2024-01-15",
      horario_inicio: "08:00",
      horario_fim: "09:30",
      professores_id: 1,
      professor_nome: "Ana Silva",
      aulas: 1,
      status: 1
    },
    { 
      id: 2, 
      turmas_id: 1,
      turma_nome: "Inglês Básico A1",
      data_aula: "2024-01-17",
      horario_inicio: "08:00",
      horario_fim: "09:30",
      professores_id: 1,
      professor_nome: "Ana Silva",
      aulas: 2,
      status: 1
    },
    { 
      id: 3, 
      turmas_id: 2,
      turma_nome: "Inglês Intermediário B1",
      data_aula: "2024-01-16",
      horario_inicio: "14:00",
      horario_fim: "15:30",
      professores_id: 2,
      professor_nome: "Carlos Santos",
      aulas: 1,
      status: 0
    },
    { 
      id: 4, 
      turmas_id: 3,
      turma_nome: "Inglês Avançado C1",
      data_aula: "2024-01-15",
      horario_inicio: "19:00",
      horario_fim: "20:30",
      professores_id: 3,
      professor_nome: "Maria Oliveira",
      aulas: 1,
      status: 1
    }
  ]);

  const aulasFiltradas = aulas.filter((aula) =>
    aula.turma_nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    aula.professor_nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    aula.data_aula.includes(pesquisa)
  );

  const handleExcluir = (id: number) => {
    if (window.confirm("Confirma a exclusão desta aula?")) {
      setAulas(aulas.filter((aula) => aula.id !== id));
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/aulas/cadastro/${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/aulas/cadastro");
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return "success"; // Ativa
      case 0: return "error";   // Inativa
      default: return "default";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1: return "Ativa";
      case 0: return "Inativa";
      default: return "Indefinido";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">Cadastro de Aulas</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleCadastrar}
          sx={{ textTransform: 'none' }}
        >
          Cadastrar
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} mb={2}>
        <TextField
          label="Pesquisar aula"
          variant="outlined"
          size="small"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Turma, professor ou data..."
        />
        <Button 
          variant="outlined" 
          startIcon={<SearchIcon />} 
          sx={{ textTransform: 'none' }}
        >
          Pesquisar
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ height: 40 }}>
              <TableCell>ID</TableCell>
              <TableCell>Turma</TableCell>
              <TableCell>Data da Aula</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Nº Aula</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aulasFiltradas.map((aula) => (
              <TableRow key={aula.id} sx={{ height: 50 }}>
                <TableCell>{aula.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {aula.turma_nome}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(aula.data_aula)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {aula.horario_inicio} - {aula.horario_fim}
                  </Typography>
                </TableCell>
                <TableCell>{aula.professor_nome}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    Aula {aula.aulas}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(aula.status)} 
                    color={getStatusColor(aula.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleEditar(aula.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleExcluir(aula.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {aulasFiltradas.length === 0 && (
              <TableRow sx={{ height: 50 }}>
                <TableCell colSpan={8} align="center">
                  Nenhuma aula encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}