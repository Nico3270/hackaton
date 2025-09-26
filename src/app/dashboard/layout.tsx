"use client";


import { TopMenu } from "@/components/TopMenu/TopMenu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, {  useEffect } from "react";

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: session, status } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session && session.user.role !== "Usuario") {
      router.push("/not_authorized");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  return (
    <main className="bg-white min-h-screen">
      <TopMenu/>
      <div className="mt-0">{children}</div>
    </main>
  );
}
