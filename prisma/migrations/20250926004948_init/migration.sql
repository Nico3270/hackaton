-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('PuestoSalud', 'Hospital', 'CampanaMovil');

-- CreateEnum
CREATE TYPE "Disponibilidad" AS ENUM ('Disponible', 'Parcial', 'NoDisponible', 'EnMantenimiento');

-- CreateEnum
CREATE TYPE "NivelComplejidad" AS ENUM ('Baja', 'Media', 'Alta');

-- CreateEnum
CREATE TYPE "EstadoEmergencia" AS ENUM ('Normal', 'Emergencia');

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('Baja', 'Media', 'Alta');

-- CreateEnum
CREATE TYPE "TipoCaracter" AS ENUM ('Municipal', 'Departamental', 'Nacional');

-- CreateEnum
CREATE TYPE "FactorEstacional" AS ENUM ('Normal', 'Lluvias', 'Sequia', 'Epidemia', 'Festividades', 'InviernoFrio', 'CalorExtremo', 'EventosAgricolas', 'EmergenciasNaturales');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Administrador', 'ServicioSalud', 'Usuario', 'Invitado');

-- CreateEnum
CREATE TYPE "TipoReporte" AS ENUM ('SintomasFrecuentes', 'DisponibilidadCampana', 'EncuestaSatisfaccion', 'Enfermedades', 'CitaControl', 'SolicitudCita');

