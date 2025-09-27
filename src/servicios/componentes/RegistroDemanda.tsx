"use client"
import { ServicioDashboardData } from "../actions/servicios";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, BarChart2, Calendar } from "lucide-react";
import { FactorEstacional } from "@prisma/client";

// Props con tipado estricto
interface RegistroDemandaProps {
  demandas: ServicioDashboardData["demandas"];
}

// Función para procesar datos para gráficos y proyecciones
const processData = (demandas: ServicioDashboardData["demandas"]) => {
  // Datos para línea temporal (atenciones por mes)
  const monthlyData = demandas.data.reduce((acc, d) => {
    const month = new Date(d.fecha).toLocaleString("default", { month: "short", year: "numeric" });
    if (!acc[month]) {
      acc[month] = { atenciones: 0, count: 0 };
    }
    acc[month].atenciones += d.atenciones;
    acc[month].count += 1;
    return acc;
  }, {} as Record<string, { atenciones: number; count: number }>);
  const lineData = Object.entries(monthlyData).map(([month, { atenciones, count }]) => ({
    month,
    atenciones: Math.round(atenciones / count), // Promedio por mes
  }));

  // Datos para barras por factor estacional
  const factorData = Object.values(FactorEstacional).map((factor) => ({
    name: factor,
    value: demandas.data
      .filter((d) => d.factorEstacional === factor)
      .reduce((sum, d) => sum + d.atenciones, 0),
  })).filter((d) => d.value > 0);

  // Proyecciones mensuales simples (promedio + ajuste estacional)
  const avgAtenciones = demandas.avgAtenciones || 0;
  const projections = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(new Date().setMonth(new Date().getMonth() + i)).toLocaleString("default", { month: "short", year: "numeric" });
    const seasonalFactor = demandas.data.some((d) => d.factorEstacional === "Lluvias" && new Date(d.fecha).getMonth() === new Date().getMonth() + i)
      ? 1.2 // +20% en lluvias
      : 1.0;
    return { month, projected: Math.round(avgAtenciones * seasonalFactor) };
  });

  return { lineData, factorData, projections };
};

export function RegistroDemanda({ demandas }: RegistroDemandaProps) {
  if (demandas.count === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 md:p-8 text-center text-gray-600">
        No hay registros de demanda disponibles.
      </div>
    );
  }

  const { lineData, factorData, projections } = processData(demandas);

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Análisis de Demanda
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {demandas.count} registros analizados | Promedio de atenciones: {Math.round(demandas.avgAtenciones || 0)}
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Atenciones Históricas */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Atenciones por Mes</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="atenciones" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tarjeta de Demanda por Factor Estacional */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Demanda por Factor Estacional</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={factorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjeta de Proyecciones Mensuales */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Proyecciones Mensuales</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left font-medium text-gray-800">Mes</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-800">Atenciones Proyectadas</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((proj) => (
                  <tr key={proj.month} className="border-t">
                    <td className="px-4 py-2">{proj.month}</td>
                    <td className="px-4 py-2">{proj.projected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}