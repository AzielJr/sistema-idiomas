
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette:{
    mode: 'light',
    primary:{
      main: '#1976d2',
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    secondary:{
      main: '#9c27b0',
      light: '#d05ce3',
      dark: '#6a0080',
      contrastText: '#fff',
    },
    background:{
      default: '#f5f5f5',
      paper: '#f0f0f0ff'
    },
    text:{
      primary: '#1b1b1bff',
      secondary: '#404246ff',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape:{
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          minWidth: '160px',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiSelect-root': {
            minWidth: '160px',
          },
        },
      },
    },
  },
  
});

export default theme;