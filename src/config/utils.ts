


export const CurrencyFormat = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP", 
        minimumFractionDigits:0,
        maximumFractionDigits: 1
    }).format(value);
}

// lib/options.ts
export const ESPECIALIDADES_PREDEFINIDAS = [
  'Medicina General', 'Pediatría', 'Ginecología y Obstetricia', 'Medicina Interna',
  'Cirugía General', 'Cardiología', 'Neurología', 'Dermatología', 'Oftalmología',
  'Otorrinolaringología', 'Ortopedia y Traumatología', 'Urología', 'Nefrología',
  'Endocrinología', 'Gastroenterología', 'Hematología', 'Infectología', 'Oncología',
  'Psiquiatría', 'Reumatología', 'Medicina Física y Rehabilitación', 'Anestesiología',
  'Medicina del Trabajo', 'Medicina Familiar y Comunitaria', 'Radiología', 'Medicina Nuclear'
];

export const SERVICIOS_ESPECIALIZADOS_PREDEFINIDOS = [
  'Unidad de Cuidados Intensivos (UCI)', 'Cirugía Mayor', 'Quimioterapia', 'Diálisis',
  'Radioterapia', 'Endoscopía', 'Litotricia', 'Trasplantes', 'Neonatología', 'Geriatría',
  'Medicina Paliativa', 'Rehabilitación Cardíaca', 'Terapia Respiratoria'
];

export const EQUIPO_DIAGNOSTICO_PREDEFINIDO = [
  'Rayos X', 'Tomografía Computarizada (TC)', 'Resonancia Magnética (RM)', 'Ecografía',
  'Laboratorio Clínico', 'Electrocardiograma (ECG)', 'Electroencefalograma (EEG)',
  'Espirometría', 'Endoscopía', 'Mamografía', 'Densitometría Ósea', 'Pruebas de Esfuerzo'
];

export const SERVICIOS_OFRECIDOS_PREDEFINIDOS = [
  'Vacunación', 'Consultas Generales', 'Chequeos Preventivos', 'Control Prenatal',
  'Planificación Familiar', 'Desparasitación', 'Atención Dental', 'Medición de Signos Vitales',
  'Educación en Salud', 'Tamizaje de Enfermedades Crónicas', 'Brigadas de Desinfección'
];