import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  Avatar,
  Paper,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Tooltip
} from "@mui/material";
import { 
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextSimple";


interface MaterialDidatico {
  id?: number;
  nome: string;
  editora: string;
  autor: string;
  obs: string;
  fotoCapa: string;
  status: number;
  idUnidade: number;
}

export default function MaterialDidaticoCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, fetchWithAuthSafe, refreshUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [material, setMaterial] = useState<MaterialDidatico>({
    nome: "",
    editora: "",
    autor: "",
    obs: "",
    fotoCapa: "",
    status: 1,
    idUnidade: 0
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (user?.idUnidade) {
      setMaterial(prev => ({ ...prev, idUnidade: user.idUnidade }));
    } else if (user && !user.idUnidade) {
      // Tentar atualizar os dados do usuário se não tiver idUnidade
      refreshUserData();
    }
  }, [user?.idUnidade, user, refreshUserData]);

  useEffect(() => {
    if (id && user?.idUnidade) {
      carregarMaterial();
    }
  }, [id, user?.idUnidade]);

  const carregarMaterial = async () => {
    if (!id || !user?.idUnidade) return;
    
    try {
      setCarregando(true);
      setError(null);
      
      const response = await fetchWithAuthSafe(`http://localhost:8080/api/material-didatico/${id}/unidade/${user.idUnidade}`);
      if (response.ok) {
        const data = await response.json();
        setMaterial({
          id: data.id,
          nome: data.nome,
          editora: data.editora,
          autor: data.autor || "",
          obs: data.obs || "",
          fotoCapa: data.fotoCapa || "",
          status: data.status,
          idUnidade: data.idUnidade
        });
        setPreviewImage(data.fotoCapa || "");
      } else {
        throw new Error('Erro ao carregar material');
      }
    } catch (error) {
      console.error('Erro ao carregar material:', error);
      setError('Erro ao carregar material. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (field: keyof MaterialDidatico, value: string | number) => {
    setMaterial((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setMaterial((prev) => ({ ...prev, status: checked ? 1 : 0 }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setMaterial((prev) => ({ ...prev, fotoCapa: base64String }));
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setMaterial((prev) => ({ ...prev, fotoCapa: "" }));
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validarFormulario = (): boolean => {
    const camposObrigatorios = [];
    
    if (!material.nome.trim()) {
      camposObrigatorios.push('Nome do Material');
    }

    if (!material.editora.trim()) {
      camposObrigatorios.push('Editora');
    }

    if (camposObrigatorios.length > 0) {
      alert(`Os seguintes campos são obrigatórios:\n\n${camposObrigatorios.join('\n')}`);
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarFormulario() || !user?.idUnidade) return;

    try {
      setLoading(true);
      setError(null);

      const materialData = {
        nome: material.nome.trim(),
        editora: material.editora.trim(),
        autor: material.autor.trim() || null,
        obs: material.obs.trim() || null,
        fotoCapa: material.fotoCapa || null,
        status: material.status,
        idUnidade: user.idUnidade
      };

      let response;
      if (id) {
        // Atualizar
        response = await fetchWithAuthSafe(`http://localhost:8080/api/material-didatico/${id}/unidade/${user.idUnidade}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(materialData)
        });
      } else {
        // Criar
        response = await fetchWithAuthSafe(`http://localhost:8080/api/material-didatico/unidade/${user.idUnidade}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(materialData)
        });
      }

      if (response.ok) {
        alert(`Material didático ${id ? 'atualizado' : 'salvo'} com sucesso!`);
        navigate("/cadastros/material-didatico");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar material');
      }
    } catch (error) {
      console.error('Erro ao salvar material:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar material. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate("/cadastros/material-didatico");
  };

  if (!user?.idUnidade) {
    return (
      <Box p={2}>
        <Alert severity="warning">
          <Typography variant="h6" gutterBottom>
            Usuário não possui unidade associada
          </Typography>
          <Typography variant="body2" paragraph>
            Dados do usuário logado: {JSON.stringify(user, null, 2)}
          </Typography>
          <Typography variant="body2">
            Entre em contato com o administrador para associar uma unidade ao seu usuário.
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (carregando) {
    return (
      <Box p={2} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Carregando material...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={{xs:1, sm:2, md:3}}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <IconButton onClick={handleVoltar} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {id ? "Editar Material Didático" : "Cadastrar Material Didático"}
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Seção da Foto da Capa */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>Foto da Capa</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{ 
                width: 120, 
                height: 160, 
                borderRadius: 2,
                bgcolor: 'grey.200'
              }}
              src={previewImage || material.fotoCapa}
              variant="rounded"
            >
              <PhotoCameraIcon sx={{ fontSize: 40, color: 'grey.500' }} />
            </Avatar>
            
            <Stack spacing={1}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ textTransform: 'none' }}
              >
                Selecionar Imagem
              </Button>
              
              {(previewImage || material.fotoCapa) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveImage}
                  sx={{ textTransform: 'none' }}
                >
                  Remover Imagem
                </Button>
              )}
              
              <Typography variant="caption" color="text.secondary">
                Formatos aceitos: JPG, PNG, GIF<br />
                Tamanho máximo: 5MB
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Informações Básicas */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>Informações Básicas</Typography>
          
          <Stack spacing={2}>
            <TextField
              label="Nome do Material *"
              value={material.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              fullWidth
              placeholder="Ex: English Grammar in Use"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Editora *"
                  value={material.editora}
                  onChange={(e) => handleChange("editora", e.target.value)}
                  fullWidth
                  placeholder="Ex: Cambridge University Press"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Autor"
                  value={material.autor}
                  onChange={(e) => handleChange("autor", e.target.value)}
                  fullWidth
                  placeholder="Ex: Raymond Murphy"
                />
              </Grid>
            </Grid>

            <TextField
              label="Observações"
              value={material.obs}
              onChange={(e) => handleChange("obs", e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Informações adicionais sobre o material..."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={material.status === 1}
                  onChange={(e) => handleStatusChange(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: material.status === 1 ? '#1976d2' : '#d32f2f',
                    fontWeight: 'bold'
                  }}
                >
                  {material.status === 1 ? 'Ativo' : 'Inativo'}
                </Typography>
              }
            />
          </Stack>
        </Paper>

        {/* Botões de Ação */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            onClick={handleVoltar} 
            disabled={loading}
            sx={{ textTransform: 'none', minWidth: 120 }}
          >
            Voltar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSalvar} 
            disabled={loading}
            sx={{ textTransform: 'none', minWidth: 120 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}