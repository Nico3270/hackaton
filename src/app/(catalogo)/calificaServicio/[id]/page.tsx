import { auth } from "@/auth.config";
import { getServicioById } from "@/dashboard/actions/getServicioById";

import CrearReporteComunidad from "@/dashboard/componentes/CrearReporteComunidad";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

// Metadata para SEO
export const metadata: Metadata = {
  title: "Calificar Servicio de Salud",
  description: "Proporciona tu feedback sobre los servicios de salud para ayudar a mejorar la atención.",
};

export default async function CalificarServicio({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const usuarioId = session?.user?.id;

  // Validar el servicio
  const result = await getServicioById(id);

  if (!result.ok || !result.servicio) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{result.message || "Servicio no encontrado."}</p>
          <p className="text-gray-500">Por favor, verifica el ID del servicio o contacta al soporte.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 flex items-center justify-center">
      <div className="mt-20 w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Calificar {result.servicio.nombre}
        </h1>
        <CrearReporteComunidad servicioId={id} usuarioId={usuarioId} />
      </div>
    </main>
  );
}