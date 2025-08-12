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

export default function AlunosCadastro() {
  const [aluno, setAluno] = useState({
    nome: "",
    dataNascimento: "",
    nivel: "",
    filiacaoPai: "",
    filiacaoMae: "",
    responsavel: "",
    responsavelCelular: "",
    emergenciaLigar: "",
    emergenciaLevar: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    bolsista: false,
    ativo: false,
    materialDidatico: ""
  });

  const handleChange = (field: string, value: any) => {
    setAluno((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    alert("Salvar cadastro (futuro): " + JSON.stringify(aluno, null, 2));
  };

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Cadastro / Edição de Aluno
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Nome"
          value={aluno.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          fullWidth
        />

        <Grid container spacing={2}>
          <Grid size={{xs:12, md:4}}>
            <TextField
              label="Data de Nascimento"
              type="date"
              value={aluno.dataNascimento}
              onChange={(e) => handleChange("dataNascimento", e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid size={{xs:12, md:8}}>
            <FormControl fullWidth size="medium">
              <InputLabel sx={{ fontSize: '16px' }}>Nível de Ensino</InputLabel>
              <Select
                value={aluno.nivel}
                onChange={(e) => handleChange("nivel", e.target.value)}
                label="Nível de Ensino"
                sx={{
                  minHeight: '56px',
                  fontSize: '16px',
                  '& .MuiSelect-select': {
                    padding: '16.5px 14px'
                  }
                }}
              >
                <MenuItem value=""><em>Selecione o nível de ensino</em></MenuItem>
                <MenuItem value="Básico">Básico</MenuItem>
                <MenuItem value="Intermediário">Intermediário</MenuItem>
                <MenuItem value="Avançado">Avançado</MenuItem>
                <MenuItem value="Conversação">Conversação</MenuItem>
                <MenuItem value="Preparatório">Preparatório</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth size="medium">
          <InputLabel sx={{ fontSize: '16px' }}>Material Didático Utilizado</InputLabel>
          <Select
            value={aluno.materialDidatico}
            onChange={(e) => handleChange("materialDidatico", e.target.value)}
            label="Material Didático Utilizado"
            sx={{
              minHeight: '56px',
              fontSize: '16px',
              '& .MuiSelect-select': {
                padding: '16.5px 14px'
              }
            }}
          >
            <MenuItem value=""><em>Selecione o material didático</em></MenuItem>
            <MenuItem value="Livro A">Livro A - Básico</MenuItem>
            <MenuItem value="Livro B">Livro B - Intermediário</MenuItem>
            <MenuItem value="Livro C">Livro C - Avançado</MenuItem>
          </Select>
        </FormControl>

        {/* Grid para Filiação Pai e Mãe  size={{xs:6, sm;6, md:7}} */}
        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:6}}> 
            <TextField
              label="Filiação Pai"
              value={aluno.filiacaoPai}
              onChange={(e) => handleChange("filiacaoPai", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12, sm:6}}>
            <TextField
              label="Filiação Mãe"
              value={aluno.filiacaoMae}
              onChange={(e) => handleChange("filiacaoMae", e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:6}}>
            <TextField
              label="Responsável"
              value={aluno.responsavel}
              onChange={(e) => handleChange("responsavel", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12, sm:6}}>
            <TextField
              label="Responsável Celular"
              value={aluno.responsavelCelular}
              onChange={(e) => handleChange("responsavelCelular", e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <TextField
          label="Emergência: Ligar Para"
          value={aluno.emergenciaLigar}
          onChange={(e) => handleChange("emergenciaLigar", e.target.value)}
          fullWidth
        />

        <TextField
          label="Emergência: Levar Para"
          value={aluno.emergenciaLevar}
          onChange={(e) => handleChange("emergenciaLevar", e.target.value)}
          fullWidth
        />

        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:9}}>
            <TextField
              label="CEP"
              value={aluno.cep}
              onChange={(e) => handleChange("cep", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12, sm:3}}>
            <Button variant="outlined" fullWidth sx={{ height: '100%' }}>
              Consultar CEP
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:9}}>
            <TextField
              label="Endereço"
              value={aluno.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12, sm:3}}>
            <TextField
              label="Número"
              value={aluno.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12, sm:12}}>
            <TextField
              label="Complemento"
              value={aluno.complemento}
              onChange={(e) => handleChange("complemento", e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{xs:12, sm:5}}>
            <TextField
              label="Bairro"
              value={aluno.bairro}
              onChange={(e) => handleChange("bairro", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12, sm:5}}>
            <TextField
              label="Cidade"
              value={aluno.cidade}
              onChange={(e) => handleChange("cidade", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{xs:12, sm:2}}>
            <TextField
              label="UF"
              value={aluno.uf}
              onChange={(e) => handleChange("uf", e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <FormControlLabel
            control={
            <Checkbox
                checked={aluno.bolsista}
                onChange={(e) => handleChange("bolsista", e.target.checked)}
            />
            }
            label="Bolsista ?"
        />

        <FormControlLabel
            control={
            <Checkbox
                checked={aluno.ativo}
                onChange={(e) => handleChange("ativo", e.target.checked)}
            />
            }
            label="Ativo ?"
        />
        </Box>


        <Box mt={2}>
          <Button variant="contained" onClick={handleSalvar} sx={{ textTransform: 'none' }}>
            Salvar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
