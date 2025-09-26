'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Esquema Zod alineado con Prisma
const schema = z.object({
  tipo: z.enum(['PuestoSalud', 'Hospital', 'CampanaMovil'], { message: 'Tipo de servicio requerido' }),
  nombre: z.string().min(1, 'Nombre requerido'),
  nit: z.string().regex(/^\d{10}$/, 'NIT debe tener 10 dígitos'),
  disponibilidad: z.enum(['Disponible', 'Parcial', 'NoDisponible', 'EnMantenimiento'], { message: 'Disponibilidad requerida' }),
  codigoPrestador: z.string().min(1, 'Código prestador requerido'),
  direccion: z.string().min(1, 'Dirección requerida'),
  departamento: z.enum(['Cundinamarca', 'Boyacá'], { message: 'Departamento requerido' }),
  ciudad: z.string().min(1, 'Ciudad requerida'),
  caracter: z.enum(['Municipal', 'Departamental', 'Nacional'], { message: 'Carácter requerido' }),
  descripcion: z.string().optional(),
  estadoEmergencia: z.enum(['Normal', 'Emergencia']).optional(),
  prioridad: z.enum(['Baja', 'Media', 'Alta']).optional(),
  capacidadDiaria: z.number().int().min(0).optional(),
  especialidades: z.array(z.string()).optional(),
  personalMedico: z.number().int().min(0).optional(),
  nivelComplejidad: z.enum(['Baja', 'Media', 'Alta']).optional(),
  camasDisponibles: z.number().int().min(0).optional(),
  camasTotales: z.number().int().min(0).optional(),
  serviciosEspecializados: z.array(z.string()).optional(),
  equipoDiagnostico: z.array(z.string()).optional(),
  contactoEmergencia: z.string().optional(),
  fechaInicio: z.coerce.date().optional(),
  fechaFin: z.coerce.date().optional(),
  ruta: z.string().optional(),
  serviciosOfrecidos: z.array(z.string()).optional(),
  capacidadEstimada: z.number().int().min(0).optional(),
}).superRefine((data, ctx) => {
  if (data.tipo === 'PuestoSalud' && data.capacidadDiaria === undefined) {
    ctx.addIssue({ code: 'custom', path: ['capacidadDiaria'], message: 'Capacidad diaria requerida para Puesto de Salud' });
  }
  if (data.tipo === 'Hospital' && data.nivelComplejidad === undefined) {
    ctx.addIssue({ code: 'custom', path: ['nivelComplejidad'], message: 'Nivel de complejidad requerido para Hospital' });
  }
  if (data.tipo === 'CampanaMovil' && (!data.fechaInicio || !data.fechaFin)) {
    ctx.addIssue({ code: 'custom', path: ['fechaInicio'], message: 'Fechas requeridas para Campaña Móvil' });
  }
});



export async function createAdminService(data: unknown) {
  const session = await auth();
  if (!session || session.user.role !== 'Administrador') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    const validatedData = schema.parse(data);

    const cleanedData: Prisma.ServicioSaludCreateInput = {
      ...validatedData,
      especialidades: validatedData.especialidades ?? [],
      serviciosEspecializados: validatedData.serviciosEspecializados ?? [],
      equipoDiagnostico: validatedData.equipoDiagnostico ?? [],
      serviciosOfrecidos: validatedData.serviciosOfrecidos ?? [],
    };

    await prisma.servicioSalud.create({ data: cleanedData });
    revalidatePath('/dashboardAdmin');

    return { ok: true, message: 'Servicio creado exitosamente' };
  } catch (error) {
    console.error('Error en createAdminService:', error);

    if (error instanceof z.ZodError) {
      return { ok: false, message: `Error de validación: ${error.errors[0].message}` };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { ok: false, message: 'NIT o código prestador ya existe' };
    }

    return { ok: false, message: 'Error al crear servicio: ' + (error instanceof Error ? error.message : 'Error desconocido') };
  }
}
