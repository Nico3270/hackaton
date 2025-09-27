// app/prediccionDemanda/page.tsx

import { getDemandaPrediction } from '@/reporteGeneral/actions/getDemandaPrediction';
import ShowDemandaPrediction from '@/reporteGeneral/componentes/ShowDemandaPrediction';

export default async function PrediccionDemandaPage() {
  const prediction = await getDemandaPrediction({
    departamentos: ['Boyacá', 'Cundinamarca'],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ShowDemandaPrediction prediction={prediction} />
    </div>
  );
}