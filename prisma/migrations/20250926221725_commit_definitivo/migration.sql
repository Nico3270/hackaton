/*
  Warnings:

  - You are about to drop the column `fechaFin` on the `ServicioSalud` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `ServicioSalud` table. All the data in the column will be lost.
  - You are about to drop the column `ruta` on the `ServicioSalud` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ServicioSalud_fechaInicio_fechaFin_idx";

-- AlterTable
ALTER TABLE "ServicioSalud" DROP COLUMN "fechaFin",
DROP COLUMN "fechaInicio",
DROP COLUMN "ruta";
