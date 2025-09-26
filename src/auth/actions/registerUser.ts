"use server";

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async ({
  nombre,
  apellido,
  departamento,
  ciudad,
  email,
  password,
  fechaNacimiento,
}: {
  nombre: string;
  apellido: string;
  departamento: string;
  ciudad: string;
  email: string;
  password: string;
  fechaNacimiento: string; // formato esperado: YYYY-MM-DD
}) => {
  try {
    // Parsing seguro de la fecha
    let parsedDate: Date;
    if (fechaNacimiento) {
      const [year, month, day] = fechaNacimiento.split("-").map(Number);
      parsedDate = new Date(Date.UTC(year, month - 1, day)); // 👈 evita problemas de zona horaria
    } else {
      parsedDate = new Date("1990-01-01T00:00:00Z");
    }

    const user = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        departamento,
        ciudad,
        fechaNacimiento: parsedDate,
        email: email.toLowerCase(),
        contraseña: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        nombre: true,
        email: true,
      },
    });

    return {
      ok: true,
      user,
      message: "Usuario creado",
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "No se pudo registrar el usuario",
    };
  }
};
