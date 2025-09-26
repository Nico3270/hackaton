// import { PrismaClient } from "@prisma/client";
// import bcryptjs from "bcryptjs";
// import fs from "fs";
// import path from "path";

// // Cargar datos del JSON (asumiendo que el archivo está en el mismo directorio o ajusta la ruta)
// const jsonPath = path.join(__dirname, "datos_hospitales_seed.json");
// const rawData = fs.readFileSync(jsonPath, "utf-8");
// const initialData: any[] = JSON.parse(rawData);

// const prisma = new PrismaClient();

// async function main() {
//   try {
//     console.log("🌱 Iniciando la carga de datos...");

//     // Limpiar tablas relevantes (ajusta según dependencias)
//     await prisma.registroDemanda.deleteMany();
//     await prisma.registroConsulta.deleteMany();
//     await prisma.reporteComunidad.deleteMany();
//     await prisma.servicioSalud.deleteMany();
//     await prisma.usuario.deleteMany(); // Limpiar usuarios para evitar duplicados

//     console.log("🧹 Tablas limpiadas.");

//     // Insertar Servicios de Salud y Usuarios asociados
//     console.log("Insertando servicios y usuarios...");
//     for (const item of initialData) {
//       // Mapear enums (asumiendo coincidencias directas; ajusta si es necesario)
//       const tipo = item.tipo === "PuestoSalud" ? "PuestoSalud" : "Hospital"; // TipoServicio
//       const caracter = item.caracter; // TipoCaracter: Municipal, Departamental, etc.
//       const disponibilidad = item.disponibilidad; // Disponibilidad: Disponible
//       const estadoEmergencia = item.estadoemergencia; // EstadoEmergencia: Normal
//       const prioridad = item.prioridad; // Prioridad: Alta, Media, Baja
//       const nivelComplejidad = item.nivelcomplejidad === 1 ? "Baja" : "Media"; // NivelComplejidad: ajusta enum (ej. Bajo=1, Medio=2)

//       // Crear ServicioSalud
//       const servicio = await prisma.servicioSalud.create({
//         data: {
//           tipo,
//           nombre: item.nombre,
//           nit: item.nit.toString(), // Convertir a string
//           disponibilidad,
//           codigoPrestador: item.codigoprestador.toString(), // Convertir a string
//           direccion: item.direccion,
//           departamento: item.departamento,
//           ciudad: item.ciudad,
//           caracter,
//           descripcion: item.descripcion,
//           estadoEmergencia,
//           prioridad,
//           capacidadDiaria: null, // No en JSON
//           especialidades: item.especialidades,
//           personalMedico: null, // No en JSON
//           nivelComplejidad,
//           camasDisponibles: null, // No en JSON
//           camasTotales: 0, // Default
//           capacidadEstimada: null, // No en JSON
//           serviciosEspecializados: item.serviciosespecializados,
//           equipoDiagnostico: item.equipodiagnostico,
//           contactoEmergencia: null, // No en JSON
//           serviciosOfrecidos: item.serviciosofrecidos,
//         },
//       });

//       // Crear Usuario asociado
//       const nitStr = item.nit.toString();
//       const email = `${nitStr}@gmail.com`;
//       const passwordHash = bcryptjs.hashSync(nitStr);
//       const fechaNacimiento = new Date("1990-01-01T00:00:00Z");

//       await prisma.usuario.create({
//         data: {
//           nombre: item.nombre,
//           apellido: "Sin apellido",
//           departamento: item.departamento,
//           ciudad: item.ciudad,
//           fechaNacimiento,
//           email: email.toLowerCase(),
//           contraseña: passwordHash,
//           role: "ServicioSalud", // Default
//         },
//       });

//       console.log(`✅ Insertado servicio: ${item.nombre} y usuario asociado.`);
//     }

//     console.log("✅ Datos insertados correctamente.");
//   } catch (error) {
//     console.error("Error durante la inserción de datos:", error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();