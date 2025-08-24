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
  Paper,
  Chip,
  Switch
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextSimple";

export default function TurmasCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, fetchWithAuthSafe } = useAuth();
  const isEditando = Boolean(id);

  const [turma, setTurma] = useState({
    nomeTurma: "",
    nivel: "",
    ano: new Date().getFullYear().toString(),
    horaInicio: "",
    horaFim: "",
    aulaSeg: false,
    aulaTer: false,
    aulaQua: false,
    aulaQui: false,
    aulaSex: false,
    aulaSab: false,
    idProfessor: null as number | null,
    sala: "",
    capacidadeMaxima: "",
    idMaterialDidatico: null as number | null,
    numeroAlunos: 0,
    idCoordenador: null as number | null,
    observacoes: "",
    ativo: true,
    idUnidade: user?.idUnidade || 0
  });

  const handleChange = (field: string, value: any) => {
    setTurma((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = async () => {
    try {
      setLoading(true);
      
      const dadosParaEnviar = {
        ...turma,
        capacidadeMaxima: parseInt(turma.capacidadeMaxima.toString()),
        idUnidade: user?.idUnidade || 0
      };
      
      const url = isEditando 
        ? `http://localhost:8080/api/turmas/${id}`
        : 'http://localhost:8080/api/turmas';
      
      const method = isEditando ? 'PUT' : 'POST';
      
      const response = await fetchWithAuthSafe(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar)
      });
      
      if (response.ok) {
        alert(isEditando ? 'Turma atualizada com sucesso!' : 'Turma criada com sucesso!');
        navigate('/cadastros/turmas');
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      alert('Erro ao salvar turma. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate("/cadastros/turmas");
  };

  // Dados reais do backend
  const [professores, setProfessores] = useState<Array<{id: number, nome: string}>>([]);
  const [coordenadores, setCoordenadores] = useState<Array<{id: number, nome: string}>>([]);
  const [materiaisDidaticos, setMateriaisDidaticos] = useState<Array<{id: number, nome: string}>>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados relacionados
  useEffect(() => {
    const carregarDados = async () => {
      if (!user?.idUnidade) return;
      
      try {
        setLoading(true);
        
        // Carregar professores
        const responseProfessores = await fetchWithAuthSafe(`http://localhost:8080/api/turmas/professores/${user.idUnidade}`);
        if (responseProfessores.ok) {
          const data = await responseProfessores.json();
          setProfessores(data.map((p: any) => ({ id: p.id, nome: p.nome })));
        }
        
        // Carregar coordenadores
        const responseCoordenadores = await fetchWithAuthSafe(`http://localhost:8080/api/turmas/coordenadores/${user.idUnidade}`);
        if (responseCoordenadores.ok) {
          const data = await responseCoordenadores.json();
          setCoordenadores(data.map((c: any) => ({ id: c.id, nome: c.userName })));
        }
        
        // Carregar materiais didáticos
        const responseMateriais = await fetchWithAuthSafe(`http://localhost:8080/api/turmas/materiais/${user.idUnidade}`);
        if (responseMateriais.ok) {
          const data = await responseMateriais.json();
          setMateriaisDidaticos(data.map((m: any) => ({ id: m.id, nome: m.nome })));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [user?.idUnidade, fetchWithAuthSafe]);

  // Carregar turma se estiver editando
  useEffect(() => {
    const carregarTurma = async () => {
      if (!id || !fetchWithAuthSafe || !user?.idUnidade) return;
      
      try {
        setLoading(true);
        
        // Primeiro carregar as listas necessárias
        const [responseProfessores, responseCoordenadores, responseMateriais, responseTurma] = await Promise.all([
          fetchWithAuthSafe(`http://localhost:8080/api/turmas/professores/${user.idUnidade}`),
          fetchWithAuthSafe(`http://localhost:8080/api/turmas/coordenadores/${user.idUnidade}`),
          fetchWithAuthSafe(`http://localhost:8080/api/turmas/materiais/${user.idUnidade}`),
          fetchWithAuthSafe(`http://localhost:8080/api/turmas/${id}`)
        ]);
        
        // Carregar professores
        if (responseProfessores.ok) {
          const data = await responseProfessores.json();
          setProfessores(data.map((p: any) => ({ id: p.id, nome: p.nome })));
        }
        
        // Carregar coordenadores
        if (responseCoordenadores.ok) {
          const data = await responseCoordenadores.json();
          setCoordenadores(data.map((c: any) => ({ id: c.id, nome: c.nome })));
        }
        
        // Carregar materiais didáticos
        if (responseMateriais.ok) {
          const data = await responseMateriais.json();
          setMateriaisDidaticos(data.map((m: any) => ({ id: m.id, nome: m.nome })));
        }
        
        // Carregar dados da turma
        if (responseTurma.ok) {
          const data = await responseTurma.json();
          setTurma({
            nomeTurma: data.nomeTurma || "",
            nivel: data.nivel || "",
            ano: data.ano || new Date().getFullYear().toString(),
            horaInicio: data.horaInicio || "",
            horaFim: data.horaFim || "",
            aulaSeg: data.aulaSeg || false,
            aulaTer: data.aulaTer || false,
            aulaQua: data.aulaQua || false,
            aulaQui: data.aulaQui || false,
            aulaSex: data.aulaSex || false,
            aulaSab: data.aulaSab || false,
            idProfessor: data.idProfessor || null,
            sala: data.sala || "",
            capacidadeMaxima: data.capacidadeMaxima?.toString() || "",
            idMaterialDidatico: data.idMaterialDidatico || null,
            numeroAlunos: data.numeroAlunos || 0,
            idCoordenador: data.idCoordenador || null,
            observacoes: data.observacoes || "",
            ativo: data.ativo !== undefined ? data.ativo : true,
            idUnidade: user?.idUnidade || 0
          });
        }
      } catch (error) {
        console.error('Erro ao carregar turma:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarTurma();
  }, [id, fetchWithAuthSafe, user?.idUnidade]);

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Typography variant="h5" fontWeight="bold" mb={2} sx={{ mt: -5 }}>
        {isEditando ? (
          <>
            Edição de Turma: <span style={{ color: '#1976d2' }}>{turma.nomeTurma}</span>
          </>
        ) : (
          'Cadastro de Turma'
        )}
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
              value={turma.nomeTurma}
              onChange={(e) => handleChange("nomeTurma", e.target.value)}
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
                  type="text"
                  value={turma.ano}
                  onChange={(e) => handleChange("ano", e.target.value)}
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
                  value={turma.horaInicio}
                  onChange={(e) => handleChange("horaInicio", e.target.value)}
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
                  value={turma.horaFim}
                  onChange={(e) => handleChange("horaFim", e.target.value)}
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
                    checked={turma.aulaSeg}
                    onChange={(e) => handleChange("aulaSeg", e.target.checked)}
                  />
                }
                label="Segunda"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.aulaTer}
                    onChange={(e) => handleChange("aulaTer", e.target.checked)}
                  />
                }
                label="Terça"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.aulaQua}
                    onChange={(e) => handleChange("aulaQua", e.target.checked)}
                  />
                }
                label="Quarta"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.aulaQui}
                    onChange={(e) => handleChange("aulaQui", e.target.checked)}
                  />
                }
                label="Quinta"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.aulaSex}
                    onChange={(e) => handleChange("aulaSex", e.target.checked)}
                  />
                }
                label="Sexta"
              />
            </Grid>
            <Grid size={{xs:6, sm:4, md:2}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={turma.aulaSab}
                    onChange={(e) => handleChange("aulaSab", e.target.checked)}
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
                    value={turma.idProfessor || ""}
                    onChange={(e) => handleChange("idProfessor", e.target.value ? parseInt(e.target.value) : null)}
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
                    value={turma.idCoordenador || ""}
                    onChange={(e) => handleChange("idCoordenador", e.target.value ? parseInt(e.target.value) : null)}
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
                value={turma.idMaterialDidatico || ""}
                onChange={(e) => handleChange("idMaterialDidatico", e.target.value ? parseInt(e.target.value) : null)}
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
                  value={turma.capacidadeMaxima}
                  onChange={(e) => handleChange("capacidadeMaxima", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{xs:12, sm:4}}>
                <TextField
                  label="Número de Alunos"
                  type="number"
                  value={turma.numeroAlunos}
                  onChange={(e) => handleChange("numeroAlunos", parseInt(e.target.value))}
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
              label="Observações"
              value={turma.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Informações adicionais sobre a turma..."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={turma.ativo || false}
                  onChange={(e) => handleChange("ativo", e.target.checked)}
                  color={turma.ativo ? "primary" : "error"}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: turma.ativo ? '#1976d2' : '#d32f2f',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: turma.ativo ? '#1976d2' : '#d32f2f',
                    },
                    '& .MuiSwitch-switchBase': {
                      color: turma.ativo ? '#1976d2' : '#d32f2f',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: turma.ativo ? '#1976d2' : '#d32f2f',
                    }
                  }}
                />
              }
              label={turma.ativo ? 'Ativa' : 'Inativa'}
            />
          </Stack>
        </Paper>

        {/* Botões de Ação */}
        <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            onClick={handleVoltar} 
            sx={{ textTransform: 'none' }}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSalvar} 
            sx={{ textTransform: 'none' }}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}