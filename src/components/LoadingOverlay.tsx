import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading deve ser usado dentro de LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoading = (loadingMessage: string = 'Carregando...') => {
    setMessage(loadingMessage);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage('');
  };

  const value: LoadingContextType = {
    showLoading,
    hideLoading,
    isLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={isLoading}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" color="inherit">
            {message}
          </Typography>
        </Box>
      </Backdrop>
    </LoadingContext.Provider>
  );
};
