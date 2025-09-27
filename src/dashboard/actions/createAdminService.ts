'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Interfaz para los datos recibidos del formulario
interface ServicioFormData {
  tipo: 'PuestoSalud' | 'Hospital' | 'CampanaMovil';
  nombre: string;
  nit: string;
  disponibilidad: 'Disponible' | 'Parcial' | 'NoDisponible' | 'EnMantenimiento';
  codigoPrestador: string;
  direccion: string;
  departamento: 'Cundinamarca' | 'Boyacá';
  ciudad: string;
  caracter: 'Municipal' | 'Departamental' | 'Nacional';
  descripcion?: string;
  estadoEmergencia?: 'Normal' | 'Emergencia';
  prioridad?: 'Baja' | 'Media' | 'Alta';
  capacidadDiaria?: number;
  especialidades?: string[];
  personalMedico?: number;
  nivelComplejidad?: 'Baja' | 'Media' | 'Alta';
  camasDisponibles?: number;
  camasTotales?: number;
  capacidadEstimada?: number;
  serviciosEspecializados?: string[];
  equipoDiagnostico?: string[];
  contactoEmergencia?: string;
  serviciosOfrecidos?: string[];
  ruta?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export async function createAdminService(data: unknown) {
  const session = await auth();
  if (!session || session.user.role !== 'Administrador') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    // Tipamos los datos con la interfaz
    const validatedData = data as ServicioFormData;

    const cleanedData: Prisma.ServicioSaludCreateInput = {
      tipo: validatedData.tipo,
      nombre: validatedData.nombre,
      nit: validatedData.nit,
      disponibilidad: validatedData.disponibilidad,
      codigoPrestador: validatedData.codigoPrestador,
      direccion: validatedData.direccion,
      departamento: validatedData.departamento,
      ciudad: validatedData.ciudad,
      caracter: validatedData.caracter,
      descripcion: validatedData.descripcion,
      estadoEmergencia: validatedData.estadoEmergencia,
      prioridad: validatedData.prioridad,
      capacidadDiaria: validatedData.capacidadDiaria,
      especialidades: validatedData.especialidades || [],
      personalMedico: validatedData.personalMedico,
      nivelComplejidad: validatedData.nivelComplejidad,
      camasDisponibles: validatedData.camasDisponibles,
      camasTotales: validatedData.camasTotales,
      capacidadEstimada: validatedData.capacidadEstimada,
      serviciosEspecializados: validatedData.serviciosEspecializados || [],
      equipoDiagnostico: validatedData.equipoDiagnostico || [],
      contactoEmergencia: validatedData.contactoEmergencia,
      serviciosOfrecidos: validatedData.serviciosOfrecidos || [],
      ruta: validatedData.ruta,
      fechaInicio: validatedData.fechaInicio ? new Date(validatedData.fechaInicio) : undefined,
      fechaFin: validatedData.fechaFin ? new Date(validatedData.fechaFin) : undefined,
    };

    await prisma.servicioSalud.create({ data: cleanedData });
    revalidatePath('/dashboardAdmin');

    return { ok: true, message: 'Servicio creado exitosamente' };
  } catch (error: unknown) {
    console.error('Error en createAdminService:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { ok: false, message: 'NIT o código prestador ya existe' };
    }

    return {
      ok: false,
      message: 'Error al crear servicio: ' + (error instanceof Error ? error.message : 'Error desconocido'),
    };
  }
}