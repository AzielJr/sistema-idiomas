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

export default function TurmasCadastro() {
  const navigate = useNavigate();

  const [turma, setTurma] = useState({
    nome_turma: "",
    nivel: "",
    ano: new Date().getFullYear(),
    dias_aula: "",
    horario_inicio: "",
    horario_fim: "",
    professores_id: "",
    sala: "",
    capacidade_max: "",
    material_didatico_id: "",
    num_alunos: 0,
    coordenador_id: "",
    teste: "",
    diadeaula_segunda: false,
    diadeaula_terca: false,
    diadeaula_quarta: false,
    diadeaula_quinta: false,
    diadeaula_sexta: false,
    diadeaula_sabado: false,
    status: 1
  });

  const handleChange = (field: string, value: any) => {
    setTurma((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    alert("Salvar cadastro (futuro): " + JSON.stringify(turma, null, 2));
  };

  const handleVoltar = () => {
    navigate("/cadastros/turmas");
  };

  // Mock data para os selects
  const professores = [
    { id: 1, nome: "Ana Silva" },
    { id: 2, nome: "Carlos Santos" },
    { id: 3, nome: "Maria Oliveira" },
    { id: 4, nome: "João Pereira" }
  ];

  const coordenadores = [
    { id: 1, nome: "Carlos Santos" },
    { id: 2, nome: "Maria Oliveira" },
    { id: 3, nome: "Ana Silva" }
  ];

  const materiaisDidaticos = [
    { id: 1, nome: "English Grammar in Use" },
    { id: 2, nome: "New Headway Elementary" },
    { id: 3, nome: "Business English Course" },
    { id: 4, nome: "Cambridge English Course" }
  ];

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Cadastro / Edição de Turma
      </Typography>

      <Stack spacing={3}>
        {/* Informações Básicas */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Informações Básicas
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label="Nome da Turma"
              value={turma.nome_turma}
              onChange={(e) => handleChange("nome_turma", e.target.value)}
              fullWidth
              required
            />

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth required size="medium">
                  <InputLabel sx={{ fontSize: '16px' }}>Nível</InputLabel>
                  <Select
                    value={turma.nivel}
                    onChange={(e) => handleChange("nivel", e.target.value)}
                    label="Nível"
                    sx={{
                      minHeight: '56px',
                      '& .MuiSelect-select': {
                        fontSize: '16px',
                        padding: '16px 14px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Selecione</em></MenuItem>
                    <MenuItem value="Básico">Básico</MenuItem>
                    <MenuItem value="Intermediário">Intermediário</MenuItem>
                    <MenuItem value="Avançado">Avançado</MenuItem>
                    <MenuItem value="Conversação">Conversação</MenuItem>
                    <MenuItem value="Preparatório">Preparatório</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  label="Ano"
                  type="number"
                  value={turma.ano}
                  onChange={(e) => handleChange("ano", parseInt(e.target.value))}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  label="Horário de Início"
                  type="time"
                  value={turma.horario_inicio}
                  onChange={(e) => handleChange("horario_inicio", e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  label="Horário de Fim"
                  type="time"
                  value={turma.horario_fim}
                  onChange={(e) => handleChange("horario_fim", e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {/* Dias da Semana */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Dias de Aula
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.diadeaula_segunda}
                    onChange={(e) => handleChange("diadeaula_segunda", e.target.checked)}
                  />
                }
                label="Segunda"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.diadeaula_terca}
                    onChange={(e) => handleChange("diadeaula_terca", e.target.checked)}
                  />
                }
                label="Terça"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.diadeaula_quarta}
                    onChange={(e) => handleChange("diadeaula_quarta", e.target.checked)}
                  />
                }
                label="Quarta"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.diadeaula_quinta}
                    onChange={(e) => handleChange("diadeaula_quinta", e.target.checked)}
                  />
                }
                label="Quinta"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.diadeaula_sexta}
                    onChange={(e) => handleChange("diadeaula_sexta", e.target.checked)}
                  />
                }
                label="Sexta"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.diadeaula_sabado}
                    onChange={(e) => handleChange("diadeaula_sabado", e.target.checked)}
                  />
                }
                label="Sábado"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Recursos e Responsáveis */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Recursos e Responsáveis
          </Typography>
          
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ fontSize: '16px' }}>Professor</InputLabel>
                  <Select
                    value={turma.professores_id}
                    onChange={(e) => handleChange("professores_id", e.target.value)}
                    label="Professor"
                    sx={{
                      minHeight: '56px',
                      '& .MuiSelect-select': {
                        fontSize: '16px',
                        padding: '16px 14px'
                      }
                    }}
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
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="medium">
                  <InputLabel sx={{ fontSize: '16px' }}>Coordenador</InputLabel>
                  <Select
                    value={turma.coordenador_id}
                    onChange={(e) => handleChange("coordenador_id", e.target.value)}
                    label="Coordenador"
                    sx={{
                      minHeight: '56px',
                      '& .MuiSelect-select': {
                        fontSize: '16px',
                        padding: '16px 14px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Selecione</em></MenuItem>
                    {coordenadores.map((coordenador) => (
                      <MenuItem key={coordenador.id} value={coordenador.id}>
                        {coordenador.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth size="medium">
              <InputLabel sx={{ fontSize: '16px' }}>Material Didático</InputLabel>
              <Select
                value={turma.material_didatico_id}
                onChange={(e) => handleChange("material_didatico_id", e.target.value)}
                label="Material Didático"
                sx={{
                  minHeight: '56px',
                  '& .MuiSelect-select': {
                    fontSize: '16px',
                    padding: '16px 14px'
                  }
                }}
              >
                <MenuItem value=""><em>Selecione</em></MenuItem>
                {materiaisDidaticos.map((material) => (
                  <MenuItem key={material.id} value={material.id}>
                    {material.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:4}}>
                <TextField
                  label="Sala"
                  value={turma.sala}
                  onChange={(e) => handleChange("sala", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{xs:12, sm:4}}>
                <TextField
                  label="Capacidade Máxima"
                  type="number"
                  value={turma.capacidade_max}
                  onChange={(e) => handleChange("capacidade_max", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{xs:12, sm:4}}>
                <TextField
                  label="Número de Alunos"
                  type="number"
                  value={turma.num_alunos}
                  onChange={(e) => handleChange("num_alunos", parseInt(e.target.value))}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {/* Informações Adicionais */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Informações Adicionais
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label="Teste"
              value={turma.teste}
              onChange={(e) => handleChange("teste", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Dias de Aula (Resumo)"
              value={turma.dias_aula}
              onChange={(e) => handleChange("dias_aula", e.target.value)}
              fullWidth
              placeholder="Ex: Segunda, Quarta, Sexta"
            />

            <FormControl fullWidth size="medium">
              <InputLabel sx={{ fontSize: '16px' }}>Status</InputLabel>
              <Select
                value={turma.status}
                onChange={(e) => handleChange("status", e.target.value)}
                label="Status"
                sx={{
                  minHeight: '56px',
                  '& .MuiSelect-select': {
                    fontSize: '16px',
                    padding: '16px 14px'
                  }
                }}
              >
                <MenuItem value={1}>Ativa</MenuItem>
                <MenuItem value={0}>Inativa</MenuItem>
              </Select>
            </FormControl>
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