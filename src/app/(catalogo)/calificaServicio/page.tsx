
import { getServicios } from '@/visualizacion/actions/getServicios';
import ServiciosList from '@/visualizacion/actions/ServiciosList';
import { Suspense } from 'react';

export default async function CalificaServicioPage() {
  
  const servicios = await getServicios();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <form action="/calificaServicio" className="w-full max-w-2xl mb-8">
          <input
            type="text"
            name="q"
            placeholder="Buscar servicios por nombre..."
            className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200"
          />
        </form>
        <ServiciosList servicios={servicios} />
      </div>
    </Suspense>
  );
}