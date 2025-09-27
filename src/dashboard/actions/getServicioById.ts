"use server";

import prisma from "@/lib/prisma";

export const getServicioById = async (id: string) => {
  try {
    const servicio = await prisma.servicioSalud.findUnique({
      where: { id },
      select: { id: true, nombre: true, ciudad: true, departamento: true },
    });
    return servicio ? { ok: true, servicio } : { ok: false, message: "Servicio no encontrado" };
  } catch (error) {
    return { ok: false, message: "Error al obtener el servicio" };
  }
};