// app/dashboard/page.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { getResumenServicios } from '@/visualizacion/actions/servicios';
import { RiLoader2Fill } from 'react-icons/ri';
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
      }
    });
  }, []);

  return (
    <div className="container mx-auto mt-20 p-4 min-h-screen bg-gray-50">
      {isPending && (
        <div className="flex justify-center items-center h-64">
          <RiLoader2Fill className="h-8 w-8 animate-spin text-blue-600" />
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
          topEspecialidades={data.topEspecialidades}
          capacidadPromedio={data.capacidadPromedio}
        />
      )}
    </div>
  );
}