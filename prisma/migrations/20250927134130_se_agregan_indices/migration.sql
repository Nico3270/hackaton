-- CreateIndex
CREATE INDEX "RegistroDemanda_servicioId_fecha_factorEstacional_idx" ON "public"."RegistroDemanda"("servicioId", "fecha", "factorEstacional");

-- CreateIndex
CREATE INDEX "ReporteComunidad_departamento_fecha_motivoVisita_idx" ON "public"."ReporteComunidad"("departamento", "fecha", "motivoVisita");
