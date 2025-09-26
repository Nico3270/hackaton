import Link from "next/link";

export default function ServiciosSaludPage() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-6">
        Página de usuarios que ofrecen servicios de salud
      </h1>

      <Link href={"/dashboardService/crearRegistro"} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
        Crear registro de demanda diaria
      </Link>
    </div>
  );
}
