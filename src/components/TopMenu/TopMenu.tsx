"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { titleFont } from "@/config/fonts";
import { SideBar } from "../SideBar/SideBar";

export const TopMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md border-b h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        {/* Logo y nombre a la izquierda */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/imgs/hackaton.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
          <span
            className={`
              text-2xl font-bold text-gray-900 
              tracking-tight relative
              ${titleFont.className}
            `}
            style={{
              textShadow: "1px 1px 2px rgba(0,0,0,0.15)", // Sombra sutil
            }}
          >
            Hackathon Salud
          </span>
        </Link>

        {/* Botones de navegación a la derecha */}
        <nav className="flex items-center space-x-4">
          {/* Botones para pantallas grandes */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href=""
              className="
                text-gray-700 text-lg font-medium 
                hover:text-blue-600 
                transition-colors duration-200 
                px-4 py-2 rounded-lg 
                hover:bg-gray-100 
                hover:shadow-sm
              "
            >
              Sección 1
            </Link>
            <Link
              href=""
              className="
                text-gray-700 text-lg font-medium 
                hover:text-blue-600 
                transition-colors duration-200 
                px-4 py-2 rounded-lg 
                hover:bg-gray-100 
                hover:shadow-sm
              "
            >
              Sección 2
            </Link>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="
                text-gray-700 text-lg font-medium 
                hover:text-indigo-600 
                transition-colors duration-200 
                px-4 py-2 rounded-lg 
                hover:bg-gray-100 
                hover:shadow-sm
              "
            >
              Perfil
            </button>
          </div>

          {/* Ícono de hamburguesa para pantallas pequeñas */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Drawer lateral */}
      <SideBar open={isDrawerOpen} toggleDrawer={setIsDrawerOpen} />
    </header>
  );
};