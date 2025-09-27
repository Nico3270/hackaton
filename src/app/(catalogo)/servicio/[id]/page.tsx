import { getServicioDashboard } from "@/servicios/actions/servicios";
import { InformacionGeneral } from "@/servicios/componentes/InformacionGeneral";
import { RegistroDemanda } from "@/servicios/componentes/RegistroDemanda";
import { ReporteComunidad } from "@/servicios/componentes/ReporteComunidad";

interface Props {
  params : Promise<{
    id: string
  }>
}

export default async function ServicioPage({ params }:Props ) {
  const {id} = await params
  const data = await getServicioDashboard(id);
  return (
    <div className="space-y-2">
      <InformacionGeneral servicio={data.servicio} />
      <ReporteComunidad reportes={data.reportes} />
      <RegistroDemanda demandas={data.demandas} />
    </div>
  );
}