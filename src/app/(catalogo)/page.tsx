// app/dashboard/page.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react'; // Cambiado a lucide-react
import { getResumenServicios } from '@/visualizacion/actions/servicios';
import { Card, CardContent } from '@/ui/components/not-found/card';
import ResumenDashboard from '@/visualizacion/componentes/ResumenDashboard';


export default function InicioPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getResumenServicios>> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar
  React.useEffect(() => {
    startTransition(async () => {
      try {
        const resumen = await getResumenServicios();
        setData(resumen);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.log(err);
      }
    });
  }, []);

  return (
    <div className="container mx-auto mt-20 p-4 min-h-screen bg-gray-50">
      {isPending && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" /> {/* Ajustado a color claro */}
        </div>
      )}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}
      {data && !isPending && (
        <ResumenDashboard
          totalServicios={data.totalServicios}
          disponibles={data.disponibles}
          porDepartamento={data.porDepartamento}
          porTipo={data.porTipo}
          porNivel={data.porNivel}
          porCiudad={data.porCiudad}
          topEspecialidades={data.topEspecialidades}
          capacidadPromedio={data.capacidadPromedio}
        />
      )}
      {!data && !isPending && !error && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <p className="text-gray-600">No hay datos disponibles para mostrar.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}