import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/providers/Provider";

export const metadata: Metadata = {
  title: "Sistema de Salud Cundinamarca y Boyacá",
  description: "Plataforma para mejorar el acceso y planificación de servicios de salud",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}