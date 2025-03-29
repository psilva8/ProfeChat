'use client';

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-indigo-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
                ProfeChat
              </Link>
            </div>
            {session ? (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link
                    href="/dashboard"
                    className={`text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/dashboard') ? 'bg-indigo-500' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/lesson-plans"
                    className={`text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/lesson-plans') ? 'bg-indigo-500' : ''
                    }`}
                  >
                    Lesson Plans
                  </Link>
                  <Link
                    href="/rubrics"
                    className={`text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/rubrics') ? 'bg-indigo-500' : ''
                    }`}
                  >
                    Rubrics
                  </Link>
                  <Link
                    href="/activities"
                    className={`text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/activities') ? 'bg-indigo-500' : ''
                    }`}
                  >
                    Activities
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="/features" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                    Features
                  </Link>
                  <Link href="/pricing" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                    Pricing
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-white">{session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-white hover:bg-indigo-500 px-4 py-2 rounded-md text-sm font-medium">
                  Sign in
                </Link>
                <Link href="/auth/register" className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-full">
        <Navigation />
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </SessionProvider>
  );
} 