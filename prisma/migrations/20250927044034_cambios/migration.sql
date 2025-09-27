/*
  Warnings:

  - You are about to drop the column `tipo` on the `ReporteComunidad` table. All the data in the column will be lost.
  - Added the required column `motivoVisita` to the `ReporteComunidad` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MotivoVisita" AS ENUM ('ReportarSintomas', 'ReportarEnfermedad', 'CitaControl', 'SolicitudCita', 'EvaluacionServicio', 'ReclamarMedicamentos');

-- DropIndex
DROP INDEX "ReporteComunidad_ciudad_tipo_idx";

-- DropIndex
DROP INDEX "ReporteComunidad_tipo_aprobado_idx";

-- DropIndex
DROP INDEX "ReporteComunidad_tipo_idx";

-- AlterTable
ALTER TABLE "ReporteComunidad" DROP COLUMN "tipo",
ADD COLUMN     "motivoVisita" "MotivoVisita" NOT NULL;

-- DropEnum
DROP TYPE "TipoReporte";

-- CreateIndex
CREATE INDEX "ReporteComunidad_motivoVisita_aprobado_idx" ON "ReporteComunidad"("motivoVisita", "aprobado");

-- CreateIndex
CREATE INDEX "ReporteComunidad_motivoVisita_idx" ON "ReporteComunidad"("motivoVisita");

-- CreateIndex
CREATE INDEX "ReporteComunidad_ciudad_motivoVisita_idx" ON "ReporteComunidad"("ciudad", "motivoVisita");
