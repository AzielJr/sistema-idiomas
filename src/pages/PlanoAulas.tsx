import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Description as DescriptionIcon,
  ContentCopy as ContentCopyIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

interface PlanoAula {
  id: number;
  // Cabeçalho inicial
  lesson_plan: string;
  main_aim: string;
  subsidiary_aim: string;
  professor: string;
  data: string;
  hora: string;
  // Estágios da aula
  warm_up: EstagioAula;
  lead_in: EstagioAula;
  controlled_practice_1: EstagioAula;
  clarification: EstagioAula;
  controlled_practice_2: EstagioAula;
  semi_controlled: EstagioAula;
  free_practice: EstagioAula;
  further_practice: EstagioAula;
  extra_15_minutes: EstagioAula;
  personalizado_professor: EstagioAula;
  // Metadados
  data_criacao: string;
  status: 'Rascunho' | 'Aprovado' | 'Em Revisão';
}

interface EstagioAula {
  activity_description: string;
  instructions_icqs: string;
  duration: string;
  interaction: string;
  anticipated_problems: string;
}

export default function PlanoAulas() {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PlanoAula[]>([
    {
      id: 1,
      lesson_plan: 'Inglês Básico - Turma A',
      main_aim: 'Desenvolver habilidades de leitura e compreensão de textos simples',
      subsidiary_aim: 'Ampliar vocabulário básico e praticar pronúncia',
      professor: 'Maria Silva',
      data: '2024-01-15',
      hora: '14:00',
      warm_up: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      lead_in: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      controlled_practice_1: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      clarification: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      controlled_practice_2: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      semi_controlled: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      free_practice: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      further_practice: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      extra_15_minutes: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      personalizado_professor: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      data_criacao: '2024-01-10',
      status: 'Aprovado'
    },
    {
      id: 2,
      lesson_plan: 'Espanhol Intermediário - Turma B',
      main_aim: 'Praticar conversação em situações do cotidiano',
      subsidiary_aim: 'Melhorar fluência e confiança na comunicação',
      professor: 'João Santos',
      data: '2024-01-16',
      hora: '16:00',
      warm_up: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      lead_in: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      controlled_practice_1: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      clarification: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      controlled_practice_2: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      semi_controlled: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      free_practice: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      further_practice: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      extra_15_minutes: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      personalizado_professor: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      data_criacao: '2024-01-11',
      status: 'Em Revisão'
    },
    {
      id: 3,
      lesson_plan: 'Inglês Avançado - Conversação',
      main_aim: 'Desenvolver habilidades de debate e argumentação',
      subsidiary_aim: 'Ampliar conhecimento de expressões idiomáticas',
      professor: 'Ana Costa',
      data: '2024-01-17',
      hora: '18:00',
      warm_up: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      lead_in: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      controlled_practice_1: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      clarification: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      controlled_practice_2: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      semi_controlled: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      free_practice: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      further_practice: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      extra_15_minutes: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      personalizado_professor: { activity_description: '', instructions_icqs: '', duration: '', interaction: '', anticipated_problems: '' },
      data_criacao: '2024-01-12',
        status: 'Rascunho'
    }
  ]);

  // Funções básicas mantidas para a lista
  const excluirPlano = (id: number) => {
    setPlanos(prev => prev.filter(p => p.id !== id));
  };

  const duplicarPlano = (plano: PlanoAula) => {
    const novoPlano = {
      ...plano,
      id: Math.max(...planos.map(p => p.id)) + 1,
      lesson_plan: `${plano.lesson_plan} (Cópia)`,
      data_criacao: new Date().toISOString().split('T')[0],
      status: 'Rascunho' as const
    };
    setPlanos(prev => [...prev, novoPlano]);
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'success';
      case 'Em Revisão': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header da Página */}
      <Box sx={{ mt: -4.375, mb: 1.25 }}>
      <PageHeader 
          title="📚 Plano de Aulas"
          rightContent={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
              onClick={() => navigate('/plano-aulas/cadastro')}
              sx={{ bgcolor: '#1976d2' }}
        >
          Novo Plano de Aula
        </Button>
          }
        />
      </Box>



      {/* Tabela de Planos */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Lesson Plan</strong></TableCell>
              <TableCell><strong>Professor</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Main Aim</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planos.map((plano) => (
              <TableRow key={plano.id} hover>
                <TableCell>{plano.lesson_plan}</TableCell>
                <TableCell>{plano.professor}</TableCell>
                <TableCell>{formatarData(plano.data)}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap>
                    {plano.main_aim}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={plano.status} 
                    size="small" 
                    color={getStatusColor(plano.status) as any}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Visualizar" arrow>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/plano-aulas/${plano.id}`)} 
                      sx={{ color: '#1976d2' }}
                    >
                    <DescriptionIcon fontSize="small" />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar" arrow>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/plano-aulas/${plano.id}/editar`)} 
                      sx={{ color: '#ff9800' }}
                    >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplicar" arrow>
                    <IconButton 
                      size="small" 
                      onClick={() => duplicarPlano(plano)} 
                      sx={{ color: '#4caf50' }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir" arrow>
                    <IconButton 
                      size="small" 
                      onClick={() => excluirPlano(plano.id)} 
                      sx={{ color: '#f44336' }}
                    >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {planos.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3, borderRadius: 3 }}>
          <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum plano de aula encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Comece adicionando um novo plano de aula
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate('/plano-aulas/cadastro')}
            sx={{ bgcolor: '#1976d2' }}
          >
            Adicionar Plano de Aula
          </Button>
        </Paper>
      )}
    </Box>
  );
}