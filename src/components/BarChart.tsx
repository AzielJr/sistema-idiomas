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
        label: "Quantidade de Alunos",
        data: data.map(item => item.value),
        backgroundColor: [
          '#0d47a1',
          '#1565c0', 
          '#1976d2',
          '#1e88e5'
        ],
        borderColor: [
          '#0d47a1',
          '#1565c0', 
          '#1976d2',
          '#1e88e5'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: [
          '#0a3d91',
          '#1359b0', 
          '#1669c2',
          '#1b7dd5'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} alunos`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(13, 71, 161, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#0d47a1',
          callback: function(value: any) {
            return value + ' alunos';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#0d47a1',
          maxRotation: 0
        }
      }
    },
    elements: {
      bar: {
        borderWidth: 2
      }
    }
  };

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      minHeight: "350px",
      padding: 2
    }}>
      <Box sx={{
        width: "100%",
        height: "100%",
        minHeight: "350px"
      }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
}