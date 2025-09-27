"use server";

import { z } from "zod";
import { Prisma, AspectoMejorar, ValoracionSatisfaccion } from "@prisma/client";
import prisma from "@/lib/prisma";

// Schema de validación para params
const GetServicioSchema = z.object({
  id: z.string().uuid({ message: "ID inválido" }),
});

// Tipos precisos para selects en includes
type ReporteComunidadSelect = Prisma.ReporteComunidadGetPayload<{
  select: {
    id: true;
    motivoVisita: true;
    ratingSatisfaccion: true;
    aspectosMejorar: true;
    sintomas: true;
    fecha: true;
    ciudad: true;
    calidadAtencion: true;
    recomendarServicio: true;
    tiempoEspera: true;
  };
}>;

type RegistroDemandaSelect = Prisma.RegistroDemandaGetPayload<{
  select: {
    id: true;
    fecha: true;
    atenciones: true;
    demandaEstimada: true;
    factorEstacional: true;
    tiposDemanda: true;
  };
}>;

// Interface para la respuesta del dashboard
export interface ServicioDashboardData {
  servicio: Prisma.ServicioSaludGetPayload<{
    include: {
      reportesComunidad: {
        select: {
          id: true;
          motivoVisita: true;
          ratingSatisfaccion: true;
          aspectosMejorar: true;
          sintomas: true;
          fecha: true;
          ciudad: true;
          calidadAtencion: true;
          recomendarServicio: true;
          tiempoEspera: true;
        };
      };
      registrosDemanda: {
        select: {
          id: true;
          fecha: true;
          atenciones: true;
          demandaEstimada: true;
          factorEstacional: true;
          tiposDemanda: true;
        };
      };
    };
  }>;
  reportes: {
    count: number;
    avgRating: number | null;
    avgTiempoEspera: number | null; // Promedio de tiempo de espera
    porcentajeRecomendacion: number | null; // % que recomienda el servicio
    calidadAtencionDist: Record<ValoracionSatisfaccion, number>; // Distribución de calidad
    topAspectos: AspectoMejorar[];
    data: ReporteComunidadSelect[];
  };
  demandas: {
    count: number;
    avgAtenciones: number | null;
    data: RegistroDemandaSelect[];
  };
}

export async function getServicioDashboard(id: string): Promise<ServicioDashboardData> {
  const validated = GetServicioSchema.safeParse({ id });
  if (!validated.success) {
    throw new Error("ID inválido");
  }

  try {
    const servicio = await prisma.servicioSalud.findUnique({
      where: { id },
      include: {
        reportesComunidad: {
          orderBy: { fecha: "desc" },
          take: 50,
          select: {
            id: true,
            motivoVisita: true,
            ratingSatisfaccion: true,
            aspectosMejorar: true,
            sintomas: true,
            fecha: true,
            ciudad: true,
            calidadAtencion: true,
            recomendarServicio: true,
            tiempoEspera: true,
          },
        },
        registrosDemanda: {
          orderBy: { fecha: "desc" },
          take: 365,
          select: {
            id: true,
            fecha: true,
            atenciones: true,
            demandaEstimada: true,
            factorEstacional: true,
            tiposDemanda: true,
          },
        },
      },
    });

    if (!servicio) {
      throw new Error("Servicio no encontrado");
    }

    const reportesCount = servicio.reportesComunidad.length;

    // Promedio de ratingSatisfaccion
    const avgRating =
      reportesCount > 0
        ? servicio.reportesComunidad.reduce(
            (sum, r) => sum + (r.ratingSatisfaccion || 0),
            0,
          ) / reportesCount
        : null;

    // Promedio de tiempoEspera
    const tiemposValidos = servicio.reportesComunidad.filter((r) => r.tiempoEspera != null);
    const avgTiempoEspera =
      tiemposValidos.length > 0
        ? tiemposValidos.reduce((sum, r) => sum + (r.tiempoEspera || 0), 0) / tiemposValidos.length
        : null;

    // Porcentaje de recomendación
    const recomendacionesValidas = servicio.reportesComunidad.filter((r) => r.recomendarServicio != null);
    const porcentajeRecomendacion =
      recomendacionesValidas.length > 0
        ? (recomendacionesValidas.filter((r) => r.recomendarServicio).length / recomendacionesValidas.length) * 100
        : null;

    // Distribución de calidadAtencion
    const calidadAtencionDist: Record<ValoracionSatisfaccion, number> = {
      MuyInsatisfecho: 0,
      Insatisfecho: 0,
      Neutral: 0,
      Satisfecho: 0,
      MuySatisfecho: 0,
    };
    servicio.reportesComunidad.forEach((r) => {
      if (r.calidadAtencion) {
        calidadAtencionDist[r.calidadAtencion]++;
      }
    });

    // Top 3 aspectos a mejorar
    const aspectosMap = new Map<AspectoMejorar, number>();
    servicio.reportesComunidad.forEach((r) => {
      r.aspectosMejorar.forEach((a) => {
        aspectosMap.set(a, (aspectosMap.get(a) || 0) + 1);
      });
    });
    const topAspectos = Array.from(aspectosMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) => key);

    const demandasCount = servicio.registrosDemanda.length;
    const avgAtenciones =
      demandasCount > 0
        ? servicio.registrosDemanda.reduce((sum, d) => sum + d.atenciones, 0) / demandasCount
        : null;

    return {
      servicio,
      reportes: {
        count: reportesCount,
        avgRating,
        avgTiempoEspera,
        porcentajeRecomendacion,
        calidadAtencionDist,
        topAspectos,
        data: servicio.reportesComunidad,
      },
      demandas: {
        count: demandasCount,
        avgAtenciones,
        data: servicio.registrosDemanda,
      },
    };
  } catch (error) {
    console.error("Error en getServicioDashboard:", error);
    throw new Error("Error al obtener datos del servicio");
  }
}