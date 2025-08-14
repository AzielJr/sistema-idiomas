import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AppRotas from "./rotas/AppRotas";
import theme from "./temas/Index";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRotas />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}