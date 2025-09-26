import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import CreateRegistroDemandaForm from "@/dashboard/componentes/CreateRegistroDemandaForm";
import { Box, Typography } from "@mui/material";
import { titleFont } from "@/config/fonts";

export default async function CrearRegistroDemandaPage() {
  const session = await auth();

  if (!session || !session.user.email) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          No autorizado. Inicia sesión para continuar.
        </Typography>
      </Box>
    );
  }

  // Extraer NIT del email (formato: nit@gmail.com)
  const emailParts = session.user.email.split("@");
  const nit = emailParts[0];

  if (!nit) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error en la sesión: No se pudo extraer el NIT del email.
        </Typography>
      </Box>
    );
  }

  // Buscar el servicio asociado por NIT
  const servicio = await prisma.servicioSalud.findUnique({
    where: { nit },
  });

  if (!servicio) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          No se ha encontrado un servicio de salud asociado a tu cuenta.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="mt-20 flex flex-col items-center" >
      <h1 className={`${titleFont.className} text-center p-6`}>
        Crear un nuevo registro de demanda para {servicio.nombre || "Servicio desconocido"}
      </h1>
      <CreateRegistroDemandaForm servicioId={servicio.id} />
    </div>
  );
}