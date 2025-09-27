// components/ShowDemandaPrediction.tsx
'use client';

import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface DemandaPrediction {
  patronesMensuales: Record<string, { mes: string; promedioAtenciones: number; factorDominante: string }[]>;
  prediccionMensual: Record<string, { mes: string; demandaEstimada: number }[]>;
  picosDemanda: Record<string, { periodo: string; incrementoPorc: number }[]>;
}

interface ShowDemandaPredictionProps {
  prediction: DemandaPrediction;
}

const ShowDemandaPrediction: React.FC<ShowDemandaPredictionProps> = ({ prediction }) => {
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('Boyacá');

  const departamentos = Object.keys(prediction.patronesMensuales);

  const colors = {
    primary: '#2563eb',
    accent: '#22c55e',
    warning: '#f59e0b',
  };

  // Patrones mensuales
  const patronesData = {
    labels: prediction.patronesMensuales[selectedDepartamento].map((d) => d.mes),
    datasets: [
      {
        label: 'Promedio Atenciones',
        data: prediction.patronesMensuales[selectedDepartamento].map((d) => d.promedioAtenciones),
        backgroundColor: colors.primary,
      },
    ],
  };

  // Predicción mensual
  const prediccionData = {
    labels: prediction.prediccionMensual[selectedDepartamento].map((d) => d.mes),
    datasets: [
      {
        label: 'Demanda Estimada',
        data: prediction.prediccionMensual[selectedDepartamento].map((d) => d.demandaEstimada),
        borderColor: colors.accent,
        fill: false,
      },
    ],
  };

  // Picos de demanda
  const picosData = {
    labels: prediction.picosDemanda[selectedDepartamento].map((d) => d.periodo),
    datasets: [
      {
        label: 'Incremento %',
        data: prediction.picosDemanda[selectedDepartamento].map((d) => d.incrementoPorc),
        backgroundColor: colors.warning,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Predicción de Demanda</h1>
      <div className="mb-8 flex justify-center">
        <select
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDepartamento}
          onChange={(e) => setSelectedDepartamento(e.target.value)}
        >
          {departamentos.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Patrones Mensuales</h2>
          <Bar data={patronesData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Predicción Mensual</h2>
          <Line data={prediccionData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Picos de Demanda</h2>
          <Bar data={picosData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default ShowDemandaPrediction;