import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  TableCellsIcon, 
  BeakerIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: UserIcon },
  { name: 'Planes de Lección', href: '/dashboard/lesson-plans', icon: DocumentTextIcon },
  { name: 'Rúbricas', href: '/dashboard/rubrics', icon: TableCellsIcon },
  { name: 'Actividades', href: '/dashboard/activities', icon: BeakerIcon },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-bold text-accent-600">ProfeChat</span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link
              href="/api/auth/signout"
              className="flex-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
            >
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 