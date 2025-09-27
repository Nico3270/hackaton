'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import colombiaData from '@/config/colombia.json';
import { createAdminService } from '../actions/createAdminService';
import { EQUIPO_DIAGNOSTICO_PREDEFINIDO, ESPECIALIDADES_PREDEFINIDAS, SERVICIOS_ESPECIALIZADOS_PREDEFINIDOS, SERVICIOS_OFRECIDOS_PREDEFINIDOS } from '@/config/utils';

// Esquema Zod para validación en cliente
const schema = z.object({
  tipo: z.enum(['PuestoSalud', 'Hospital', 'CampanaMovil'], { message: 'Tipo de servicio requerido' }),
  nombre: z.string().min(1, 'Nombre requerido'),
  nit: z.string().regex(/^\d{10}$/, 'NIT debe tener 10 dígitos'),
  disponibilidad: z.enum(['Disponible', 'Parcial', 'NoDisponible', 'EnMantenimiento'], { message: 'Disponibilidad requerida' }),
  codigoPrestador: z.string().min(1, 'Código prestador requerido'),
  direccion: z.string().min(1, 'Dirección requerida'),
  departamento: z.enum(['Cundinamarca', 'Boyacá'], { message: 'Departamento requerido' }),
  ciudad: z.string().min(1, 'Ciudad requerida'),
  caracter: z.enum(['Municipal', 'Departamental', 'Nacional'], { message: 'Carácter requerido' }),
  descripcion: z.string().optional(),
  estadoEmergencia: z.enum(['Normal', 'Emergencia']).optional(),
  prioridad: z.enum(['Baja', 'Media', 'Alta']).optional(),
  capacidadDiaria: z.number().int().min(0).optional(),
  especialidades: z.array(z.string()).optional(),
  personalMedico: z.number().int().min(0).optional(),
  nivelComplejidad: z.enum(['Baja', 'Media', 'Alta']).optional(),
  camasDisponibles: z.number().int().min(0).optional(),
  camasTotales: z.number().int().min(0).optional(),
  serviciosEspecializados: z.array(z.string()).optional(),
  equipoDiagnostico: z.array(z.string()).optional(),
  contactoEmergencia: z.string().optional(),
  fechaInicio: z.string().datetime().optional(),
  fechaFin: z.string().datetime().optional(),
  ruta: z.string().optional(),
  serviciosOfrecidos: z.array(z.string()).optional(),
  capacidadEstimada: z.number().int().min(0).optional(),
}).superRefine((data, ctx) => {
  if (data.tipo === 'PuestoSalud' && data.capacidadDiaria === undefined) {
    ctx.addIssue({ code: 'custom', path: ['capacidadDiaria'], message: 'Capacidad diaria requerida para Puesto de Salud' });
  }
  if (data.tipo === 'Hospital' && data.nivelComplejidad === undefined) {
    ctx.addIssue({ code: 'custom', path: ['nivelComplejidad'], message: 'Nivel de complejidad requerido para Hospital' });
  }
  if (data.tipo === 'CampanaMovil') {
    if (!data.fechaInicio || !data.fechaFin) {
      ctx.addIssue({ code: 'custom', path: ['fechaInicio'], message: 'Fechas requeridas para Campaña Móvil' });
    }
    if (!data.ruta) {
      ctx.addIssue({ code: 'custom', path: ['ruta'], message: 'Ruta requerida para Campaña Móvil' });
    }
  }
});

// Interfaz TypeScript para FormData
interface FormData {
  tipo: 'PuestoSalud' | 'Hospital' | 'CampanaMovil';
  nombre: string;
  nit: string;
  disponibilidad: 'Disponible' | 'Parcial' | 'NoDisponible' | 'EnMantenimiento';
  codigoPrestador: string;
  direccion: string;
  departamento: 'Cundinamarca' | 'Boyacá';
  ciudad: string;
  caracter: 'Municipal' | 'Departamental' | 'Nacional';
  descripcion?: string;
  estadoEmergencia?: 'Normal' | 'Emergencia';
  prioridad?: 'Baja' | 'Media' | 'Alta';
  capacidadDiaria?: number;
  especialidades?: string[];
  personalMedico?: number;
  nivelComplejidad?: 'Baja' | 'Media' | 'Alta';
  camasDisponibles?: number;
  camasTotales?: number;
  serviciosEspecializados?: string[];
  equipoDiagnostico?: string[];
  contactoEmergencia?: string;
  fechaInicio?: string;
  fechaFin?: string;
  ruta?: string;
  serviciosOfrecidos?: string[];
  capacidadEstimada?: number;
}

