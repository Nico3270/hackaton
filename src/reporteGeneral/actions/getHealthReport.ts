// actions/getHealthReport.ts
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquema de validación para los parámetros de entrada
const HealthReportSchema = z.object({
  departamentos: z.array(z.enum(['Boyacá', 'Cundinamarca'])).default(['Boyacá', 'Cundinamarca']),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
});

// Tipos derivados del schema
type HealthReportInput = z.infer<typeof HealthReportSchema>;

interface HealthReport {
  satisfaccionGeneral: Record<string, { promedio: number; distribucion: Record<string, string> }>;
  calidadAtencion: Record<string, Record<string, Record<string, string>>>;
  tiempoEsperaPromedio: Record<string, number>;
  aspectosMejorar: Record<string, Record<string, string>>;
  disponibilidad: Record<string, Record<string, string>>;
  sintomasFrecuentes: Record<string, Record<string, string>>;
  tendenciasEstacionales: Record<string, Array<{ mes: string; count: number }>>;
  recomendacion: Record<string, { porcentaje: string }>;
  motivosVisita: Record<string, Record<string, string>>;
}

// Server Action
export async function getHealthReport(input: HealthReportInput): Promise<HealthReport> {
  try {
    // Validar parámetros de entrada
    const { departamentos, fechaInicio, fechaFin } = HealthReportSchema.parse(input);

    // Filtros base para las consultas
    const where = {
      departamento: { in: departamentos },
      ...(fechaInicio && fechaFin ? { fecha: { gte: new Date(fechaInicio), lte: new Date(fechaFin) } } : {}),
    };

    // 1. Satisfacción general: promedio y distribución
    const satisfaccionData = await prisma.reporteComunidad.groupBy({
      by: ['departamento', 'ratingSatisfaccion'],
      where,
      _count: { _all: true },
      _avg: { ratingSatisfaccion: true },
    });

    const satisfaccionGeneral = departamentos.reduce((acc, dep) => {
      const depData = satisfaccionData.filter((d) => d.departamento === dep);
      const total = depData.reduce((sum, d) => sum + d._count._all, 0);
      const promedio = depData.length > 0 ? depData.reduce((sum, d) => sum + (d._avg.ratingSatisfaccion ?? 0), 0) / depData.length : 0;
      acc[dep] = {
        promedio,
        distribucion: depData.reduce((dist, d) => {
          const ratingKey = (d.ratingSatisfaccion ?? 0).toString();
          dist[ratingKey] = ((d._count._all / total) * 100).toFixed(2);
          return dist;
        }, {} as Record<string, string>),
      };
      return acc;
    }, {} as Record<string, { promedio: number; distribucion: Record<string, string> }>);

    // 2. Calidad de atención por tipo de servicio
    const calidadData = await prisma.reporteComunidad.groupBy({
      by: ['departamento', 'calidadAtencion', 'servicioId'],
      where,
      _count: { _all: true },
    });

    const calidadAtencion: Record<string, Record<string, Record<string, string>>> = {};
    for (const dep of departamentos) {
      calidadAtencion[dep] = {};
      const depData = calidadData.filter((d) => d.departamento === dep);
      const servicioIds = depData.map((d) => d.servicioId).filter((id): id is string => !!id);
      const servicios = await prisma.servicioSalud.findMany({
        where: { id: { in: servicioIds } },
        select: { id: true, tipo: true },
      });

      for (const servicio of servicios) {
        const servicioData = depData.filter((d) => d.servicioId === servicio.id);
        const total = servicioData.reduce((sum, d) => sum + d._count._all, 0);
        calidadAtencion[dep][servicio.tipo] = servicioData.reduce((dist, d) => {
          if (d.calidadAtencion) {
            dist[d.calidadAtencion] = ((d._count._all / total) * 100).toFixed(2);
          }
          return dist;
        }, {} as Record<string, string>);
      }
    }

    // 3. Tiempo de espera promedio
    const tiempoEsperaData = await prisma.reporteComunidad.groupBy({
      by: ['departamento'],
      where,
      _avg: { tiempoEspera: true },
    });

    const tiempoEsperaPromedio = tiempoEsperaData.reduce((acc, d) => {
      if (d.departamento) {
        acc[d.departamento] = d._avg.tiempoEspera ?? 0;
      }
      return acc;
    }, {} as Record<string, number>);

    // 4. Aspectos a mejorar
    const aspectosData = await prisma.reporteComunidad.findMany({
      where,
      select: { departamento: true, aspectosMejorar: true },
    });

    const aspectosMejorar = departamentos.reduce((acc, dep) => {
      acc[dep] = {};
      const depData = aspectosData.filter((d) => d.departamento === dep);
      const total = depData.length;
      const aspectosCount = depData.flatMap((d) => d.aspectosMejorar).reduce((count, aspecto) => {
        count[aspecto] = (count[aspecto] || 0) + 1;
        return count;
      }, {} as Record<string, number>);
      Object.keys(aspectosCount).forEach((aspecto) => {
        acc[dep][aspecto] = ((aspectosCount[aspecto] / total) * 100).toFixed(2);
      });
      return acc;
    }, {} as Record<string, Record<string, string>>);

    // 5. Disponibilidad de servicios
    const disponibilidadData = await prisma.reporteComunidad.groupBy({
      by: ['departamento', 'disponibilidad'],
      where,
      _count: { _all: true },
    });

    const disponibilidad = departamentos.reduce((acc, dep) => {
      const depData = disponibilidadData.filter((d) => d.departamento === dep);
      const total = depData.reduce((sum, d) => sum + d._count._all, 0);
      acc[dep] = depData.reduce((dist, d) => {
        if (d.disponibilidad) {
          dist[d.disponibilidad] = ((d._count._all / total) * 100).toFixed(2);
        }
        return dist;
      }, {} as Record<string, string>);
      return acc;
    }, {} as Record<string, Record<string, string>>);

    // 6. Síntomas frecuentes
    const sintomasData = await prisma.reporteComunidad.findMany({
      where: { ...where, motivoVisita: { in: ['ReportarSintomas', 'ReportarEnfermedad'] } },
      select: { departamento: true, sintomas: true },
    });

    const sintomasFrecuentes = departamentos.reduce((acc, dep) => {
      acc[dep] = {};
      const depData = sintomasData.filter((d) => d.departamento === dep);
      const total = depData.length;
      const sintomasCount = depData.flatMap((d) => d.sintomas).reduce((count, sintoma) => {
        count[sintoma] = (count[sintoma] || 0) + 1;
        return count;
      }, {} as Record<string, number>);
      Object.keys(sintomasCount).forEach((sintoma) => {
        acc[dep][sintoma] = ((sintomasCount[sintoma] / total) * 100).toFixed(2);
      });
      return acc;
    }, {} as Record<string, Record<string, string>>);

    // 7. Tendencias estacionales
    const tendenciasData = await prisma.reporteComunidad.groupBy({
      by: ['departamento', 'fecha'],
      where,
      _count: { _all: true },
    });

    const tendenciasEstacionales = departamentos.reduce((acc, dep) => {
      const depData = tendenciasData.filter((d) => d.departamento === dep);
      const meses = Array.from({ length: 12 }, (_, i) => ({
        mes: new Date(0, i).toLocaleString('es', { month: 'long' }),
        count: 0,
      }));
      depData.forEach((d) => {
        const mes = d.fecha.getMonth();
        meses[mes].count += d._count._all;
      });
      acc[dep] = meses;
      return acc;
    }, {} as Record<string, Array<{ mes: string; count: number }>>);

    // 8. Recomendación (NPS-like)
    const recomendacionData = await prisma.reporteComunidad.groupBy({
      by: ['departamento', 'recomendarServicio'],
      where,
      _count: { _all: true },
    });

    const recomendacion = departamentos.reduce((acc, dep) => {
      const depData = recomendacionData.filter((d) => d.departamento === dep);
      const total = depData.reduce((sum, d) => sum + d._count._all, 0);
      const promotores = depData.find((d) => d.recomendarServicio === true)?._count._all || 0;
      acc[dep] = { porcentaje: ((promotores / total) * 100).toFixed(2) };
      return acc;
    }, {} as Record<string, { porcentaje: string }>);

    // 9. Motivos de visita
    const motivosData = await prisma.reporteComunidad.groupBy({
      by: ['departamento', 'motivoVisita'],
      where,
      _count: { _all: true },
    });

    const motivosVisita = departamentos.reduce((acc, dep) => {
      const depData = motivosData.filter((d) => d.departamento === dep);
      const total = depData.reduce((sum, d) => sum + d._count._all, 0);
      acc[dep] = depData.reduce((dist, d) => {
        if (d.motivoVisita) {
          dist[d.motivoVisita] = ((d._count._all / total) * 100).toFixed(2);
        }
        return dist;
      }, {} as Record<string, string>);
      return acc;
    }, {} as Record<string, Record<string, string>>);

    return {
      satisfaccionGeneral,
      calidadAtencion,
      tiempoEsperaPromedio,
      aspectosMejorar,
      disponibilidad,
      sintomasFrecuentes,
      tendenciasEstacionales,
      recomendacion,
      motivosVisita,
    };
  } catch (error) {
    console.error('Error en getHealthReport:', error);
    throw new Error('No se pudo generar el reporte de salud');
  } finally {
    await prisma.$disconnect();
  }
}