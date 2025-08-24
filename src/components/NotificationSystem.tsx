import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: AlertColor, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  const addNotification = (message: string, type: AlertColor, duration: number = 6000) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, newNotification]);
    
    if (!currentNotification) {
      setCurrentNotification(newNotification);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExited = () => {
    if (notifications.length > 1) {
      const remainingNotifications = notifications.slice(1);
      setNotifications(remainingNotifications);
      setCurrentNotification(remainingNotifications[0]);
      setOpen(true);
    } else {
      setNotifications([]);
      setCurrentNotification(null);
    }
  };

  const showNotification = (message: string, type: AlertColor, duration?: number) => {
    addNotification(message, type, duration);
  };

  const showSuccess = (message: string) => showNotification(message, 'success');
  const showError = (message: string) => showNotification(message, 'error');
  const showWarning = (message: string) => showNotification(message, 'warning');
  const showInfo = (message: string) => showNotification(message, 'info');

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {currentNotification && (
        <Snackbar
          open={open}
          autoHideDuration={currentNotification.duration}
          onClose={handleClose}
          onExited={handleExited}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity={currentNotification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {currentNotification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};
