import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProfeChat - Asistente de Planificación Educativa",
  description: "Herramienta de planificación educativa impulsada por IA para docentes peruanos. Genera planes de lección, unidades y rúbricas alineadas con el currículo nacional.",
  keywords: "educación peruana, planificación educativa, planes de lección, unidades didácticas, rúbricas, currículo nacional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 