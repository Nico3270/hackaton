import { getServicioDashboard } from "@/servicios/actions/servicios";
import { InformacionGeneral } from "@/servicios/componentes/InformacionGeneral";
import { RegistroDemanda } from "@/servicios/componentes/RegistroDemanda";
import { ReporteComunidad } from "@/servicios/componentes/ReporteComunidad";


export default async function ServicioPage({ params }: { params: { id: string } }) {
  const data = await getServicioDashboard(params.id);
  return (
    <div className="space-y-8">
      <InformacionGeneral servicio={data.servicio} />
      <ReporteComunidad reportes={data.reportes} />
      <RegistroDemanda demandas={data.demandas} />
    </div>
  );
}