'use server';

import prisma from '@/lib/prisma';

export async function getServicios() {
  try {
    const servicios = await prisma.servicioSalud.findMany({
      select: { id: true, nombre: true, departamento: true },
      orderBy: { nombre: 'asc' },
    });
    return servicios;
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return [];
  }
}