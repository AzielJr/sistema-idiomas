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

export default function Alunos() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");

  const [alunos, setAlunos] = useState([
    { id: 1, nome: "João Silva", ativo: true },
    { id: 2, nome: "Maria Souza", ativo: true },
    { id: 3, nome: "Carlos Oliveira", ativo: false }
  ]);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handleExcluir = (id: number) => {
    if (window.confirm("Confirma a exclusão deste aluno?")) {
      setAlunos(alunos.filter((aluno) => aluno.id !== id));
    }
  };

  const handleEditar = (id: number) => {
    alert(`Editar aluno ID: ${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/alunos/cadastro");
  };

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">Cadastro de Alunos</Typography>
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
          label="Pesquisar aluno"
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
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunosFiltrados.map((aluno) => (
              <TableRow key={aluno.id} sx={{ height: 30 }}>
                <TableCell>{aluno.id}</TableCell>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>
                  <Chip 
                    label={aluno.ativo ? "Ativo" : "Inativo"} 
                    color={aluno.ativo ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleEditar(aluno.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleExcluir(aluno.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {alunosFiltrados.length === 0 && (
              <TableRow sx={{ height: 30 }}>
                <TableCell colSpan={4} align="center">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
