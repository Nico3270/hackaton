// app/actions/servicios.ts
'use server';

import prisma from "@/lib/prisma";



interface FiltrosResumen {
  departamento?: string;
  ciudad?: string;
}

export async function getResumenServicios(filtros: FiltrosResumen = {}) {
  // Verificar sesión (opcional para admins, pero por ahora lo incluyo para seguridad)
  

  try {
    // Conteo total de servicios
    const totalServicios = await prisma.servicioSalud.count({
      where: {
        departamento: filtros.departamento,
        ciudad: filtros.ciudad,
      },
    });

    // Servicios disponibles
    const disponibles = await prisma.servicioSalud.count({
      where: {
        disponibilidad: 'Disponible',
        departamento: filtros.departamento,
        ciudad: filtros.ciudad,
      },
    });

    // Distribución por departamento (para bar chart)
    const porDepartamento = await prisma.servicioSalud.groupBy({
      by: ['departamento'],
      _count: { id: true },
      where: {
        departamento: filtros.departamento, // Si filtro, solo ese
      },
    });

    // Distribución por tipo (para pie chart)
    const porTipo = await prisma.servicioSalud.groupBy({
      by: ['tipo'],
      _count: { id: true },
      where: {
        departamento: filtros.departamento,
        ciudad: filtros.ciudad,
      },
    });

    // Distribución por nivel de complejidad (para otro pie o bar)
    const porNivel = await prisma.servicioSalud.groupBy({
      by: ['nivelComplejidad'],
      _count: { id: true },
      where: {
        departamento: filtros.departamento,
        ciudad: filtros.ciudad,
      },
    });

    // Top especialidades (conteo simple, para stacked bar)
    const especialidades = await prisma.servicioSalud.findMany({
      select: { especialidades: true },
      where: {
        departamento: filtros.departamento,
        ciudad: filtros.ciudad,
      },
    });
    const topEspecialidades = especialidades.flatMap(s => s.especialidades)
      .reduce((acc: Record<string, number>, esp) => {
        acc[esp] = (acc[esp] || 0) + 1;
        return acc;
      }, {});

    // Datos para predicción básica (promedio capacidad mensual, ficticio por ahora basado en datos existentes)
    const capacidadPromedio = await prisma.servicioSalud.aggregate({
      _avg: { capacidadEstimada: true },
      where: {
        departamento: filtros.departamento,
        ciudad: filtros.ciudad,
      },
    });
    // Distribución por ciudad (para pie chart, top 10)
const porCiudad = await prisma.servicioSalud.groupBy({
  by: ['ciudad'],
  _count: { id: true },
  where: {
    departamento: filtros.departamento,
    ciudad: filtros.ciudad,
  },
  orderBy: { _count: { id: 'desc' } },
  take: 10, // Limita a top 10 para rendimiento
});


    return {
      totalServicios,
      disponibles,
      porDepartamento,
      porTipo,
      porNivel,
      topEspecialidades,
      porCiudad,
      capacidadPromedio: capacidadPromedio._avg.capacidadEstimada || 0,
    };
  } catch (error) {
    console.error('Error en getResumenServicios:', error);
    throw new Error('Error al obtener resumen de servicios');
  }
}