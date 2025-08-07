import { Box, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const location = useLocation();

  // Função para gerar breadcrumbs baseado na rota atual
  const generateBreadcrumbs = () => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');
    
    const crumbs = [];
    let currentPath = '';
    
    // Sempre adiciona Home
    crumbs.push({ 
      label: 'Home', 
      path: '/',
      icon: <HomeIcon fontSize="small" />
    });
    
    // Mapeia os segmentos para nomes mais amigáveis
    const segmentMap: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'alunos': 'Alunos',
      'professores': 'Professores',
      'turmas': 'Turmas',
      'cadastros': 'Cadastros',
      'administracao': 'Administração',
      'secretaria': 'Secretaria',
      'projetos': 'Projetos',
      'mov': 'Movimentações',
      'cadastro': 'Cadastro'
    };
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segmentMap[segment.toLowerCase()] || segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, path: currentPath });
    });
    
    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Determina o título da página se não foi fornecido
  const pageTitle = title || breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        backgroundColor: 'white',
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          {pageTitle}
        </Typography>
        
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mt: 1 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Box key={index} display="flex" alignItems="center" gap={0.5}>
                {crumb.icon}
                <Typography color="text.primary" fontWeight="medium">
                  {crumb.label}
                </Typography>
              </Box>
            ) : (
              <Link 
                key={index} 
                color="inherit" 
                href={crumb.path}
                underline="hover"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {crumb.icon}
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
    </Paper>
  );
}