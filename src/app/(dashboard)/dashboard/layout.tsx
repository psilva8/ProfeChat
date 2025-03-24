import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/nav';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="w-72 bg-white px-8 py-6 border-r">
          <div className="flex h-16 shrink-0 items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-accent-600 hover:text-accent-500 transition-colors"
            >
              ProfeChat
            </Link>
          </div>

          <DashboardNav />

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{session.user.name}</p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>

        <main className="flex-1 bg-gray-50">
          <div className="py-8 px-6">{children}</div>
        </main>
      </div>
    </div>
  );
} 