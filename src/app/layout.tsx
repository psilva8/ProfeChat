import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/client-layout";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProfeChat - AI-Powered Teaching Assistant",
  description: "Create lesson plans, rubrics, and activities with AI assistance",
};

const Footer = () => {
  return (
    <footer className="w-full py-3 border-t border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EduPlanner. All rights reserved.
        </div>
        <div className="flex space-x-4 text-sm text-gray-500">
          <Link href="/about" className="hover:text-accent-600">About</Link>
          <Link href="/contact" className="hover:text-accent-600">Contact</Link>
          <Link href="/test/diagnostics" className="hover:text-accent-600">Diagnostics</Link>
        </div>
      </div>
    </footer>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
        <Footer />
      </body>
    </html>
  );
} 