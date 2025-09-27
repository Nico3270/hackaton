
import { getHealthReport } from '@/reporteGeneral/actions/getHealthReport';
import ShowUsuariosInformacion from '@/reporteGeneral/componentes/ShowUsuariosInformacion';

export default async function ReporteUsuariosPage() {
  const report = await getHealthReport({
    departamentos: ['Boyacá', 'Cundinamarca'],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ShowUsuariosInformacion report={report} />
    </div>
  );
}