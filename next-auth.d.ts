// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

// Extender el módulo NextAuth
declare module "next-auth" {
  // Extender el tipo User
  interface User extends DefaultUser {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    departamento: string;
    ciudad: string;
    fechaNacimiento: Date;
    emailVerified: Date | null;
    role: Role;
    fechaCreacion: Date;
    fechaActualizacion: Date;
  }

  // Extender el tipo Session
  interface Session extends DefaultSession {
    user: User; // Utiliza el tipo extendido de User
  }

  // Extender el tipo JWT
  interface JWT {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    departamento: string;
    ciudad: string;
    fechaNacimiento: Date;
    emailVerified: Date | null;
    role: Role;
    fechaCreacion: Date;
    fechaActualizacion: Date;
  }
}