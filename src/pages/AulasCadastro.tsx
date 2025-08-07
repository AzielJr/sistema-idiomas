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
  Typography,
  Paper
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AulasCadastro() {
  const navigate = useNavigate();

  const [aula, setAula] = useState({
    turmas_id: "",
    data_aula: "",
    horario_inicio: "",
    horario_fim: "",
    professores_id: "",
    aulas: "",
    ativo: true
  });

  const handleChange = (field: string, value: any) => {
    setAula((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    alert("Salvar cadastro (futuro): " + JSON.stringify(aula, null, 2));
  };

  const handleVoltar = () => {
    navigate("/cadastros/aulas");
  };

  // Mock data para os selects
  const turmas = [
    { id: 1, nome: "Inglês Básico A1" },
    { id: 2, nome: "Inglês Intermediário B1" },
    { id: 3, nome: "Inglês Avançado C1" },
    { id: 4, nome: "Conversação Avançada" }
  ];

  const professores = [
    { id: 1, nome: "Ana Silva" },
    { id: 2, nome: "Carlos Santos" },
    { id: 3, nome: "Maria Oliveira" },
    { id: 4, nome: "João Pereira" }
  ];

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Cadastro / Edição de Aula
      </Typography>

      <Stack spacing={3}>
        {/* Informações da Aula */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Informações da Aula
          </Typography>
          
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth required>
                  <InputLabel>Turma</InputLabel>
                  <Select
                    value={aula.turmas_id}
                    onChange={(e) => handleChange("turmas_id", e.target.value)}
                    label="Turma"
                  >
                    <MenuItem value=""><em>Selecione</em></MenuItem>
                    {turmas.map((turma) => (
                      <MenuItem key={turma.id} value={turma.id}>
                        {turma.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth required>
                  <InputLabel>Professor</InputLabel>
                  <Select
                    value={aula.professores_id}
                    onChange={(e) => handleChange("professores_id", e.target.value)}
                    label="Professor"
                  >
                    <MenuItem value=""><em>Selecione</em></MenuItem>
                    {professores.map((professor) => (
                      <MenuItem key={professor.id} value={professor.id}>
                        {professor.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:4}}>
                <TextField
                  label="Data da Aula"
                  type="date"
                  value={aula.data_aula}
                  onChange={(e) => handleChange("data_aula", e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid size={{xs:12, sm:4}}>
                <TextField
                  label="Horário de Início"
                  type="time"
                  value={aula.horario_inicio}
                  onChange={(e) => handleChange("horario_inicio", e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid size={{xs:12, sm:4}}>
                <TextField
                  label="Horário de Fim"
                  type="time"
                  value={aula.horario_fim}
                  onChange={(e) => handleChange("horario_fim", e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  label="Número da Aula"
                  type="number"
                  value={aula.aulas}
                  onChange={(e) => handleChange("aulas", e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <Box display="flex" alignItems="center" height="100%">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={aula.ativo}
                        onChange={(e) => handleChange("ativo", e.target.checked)}
                      />
                    }
                    label="Ativo?"
                  />
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {/* Botões de Ação */}
        <Box display="flex" gap={2} mt={3}>
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