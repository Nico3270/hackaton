
import { getServicios } from '@/visualizacion/actions/getServicios';
import ServiciosList from '@/visualizacion/actions/ServiciosList';
import { Suspense } from 'react';

export default async function CalificaServicioPage() {
  const servicios = await getServicios();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center mt-20">
        <ServiciosList servicios={servicios} />
      </div>
    </Suspense>
  );
}