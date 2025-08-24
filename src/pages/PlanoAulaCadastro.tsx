import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
  Badge,
  Tooltip
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as AccessTimeIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  ChatBubble as ChatBubbleIcon,
  Add as AddIcon,
  Send as SendIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface PlanoAula {
  id?: number;
  lesson_plan: string;
  tipo_plano: string;
  main_aim: string;
  subsidiary_aim: string;
  professor: string;
  data: string;
  hora: string;
  [key: string]: any;
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

interface Comentario {
  id: string;
  autor: string;
  tipo: 'coordenador' | 'professor';
  mensagem: string;
  data: string;
  hora: string;
}

interface EstagioComentarios {
  [estagioKey: string]: Comentario[];
}

const estagiosPorTipo = {
  'Reading': [
    { key: 'warm_up', nome: 'Warm up', cor: '#e3f2fd', icone: '🔥' },
    { key: 'lead_in', nome: 'Lead-in', cor: '#e8f5e8', icone: '🎯' },
    { key: 'pre_teach_words', nome: 'Pre-teach of words (max. 6 words)', cor: '#fff3e0', icone: '📚' },
    { key: 'prediction_setting', nome: 'Prediction / Setting the Scene', cor: '#f3e5f5', icone: '🎭' },
    { key: 'reading_gist', nome: 'Reading for Gist', cor: '#e1f5fe', icone: '👀' },
    { key: 'reading_specifics', nome: 'Reading for Specifics', cor: '#fce4ec', icone: '🔍' },
    { key: 'reading_details', nome: 'Reading for Details (INT+ level)', cor: '#f1f8e9', icone: '📖' },
    { key: 'follow_up', nome: 'Follow-up', cor: '#fff8e1', icone: '🔄' },
    { key: 'feedback', nome: 'Feedback', cor: '#e8eaf6', icone: '💬' },
    { key: 'extra_15_minutes', nome: 'Extra 15 min', cor: '#fafafa', icone: '⏰' },
    { key: 'personalizado_professor', nome: 'Personalizado - Professor', cor: '#e8eaf6', icone: '🎨' }
  ],
  'Listening': [
    { key: 'warm_up', nome: 'Warm up', cor: '#e3f2fd', icone: '🔥' },
    { key: 'lead_in', nome: 'Lead-in', cor: '#e8f5e8', icone: '🎯' },
    { key: 'pre_teach_words', nome: 'Pre-teach of words (max. 6 words)', cor: '#fff3e0', icone: '📚' },
    { key: 'prediction_setting', nome: 'Prediction / Setting the Scene', cor: '#f3e5f5', icone: '🎭' },
    { key: 'listening_gist', nome: 'Listening for Gist', cor: '#e1f5fe', icone: '👂' },
    { key: 'listening_specifics', nome: 'Listening for Specifics', cor: '#fce4ec', icone: '🎧' },
    { key: 'listening_details', nome: 'Listening for Details (INT+ level)', cor: '#f1f8e9', icone: '🎵' },
    { key: 'follow_up', nome: 'Follow-up', cor: '#fff8e1', icone: '🔄' },
    { key: 'feedback', nome: 'Feedback', cor: '#e8eaf6', icone: '💬' },
    { key: 'extra_15_minutes', nome: 'Extra 15 min', cor: '#fafafa', icone: '⏰' },
    { key: 'personalizado_professor', nome: 'Personalizado - Professor', cor: '#e8eaf6', icone: '🎨' }
  ],
  'Grammar': [
    { key: 'warm_up', nome: 'Warm up', cor: '#e3f2fd', icone: '🔥' },
    { key: 'lead_in', nome: 'Lead-in', cor: '#e8f5e8', icone: '🎯' },
    { key: 'clarification', nome: 'Clarification', cor: '#f3e5f5', icone: '💡' },
    { key: 'controlled_practice', nome: 'Controlled Practice', cor: '#fff3e0', icone: '📝' },
    { key: 'semi_controlled_practice', nome: 'Semi-controlled practice', cor: '#fce4ec', icone: '🔄' },
    { key: 'freer_practice', nome: 'Freer Practice', cor: '#f1f8e9', icone: '🆓' },
    { key: 'feedback', nome: 'Feedback', cor: '#e8eaf6', icone: '💬' },
    { key: 'extra_15_minutes', nome: 'Extra 15 min', cor: '#fafafa', icone: '⏰' },
    { key: 'personalizado_professor', nome: 'Personalizado - Professor', cor: '#e8eaf6', icone: '🎨' }
  ],
  'Lexis': [
    { key: 'warm_up', nome: 'Warm up', cor: '#e3f2fd', icone: '🔥' },
    { key: 'lead_in', nome: 'Lead-in', cor: '#e8f5e8', icone: '🎯' },
    { key: 'clarification', nome: 'Clarification (max 10 words)', cor: '#f3e5f5', icone: '💡' },
    { key: 'controlled_practice', nome: 'Controlled Practice', cor: '#fff3e0', icone: '📝' },
    { key: 'semi_controlled_practice', nome: 'Semi-controlled Practice', cor: '#fce4ec', icone: '🔄' },
    { key: 'freer_practice', nome: 'Freer Practice', cor: '#f1f8e9', icone: '🆓' },
    { key: 'feedback', nome: 'Feedback', cor: '#e8eaf6', icone: '💬' },
    { key: 'extra_15_minutes', nome: 'Extra 15 min', cor: '#fafafa', icone: '⏰' },
    { key: 'personalizado_professor', nome: 'Personalizado - Professor', cor: '#e8eaf6', icone: '🎨' }
  ],
  'TTT': [
    { key: 'warm_up', nome: 'Warm up', cor: '#e3f2fd', icone: '🔥' },
    { key: 'lead_in', nome: 'Lead-in', cor: '#e8f5e8', icone: '🎯' },
    { key: 'controlled_practice_1', nome: 'Controlled practice 1', cor: '#fff3e0', icone: '📝' },
    { key: 'clarification', nome: 'Clarification', cor: '#f3e5f5', icone: '💡' },
    { key: 'controlled_practice_2', nome: 'Controlled Practice 2', cor: '#e1f5fe', icone: '✏️' },
    { key: 'semi_controlled', nome: 'Semi Controlled', cor: '#fce4ec', icone: '🔄' },
    { key: 'freer_practice', nome: 'Freer Practice', cor: '#f1f8e9', icone: '🆓' },
    { key: 'feedback', nome: 'Feedback', cor: '#e8eaf6', icone: '💬' },
    { key: 'extra_15_minutes', nome: 'Extra 15 min', cor: '#fafafa', icone: '⏰' },
    { key: 'personalizado_professor', nome: 'Personalizado - Professor', cor: '#e8eaf6', icone: '🎨' }
  ]
};

const interactionTypes = [
  'T-S (Teacher-Student)',
  'S-T (Student-Teacher)',
  'S-S (Student-Student)',
  'Individual',
  'Pair work',
  'Group work',
  'Whole class'
];

const createEmptyEstagio = (): EstagioAula => ({
  activity_description: '',
  instructions_icqs: '',
  duration: '',
  interaction: '',
  anticipated_problems: ''
});

export default function PlanoAulaCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  // Estados para sistema de comentários
  const [comentarios, setComentarios] = useState<EstagioComentarios>({});
  const [modalComentarios, setModalComentarios] = useState(false);
  const [estagioAtual, setEstagioAtual] = useState<string>('');
  const [novoComentario, setNovoComentario] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'coordenador' | 'professor'>('professor'); // Mock - será do contexto de auth
  const [nomeUsuarioLogado, setNomeUsuarioLogado] = useState<string>('João Silva'); // Mock - será do contexto de auth

  const [plano, setPlano] = useState<PlanoAula>(() => {
    const initialState: PlanoAula = {
      lesson_plan: '',
      tipo_plano: 'Reading', // Definir tipo padrão
      main_aim: '',
      subsidiary_aim: '',
      professor: '',
      data: new Date().toISOString().split('T')[0],
      hora: '',
      data_criacao: new Date().toISOString().split('T')[0],
      status: 'Rascunho'
    };

    // Inicializar com estágios do tipo Reading por padrão
    estagiosPorTipo['Reading'].forEach(estagio => {
      initialState[estagio.key] = createEmptyEstagio();
    });

    console.log('Estado inicial criado com:', Object.keys(initialState).filter(key => 
      !['lesson_plan', 'tipo_plano', 'main_aim', 'subsidiary_aim', 'professor', 'data', 'hora', 'data_criacao', 'status'].includes(key)
    ).length, 'estágios');

    return initialState;
  });

  const getEstagiosAtuais = () => {
    // Sempre retornar os estágios baseados no tipo_plano atual
    const tipoAtual = plano.tipo_plano || 'Reading';
    const estagios = estagiosPorTipo[tipoAtual as keyof typeof estagiosPorTipo];
    
    if (estagios) {
      console.log(`✅ Retornando ${estagios.length} estágios para ${tipoAtual}:`, estagios.map(e => e.nome));
      return estagios;
    }
    
    console.log('❌ Tipo não encontrado, retornando Reading como padrão');
    return estagiosPorTipo['Reading'];
  };

  const inicializarEstagios = (tipoPlano: string) => {
    if (tipoPlano && estagiosPorTipo[tipoPlano as keyof typeof estagiosPorTipo]) {
      const novosEstagios = estagiosPorTipo[tipoPlano as keyof typeof estagiosPorTipo];
      
      // Criar um novo objeto plano SEM os estágios antigos
      const planoAtualizado: PlanoAula = {
        lesson_plan: plano.lesson_plan,
        tipo_plano: tipoPlano,
        main_aim: plano.main_aim,
        subsidiary_aim: plano.subsidiary_aim,
        professor: plano.professor,
        data: plano.data,
        hora: plano.hora,
        data_criacao: plano.data_criacao,
        status: plano.status
      };
      
      // Adicionar APENAS os estágios do tipo selecionado
      novosEstagios.forEach(estagio => {
        planoAtualizado[estagio.key] = createEmptyEstagio();
      });
      
      console.log(`🔄 Inicializando ${novosEstagios.length} estágios para ${tipoPlano}:`, novosEstagios.map(e => e.nome));
      
      // Log para verificar o estado final
      const estagiosFinais = Object.keys(planoAtualizado).filter(key => 
        !['lesson_plan', 'tipo_plano', 'main_aim', 'subsidiary_aim', 'professor', 'data', 'hora', 'data_criacao', 'status'].includes(key)
      );
      console.log(`📊 Estado final do plano: ${estagiosFinais.length} estágios ativos:`, estagiosFinais);
      
      setPlano(planoAtualizado);
    }
  };

  const professores = [
    'Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Lima', 'Carlos Oliveira'
  ];

  const turmas = [
    'Inglês Básico - Turma A', 'Inglês Básico - Turma B', 'Inglês Intermediário - Turma A',
    'Inglês Intermediário - Turma B', 'Inglês Avançado - Turma A', 'Espanhol Básico - Turma A',
    'Conversação - Turma A'
  ];

  const tiposPlano = ['Reading', 'Listening', 'Grammar', 'Lexis', 'TTT'];

  useEffect(() => {
    if (id) {
      carregarPlano(id);
    }
  }, [id]);

  // Monitorar mudanças no tipo de plano e garantir sincronização
  useEffect(() => {
    if (plano.tipo_plano) {
      const estagiosAtuais = getEstagiosAtuais();
      const estagiosNoPlano = Object.keys(plano).filter(key => 
        !['lesson_plan', 'tipo_plano', 'main_aim', 'subsidiary_aim', 'professor', 'data', 'hora', 'data_criacao', 'status'].includes(key)
      );
      
      console.log(`🔍 Verificação de sincronização:`);
      console.log(`   Tipo selecionado: ${plano.tipo_plano}`);
      console.log(`   Estágios esperados: ${estagiosAtuais.length} (${estagiosAtuais.map(e => e.key).join(', ')})`);
      console.log(`   Estágios no plano: ${estagiosNoPlano.length} (${estagiosNoPlano.join(', ')})`);
      
      // Se os estágios não estiverem sincronizados, corrigir
      if (estagiosAtuais.length !== estagiosNoPlano.length || 
          !estagiosAtuais.every(estagio => estagiosNoPlano.includes(estagio.key))) {
        console.log(`⚠️ Sincronização incorreta detectada! Corrigindo...`);
        inicializarEstagios(plano.tipo_plano);
      }
    }
  }, [plano.tipo_plano]);

  const carregarPlano = async (planoId: string) => {
    console.log('Carregando plano:', planoId);
  };

  const salvarPlano = async () => {
    try {
      setLoading(true);
      console.log('Salvando plano:', plano);
      alert('Plano salvo com sucesso!');
      navigate('/plano-aulas');
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      alert('Erro ao salvar plano');
    } finally {
      setLoading(false);
    }
  };

  const voltar = () => {
    navigate('/plano-aulas');
  };

  // Funções para sistema de comentários
  const abrirModalComentarios = (estagioKey: string) => {
    setEstagioAtual(estagioKey);
    setModalComentarios(true);
  };

  const fecharModalComentarios = () => {
    setModalComentarios(false);
    setEstagioAtual('');
    setNovoComentario('');
  };

  const adicionarComentario = () => {
    if (!novoComentario.trim() || !estagioAtual) return;

    const comentario: Comentario = {
      id: Date.now().toString(),
      autor: tipoUsuario === 'coordenador' ? 'Coordenador' : nomeUsuarioLogado,
      tipo: tipoUsuario,
      mensagem: novoComentario.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setComentarios(prev => ({
      ...prev,
      [estagioAtual]: [...(prev[estagioAtual] || []), comentario]
    }));

    setNovoComentario('');
  };

  const getComentariosEstagio = (estagioKey: string): Comentario[] => {
    return comentarios[estagioKey] || [];
  };

  const temComentarios = (estagioKey: string): boolean => {
    return (comentarios[estagioKey] || []).length > 0;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ pt: 0.375, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={voltar}>
            Voltar
          </Button>
          
                     <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
             {/* Botão para alternar tipo de usuário (para teste) */}
             <Button
               variant="outlined"
               size="small"
               onClick={() => setTipoUsuario(prev => prev === 'professor' ? 'coordenador' : 'professor')}
               sx={{ 
                 color: tipoUsuario === 'coordenador' ? '#d32f2f' : '#1976d2',
                 borderColor: tipoUsuario === 'coordenador' ? '#d32f2f' : '#1976d2',
                 minWidth: '140px'
               }}
             >
               {tipoUsuario === 'coordenador' ? '👨‍🏫 Professor' : '👨‍💼 Coordenador'}
             </Button>
             
             <Button
               variant="outlined"
               startIcon={<DescriptionIcon />}
               onClick={() => alert('Funcionalidade em desenvolvimento')}
               sx={{ color: '#1976d2', borderColor: '#1976d2' }}
             >
               Gerar Plano
             </Button>
             <Button
               onClick={salvarPlano}
               variant="contained"
               startIcon={<SaveIcon />}
               disabled={loading}
               sx={{ bgcolor: '#1976d2' }}
             >
               {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Salvar')}
             </Button>
           </Box>
        </Box>
      </Container>

      <Container maxWidth="xl" sx={{ py: 3, pt: 0.25 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: '#f8f9fa', borderRadius: 3 }}>
          <Typography variant="h4" align="center" sx={{ 
            fontWeight: 'bold', 
            mb: 4, 
            color: '#1976d2',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            📋 LESSON PLAN
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            <Box sx={{ flex: '0 0 26%' }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="turma-label" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  🎓 TURMA
                </InputLabel>
                <Select
                  labelId="turma-label"
                  value={plano.lesson_plan}
                  onChange={(e) => setPlano(prev => ({ ...prev, lesson_plan: e.target.value }))}
                  label="🎓 TURMA"
                >
                  {turmas.map((turma) => (
                    <MenuItem key={turma} value={turma}>{turma}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: '0 0 26%' }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="professor-label" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  👨‍🏫 PROFESSOR
                </InputLabel>
                <Select
                  labelId="professor-label"
                  value={plano.professor}
                  onChange={(e) => setPlano(prev => ({ ...prev, professor: e.target.value }))}
                  label="👨‍🏫 PROFESSOR"
                >
                  {professores.map((professor) => (
                    <MenuItem key={professor} value={professor}>{professor}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: '0 0 26%' }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="tipo-plano-label" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  📚 TIPO DE PLANO
                </InputLabel>
                <Select
                  labelId="tipo-plano-label"
                  value={plano.tipo_plano}
                  onChange={(e) => {
                    const novoTipo = e.target.value;
                    setPlano(prev => ({ ...prev, tipo_plano: novoTipo }));
                    inicializarEstagios(novoTipo);
                  }}
                  label="📚 TIPO DE PLANO"
                >
                  {tiposPlano.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
                         <Box sx={{ flex: '0 0 22%' }}>
               <TextField
                 label="📅 DATA"
                 type="date"
                 value={plano.data}
                 onChange={(e) => setPlano(prev => ({ ...prev, data: e.target.value }))}
                 variant="outlined"
                 InputLabelProps={{ shrink: true, sx: { fontWeight: 'bold', color: '#1976d2' } }}
                 sx={{ width: 'calc(100% - 50px)', ml: -0.875 }}
               />
             </Box>
          </Box>

          <Box sx={{ mb: 1.125 }}>
            <TextField
              fullWidth
              label="🎯 MAIN AIM (Objetivo Principal)"
              multiline
              rows={2}
              value={plano.main_aim}
              onChange={(e) => setPlano(prev => ({ ...prev, main_aim: e.target.value }))}
              variant="outlined"
              placeholder="Descreva o objetivo principal da aula..."
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="🎯 SUBSIDIARY AIM (Objetivo Secundário)"
              multiline
              rows={2}
              value={plano.subsidiary_aim}
              onChange={(e) => setPlano(prev => ({ ...prev, subsidiary_aim: e.target.value }))}
              variant="outlined"
              placeholder="Descreva os objetivos secundários..."
            />
          </Box>
        </Paper>

        <Typography variant="h5" sx={{ 
          mb: 4, 
          color: '#1976d2', 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🎯 ESTÁGIOS DA AULA
        </Typography>

        {getEstagiosAtuais().map((estagio, index) => {
          const estagioData = plano[estagio.key] as EstagioAula || createEmptyEstagio();
          
          return (
            <Accordion key={estagio.key} sx={{ mb: 1.25, border: '2px solid #e0e0e0', borderRadius: '16px !important' }}>
                             <AccordionSummary 
                 expandIcon={
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                           {/* Ícone de comentários */}
                      <Tooltip title="Comentários Coordenador" arrow>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalComentarios(estagio.key);
                          }}
                          sx={{ 
                            color: '#1976d2',
                            '&:hover': { 
                              bgcolor: 'rgba(255,255,255,0.2)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Badge 
                            badgeContent={getComentariosEstagio(estagio.key).length} 
                            color="error"
                            invisible={getComentariosEstagio(estagio.key).length === 0}
                          >
                            {temComentarios(estagio.key) ? (
                              <ChatBubbleIcon sx={{ fontSize: 24 }} />
                            ) : (
                              <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />
                            )}
                          </Badge>
                        </IconButton>
                      </Tooltip>
                     
                     {/* Setas de expansão */}
                     <ExpandMoreIcon sx={{ fontSize: 28, color: '#1976d2' }} />
                   </Box>
                 } 
                 sx={{ 
                   bgcolor: estagio.cor, 
                   borderRadius: '14px 14px 0 0',
                   minHeight: '60px'
                 }}
               >
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                   <Chip 
                     label={index + 1} 
                     size="medium" 
                     sx={{ bgcolor: 'white', color: '#1976d2', fontWeight: 'bold' }} 
                   />
                   <Typography variant="h4" sx={{ color: '#1976d2' }}>
                     {estagio.icone}
                   </Typography>
                   <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                     {estagio.nome}
                   </Typography>
                 </Box>
                 
                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2.5 }}>
                    <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: '500' }}>
                      {estagioData.duration || '0 Min.'}
                    </Typography>
                  </Box>
               </AccordionSummary>
              
              <AccordionDetails sx={{ bgcolor: '#fafafa', p: 4 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                  <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="📝 ACTIVITY/DESCRIPTION"
                      multiline
                      rows={5}
                      value={estagioData.activity_description}
                      onChange={(e) => setPlano(prev => ({
                        ...prev,
                        [estagio.key]: {
                          ...estagioData,
                          activity_description: e.target.value
                        }
                      }))}
                      variant="outlined"
                      placeholder="Descreva detalhadamente a atividade principal deste estágio..."
                    />
                  </Box>
                  
                  <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="💬 INSTRUCTIONS / ICQS"
                      multiline
                      rows={5}
                      value={estagioData.instructions_icqs}
                      onChange={(e) => setPlano(prev => ({
                        ...prev,
                        [estagio.key]: {
                          ...estagioData,
                          instructions_icqs: e.target.value
                        }
                      }))}
                      variant="outlined"
                      placeholder="Instruções claras e perguntas de verificação de compreensão..."
                    />
                  </Box>
                  
                  <Box sx={{ flex: '1 1 115px', minWidth: 0 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`duration-${estagio.key}-label`}>
                        ⏱️ DURATION
                      </InputLabel>
                      <Select
                        labelId={`duration-${estagio.key}-label`}
                        value={estagioData.duration}
                        onChange={(e) => setPlano(prev => ({
                          ...prev,
                          [estagio.key]: {
                            ...estagioData,
                            duration: e.target.value
                          }
                        }))}
                        label="⏱️ DURATION"
                      >
                        {[
                          '1 Min.', '2 Min.', '3 Min.', '4 Min.', '5 Min.',
                          '10 Min.', '15 Min.', '20 Min.', '25 Min.', '30 Min.',
                          '35 Min.', '40 Min.', '45 Min.', '50 Min.', '55 Min.',
                          '60 Min.', '65 Min.', '70 Min.', '75 Min.', '80 Min.',
                          '85 Min.', '90 Min.'
                        ].map((duration) => (
                          <MenuItem key={duration} value={duration}>{duration}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 225px', minWidth: 0, ml: 1.25 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id={`interaction-${estagio.key}-label`}>
                        👥 INTERACTION
                      </InputLabel>
                      <Select
                        labelId={`interaction-${estagio.key}-label`}
                        value={estagioData.interaction}
                        onChange={(e) => setPlano(prev => ({
                          ...prev,
                          [estagio.key]: {
                            ...estagioData,
                            interaction: e.target.value
                          }
                        }))}
                        label="👥 INTERACTION"
                      >
                        {interactionTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                    <TextField
                      fullWidth
                      label="⚠️ ANTICIPATED PROBLEMS"
                      multiline
                      rows={2}
                      value={estagioData.anticipated_problems}
                      onChange={(e) => setPlano(prev => ({
                        ...prev,
                        [estagio.key]: {
                          ...estagioData,
                          anticipated_problems: e.target.value
                        }
                      }))}
                      variant="outlined"
                      placeholder="Possiveis dificuldades e como resolver."
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
                 })}
       </Container>

       {/* Modal de Comentários */}
       <Dialog 
         open={modalComentarios} 
         onClose={fecharModalComentarios}
         maxWidth="md"
         fullWidth
         PaperProps={{
           sx: { borderRadius: 3, minHeight: '60vh' }
         }}
       >
         <DialogTitle sx={{ 
           bgcolor: '#1976d2', 
           color: 'white',
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center'
         }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <ChatBubbleIcon />
             <Typography variant="h6">
               Comentários - {estagiosPorTipo[plano.tipo_plano as keyof typeof estagiosPorTipo]?.find(e => e.key === estagioAtual)?.nome || 'Estágio'}
             </Typography>
           </Box>
           <IconButton onClick={fecharModalComentarios} sx={{ color: 'white' }}>
             <CloseIcon />
           </IconButton>
         </DialogTitle>

         <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
           {/* Área de conversa */}
           <Box sx={{ 
             flex: 1, 
             p: 3, 
             maxHeight: '400px', 
             overflowY: 'auto',
             bgcolor: '#f8f9fa'
           }}>
             {getComentariosEstagio(estagioAtual).length === 0 ? (
               <Box sx={{ 
                 textAlign: 'center', 
                 py: 4,
                 color: '#666'
               }}>
                 <ChatBubbleOutlineIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                 <Typography variant="h6" sx={{ mb: 1 }}>
                   Nenhum comentário ainda
                 </Typography>
                 <Typography variant="body2">
                   Seja o primeiro a comentar sobre este estágio!
                 </Typography>
               </Box>
             ) : (
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                 {getComentariosEstagio(estagioAtual).map((comentario) => (
                   <Box key={comentario.id} sx={{ 
                     display: 'flex', 
                     justifyContent: comentario.tipo === 'coordenador' ? 'flex-end' : 'flex-start',
                     mb: 2
                   }}>
                     <Box sx={{
                       maxWidth: '70%',
                       bgcolor: comentario.tipo === 'coordenador' ? '#1976d2' : 'white',
                       color: comentario.tipo === 'coordenador' ? 'white' : '#333',
                       p: 2,
                       borderRadius: 2,
                       boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                       border: comentario.tipo === 'professor' ? '1px solid #e0e0e0' : 'none'
                     }}>
                       {/* Cabeçalho do comentário */}
                       <Box sx={{ 
                         display: 'flex', 
                         justifyContent: 'space-between', 
                         alignItems: 'center',
                         mb: 1
                       }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <Avatar 
                             sx={{ 
                               width: 24, 
                               height: 24, 
                               fontSize: '12px',
                               bgcolor: comentario.tipo === 'coordenador' ? '#fff' : '#1976d2',
                               color: comentario.tipo === 'coordenador' ? '#1976d2' : '#fff'
                             }}
                           >
                             {comentario.autor.charAt(0)}
                           </Avatar>
                           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                             {comentario.autor}
                           </Typography>
                         </Box>
                         <Typography variant="caption" sx={{ opacity: 0.7 }}>
                           {comentario.data} às {comentario.hora}
                         </Typography>
                       </Box>
                       
                       {/* Mensagem */}
                       <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                         {comentario.mensagem}
                       </Typography>
                     </Box>
                   </Box>
                 ))}
               </Box>
             )}
           </Box>

           {/* Área de input */}
           <Box sx={{ 
             p: 3, 
             borderTop: '1px solid #e0e0e0',
             bgcolor: 'white'
           }}>
             <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
               <TextField
                 fullWidth
                 multiline
                 rows={3}
                                   placeholder={`Adicione um comentário como ${tipoUsuario === 'coordenador' ? 'coordenador' : nomeUsuarioLogado}...`}
                 value={novoComentario}
                 onChange={(e) => setNovoComentario(e.target.value)}
                 variant="outlined"
                 sx={{ 
                   '& .MuiOutlinedInput-root': { 
                     borderRadius: 2,
                     '&:hover .MuiOutlinedInput-notchedOutline': {
                       borderColor: '#1976d2'
                     }
                   }
                 }}
               />
               <Button
                 variant="contained"
                 onClick={adicionarComentario}
                 disabled={!novoComentario.trim()}
                 startIcon={<SendIcon />}
                 sx={{ 
                   bgcolor: '#1976d2',
                   minWidth: '120px',
                   height: '56px',
                   borderRadius: 2
                 }}
               >
                 Enviar
               </Button>
             </Box>
           </Box>
         </DialogContent>
       </Dialog>
     </Box>
   );
 }
