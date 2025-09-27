
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiStar, FiInfo } from 'react-icons/fi';

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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{titulo}</h2>
      {servicios.length === 0 ? (
        <p className="text-gray-500 text-sm">No se encontraron servicios en {titulo}.</p>
      ) : (
        <ul className="space-y-3">
          {servicios.map((servicio) => (
            <li
              key={servicio.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-gray-900 max-w-[60%] truncate">
                {servicio.nombre}
              </span>
              <div className="flex items-center space-x-4">
                <Link
                  href={`/calificaServicio/${servicio.id}`}
                  className="flex flex-col items-center text-blue-600 hover:text-blue-700 transition"
                >
                  <FiStar className="text-lg" />
                  <span className="text-[11px] font-medium">Calificar</span>
                </Link>
                <Link
                  href={`/ver/${servicio.id}`}
                  className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition"
                >
                  <FiInfo className="text-lg" />
                  <span className="text-[11px] font-medium">Ver Info</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ServiciosList({ servicios: initialServicios }: ServiciosListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredServicios = initialServicios.filter((s) =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cundinamarca = filteredServicios.filter((s) => s.departamento === 'Cundinamarca');
  const boyaca = filteredServicios.filter((s) => s.departamento === 'Boyacá');

  return (
    <>
      {/* Barra de búsqueda premium */}
      <div className="w-full max-w-2xl mb-10">
        <input
          type="text"
          placeholder="Buscar servicios por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all duration-200"
        />
      </div>

      {/* Listado por departamentos */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <DepartamentoServicios titulo="Boyacá" servicios={boyaca} />
        <DepartamentoServicios titulo="Cundinamarca" servicios={cundinamarca} />
      </div>
    </>
  );
}

