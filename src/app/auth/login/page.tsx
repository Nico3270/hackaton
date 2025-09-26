"use client";


import { LoginForm } from "@/auth/componentes/LoginForm";
import Image from "next/image";
import { InfoEmpresa as empresa } from "@/config/config";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda - Formulario */}
      <LoginForm />

      {/* Columna derecha - Imagen */}
      <div className="md:w-1/2 relative hidden md:block bg-gray-100">
        <Image
          src="/imgs/hackaton.png" // Coloca aquí la ruta de la imagen del restaurante
          alt="Hackaton Salud"
          fill
          style={{ objectFit: "cover" }} // Asegura que la imagen cubra el espacio correctamente
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
