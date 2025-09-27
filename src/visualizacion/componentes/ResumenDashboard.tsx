// app/components/ResumenDashboard.tsx
'use client';

import { Badge } from '@/ui/components/not-found/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/not-found/card';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';


// Colores claros/pastel tipo Apple: neutros suaves
const COLORS = ['#A5D8FF', '#B2F2BB', '#FFE3A3', '#DDBDFC', '#FFC9C9', '#C3EAFD'];

interface ResumenProps {
  totalServicios: number;
  disponibles: number;
  porDepartamento: { departamento: string; _count: { id: number } }[];
  porTipo: { tipo: string; _count: { id: number } }[];
  porNivel: { nivelComplejidad: string | null; _count: { id: number } }[];
  topEspecialidades: Record<string, number>;
  capacidadPromedio: number;
}

const ResumenDashboard: React.FC<ResumenProps> = ({
  totalServicios,
  disponibles,
  porDepartamento,
  porTipo,
  porNivel,
  topEspecialidades,
  capacidadPromedio,
}) => {
  // Preparar datos para gráficos
  const deptData = porDepartamento.map(d => ({ name: d.departamento, value: d._count.id }));
  const tipoData = porTipo.map(t => ({ name: t.tipo, value: t._count.id }));
  const nivelData = porNivel.map(n => ({ name: `Nivel ${n.nivelComplejidad || 'N/A'}`, value: n._count.id }));
  const espData = Object.entries(topEspecialidades)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Datos ficticios para línea de capacidad mensual (basado en promedio, simulado estacional)
  const mensualData = [
    { mes: 'Ene', capacidad: capacidadPromedio * 0.8 },
    { mes: 'Feb', capacidad: capacidadPromedio * 0.9 },
    { mes: 'Mar', capacidad: capacidadPromedio * 1.1 },
    { mes: 'Abr', capacidad: capacidadPromedio * 1.2 }, // Pico lluvia
    { mes: 'May', capacidad: capacidadPromedio * 1.3 },
    { mes: 'Jun', capacidad: capacidadPromedio * 1.0 },
    { mes: 'Jul', capacidad: capacidadPromedio * 0.9 },
    { mes: 'Ago', capacidad: capacidadPromedio * 0.8 },
    { mes: 'Sep', capacidad: capacidadPromedio * 1.0 },
    { mes: 'Oct', capacidad: capacidadPromedio * 1.1 },
    { mes: 'Nov', capacidad: capacidadPromedio * 1.2 },
    { mes: 'Dic', capacidad: capacidadPromedio * 0.9 },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-50 min-h-screen font-sans">
      {/* Métricas clave - Tarjetas premium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md border-0 rounded-xl transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Total Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">{totalServicios}</p> {/* Ajuste a claro */}
          </CardContent>
        </Card>
        <Card className="shadow-md border-0 rounded-xl transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">{disponibles}</p> {/* Ajuste a claro */}
            <Badge variant="secondary" className="ml-2 bg-green-50 text-green-600"> {/* Ajuste a claro */}
              {totalServicios > 0 ? ((disponibles / totalServicios) * 100).toFixed(1) : '0.0'}%
            </Badge>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0 rounded-xl transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Capacidad Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-400">{capacidadPromedio.toFixed(0)}</p> {/* Ajuste a claro */}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos - Responsive containers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Por Tipo */}
        <Card className="shadow-md border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tipoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {tipoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: Por Nivel */}
        <Card className="shadow-md border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Distribución por Nivel</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={nivelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
                  {nivelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Por Departamento */}
        <Card className="shadow-md border-0 rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Servicios por Departamento</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#A5D8FF" /> {/* Ajuste a claro */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Top Especialidades */}
        <Card className="shadow-md border-0 rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Top 5 Especialidades</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={espData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#B2F2BB" /> {/* Ajuste a claro */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart: Capacidad Mensual Proyectada */}
        <Card className="shadow-md border-0 rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Proyección Capacidad Mensual</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mensualData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="capacidad" stroke="#FFE3A3" strokeWidth={2} /> {/* Ajuste a claro */}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> 
      </div>
    </div>
  );
};

export default ResumenDashboard;