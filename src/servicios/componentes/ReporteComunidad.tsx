"use client";

import { ServicioDashboardData } from "../actions/servicios";
import { BarChart, LineChart, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar } from "recharts";
import { MessageSquare, Star, TrendingUp, Clock, ThumbsUp } from "lucide-react";
import { AspectoMejorar, ValoracionSatisfaccion } from "@prisma/client";
import { Line } from "recharts";

// Tipo explícito para síntomas
interface SymptomData {
  text: string;
  value: number;
}

// Props con tipado estricto
interface ReporteComunidadProps {
  reportes: ServicioDashboardData["reportes"];
}

// Función para procesar datos para gráficos
const processData = (reportes: ServicioDashboardData["reportes"]) => {
  // Datos para línea temporal (agrupar por mes)
  const monthlyReports = reportes.data.reduce((acc, r) => {
    const month = new Date(r.fecha).toLocaleString("default", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const lineData = Object.entries(monthlyReports).map(([month, count]) => ({ month, count }));

  // Datos para barras de aspectos
  const barData = reportes.topAspectos.map((asp: AspectoMejorar) => ({
    name: asp,
    value: reportes.data.filter((r) => r.aspectosMejorar.includes(asp)).length,
  }));

  // Datos para síntomas (barras horizontales)
  const symptomsMap = new Map<string, number>();
  reportes.data.forEach((r) => {
    r.sintomas.forEach((s) => {
      symptomsMap.set(s, (symptomsMap.get(s) || 0) + 1);
    });
  });
  const symptomData: SymptomData[] = Array.from(symptomsMap.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value) // Ordenar por frecuencia descendente
    .slice(0, 10); // Top 10 síntomas

  // Datos para distribución de calidadAtencion
  const calidadData = Object.entries(reportes.calidadAtencionDist)
    .map(([name, value]) => ({
      name: name as ValoracionSatisfaccion,
      value,
    }))
    .filter((d) => d.value > 0);

  // Datos para gauge de recomendación
  const recomendacionData = [
    { name: "Recomendado", value: reportes.porcentajeRecomendacion || 0 },
    { name: "No Recomendado", value: reportes.porcentajeRecomendacion ? 100 - reportes.porcentajeRecomendacion : 100 },
  ];

  return { lineData, barData, symptomData, calidadData, recomendacionData };
};

export function ReporteComunidad({ reportes }: ReporteComunidadProps) {
  if (reportes.count === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 md:p-8 text-center text-gray-600">
        No hay reportes aprobados disponibles.
      </div>
    );
  }

  const { lineData, barData, symptomData, calidadData, recomendacionData } = processData(reportes);

  // Colores para el gauge
  const COLORS = ["#10b981", "#d1d5db"]; // Verde para Recomendado, gris para No Recomendado

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Feedback de la Comunidad
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {reportes.count} reportes analizados | Promedio de satisfacción: {reportes.avgRating?.toFixed(1) || "N/A"}
          </p>
        </div>

        {/* Tarjeta de Métricas Generales */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-800">Métricas Generales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <p className="text-gray-600">
                Tiempo de espera promedio: {reportes.avgTiempoEspera ? `${reportes.avgTiempoEspera.toFixed(1)} min` : "N/A"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <p className="text-gray-600">
                Recomendación: {reportes.porcentajeRecomendacion ? `${reportes.porcentajeRecomendacion.toFixed(1)}%` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Aspectos a Mejorar */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-800">Aspectos a Mejorar</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tarjeta de Tendencias Temporales */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Reportes por Mes</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tarjeta de Calidad de Atención */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Calidad de Atención</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={calidadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tarjeta de Recomendación */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <ThumbsUp className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Porcentaje de Recomendación</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={recomendacionData}
                  dataKey="value"
                  innerRadius="40%"
                  outerRadius="80%"
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                >
                  {recomendacionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjeta de Síntomas Frecuentes */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Síntomas Frecuentes</h2>
          </div>
          {symptomData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={symptomData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="text" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#1d4ed8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">No hay síntomas registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}