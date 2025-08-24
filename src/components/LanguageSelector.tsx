import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Menu,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useState } from 'react';

// Componente de bandeira usando imagens reais
const FlagIcon: React.FC<{ country: string; size?: number }> = ({ country, size = 20 }) => {
  // URLs das bandeiras reais
  const flags: { [key: string]: string } = {
    pt: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg',
    en: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg',
    es: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg'
  };

  return (
    <Box sx={{ 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
    }}>
      <img 
        src={flags[country] || flags.pt} 
        alt={`Bandeira ${country.toUpperCase()}`}
        style={{
          width: size,
          height: size * 0.7,
          borderRadius: '2px',
          objectFit: 'cover',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
        onError={(e) => {
          // Fallback para emojis se a imagem falhar
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('span');
          fallback.style.fontSize = `${size}px`;
          fallback.textContent = country === 'pt' ? '🇧🇷' : country === 'en' ? '🇺🇸' : '🇪🇸';
          target.parentNode?.appendChild(fallback);
        }}
      />
    </Box>
  );
};

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    handleClose();
  };

  const languages = [
    { code: 'pt', name: 'Português', nativeName: 'Português' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Español', nativeName: 'Español' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Cores adaptativas baseadas no contexto (mobile vs desktop)
  const isDarkHeader = isMobile; // Mobile tem header escuro, desktop tem header claro
  
  const buttonColors = {
    color: isDarkHeader ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
    backgroundColor: isDarkHeader ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    hoverBackground: isDarkHeader ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'
  };

  const textColors = {
    color: isDarkHeader ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
  };

  return (
    <Box>
      <Tooltip title={`Idioma: ${currentLanguage.nativeName}`} arrow placement="bottom">
        <IconButton
          onClick={handleClick}
          sx={{
            color: buttonColors.color,
            backgroundColor: buttonColors.backgroundColor,
            borderRadius: '12px',
            padding: '8px',
            minWidth: 'auto',
            border: isDarkHeader ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: buttonColors.hoverBackground,
              transform: 'scale(1.05)',
              transition: 'all 0.2s ease-in-out'
            },
            '&:active': {
              transform: 'scale(0.95)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.8,
            padding: '2px'
          }}>
            <FlagIcon country={currentLanguage.code} size={18} />
            <Typography 
              variant="caption" 
              sx={{ 
                ...textColors,
                fontSize: '0.7rem', 
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              {currentLanguage.code}
            </Typography>
          </Box>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        {languages.map((language) => (
          <MenuItem 
            key={language.code} 
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === i18n.language}
            sx={{
              padding: '12px 16px',
              borderRadius: '8px',
              margin: '2px 8px',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease-in-out'
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.16)'
                }
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              width: '100%'
            }}>
              <FlagIcon country={language.code} size={20} />
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: language.code === i18n.language ? 600 : 500,
                    color: language.code === i18n.language ? '#1976d2' : '#333'
                  }}
                >
                  {language.nativeName}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#666',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {language.code}
                </Typography>
              </Box>
              {language.code === i18n.language && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    animation: 'pulse 2s infinite'
                  }}
                />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default LanguageSelector;