import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Aceptar diferentes nombres de la contraseña en el body por compatibilidad
    const rawPassword = body.contraseña ?? body.contrasena ?? body.password;

    const {
      nombre,
      email,
      apellido,
      departamento,
      ciudad,
      fechaNacimiento, // esperar formato ISO 'YYYY-MM-DD' o similar
    } = body;

    // Validación básica
    if (
      !nombre ||
      !email ||
      !rawPassword ||
      !apellido ||
      !departamento ||
      !ciudad ||
      !fechaNacimiento
    ) {
      return NextResponse.json(
        {
          message:
            "Todos los campos son obligatorios: nombre, apellido, email, contraseña, departamento, ciudad, fechaNacimiento",
        },
        { status: 400 }
      );
    }

    // Validar fecha
    const fecha = new Date(fechaNacimiento);
    if (isNaN(fecha.getTime())) {
      return NextResponse.json({ message: "fechaNacimiento inválida" }, { status: 400 });
    }

    // Verificar usuario existente
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 });
    }

    // Hashear contraseña (async)
    const hashedPassword = await bcryptjs.hash(rawPassword, 10);

    // Crear usuario (no incluimos role para que se use el default desde el schema)
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        contraseña: hashedPassword,
        departamento,
        ciudad,
        fechaNacimiento: fecha,
      },
      // No incluir la contraseña en la respuesta
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        departamento: true,
        ciudad: true,
        fechaNacimiento: true,
      },
    });

    return NextResponse.json({ message: "Usuario creado exitosamente", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { message: "Ocurrió un error al registrar el usuario" },
      { status: 500 }
    );
  }
}
