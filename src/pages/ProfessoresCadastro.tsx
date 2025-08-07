import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfessoresCadastro() {
  const navigate = useNavigate();

  const [professor, setProfessor] = useState({
    nome: "",
    formacao: "",
    experiencia_anos: "",
    data_admissao: "",
    data_nascimento: "",
    salario: "",
    ativo: true,
    coordenador: false,
    qtd_turmas: "",
    system_users_id: ""
  });

  const handleChange = (field: string, value: any) => {
    setProfessor((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    alert("Salvar cadastro (futuro): " + JSON.stringify(professor, null, 2));
  };

  const handleVoltar = () => {
    navigate("/cadastros/professores");
  };

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Cadastro / Edição de Professor
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Nome Completo"
          value={professor.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          fullWidth
          required
        />

        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:6}}>
            <TextField
              label="Data de Nascimento"
              type="date"
              value={professor.data_nascimento}
              onChange={(e) => handleChange("data_nascimento", e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid size={{xs:12, sm:6}}>
            <TextField
              label="Data de Admissão"
              type="date"
              value={professor.data_admissao}
              onChange={(e) => handleChange("data_admissao", e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        <TextField
          label="Formação Acadêmica"
          value={professor.formacao}
          onChange={(e) => handleChange("formacao", e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="Ex: Letras - Inglês, Pedagogia, Licenciatura em..."
        />

        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:4}}>
            <TextField
              label="Experiência (anos)"
              type="number"
              value={professor.experiencia_anos}
              onChange={(e) => handleChange("experiencia_anos", e.target.value)}
              fullWidth
              inputProps={{ min: 0, max: 50 }}
            />
          </Grid>
          <Grid size={{xs:12, sm:4}}>
            <TextField
              label="Salário (R$)"
              type="number"
              value={professor.salario}
              onChange={(e) => handleChange("salario", e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              placeholder="0,00"
            />
          </Grid>
          <Grid size={{xs:12, sm:4}}>
            <TextField
              label="Quantidade de Turmas"
              type="number"
              value={professor.qtd_turmas}
              onChange={(e) => handleChange("qtd_turmas", e.target.value)}
              fullWidth
              inputProps={{ min: 0, max: 20 }}
            />
          </Grid>
        </Grid>

        <FormControl fullWidth>
          <InputLabel>Usuário do Sistema</InputLabel>
          <Select
            value={professor.system_users_id}
            onChange={(e) => handleChange("system_users_id", e.target.value)}
            label="Usuário do Sistema"
          >
            <MenuItem value=""><em>Selecione um usuário</em></MenuItem>
            <MenuItem value="1">Admin - Administrador</MenuItem>
            <MenuItem value="2">Prof1 - Professor 1</MenuItem>
            <MenuItem value="3">Prof2 - Professor 2</MenuItem>
            <MenuItem value="4">Coord1 - Coordenador 1</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={professor.ativo}
                onChange={(e) => handleChange("ativo", e.target.checked)}
              />
            }
            label="Professor Ativo"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={professor.coordenador}
                onChange={(e) => handleChange("coordenador", e.target.checked)}
              />
            }
            label="É Coordenador"
          />
        </Box>

        <Box mt={2} display="flex" gap={2}>
          <Button 
            variant="contained" 
            onClick={handleSalvar} 
            sx={{ textTransform: 'none' }}
          >
            Salvar
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleVoltar} 
            sx={{ textTransform: 'none' }}
          >
            Voltar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}