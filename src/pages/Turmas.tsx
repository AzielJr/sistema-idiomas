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
  Group as GroupIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Turma {
  id: number;
  nome_turma: string;
  nivel: string;
  ano: number;
  dias_aula: string;
  horario_inicio: string;
  horario_fim: string;
  professores_id: number;
  professor_nome: string;
  sala: string;
  capacidade_max: number;
  material_didatico_id: number;
  material_nome: string;
  num_alunos: number;
  coordenador_id: number;
  coordenador_nome: string;
  teste: string;
  diadeaula_segunda: number;
  diadeaula_terca: number;
  diadeaula_quarta: number;
  diadeaula_quinta: number;
  diadeaula_sexta: number;
  diadeaula_sabado: number;
  status: number;
}

export default function Turmas() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");

  const [turmas, setTurmas] = useState<Turma[]>([
    { 
      id: 1, 
      nome_turma: "Inglês Básico A1", 
      nivel: "Básico", 
      ano: 2024,
      dias_aula: "Segunda, Quarta",
      horario_inicio: "08:00",
      horario_fim: "09:30",
      professores_id: 1,
      professor_nome: "Ana Silva",
      sala: "Sala 101",
      capacidade_max: 15,
      material_didatico_id: 1,
      material_nome: "English Grammar in Use",
      num_alunos: 12,
      coordenador_id: 2,
      coordenador_nome: "Carlos Santos",
      teste: "Teste A1",
      diadeaula_segunda: 1,
      diadeaula_terca: 0,
      diadeaula_quarta: 1,
      diadeaula_quinta: 0,
      diadeaula_sexta: 0,
      diadeaula_sabado: 0,
      status: 1
    },
    { 
      id: 2, 
      nome_turma: "Inglês Intermediário B1", 
      nivel: "Intermediário", 
      ano: 2024,
      dias_aula: "Terça, Quinta",
      horario_inicio: "14:00",
      horario_fim: "15:30",
      professores_id: 2,
      professor_nome: "Carlos Santos",
      sala: "Sala 102",
      capacidade_max: 20,
      material_didatico_id: 2,
      material_nome: "New Headway Elementary",
      num_alunos: 18,
      coordenador_id: 2,
      coordenador_nome: "Carlos Santos",
      teste: "Teste B1",
      diadeaula_segunda: 0,
      diadeaula_terca: 1,
      diadeaula_quarta: 0,
      diadeaula_quinta: 1,
      diadeaula_sexta: 0,
      diadeaula_sabado: 0,
      status: 1
    },
    { 
      id: 3, 
      nome_turma: "Inglês Avançado C1", 
      nivel: "Avançado", 
      ano: 2024,
      dias_aula: "Segunda, Sexta",
      horario_inicio: "19:00",
      horario_fim: "20:30",
      professores_id: 3,
      professor_nome: "Maria Oliveira",
      sala: "Sala 103",
      capacidade_max: 12,
      material_didatico_id: 3,
      material_nome: "Business English Course",
      num_alunos: 8,
      coordenador_id: 2,
      coordenador_nome: "Carlos Santos",
      teste: "Teste C1",
      diadeaula_segunda: 1,
      diadeaula_terca: 0,
      diadeaula_quarta: 0,
      diadeaula_quinta: 0,
      diadeaula_sexta: 1,
      diadeaula_sabado: 0,
      status: 0
    }
  ]);

  const turmasFiltradas = turmas.filter((turma) =>
    turma.nome_turma.toLowerCase().includes(pesquisa.toLowerCase()) ||
    turma.nivel.toLowerCase().includes(pesquisa.toLowerCase()) ||
    turma.professor_nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handleExcluir = (id: number) => {
    if (window.confirm("Confirma a exclusão desta turma?")) {
      setTurmas(turmas.filter((turma) => turma.id !== id));
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/turmas/cadastro/${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/turmas/cadastro");
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

  const getNivelColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case "básico": return "info";
      case "intermediário": return "warning";
      case "avançado": return "error";
      default: return "default";
    }
  };

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">Cadastro de Turmas</Typography>
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
          label="Pesquisar turma"
          variant="outlined"
          size="small"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Nome, nível ou professor..."
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
              <TableCell>Nome da Turma</TableCell>
              <TableCell>Nível</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Dias/Horário</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Alunos</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turmasFiltradas.map((turma) => (
              <TableRow key={turma.id} sx={{ height: 50 }}>
                <TableCell>{turma.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {turma.nome_turma}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={turma.nivel} 
                    color={getNivelColor(turma.nivel)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{turma.ano}</TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    {turma.dias_aula}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {turma.horario_inicio} - {turma.horario_fim}
                  </Typography>
                </TableCell>
                <TableCell>{turma.professor_nome}</TableCell>
                <TableCell>{turma.sala}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <GroupIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {turma.num_alunos}/{turma.capacidade_max}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(turma.status)} 
                    color={getStatusColor(turma.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleEditar(turma.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleExcluir(turma.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {turmasFiltradas.length === 0 && (
              <TableRow sx={{ height: 50 }}>
                <TableCell colSpan={10} align="center">
                  Nenhuma turma encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}