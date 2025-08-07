import { CssBaseline, ThemeProvider } from "@mui/material";
import AppRotas from "./rotas/AppRotas";
import theme from "./temas/Index";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRotas />
    </ThemeProvider>
  );
}