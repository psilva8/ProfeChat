import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Fetch user's data counts
  const [lessonPlansCount, rubricCount, activitiesCount] = await Promise.all([
    db.lessonPlan.count({
      where: { userId: session.user.id },
    }),
    db.rubric.count({
      where: { userId: session.user.id },
    }),
    db.activity.count({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Planes de Lección</h2>
          <p className="text-4xl font-bold text-accent-600">{lessonPlansCount}</p>
          <a href="/dashboard/lesson-plans" className="text-accent-600 hover:text-accent-700 font-medium mt-4 inline-block">
            Ver todos →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Rúbricas</h2>
          <p className="text-4xl font-bold text-accent-600">{rubricCount}</p>
          <a href="/dashboard/rubrics" className="text-accent-600 hover:text-accent-700 font-medium mt-4 inline-block">
            Ver todas →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Actividades</h2>
          <p className="text-4xl font-bold text-accent-600">{activitiesCount}</p>
          <a href="/dashboard/activities" className="text-accent-600 hover:text-accent-700 font-medium mt-4 inline-block">
            Ver todas →
          </a>
        </div>
      </div>
    </div>
  );
} 