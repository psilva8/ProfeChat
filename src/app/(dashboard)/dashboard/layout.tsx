import React from 'react';
import { DashboardNav } from '@/components/dashboard/nav';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="w-72 bg-white px-8 py-6 border-r">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="text-2xl font-bold text-accent-600 hover:text-accent-500 transition-colors">
              ProfeChat
            </Link>
          </div>
          <DashboardNav />
        </div>
        <main className="flex-1 bg-gray-50">
          <div className="py-8 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 