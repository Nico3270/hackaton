'use client';

import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

interface HealthReport {
  satisfaccionGeneral: Record<string, { promedio: number; distribucion: Record<string, string> }>;
  calidadAtencion: Record<string, Record<string, Record<string, string>>>;
  tiempoEsperaPromedio: Record<string, number>;
  aspectosMejorar: Record<string, Record<string, string>>;
  disponibilidad: Record<string, Record<string, string>>;
  sintomasFrecuentes: Record<string, Record<string, string>>;
  tendenciasEstacionales: Record<string, Array<{ mes: string; count: number }>>;
  recomendacion: Record<string, { porcentaje: string }>;
  motivosVisita: Record<string, Record<string, string>>;
}

interface ShowUsuariosInformacionProps {
  report: HealthReport;
}

const ShowUsuariosInformacion: React.FC<ShowUsuariosInformacionProps> = ({ report }) => {
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('Boyacá');

  const departamentos = Object.keys(report.satisfaccionGeneral);

  // Colores consistentes para gráficos
  const colors = {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#22c55e',
    neutral: '#6b7280',
    warning: '#f59e0b',
  };

  // 1. Satisfacción general
  const satisfaccionData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Distribución de Satisfacción (%)',
        data: Object.values(report.satisfaccionGeneral[selectedDepartamento].distribucion),
        backgroundColor: [colors.warning, colors.neutral, colors.accent, colors.primary, colors.secondary],
      },
    ],
  };

  // 2. Calidad de atención por tipo de servicio
  const calidadData = {
    labels: Object.keys(report.calidadAtencion[selectedDepartamento]),
    datasets: Object.keys(report.calidadAtencion[selectedDepartamento]['PuestoSalud'] || {}).map((calidad, index) => ({
      label: calidad,
      data: Object.values(report.calidadAtencion[selectedDepartamento]).map((tipo) => tipo[calidad] || '0'),
      backgroundColor: [colors.primary, colors.secondary, colors.accent, colors.warning, colors.neutral][index % 5],
    })),
  };

  // 3. Tiempo de espera
  const tiempoEsperaData = {
    labels: departamentos,
    datasets: [
      {
        label: 'Tiempo de Espera Promedio (min)',
        data: departamentos.map((dep) => report.tiempoEsperaPromedio[dep]),
        backgroundColor: colors.primary,
      },
    ],
  };

  // 4. Aspectos a mejorar
  const aspectosData = {
    labels: Object.keys(report.aspectosMejorar[selectedDepartamento]),
    datasets: [
      {
        label: 'Aspectos a Mejorar (%)',
        data: Object.values(report.aspectosMejorar[selectedDepartamento]),
        backgroundColor: colors.accent,
      },
    ],
  };

  // 5. Disponibilidad
  const disponibilidadData = {
    labels: Object.keys(report.disponibilidad[selectedDepartamento]),
    datasets: [
      {
        data: Object.values(report.disponibilidad[selectedDepartamento]),
        backgroundColor: [colors.primary, colors.warning, colors.neutral, colors.secondary],
      },
    ],
  };

  // 6. Síntomas frecuentes
  const sintomasData = {
    labels: Object.keys(report.sintomasFrecuentes[selectedDepartamento]),
    datasets: [
      {
        label: 'Síntomas Frecuentes (%)',
        data: Object.values(report.sintomasFrecuentes[selectedDepartamento]),
        backgroundColor: colors.secondary,
      },
    ],
  };

  // 7. Tendencias estacionales
  const tendenciasData = {
    labels: report.tendenciasEstacionales[selectedDepartamento].map((d) => d.mes),
    datasets: [
      {
        label: 'Reportes por Mes',
        data: report.tendenciasEstacionales[selectedDepartamento].map((d) => d.count),
        borderColor: colors.primary,
        fill: false,
      },
    ],
  };

  // 8. Recomendación
  const recomendacionData = {
    labels: departamentos,
    datasets: [
      {
        label: 'Porcentaje de Recomendación (%)',
        data: departamentos.map((dep) => report.recomendacion[dep].porcentaje),
        backgroundColor: colors.accent,
      },
    ],
  };

  // 9. Motivos de visita
  const motivosData = {
    labels: Object.keys(report.motivosVisita[selectedDepartamento]),
    datasets: [
      {
        label: 'Motivos de Visita (%)',
        data: Object.values(report.motivosVisita[selectedDepartamento]),
        backgroundColor: colors.neutral,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Reporte de Salud - Usuarios</h1>

      {/* Filtro de departamento */}
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

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Satisfacción General */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Satisfacción General</h2>
          <p className="text-gray-600 mb-4">Promedio: {report.satisfaccionGeneral[selectedDepartamento].promedio.toFixed(2)}</p>
          <Doughnut data={satisfaccionData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Calidad de Atención */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Calidad de Atención por Servicio</h2>
          <Bar data={calidadData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Tiempo de Espera */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Tiempo de Espera Promedio</h2>
          <Bar data={tiempoEsperaData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Aspectos a Mejorar */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Aspectos a Mejorar</h2>
          <Bar data={aspectosData} options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }} />
        </div>

        {/* Disponibilidad */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Disponibilidad de Servicios</h2>
          <Doughnut data={disponibilidadData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Síntomas Frecuentes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Síntomas Frecuentes</h2>
          <Bar data={sintomasData} options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }} />
        </div>

        {/* Tendencias Estacionales */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Tendencias Estacionales</h2>
          <Line data={tendenciasData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Recomendación */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recomendación (NPS-like)</h2>
          <Bar data={recomendacionData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Motivos de Visita */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Motivos de Visita</h2>
          <Doughnut data={motivosData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
};

export default ShowUsuariosInformacion;