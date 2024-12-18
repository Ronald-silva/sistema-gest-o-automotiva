import './styles/home.css';
import './styles/dashboard.css';
import './styles/gestao.css';
import './styles/registro.css';
import './styles/nav.css';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line, Bar, Pie } from 'react-chartjs-2';
  
  // Registra os elementos e as escalas necessários
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
  );
  
  const ChartComponent = () => {
    const data = {
      labels: ['Janeiro', 'Fevereiro', 'Março'],
      datasets: [
        {
          label: 'Relatório de Vendas',
          data: [100, 200, 300],
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };
    
  
    return (
      <div>
        <h2>Gráfico de Relatório</h2>
        <Line data={data} />
        <Bar data={data} />
        <Pie data={data} />
      </div>
    );
  };
  
  export default ChartComponent;
  