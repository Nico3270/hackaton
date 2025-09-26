/*
  Warnings:

  - You are about to drop the column `ipUsuario` on the `ReporteComunidad` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReporteComunidad_ipUsuario_idx";

-- AlterTable
ALTER TABLE "ReporteComunidad" DROP COLUMN "ipUsuario";