-- CreateEnum
CREATE TYPE "ValoracionSatisfaccion" AS ENUM ('MuyInsatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'MuySatisfecho');

-- CreateEnum
CREATE TYPE "FrecuenciaSintomas" AS ENUM ('Raro', 'Ocasional', 'Frecuente', 'Constante');

-- CreateEnum
CREATE TYPE "SatisfaccionGeneral" AS ENUM ('Malo', 'Regular', 'Bueno');

-- CreateTable
CREATE TABLE "ServicioSalud" (
    "id" TEXT NOT NULL,
    "tipo" "TipoServicio" NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "disponibilidad" "Disponibilidad" NOT NULL,
    "codigoPrestador" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "caracter" "TipoCaracter" NOT NULL,
    "descripcion" TEXT,
    "estadoEmergencia" "EstadoEmergencia",
    "prioridad" "Prioridad",
    "capacidadDiaria" INTEGER,
    "especialidades" TEXT[],
    "personalMedico" INTEGER,
    "nivelComplejidad" "NivelComplejidad",
    "camasDisponibles" INTEGER,
    "camasTotales" INTEGER,
    "serviciosEspecializados" TEXT[],
    "equipoDiagnostico" TEXT[],
    "contactoEmergencia" TEXT,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "ruta" TEXT,
    "serviciosOfrecidos" TEXT[],
    "capacidadEstimada" INTEGER,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicioSalud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroDemanda" (
    "id" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "atenciones" INTEGER NOT NULL,
    "demandaEstimada" DOUBLE PRECISION,
    "factorEstacional" "FactorEstacional" NOT NULL,
    "tiposDemanda" TEXT[],
    "notas" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroDemanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Usuario',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReporteComunidad" (
    "id" TEXT NOT NULL,
    "tipo" "TipoReporte" NOT NULL,
    "ciudad" TEXT NOT NULL,
    "departamento" TEXT,
    "sintomas" TEXT[],
    "frecuenciaSintomas" "FrecuenciaSintomas",
    "duracionSintomasDias" INTEGER,
    "descripcion" TEXT,
    "disponibilidad" TEXT,
    "email" TEXT,
    "ipUsuario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "servicioId" TEXT,
    "valoracion" "ValoracionSatisfaccion",
    "tiempoEspera" INTEGER,
    "sintomasPostAtencion" TEXT[],
    "satisfaccionGeneral" "SatisfaccionGeneral",
    "usuarioId" TEXT,

    CONSTRAINT "ReporteComunidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroConsulta" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tiposDemanda" TEXT[],
    "notas" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroConsulta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServicioSalud_nit_key" ON "ServicioSalud"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "ServicioSalud_codigoPrestador_key" ON "ServicioSalud"("codigoPrestador");

-- CreateIndex
CREATE INDEX "ServicioSalud_departamento_ciudad_idx" ON "ServicioSalud"("departamento", "ciudad");

-- CreateIndex
CREATE INDEX "ServicioSalud_tipo_idx" ON "ServicioSalud"("tipo");

-- CreateIndex
CREATE INDEX "ServicioSalud_disponibilidad_idx" ON "ServicioSalud"("disponibilidad");

-- CreateIndex
CREATE INDEX "ServicioSalud_fechaInicio_fechaFin_idx" ON "ServicioSalud"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "ServicioSalud_nit_idx" ON "ServicioSalud"("nit");

-- CreateIndex
CREATE INDEX "ServicioSalud_codigoPrestador_idx" ON "ServicioSalud"("codigoPrestador");

-- CreateIndex
CREATE INDEX "RegistroDemanda_servicioId_idx" ON "RegistroDemanda"("servicioId");

-- CreateIndex
CREATE INDEX "RegistroDemanda_fecha_idx" ON "RegistroDemanda"("fecha");

-- CreateIndex
CREATE INDEX "RegistroDemanda_servicioId_fecha_idx" ON "RegistroDemanda"("servicioId", "fecha");

-- CreateIndex
CREATE INDEX "RegistroDemanda_factorEstacional_idx" ON "RegistroDemanda"("factorEstacional");

-- CreateIndex
CREATE UNIQUE INDEX "RegistroDemanda_servicioId_fecha_key" ON "RegistroDemanda"("servicioId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE INDEX "Usuario_correo_idx" ON "Usuario"("correo");

-- CreateIndex
CREATE INDEX "Usuario_departamento_ciudad_idx" ON "Usuario"("departamento", "ciudad");

-- CreateIndex
CREATE INDEX "ReporteComunidad_ciudad_idx" ON "ReporteComunidad"("ciudad");

-- CreateIndex
CREATE INDEX "ReporteComunidad_fecha_idx" ON "ReporteComunidad"("fecha");

-- CreateIndex
CREATE INDEX "ReporteComunidad_tipo_aprobado_idx" ON "ReporteComunidad"("tipo", "aprobado");

-- CreateIndex
CREATE INDEX "ReporteComunidad_tipo_idx" ON "ReporteComunidad"("tipo");

-- CreateIndex
CREATE INDEX "ReporteComunidad_servicioId_idx" ON "ReporteComunidad"("servicioId");

-- CreateIndex
CREATE INDEX "ReporteComunidad_valoracion_idx" ON "ReporteComunidad"("valoracion");

-- CreateIndex
CREATE INDEX "ReporteComunidad_usuarioId_idx" ON "ReporteComunidad"("usuarioId");

-- CreateIndex
CREATE INDEX "ReporteComunidad_ipUsuario_idx" ON "ReporteComunidad"("ipUsuario");

-- CreateIndex
CREATE INDEX "ReporteComunidad_email_idx" ON "ReporteComunidad"("email");

-- CreateIndex
CREATE INDEX "RegistroConsulta_usuarioId_idx" ON "RegistroConsulta"("usuarioId");

-- CreateIndex
CREATE INDEX "RegistroConsulta_servicioId_idx" ON "RegistroConsulta"("servicioId");

-- CreateIndex
CREATE INDEX "RegistroConsulta_fecha_idx" ON "RegistroConsulta"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "RegistroConsulta_usuarioId_servicioId_fecha_key" ON "RegistroConsulta"("usuarioId", "servicioId", "fecha");

-- AddForeignKey
ALTER TABLE "RegistroDemanda" ADD CONSTRAINT "RegistroDemanda_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "ServicioSalud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReporteComunidad" ADD CONSTRAINT "ReporteComunidad_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "ServicioSalud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReporteComunidad" ADD CONSTRAINT "ReporteComunidad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroConsulta" ADD CONSTRAINT "RegistroConsulta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroConsulta" ADD CONSTRAINT "RegistroConsulta_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "ServicioSalud"("id") ON DELETE CASCADE ON UPDATE CASCADE;
