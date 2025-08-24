import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AppRotas from "./rotas/AppRotas";
import theme from "./temas/Index";
import { AuthProvider } from "./contexts/AuthContextSimple";
import { NotificationProvider } from "./components/NotificationSystem";
import { LoadingProvider } from "./components/LoadingOverlay";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppRotas />
            </AuthProvider>
          </BrowserRouter>
        </NotificationProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}