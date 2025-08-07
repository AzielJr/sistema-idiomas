import { Box, useTheme, useMediaQuery } from "@mui/material";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip);

interface DataItem {
  label: string;
  value: number;
}

interface BarChartProps {
  data?: DataItem[];
}

export default function BarChart({ data = [] }: BarChartProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  // Configuração do gráfico
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Quantidade",
        data: data.map(item => item.value),
        backgroundColor: "#1976d2"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: !isSmallScreen
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: isSmallScreen ? 10 : 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: isSmallScreen ? 10 : 12
          }
        }
      }
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
}