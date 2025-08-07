import { Box, useTheme, useMediaQuery } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(Legend, Tooltip, ArcElement);

interface DataItem {
  label: string;
  value: number;
}

interface RoscaChartProps {
  data?: DataItem[];
}

export default function RoscaChart({ data = [] }: RoscaChartProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Cores para o gráfico
  const backgroundColors = [
    '#1976d2', // azul
    '#2e7d32', // verde
    '#ed6c02', // laranja
    '#9c27b0', // roxo
    '#d32f2f', // vermelho
    '#0288d1', // azul claro
    '#388e3c', // verde claro
    '#f57c00'  // laranja claro
  ];

  // Configuração do gráfico
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Quantidade",
        data: data.map(item => item.value),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isSmallScreen ? "bottom" : "right" as const,
        labels: {
          font: {
            size: isSmallScreen ? 10 : 12
          },
          boxWidth: isSmallScreen ? 10 : 15
        }
      }
    },
    cutout: isSmallScreen ? '65%' : '50%'
  };

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center",
      maxWidth: isSmallScreen ? "100%" : "90%",
      margin: "0 auto"
    }}>
      <Doughnut data={chartData} options={options} />
    </Box>
  );
}