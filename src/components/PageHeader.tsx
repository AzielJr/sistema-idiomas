import { Box, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, rightContent }: PageHeaderProps) {
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
      'mov': 'Acadêmico',
      'cadastro': 'Cadastro',
      'grupos-acesso': 'Níveis de Acesso'
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
        p: 0.5, 
        mb: 0.5, 
        mt: 0,
        borderRadius: 1,
        backgroundColor: 'white',
        borderLeft: '2px solid',
        borderColor: 'primary.main',
        boxShadow: 'none'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" gap={0.1} flex={1}>
          <Typography variant="subtitle1" fontWeight="500" color="primary.main" sx={{ fontSize: '1rem' }}>
            {pageTitle}
          </Typography>
          
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mt: 0.1, fontSize: '0.7rem' }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Box key={index} display="flex" alignItems="center" gap={0.5}>
                  {crumb.icon}
                  <Typography color="text.primary" fontWeight="medium" fontSize="0.7rem">
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
                    fontSize: '0.7rem',
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
        
        {rightContent && (
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            {rightContent}
          </Box>
        )}
      </Box>
    </Paper>
  );
}