export default function CrearServicioForm() {
  const [cities, setCities] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: 'PuestoSalud',
      nombre: '',
      nit: '',
      disponibilidad: 'Disponible',
      codigoPrestador: '',
      direccion: '',
      departamento: 'Cundinamarca',
      ciudad: '',
      caracter: 'Municipal',
      descripcion: '',
      estadoEmergencia: undefined,
      prioridad: undefined,
      capacidadDiaria: undefined,
      especialidades: [],
      personalMedico: undefined,
      nivelComplejidad: undefined,
      camasDisponibles: undefined,
      camasTotales: undefined,
      serviciosEspecializados: [],
      equipoDiagnostico: [],
      contactoEmergencia: '',
      fechaInicio: undefined,
      fechaFin: undefined,
      ruta: '',
      serviciosOfrecidos: [],
      capacidadEstimada: undefined,
    },
  });

  const tipo = watch('tipo');
  const departamento = watch('departamento');

  useEffect(() => {
    if (departamento) {
      const deptData = colombiaData.find((d) => d.departamento === departamento);
      setCities(deptData ? deptData.ciudades : []);
    } else {
      setCities([]);
    }
  }, [departamento]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('Datos enviados:', data);
    setIsPending(true);
    setErrorMessage('');
    setOpenSnackbar(false);
    try {
      const response = await createAdminService(data);
      if (response.ok) {
        setSuccessMessage(response.message);
        setOpenDialog(true);
        reset();
      } else {
        setErrorMessage(response.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage('Error al crear servicio: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      setOpenSnackbar(true);
    }
    setIsPending(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    router.push('/');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isPuestoSalud = tipo === 'PuestoSalud';
  const isHospital = tipo === 'Hospital';
  const isCampanaMovil = tipo === 'CampanaMovil';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card
        sx={{
          maxWidth: 900,
          width: '100%',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.9)',
        }}
      >
        <CardHeader
          sx={{
            bgcolor: 'transparent',
            pt: 6,
            pb: 2,
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontFamily: "'SF Pro Display', -apple-system, sans-serif",
              color: '#1A1A1A',
              textAlign: 'center',
            }}
          >
            Crear Servicio de Salud
          </Typography>
        </CardHeader>
        <CardContent sx={{ p: 6 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo */}
            <FormControl fullWidth error={!!errors.tipo} required>
              <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                Tipo de Servicio
              </InputLabel>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Tipo de Servicio"
                    sx={{
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                    }}
                  >
                    <MenuItem value="PuestoSalud">Puesto de Salud</MenuItem>
                    <MenuItem value="Hospital">Hospital</MenuItem>
                    <MenuItem value="CampanaMovil">Campaña Móvil</MenuItem>
                  </Select>
                )}
              />
              {errors.tipo && (
                <Typography color="error" sx={{ fontSize: '0.875rem', mt: 1 }}>
                  {errors.tipo.message}
                </Typography>
              )}
            </FormControl>

            {/* Nombre, NIT, Código */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                {...register('nombre')}
                label="Nombre"
                fullWidth
                required
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                  },
                  '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                }}
              />
              <TextField
                {...register('nit')}
                label="NIT"
                fullWidth
                required
                error={!!errors.nit}
                helperText={errors.nit?.message || 'Ejemplo: 1234567890'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                  },
                  '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                }}
              />
              <TextField
                {...register('codigoPrestador')}
                label="Código Prestador"
                fullWidth
                required
                error={!!errors.codigoPrestador}
                helperText={errors.codigoPrestador?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                  },
                  '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                }}
              />
            </div>

            {/* Dirección, Departamento, Ciudad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                {...register('direccion')}
                label="Dirección"
                fullWidth
                required
                error={!!errors.direccion}
                helperText={errors.direccion?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                  },
                  '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                }}
              />
              <FormControl fullWidth error={!!errors.departamento} required>
                <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                  Departamento
                </InputLabel>
                <Controller
                  name="departamento"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Departamento"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                      }}
                    >
                      <MenuItem value="Cundinamarca">Cundinamarca</MenuItem>
                      <MenuItem value="Boyacá">Boyacá</MenuItem>
                    </Select>
                  )}
                />
                {errors.departamento && (
                  <Typography color="error" sx={{ fontSize: '0.875rem', mt: 1 }}>
                    {errors.departamento.message}
                  </Typography>
                )}
              </FormControl>
              <FormControl fullWidth error={!!errors.ciudad} required disabled={!departamento}>
                <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                  Ciudad
                </InputLabel>
                <Controller
                  name="ciudad"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Ciudad"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                      }}
                      disabled={!departamento}
                    >
                      {cities.map((city, i) => (
                        <MenuItem key={i} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.ciudad && (
                  <Typography color="error" sx={{ fontSize: '0.875rem', mt: 1 }}>
                    {errors.ciudad.message}
                  </Typography>
                )}
              </FormControl>
            </div>

            {/* Carácter */}
            <FormControl fullWidth error={!!errors.caracter} required>
              <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                Carácter
              </InputLabel>
              <Controller
                name="caracter"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Carácter"
                    sx={{
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                    }}
                  >
                    <MenuItem value="Municipal">Municipal</MenuItem>
                    <MenuItem value="Departamental">Departamental</MenuItem>
                    <MenuItem value="Nacional">Nacional</MenuItem>
                  </Select>
                )}
              />
              {errors.caracter && (
                <Typography color="error" sx={{ fontSize: '0.875rem', mt: 1 }}>
                  {errors.caracter.message}
                </Typography>
              )}
            </FormControl>

            {/* Descripción */}
            <TextField
              {...register('descripcion')}
              label="Descripción"
              multiline
              rows={3}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#fff',
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                },
                '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
              }}
            />

            {/* Disponibilidad */}
            <FormControl fullWidth error={!!errors.disponibilidad} required>
              <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                Disponibilidad
              </InputLabel>
              <Controller
                name="disponibilidad"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Disponibilidad"
                    sx={{
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                    }}
                  >
                    <MenuItem value="Disponible">Disponible</MenuItem>
                    <MenuItem value="Parcial">Parcial</MenuItem>
                    <MenuItem value="NoDisponible">No Disponible</MenuItem>
                    <MenuItem value="EnMantenimiento">En Mantenimiento</MenuItem>
                  </Select>
                )}
              />
              {errors.disponibilidad && (
                <Typography color="error" sx={{ fontSize: '0.875rem', mt: 1 }}>
                  {errors.disponibilidad.message}
                </Typography>
              )}
            </FormControl>

            {/* Condicional: PuestoSalud */}
            {isPuestoSalud && (
              <Box className="space-y-4">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1A1A1A',
                    fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                  }}
                >
                  Detalles Puesto de Salud
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    {...register('capacidadDiaria', { valueAsNumber: true })}
                    label="Capacidad Diaria"
                    type="number"
                    fullWidth
                    required
                    error={!!errors.capacidadDiaria}
                    helperText={errors.capacidadDiaria?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                  <TextField
                    {...register('personalMedico', { valueAsNumber: true })}
                    label="Personal Médico"
                    type="number"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                </div>
                <FormControl fullWidth>
                  <Controller
                    name="especialidades"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={ESPECIALIDADES_PREDEFINIDAS}
                        value={field.value ?? []}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Especialidades"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: '#fff',
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                              },
                              '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                            }}
                          />
                        )}
                        sx={{ bgcolor: '#fff' }}
                      />
                    )}
                  />
                </FormControl>
              </Box>
            )}

            {/* Condicional: Hospital */}
            {isHospital && (
              <Box className="space-y-4">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1A1A1A',
                    fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                  }}
                >
                  Detalles Hospital
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormControl fullWidth error={!!errors.nivelComplejidad} required>
                    <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                      Nivel de Complejidad
                    </InputLabel>
                    <Controller
                      name="nivelComplejidad"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Nivel de Complejidad"
                          sx={{
                            borderRadius: '12px',
                            bgcolor: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                          }}
                          value={field.value ?? ''}
                        >
                          <MenuItem value="Baja">Baja</MenuItem>
                          <MenuItem value="Media">Media</MenuItem>
                          <MenuItem value="Alta">Alta</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.nivelComplejidad && (
                      <Typography color="error" sx={{ fontSize: '0.875rem', mt: 1 }}>
                        {errors.nivelComplejidad.message}
                      </Typography>
                    )}
                  </FormControl>
                  <TextField
                    {...register('camasDisponibles', { valueAsNumber: true })}
                    label="Camas Disponibles"
                    type="number"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                  <TextField
                    {...register('camasTotales', { valueAsNumber: true })}
                    label="Camas Totales"
                    type="number"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl fullWidth>
                    <Controller
                      name="serviciosEspecializados"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          multiple
                          options={SERVICIOS_ESPECIALIZADOS_PREDEFINIDOS}
                          value={field.value ?? []}
                          onChange={(_, newValue) => field.onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Servicios Especializados"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  bgcolor: '#fff',
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                                },
                                '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                              }}
                            />
                          )}
                          sx={{ bgcolor: '#fff' }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <Controller
                      name="equipoDiagnostico"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          multiple
                          options={EQUIPO_DIAGNOSTICO_PREDEFINIDO}
                          value={field.value ?? []}
                          onChange={(_, newValue) => field.onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Equipo Diagnóstico"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  bgcolor: '#fff',
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                                },
                                '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                              }}
                            />
                          )}
                          sx={{ bgcolor: '#fff' }}
                        />
                      )}
                    />
                  </FormControl>
                </div>
                <TextField
                  {...register('contactoEmergencia')}
                  label="Contacto Emergencia"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                  }}
                />
              </Box>
            )}

            {/* Condicional: CampanaMovil */}
            {isCampanaMovil && (
              <Box className="space-y-4">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1A1A1A',
                    fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                  }}
                >
                  Detalles Campaña Móvil
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    {...register('fechaInicio')}
                    label="Fecha Inicio"
                    type="datetime-local"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.fechaInicio}
                    helperText={errors.fechaInicio?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                  <TextField
                    {...register('fechaFin')}
                    label="Fecha Fin"
                    type="datetime-local"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.fechaFin}
                    helperText={errors.fechaFin?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                  <TextField
                    {...register('ruta')}
                    label="Ruta"
                    fullWidth
                    required
                    error={!!errors.ruta}
                    helperText={errors.ruta?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                  <TextField
                    {...register('capacidadEstimada', { valueAsNumber: true })}
                    label="Capacidad Estimada"
                    type="number"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                    }}
                  />
                </div>
                <FormControl fullWidth>
                  <Controller
                    name="serviciosOfrecidos"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={SERVICIOS_OFRECIDOS_PREDEFINIDOS}
                        value={field.value ?? []}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Servicios Ofrecidos"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: '#fff',
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                              },
                              '& .MuiInputLabel-root': { fontFamily: "'SF Pro Text', -apple-system, sans-serif" },
                            }}
                          />
                        )}
                        sx={{ bgcolor: '#fff' }}
                      />
                    )}
                  />
                </FormControl>
              </Box>
            )}

            {/* Campos Comunes Opcionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth error={!!errors.estadoEmergencia}>
                <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                  Estado Emergencia
                </InputLabel>
                <Controller
                  name="estadoEmergencia"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Estado Emergencia"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                      }}
                      value={field.value ?? ''}
                    >
                      <MenuItem value="">Selecciona</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Emergencia">Emergencia</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl fullWidth error={!!errors.prioridad}>
                <InputLabel sx={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                  Prioridad
                </InputLabel>
                <Controller
                  name="prioridad"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Prioridad"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                      }}
                      value={field.value ?? ''}
                    >
                      <MenuItem value="">Selecciona</MenuItem>
                      <MenuItem value="Baja">Baja</MenuItem>
                      <MenuItem value="Media">Media</MenuItem>
                      <MenuItem value="Alta">Alta</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            {/* Botón Submit */}
            <Box className="relative">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isPending}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                  bgcolor: '#007AFF',
                  '&:hover': { bgcolor: '#005BB5', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                  '&:disabled': { bgcolor: '#A0C4FF', cursor: 'not-allowed' },
                  transition: 'all 0.3s ease',
                }}
              >
                <AnimatePresence mode="wait">
                  {isPending ? (
                    <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    </motion.div>
                  ) : (
                    <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Crear Servicio
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Box>
          </form>

          {/* Snackbar para Errores */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: '100%', borderRadius: '12px', fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>

          {/* Modal de Éxito */}
          <AnimatePresence>
            {openDialog && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  sx={{
                    '& .MuiDialog-paper': {
                      borderRadius: '16px',
                      backdropFilter: 'blur(12px)',
                      background: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  <DialogTitle
                    sx={{ fontWeight: 700, fontFamily: "'SF Pro Display', -apple-system, sans-serif", color: '#1A1A1A' }}
                  >
                    ¡Éxito!
                  </DialogTitle>
                  <DialogContent>
                    <Typography sx={{ color: '#1A1A1A', fontFamily: "'SF Pro Text', -apple-system, sans-serif" }}>
                      {successMessage}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseDialog}
                      variant="contained"
                      sx={{
                        borderRadius: '12px',
                        bgcolor: '#007AFF',
                        '&:hover': { bgcolor: '#005BB5', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
                        fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                      }}
                    >
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}