import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import prisma from "./lib/prisma";
import bcryptjs from "bcryptjs";
import { randomBytes } from "crypto";
import { Role } from "@prisma/client";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },

  trustHost: true,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.usuario.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          const randomPassword = randomBytes(16).toString("hex");
          const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

          await prisma.usuario.create({
            data: {
              nombre: profile?.given_name || "Usuario",
              apellido: profile?.family_name || "Sin apellido",
              email: user.email as string,
              contraseña: hashedPassword,
              departamento: "Desconocido",
              ciudad: "Desconocida",
              fechaNacimiento: new Date("1990-01-01"),
              role: Role.Usuario,
              emailVerified: null,
              fechaCreacion: new Date(),
              fechaActualizacion: new Date(),
            },
          });
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        const usuario = await prisma.usuario.findUnique({
          where: { email: user.email as string },
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            departamento: true,
            ciudad: true,
            fechaNacimiento: true,
            emailVerified: true,
            role: true,
            fechaCreacion: true,
            fechaActualizacion: true,
          },
        });

        if (!usuario) {
          throw new Error("Usuario no encontrado en la base de datos después de signIn");
        }

        token.id = usuario.id;
        token.nombre = usuario.nombre;
        token.apellido = usuario.apellido;
        token.email = usuario.email;
        token.departamento = usuario.departamento;
        token.ciudad = usuario.ciudad;
        token.fechaNacimiento = usuario.fechaNacimiento;
        token.emailVerified = usuario.emailVerified ?? null;
        token.role = usuario.role;
        token.fechaCreacion = usuario.fechaCreacion;
        token.fechaActualizacion = usuario.fechaActualizacion;
      }

      if (trigger === "update" && session) {
        if (session.nombre) token.nombre = session.nombre;
        if (session.apellido) token.apellido = session.apellido;
        if (session.departamento) token.departamento = session.departamento;
        if (session.ciudad) token.ciudad = session.ciudad;
        if (session.fechaNacimiento) token.fechaNacimiento = session.fechaNacimiento;
        if (session.emailVerified !== undefined) token.emailVerified = session.emailVerified;
        if (session.role) token.role = session.role;
        if (session.fechaCreacion) token.fechaCreacion = session.fechaCreacion;
        if (session.fechaActualizacion) token.fechaActualizacion = session.fechaActualizacion;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        nombre: token.nombre as string,
        apellido: token.apellido as string,
        email: token.email as string,
        departamento: token.departamento as string,
        ciudad: token.ciudad as string,
        fechaNacimiento: token.fechaNacimiento as Date,
        emailVerified: token.emailVerified instanceof Date ? token.emailVerified : null,
        role: token.role as Role,
        fechaCreacion: token.fechaCreacion as Date,
        fechaActualizacion: token.fechaActualizacion as Date,
      };
      return session;
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.usuario.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            contraseña: true,
            departamento: true,
            ciudad: true,
            fechaNacimiento: true,
            emailVerified: true,
            role: true,
            fechaCreacion: true,
            fechaActualizacion: true,
          },
        });

        if (!user) return null;

        const isValidPassword = bcryptjs.compareSync(password, user.contraseña);
        if (!isValidPassword) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { contraseña: _, ...userWithoutPassword } = user;

        return {
          ...userWithoutPassword,
          emailVerified: user.emailVerified ?? null,
        };
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);