"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import { Prisma, MotivoVisita, AspectoMejorar, ValoracionSatisfaccion, FrecuenciaSintomas } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface CrearReporteData {
  servicioId: string;
  motivoVisita: MotivoVisita;
  ratingSatisfaccion?: number;
  recomendarServicio?: boolean;
  calidadAtencion?: ValoracionSatisfaccion;
  tiempoEspera?: number;
  aspectosMejorar: AspectoMejorar[];
  sintomas: string[];
  frecuenciaSintomas?: FrecuenciaSintomas;
  duracionSintomasDias?: number;
  descripcion?: string;
  email?: string;
}

interface CrearReporteResult {
  ok: boolean;
  message: string;
  reporte?: Prisma.ReporteComunidadGetPayload<{}>;
}

export const crearReporteComunidad = async (data: CrearReporteData, usuarioIdProp?: string): Promise<CrearReporteResult> => {
  const session = await auth();
  const usuarioId = usuarioIdProp || session?.user?.id || undefined;

  // Validaciones iniciales
  if (!data.servicioId || !data.motivoVisita) {
    return { ok: false, message: "El ID del servicio y el motivo de visita son requeridos." };
  }
  if (data.ratingSatisfaccion && (data.ratingSatisfaccion < 1 || data.ratingSatisfaccion > 5)) {
    return { ok: false, message: "El rating de satisfacción debe estar entre 1 y 5." };
  }
  if ((data.motivoVisita === "ReportarSintomas" || data.motivoVisita === "ReportarEnfermedad") && data.sintomas.length === 0) {
    return { ok: false, message: "Debes seleccionar al menos un síntoma para este motivo de visita." };
  }

  try {
    // Obtener ciudad y departamento del servicio
    const servicio = await prisma.servicioSalud.findUnique({
      where: { id: data.servicioId },
      select: { id: true, ciudad: true, departamento: true },
    });

    if (!servicio) {
      return { ok: false, message: "Servicio no encontrado." };
    }

    // Crear el reporte con los datos proporcionados y complementarios
    const reporte = await prisma.reporteComunidad.create({
      data: {
        motivoVisita: data.motivoVisita,
        ciudad: servicio.ciudad,
        departamento: servicio.departamento || undefined, // Opcional
        descripcion: data.descripcion,
        email: data.email,
        aprobado: false,
        servicioId: data.servicioId,
        ratingSatisfaccion: data.ratingSatisfaccion,
        recomendarServicio: data.recomendarServicio,
        calidadAtencion: data.calidadAtencion,
        tiempoEspera: data.tiempoEspera,
        aspectosMejorar: data.aspectosMejorar,
        sintomas: data.sintomas,
        frecuenciaSintomas: data.frecuenciaSintomas,
        duracionSintomasDias: data.duracionSintomasDias,
        usuarioId,
      },
    });

    // Revalidar la caché de la página relacionada para mantener la interfaz actualizada
    revalidatePath(`/calificarServicio/${data.servicioId}`);

    return { ok: true, message: "Reporte creado exitosamente.", reporte };
  } catch (error) {
    console.error("Error al crear el reporte:", error);
    return { ok: false, message: `Error al procesar el reporte: ${error instanceof Error ? error.message : "Error desconocido."}` };
  }
};