"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Definimos el esquema de validación
const schema = z.object({
  servicioId: z.string().uuid(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha debe ser en formato YYYY-MM-DD"),
  atenciones: z.number().int().min(0),
  demandaEstimada: z.number().optional(),
  factorEstacional: z.enum([
    "Normal",
    "Lluvias",
    "Sequia",
    "Epidemia",
    "Festividades",
    "InviernoFrio",
    "CalorExtremo",
    "EventosAgricolas",
    "EmergenciasNaturales",
  ]),
  tiposDemanda: z.array(z.string()).min(1),
  notas: z.string().optional(),
});

// Tipo derivado del esquema para los datos de entrada
type RegistroDemandaInput = z.infer<typeof schema>;

// Función para crear un registro de demanda
export const createRegistroDemanda = async (data: RegistroDemandaInput) => {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ServicioSalud") {
      return { ok: false, message: "No autorizado" };
    }

    const validated = schema.parse(data);

    // Convertir fecha string (YYYY-MM-DD) a DateTime (inicio del día en UTC)
    const fechaDate = new Date(`${validated.fecha}T00:00:00.000Z`);

    await prisma.registroDemanda.create({
      data: {
        servicioId: validated.servicioId,
        fecha: fechaDate,
        atenciones: validated.atenciones,
        demandaEstimada: validated.demandaEstimada,
        factorEstacional: validated.factorEstacional,
        tiposDemanda: validated.tiposDemanda,
        notas: validated.notas,
      },
    });

    return { ok: true, message: "Registro creado exitosamente" };
  } catch (error: unknown) {
    // Manejo de error específico para Prisma (P2002: violación de unicidad)
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return { ok: false, message: "Ya existe un registro para este servicio y fecha" };
    }
    return { ok: false, message: `Error al crear el registro: ${(error instanceof Error ? error.message : "Error desconocido")}` };
  }
};