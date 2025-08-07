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
  Search as SearchIcon 
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Professores() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");

  const [professores, setProfessores] = useState([
    { 
      id: 1, 
      nome: "Ana Silva", 
      formacao: "Letras - Inglês",
      experiencia_anos: 5,
      data_admissao: "2020-03-15",
      salario: 3500.00,
      ativo: true,
      coordenador: false,
      qtd_turmas: 3
    },
    { 
      id: 2, 
      nome: "Carlos Santos", 
      formacao: "Pedagogia",
      experiencia_anos: 8,
      data_admissao: "2018-08-20",
      salario: 4200.00,
      ativo: true,
      coordenador: true,
      qtd_turmas: 2
    },
    { 
      id: 3, 
      nome: "Maria Oliveira", 
      formacao: "Letras - Espanhol",
      experiencia_anos: 3,
      data_admissao: "2022-01-10",
      salario: 3000.00,
      ativo: false,
      coordenador: false,
      qtd_turmas: 0
    }
  ]);

  const professoresFiltrados = professores.filter((professor) =>
    professor.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handleExcluir = (id: number) => {
    if (window.confirm("Confirma a exclusão deste professor?")) {
      setProfessores(professores.filter((professor) => professor.id !== id));
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/professores/cadastro/${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/professores/cadastro");
  };



  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">Cadastro de Professores</Typography>
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
          label="Pesquisar professor"
          variant="outlined"
          size="small"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
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
            <TableRow sx={{ height: 30 }}>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Formação</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Coordenador</TableCell>
              <TableCell>Turmas</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professoresFiltrados.map((professor) => (
              <TableRow key={professor.id} sx={{ height: 30 }}>
                <TableCell>{professor.id}</TableCell>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.formacao}</TableCell>
                <TableCell>
                  <Chip 
                    label={professor.ativo ? "Ativo" : "Inativo"} 
                    color={professor.ativo ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={professor.coordenador ? "Sim" : "Não"} 
                    color={professor.coordenador ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{professor.qtd_turmas}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleEditar(professor.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleExcluir(professor.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {professoresFiltrados.length === 0 && (
              <TableRow sx={{ height: 30 }}>
                <TableCell colSpan={7} align="center">
                  Nenhum professor encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}