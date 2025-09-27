// prisma/seed.ts
import { PrismaClient, MotivoVisita, Disponibilidad, ValoracionSatisfaccion, FrecuenciaSintomas, AspectoMejorar } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de ReporteComunidad...');

  // Obtener todos los servicios de salud existentes
  const servicios = await prisma.servicioSalud.findMany({
    select: { id: true, departamento: true, ciudad: true },
  });

  if (servicios.length === 0) {
    console.log('No hay servicios de salud en la DB. Seed abortado.');
    return;
  }

  // Enums y datos base para variaciones realistas
  const motivos = Object.values(MotivoVisita);
  const disponibilidades = Object.values(Disponibilidad);
  const valoraciones = Object.values(ValoracionSatisfaccion);
  const frecuencias = Object.values(FrecuenciaSintomas);
  const aspectos = Object.values(AspectoMejorar);

  // Síntomas comunes realistas
  const sintomasComunes = [
    'Fiebre', 'Tos', 'Dolor de cabeza', 'Fatiga', 'Dolor abdominal', 'Náuseas', 'Diarrea', 'Dolor muscular', 'Congestión nasal', 'Dolor de garganta'
  ];

  // Plantillas de descripciones por motivo, con variaciones
  const plantillasDescripcion = {
    ReportarSintomas: [
      'He estado experimentando síntomas como {sintomas} en los últimos días.',
      'En mi zona, varios vecinos reportan {sintomas} frecuentemente.',
      'Sufro de {sintomas} y necesito orientación médica.',
    ],
    ReportarEnfermedad: [
      'Reporto un caso de {sintomas} que parece una enfermedad común en la temporada.',
      'He sido diagnosticado con {sintomas}, y creo que hay un brote.',
      'Enfermedad reportada: {sintomas}, afecta a mi familia.',
    ],
    CitaControl: [
      'Solicito una cita de control para seguimiento de mi condición.',
      'Necesito programar una revisión médica rutinaria.',
      'Cita de control para chequeo general de salud.',
    ],
    SolicitudCita: [
      'Quiero solicitar una cita para consulta general.',
      'Necesito una cita urgente por {sintomas}.',
      'Solicitud de cita para examen preventivo.',
    ],
    EvaluacionServicio: [
      'Evaluación del servicio: {calidad}, tiempo de espera fue {tiempo}.',
      'El servicio fue {calidad}, recomiendo mejoras en {aspectos}.',
      'Opinión general: {calidad}, aspectos a mejorar: {aspectos}.',
    ],
    ReclamarMedicamentos: [
      'Reclamo por falta de medicamentos para {sintomas}.',
      'No hay disponibilidad de medicinas básicas.',
      'Solicito reclamo por medicamentos no entregados.',
    ],
  } as Record<MotivoVisita, string[]>;

  // Función para generar un reporte variado pero coherente
  const generarReporte = (servicioId: string, departamento: string, ciudad: string) => {
    const motivo: MotivoVisita = faker.helpers.arrayElement(motivos);
    // Corrección: Verificación explícita para evitar error de tipado
    const esSintomaRelacionado = motivo === MotivoVisita.ReportarSintomas || motivo === MotivoVisita.ReportarEnfermedad;

    // Variar calificaciones: 30% altas (4-5), 40% medias (3), 30% bajas (1-2)
    const rating = faker.helpers.weightedArrayElement([
      { value: 1, weight: 1 },
      { value: 2, weight: 1 },
      { value: 3, weight: 2 },
      { value: 4, weight: 1.5 },
      { value: 5, weight: 1.5 },
    ]);

    const calidad = faker.helpers.arrayElement(valoraciones);
    const recomendar = faker.datatype.boolean({ probability: rating >= 3 ? 0.8 : 0.2 });
    const tiempoEspera = faker.number.int({ min: 5, max: 120 }); // Minutos
    const aspectosMejorar = faker.helpers.arrayElements(aspectos, { min: 0, max: 3 });

    // Síntomas solo si aplica
    const sintomas = esSintomaRelacionado ? faker.helpers.arrayElements(sintomasComunes, { min: 1, max: 3 }) : [];
    const frecuencia = esSintomaRelacionado ? faker.helpers.arrayElement(frecuencias) : null;
    const duracion = esSintomaRelacionado ? faker.number.int({ min: 1, max: 30 }) : null;

    // Descripción basada en plantilla con placeholders
    let descripcionTemplate = faker.helpers.arrayElement(plantillasDescripcion[motivo]);
    descripcionTemplate = descripcionTemplate.replace('{sintomas}', sintomas.join(', '));
    descripcionTemplate = descripcionTemplate.replace('{calidad}', calidad);
    descripcionTemplate = descripcionTemplate.replace('{tiempo}', `${tiempoEspera} minutos`);
    descripcionTemplate = descripcionTemplate.replace('{aspectos}', aspectosMejorar.join(', '));

    // Variaciones leves en descripción para no ser idénticas
    const descripcion = faker.helpers.maybe(() => descripcionTemplate + ' ' + faker.lorem.sentence(3), { probability: 0.5 }) || descripcionTemplate;

    return {
      motivoVisita: motivo,
      ciudad,
      departamento,
      descripcion,
      disponibilidad: faker.helpers.arrayElement(disponibilidades),
      email: faker.internet.email(),
      fecha: faker.date.past({ years: 1 }),
      aprobado: faker.datatype.boolean({ probability: 0.7 }),
      servicioId,
      ratingSatisfaccion: rating,
      recomendarServicio: recomendar,
      calidadAtencion: calidad,
      tiempoEspera,
      aspectosMejorar,
      sintomas,
      frecuenciaSintomas: frecuencia,
      duracionSintomasDias: duracion,
    };
  };

  // Generar 50 por servicio
  for (const servicio of servicios) {
    console.log(`Generando 50 reportes para servicio ${servicio.id}...`);
    for (let i = 0; i < 50; i++) {
      const reporteData = generarReporte(servicio.id, servicio.departamento, servicio.ciudad);
      await prisma.reporteComunidad.create({ data: reporteData });
    }
  }

  console.log('Seed completado: Reportes de comunidad poblados con variaciones realistas y distribuciones equilibradas en calificaciones.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });