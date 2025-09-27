'use client';

import Link from 'next/link';

type Servicio = {
  id: string;
  nombre: string;
  departamento: string;
};

type ServiciosListProps = {
  servicios: Servicio[];
};

type DepartamentoServiciosProps = {
  titulo: string;
  servicios: Servicio[];
};

function DepartamentoServicios({ titulo, servicios }: DepartamentoServiciosProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{titulo}</h2>
      {servicios.length === 0 ? (
        <p className="text-gray-500">No se encontraron servicios en {titulo}.</p>
      ) : (
        <ul className="space-y-4">
          {servicios.map((servicio) => (
            <li
              key={servicio.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-xl"
            >
              <span className="text-md font-medium text-gray-900">
                {servicio.nombre}
              </span>
              <div className="space-x-2">
                <Link
                  href={`/calificaServicio/${servicio.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  Calificar
                </Link>
                <Link
                  href={`/ver/${servicio.id}`}
                  className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
                >
                  Ver Info
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ServiciosList({ servicios }: ServiciosListProps) {
  const cundinamarca = servicios.filter(
    (s) => s.departamento === 'Cundinamarca'
  );
  const boyaca = servicios.filter((s) => s.departamento === 'Boyacá');

  return (
    <div className="w-full  grid grid-cols-1 md:grid-cols-2 gap-8">
      <DepartamentoServicios titulo="Boyacá" servicios={boyaca} />
      <DepartamentoServicios titulo="Cundinamarca" servicios={cundinamarca} />
    </div>
  );
}
