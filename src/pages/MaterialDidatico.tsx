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
  Avatar,
  Chip
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Search as SearchIcon,
  Book as BookIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MaterialDidatico {
  id: number;
  nome: string;
  editora: string;
  autor: string;
  obs: string;
  foto_capa?: string; // Base64 ou URL da imagem
  status: number; // 1 = Ativo, 0 = Inativo
}

export default function MaterialDidatico() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");

  const [materiais, setMateriais] = useState<MaterialDidatico[]>([
    { 
      id: 1, 
      nome: "English Grammar in Use", 
      editora: "Cambridge University Press", 
      autor: "Raymond Murphy", 
      obs: "Livro intermediário",
      foto_capa: "",
      status: 1
    },
    { 
      id: 2, 
      nome: "New Headway Elementary", 
      editora: "Oxford University Press", 
      autor: "John Soars", 
      obs: "Curso completo para iniciantes",
      foto_capa: "",
      status: 1
    },
    { 
      id: 3, 
      nome: "Business English Course", 
      editora: "Pearson", 
      autor: "David Cotton", 
      obs: "Inglês para negócios",
      foto_capa: "",
      status: 0
    },
    { 
      id: 4, 
      nome: "Interchange Intro", 
      editora: "Cambridge", 
      autor: "Jack C. Richards", 
      obs: "Material básico",
      foto_capa: "",
      status: 1
    }
  ]);

  const materiaisFiltrados = materiais.filter((material) =>
    material.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    material.editora.toLowerCase().includes(pesquisa.toLowerCase()) ||
    material.autor.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const handleExcluir = (id: number) => {
    if (window.confirm("Confirma a exclusão deste material didático?")) {
      setMateriais(materiais.filter((material) => material.id !== id));
    }
  };

  const handleEditar = (id: number) => {
    navigate(`/cadastros/material-didatico/cadastro/${id}`);
  };

  const handleCadastrar = () => {
    navigate("/cadastros/material-didatico/cadastro");
  };

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">Material Didático</Typography>
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
          label="Pesquisar material"
          variant="outlined"
          size="small"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Nome, editora ou autor..."
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
              <TableCell>Capa</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Editora</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materiaisFiltrados.map((material) => (
              <TableRow key={material.id} sx={{ height: 50 }}>
                <TableCell>
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                    src={material.foto_capa}
                  >
                    <BookIcon fontSize="small" />
                  </Avatar>
                </TableCell>
                <TableCell>{material.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {material.nome}
                  </Typography>
                </TableCell>
                <TableCell>{material.editora}</TableCell>
                <TableCell>{material.autor}</TableCell>
                <TableCell>
                  <Chip 
                    label={material.status === 1 ? "Ativo" : "Inativo"} 
                    color={material.status === 1 ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small" onClick={() => handleEditar(material.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleExcluir(material.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {materiaisFiltrados.length === 0 && (
              <TableRow sx={{ height: 50 }}>
                <TableCell colSpan={7} align="center">
                  Nenhum material didático encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}