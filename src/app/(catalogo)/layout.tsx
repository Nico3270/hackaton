"use client";


import { TopMenu } from "@/components/TopMenu/TopMenu";
import React from "react";

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-white min-h-screen flex flex-col relative">
      <TopMenu />
      <div className="flex-grow mt-0">{children}</div>
    </main>
  );
}