// actions/getDemandaPrediction.ts
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const DemandaPredictionSchema = z.object({
  departamentos: z.array(z.string()).default(['Boyacá', 'Cundinamarca']),
  servicioId: z.string().optional(),
});

type DemandaPredictionInput = z.infer<typeof DemandaPredictionSchema>;

interface DemandaPrediction {
  patronesMensuales: Record<string, { mes: string; promedioAtenciones: number; factorDominante: string }[]>;
  prediccionMensual: Record<string, { mes: string; demandaEstimada: number }[]>;
  picosDemanda: Record<string, { periodo: string; incrementoPorc: number }[]>;
}

export async function getDemandaPrediction(input: DemandaPredictionInput): Promise<DemandaPrediction> {
  try {
    const { departamentos, servicioId } = DemandaPredictionSchema.parse(input);

    const where = {
      servicio: { departamento: { in: departamentos } },
      ...(servicioId ? { servicioId } : {}),
    };

    // Datos históricos de demanda
    const demandaData = await prisma.registroDemanda.findMany({
      where,
      include: { servicio: true },
      orderBy: { fecha: 'asc' },
    });

    // Agregados mensuales
    const patronesMensuales = departamentos.reduce((acc, dep) => {
      const depData = demandaData.filter((d) => d.servicio.departamento === dep);
      const meses = Array.from({ length: 12 }, (_, i) => ({
        mes: new Date(0, i).toLocaleString('es', { month: 'long' }),
        promedioAtenciones: 0,
        factorDominante: 'Normal',
      }));

      depData.forEach((d) => {
        const mes = d.fecha.getMonth();
        meses[mes].promedioAtenciones += d.atenciones / depData.length;
      });

      // Factor dominante por mes (simplificado: más frecuente)
      const factoresPorMes = depData.reduce((map, d) => {
        const mes = d.fecha.getMonth();
        map[mes] = map[mes] || {};
        map[mes][d.factorEstacional] = (map[mes][d.factorEstacional] || 0) + 1;
        return map;
      }, {} as Record<number, Record<string, number>>);

      Object.keys(factoresPorMes).forEach((m) => {
        const mesIdx = parseInt(m);
        const maxFactor = Object.entries(factoresPorMes[mesIdx]).reduce((a, b) => (b[1] > a[1] ? b : a));
        meses[mesIdx].factorDominante = maxFactor[0];
      });

      acc[dep] = meses;
      return acc;
    }, {} as Record<string, { mes: string; promedioAtenciones: number; factorDominante: string }[]>);

    // Predicción simple: Media móvil de últimos 3 meses + ajuste por factor (e.g., +20% en Lluvias)
    const ajustesFactor: Record<string, number> = {
      Normal: 1,
      Lluvias: 1.2,
      Sequia: 1.1,
      Epidemia: 1.5,
      // ... agregar otros factores
    };

    const prediccionMensual = departamentos.reduce((acc, dep) => {
      const depData = demandaData.filter((d) => d.servicio.departamento === dep);
      const predicciones = Array.from({ length: 12 }, (_, i) => {
        const mes = new Date(0, i).toLocaleString('es', { month: 'long' });
        const historico = depData.filter((d) => d.fecha.getMonth() === i);
        const promedio = historico.reduce((sum, d) => sum + (d.demandaEstimada ?? 0), 0) / (historico.length || 1);
        const factor = patronesMensuales[dep][i].factorDominante;
        return { mes, demandaEstimada: promedio * (ajustesFactor[factor] || 1) };
      });
      acc[dep] = predicciones;
      return acc;
    }, {} as Record<string, { mes: string; demandaEstimada: number }[]>);

    // Picos de demanda: Periodos con incremento >20% sobre promedio
    const picosDemanda = departamentos.reduce((acc, dep) => {
      const depPatrones = patronesMensuales[dep];
      const promedioAnual = depPatrones.reduce((sum, m) => sum + m.promedioAtenciones, 0) / 12;
      acc[dep] = depPatrones
        .filter((m) => m.promedioAtenciones > promedioAnual * 1.2)
        .map((m) => ({ periodo: m.mes, incrementoPorc: ((m.promedioAtenciones / promedioAnual) - 1) * 100 }));
      return acc;
    }, {} as Record<string, { periodo: string; incrementoPorc: number }[]>);

    return { patronesMensuales, prediccionMensual, picosDemanda };
  } catch (error) {
    console.error('Error en getDemandaPrediction:', error);
    throw new Error('No se pudo generar la predicción de demanda');
  } finally {
    await prisma.$disconnect();
  }
}