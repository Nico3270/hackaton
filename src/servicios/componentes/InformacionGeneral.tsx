
import { MapPin, Hospital, Stethoscope, Users, Bed } from "lucide-react"; // Iconos de lucide-react
import { cn } from "@/lib/utils"; // Utilidad para combinar clases Tailwind (crea si no existe)
import { ServicioDashboardData } from "../actions/servicios";

// Props con tipado estricto
interface InformacionGeneralProps {
  servicio: ServicioDashboardData["servicio"];
}

export function InformacionGeneral({ servicio }: InformacionGeneralProps) {
  // Calcular porcentaje de ocupación
  const ocupacion = servicio.camasTotales
    ? Math.round(((servicio.camasDisponibles || 1) / servicio.camasTotales) * 100)
    : null;

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {servicio.nombre}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {servicio.tipo === "PuestoSalud"
              ? "Puesto de Salud"
              : servicio.tipo === "Hospital"
              ? "Hospital"
              : "Campaña Móvil"}
            {" "} | {servicio.nivelComplejidad || "N/A"}
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Ubicación */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Ubicación</h2>
            </div>
            <p className="text-gray-600">{servicio.direccion}</p>
            <p className="text-gray-500 text-sm mt-1">
              {servicio.ciudad}, {servicio.departamento}
            </p>
            {/* Placeholder para mapa */}
            <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Mapa interactivo (pendiente)</p>
            </div>
          </div>

          {/* Tarjeta de Disponibilidad */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Hospital className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Disponibilidad</h2>
            </div>
            <p className="text-lg font-medium text-gray-800">
              Estado: <span className={cn(
                servicio.disponibilidad === "Disponible" && "text-green-600",
                servicio.disponibilidad === "Parcial" && "text-yellow-600",
                servicio.disponibilidad === "NoDisponible" && "text-red-600",
                servicio.disponibilidad === "EnMantenimiento" && "text-gray-600"
              )}>
                {servicio.disponibilidad}
              </span>
            </p>
            {ocupacion && (
              <p className="text-gray-600 mt-2">
                Ocupación: {ocupacion}% ({servicio.camasDisponibles}/{servicio.camasTotales} camas)
              </p>
            )}
            {servicio.capacidadDiaria && (
              <p className="text-gray-600 mt-2">
                Capacidad diaria: {servicio.capacidadDiaria} pacientes
              </p>
            )}
          </div>

          {/* Tarjeta de Especialidades */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Especialidades</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {servicio.especialidades.length > 0 ? (
                servicio.especialidades.map((esp) => (
                  <span
                    key={esp}
                    className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {esp}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No hay especialidades registradas</p>
              )}
            </div>
          </div>

          {/* Tarjeta de Personal y Recursos */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Recursos</h2>
            </div>
            {servicio.personalMedico && (
              <p className="text-gray-600">Personal médico: {servicio.personalMedico}</p>
            )}
            {servicio.equipoDiagnostico.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-600 font-medium">Equipos diagnósticos:</p>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {servicio.equipoDiagnostico.map((eq) => (
                    <li key={eq}>{eq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta de Contacto */}
        {servicio.contactoEmergencia && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Bed className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Contacto de Emergencia</h2>
            </div>
            <p className="text-gray-600">{servicio.contactoEmergencia}</p>
          </div>
        )}
      </div>
    </div>
  );
}