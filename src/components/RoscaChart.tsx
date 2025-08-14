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
  // Cores para o gráfico - mais vibrantes e profissionais
  const backgroundColors = [
    '#4a148c', // roxo escuro
    '#7b1fa2', // roxo médio
    '#ab47bc', // roxo claro
    '#ce93d8', // roxo muito claro
    '#e1bee7', // lilás
    '#f3e5f5', // rosa muito claro
    '#8e24aa', // roxo vibrante
    '#ba68c8'  // roxo suave
  ];

  // Configuração do gráfico
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: "Quantidade",
        data: data.map(item => item.value),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 13,
            weight: 'bold'
          },
          boxWidth: 18,
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 8,
        displayColors: true
      }
    },
    cutout: '45%',
    radius: '90%'
  };

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center",
      minHeight: "280px",
      position: "relative"
    }}>
      <Box sx={{
        width: "100%",
        height: "100%",
        maxWidth: "350px",
        maxHeight: "350px"
      }}>
        <Doughnut data={chartData} options={options} />
      </Box>
    </Box>
  );
}