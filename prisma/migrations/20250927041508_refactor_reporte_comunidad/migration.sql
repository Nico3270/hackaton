/*
  Warnings:

  - You are about to drop the column `satisfaccionGeneral` on the `ReporteComunidad` table. All the data in the column will be lost.
  - You are about to drop the column `sintomasPostAtencion` on the `ReporteComunidad` table. All the data in the column will be lost.
  - You are about to drop the column `valoracion` on the `ReporteComunidad` table. All the data in the column will be lost.
  - The `disponibilidad` column on the `ReporteComunidad` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AspectoMejorar" AS ENUM ('TiempoEspera', 'AmabilidadPersonal', 'DisponibilidadCitas', 'Infraestructura', 'CalidadDiagnostico', 'Otros');

-- DropIndex
DROP INDEX "ReporteComunidad_valoracion_idx";

-- AlterTable
ALTER TABLE "ReporteComunidad" DROP COLUMN "satisfaccionGeneral",
DROP COLUMN "sintomasPostAtencion",
DROP COLUMN "valoracion",
ADD COLUMN     "aspectosMejorar" "AspectoMejorar"[] DEFAULT ARRAY[]::"AspectoMejorar"[],
ADD COLUMN     "calidadAtencion" "ValoracionSatisfaccion",
ADD COLUMN     "ratingSatisfaccion" INTEGER,
ADD COLUMN     "recomendarServicio" BOOLEAN,
ALTER COLUMN "sintomas" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "disponibilidad",
ADD COLUMN     "disponibilidad" "Disponibilidad";

-- CreateIndex
CREATE INDEX "ReporteComunidad_ratingSatisfaccion_idx" ON "ReporteComunidad"("ratingSatisfaccion");

-- CreateIndex
CREATE INDEX "ReporteComunidad_servicioId_ratingSatisfaccion_idx" ON "ReporteComunidad"("servicioId", "ratingSatisfaccion");

-- CreateIndex
CREATE INDEX "ReporteComunidad_ciudad_tipo_idx" ON "ReporteComunidad"("ciudad", "tipo");
