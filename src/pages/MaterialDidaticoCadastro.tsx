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
  Checkbox
} from "@mui/material";
import { 
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface MaterialDidatico {
  id?: number;
  nome: string;
  editora: string;
  autor: string;
  obs: string;
  foto_capa: string;
  status: number; // 1 = ativo, 0 = inativo
}

export default function MaterialDidaticoCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [material, setMaterial] = useState<MaterialDidatico>({
    nome: "",
    editora: "",
    autor: "",
    obs: "",
    foto_capa: "",
    status: 1 // Padrão ativo
  });

  const [previewImage, setPreviewImage] = useState<string>("");

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
        setMaterial((prev) => ({ ...prev, foto_capa: base64String }));
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setMaterial((prev) => ({ ...prev, foto_capa: "" }));
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSalvar = () => {
    // Validações básicas
    if (!material.nome.trim()) {
      alert('O nome do material é obrigatório.');
      return;
    }

    if (!material.editora.trim()) {
      alert('A editora é obrigatória.');
      return;
    }

    if (!material.autor.trim()) {
      alert('O autor é obrigatório.');
      return;
    }

    // Simular salvamento
    alert("Material didático salvo com sucesso!\n\n" + JSON.stringify({
      ...material,
      foto_capa: material.foto_capa ? "Imagem carregada" : "Sem imagem"
    }, null, 2));
    
    // Voltar para a listagem
    navigate("/cadastros/material-didatico");
  };

  const handleVoltar = () => {
    navigate("/cadastros/material-didatico");
  };

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
              src={previewImage || material.foto_capa}
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
              
              {(previewImage || material.foto_capa) && (
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
              required
              placeholder="Ex: English Grammar in Use"
            />

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  label="Editora *"
                  value={material.editora}
                  onChange={(e) => handleChange("editora", e.target.value)}
                  fullWidth
                  required
                  placeholder="Ex: Cambridge University Press"
                />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  label="Autor *"
                  value={material.autor}
                  onChange={(e) => handleChange("autor", e.target.value)}
                  fullWidth
                  required
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
                <Checkbox
                  checked={material.status === 1}
                  onChange={(e) => handleStatusChange(e.target.checked)}
                  color="primary"
                />
              }
              label="Ativo?"
            />
          </Stack>
        </Paper>

        {/* Botões de Ação */}
        <Stack direction="row" spacing={2} justifyContent="flex-start">
          <Button 
            variant="contained" 
            onClick={handleSalvar} 
            sx={{ textTransform: 'none', minWidth: 120 }}
          >
            Salvar
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleVoltar} 
            sx={{ textTransform: 'none', minWidth: 120 }}
          >
            Voltar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}