import { PrismaClient, FactorEstacional, TipoServicio } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de RegistroDemanda...');

  // Obtener todos los servicios de salud existentes
  const servicios = await prisma.servicioSalud.findMany({
    select: { id: true, tipo: true, capacidadDiaria: true, departamento: true },
  });

  if (servicios.length === 0) {
    console.log('No hay servicios de salud en la DB. Seed abortado.');
    return;
  }

  // Enums y datos base para variaciones realistas
  const factoresEstacionales = Object.values(FactorEstacional);
  const tiposDemanda = [
    'ConsultaGeneral',
    'Vacunacion',
    'Urgencias',
    'ExamenesDiagnosticos',
    'ControlPrenatal',
    'AtencionPediátrica',
    'CirugíaMenor',
  ];

  // Factores de ajuste por tipo de servicio y factor estacional
  const ajustesTipoServicio: Record<TipoServicio, number> = {
    Hospital: 1.5, // Mayor capacidad
    PuestoSalud: 0.8, // Menor capacidad
    CampanaMovil: 0.5, // Capacidad limitada
  };

  const ajustesFactorEstacional: Record<FactorEstacional, number> = {
    Normal: 1.0,
    Lluvias: 1.2,
    Sequia: 0.9,
    Epidemia: 1.5,
    Festividades: 1.1,
    InviernoFrio: 1.3,
    CalorExtremo: 1.0,
    EventosAgricolas: 0.8,
    EmergenciasNaturales: 1.4,
  };

  // Plantillas de notas por factor estacional
  const notasPlantillas: Record<FactorEstacional, string[]> = {
    Normal: ['Atenciones rutinarias sin incidencias.', 'Demanda estándar para el periodo.'],
    Lluvias: ['Aumento de consultas por infecciones respiratorias.', 'Demanda alta debido a temporada de lluvias.'],
    Sequia: ['Menor demanda por condiciones climáticas.', 'Consultas principalmente por deshidratación.'],
    Epidemia: ['Pico de atenciones por brote epidémico.', 'Alta demanda de consultas infecciosas.'],
    Festividades: ['Incremento por eventos masivos.', 'Consultas relacionadas con lesiones menores.'],
    InviernoFrio: ['Aumento de casos gripales.', 'Demanda por infecciones respiratorias.'],
    CalorExtremo: ['Casos de insolación reportados.', 'Demanda moderada por golpes de calor.'],
    EventosAgricolas: ['Menor demanda por actividades agrícolas.', 'Atenciones esporádicas.'],
    EmergenciasNaturales: ['Alta demanda por emergencias.', 'Atenciones por lesiones relacionadas con desastres.'],
  };

  // Función para generar un registro de demanda
  const generarRegistroDemanda = (servicioId: string, tipoServicio: TipoServicio) => {
    const factorEstacional = faker.helpers.arrayElement(factoresEstacionales);
    const baseAtenciones = faker.number.int({ min: 10, max: 100 }); // Base para atenciones
    const ajusteTipo = ajustesTipoServicio[tipoServicio] || 1;
    const ajusteFactor = ajustesFactorEstacional[factorEstacional] || 1;

    // Calcular atenciones ajustadas
    const atenciones = Math.round(baseAtenciones * ajusteTipo * ajusteFactor);

    // Demanda estimada (similar a atenciones, con variación)
    const demandaEstimada = atenciones * faker.number.float({ min: 0.9, max: 1.1, fractionDigits: 2 });

    // Seleccionar tipos de demanda según tipo de servicio
    const tiposDemandaServicio = {
      Hospital: tiposDemanda,
      PuestoSalud: tiposDemanda.filter((t) => t !== 'CirugíaMenor'),
      CampanaMovil: ['Vacunacion', 'ConsultaGeneral', 'AtencionPediátrica'],
    };
    const tipos = faker.helpers.arrayElements(tiposDemandaServicio[tipoServicio], { min: 1, max: 3 });

    // Generar nota basada en plantilla
    const notaTemplate = faker.helpers.arrayElement(notasPlantillas[factorEstacional]);
    const nota = faker.helpers.maybe(() => notaTemplate + ' ' + faker.lorem.sentence(3), { probability: 0.5 }) || notaTemplate;

    return {
      servicioId,
      fecha: faker.date.past({ years: 1 }),
      atenciones,
      demandaEstimada,
      factorEstacional,
      tiposDemanda: tipos,
      notas: nota,
    };
  };

  // Generar 50 registros por servicio
  for (const servicio of servicios) {
    console.log(`Generando 50 registros de demanda para servicio ${servicio.id} (${servicio.tipo})...`);
    for (let i = 0; i < 50; i++) {
      const registroData = generarRegistroDemanda(servicio.id, servicio.tipo);
      await prisma.registroDemanda.create({ data: registroData });
    }
  }

  console.log('Seed completado: Registros de demanda poblados con datos realistas y patrones estacionales.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });