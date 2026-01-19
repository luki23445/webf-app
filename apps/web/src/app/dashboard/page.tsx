'use client';

import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../../components/layout/main-layout';
import { AuthGuard } from '../../components/auth-guard';
import { projectsApi, timeApi } from '../../lib/api';
import { useAuth } from '../../contexts/auth-context';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(),
  });

  const { data: timeEntries } = useQuery({
    queryKey: ['time', 'today'],
    queryFn: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return timeApi.list({
        startDate: today.toISOString(),
        userId: user?.id,
      });
    },
    enabled: !!user?.id,
  });

  const activeProjects = projects?.data?.filter((p: any) => p.status === 'in_progress') || [];
  const blockedTasks = projects?.data?.flatMap((p: any) =>
    p.tasks?.filter((t: any) => t.status === 'blocked') || []
  ) || [];

  const todayMinutes =
    timeEntries?.data?.reduce((sum: number, entry: any) => sum + entry.minutes, 0) || 0;
  const todayHours = Math.floor(todayMinutes / 60);
  const todayMins = todayMinutes % 60;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Witaj, {user?.name}!</p>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Projekty aktywne</p>
                <p className="text-3xl font-bold mt-2">{activeProjects.length}</p>
              </div>
              <div className="text-4xl">📁</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zadania zablokowane</p>
                <p className="text-3xl font-bold mt-2">{blockedTasks.length}</p>
              </div>
              <div className="text-4xl">🚫</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Czas dzisiaj</p>
                <p className="text-3xl font-bold mt-2">
                  {todayHours}h {todayMins}m
                </p>
              </div>
              <div className="text-4xl">⏱️</div>
            </div>
          </div>
        </div>

        {/* Moje zadania */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Moje zadania</h2>
          </div>
          <div className="p-6">
            {projects?.data?.length === 0 ? (
              <p className="text-gray-500">Brak zadań</p>
            ) : (
              <div className="space-y-4">
                {projects?.data
                  ?.flatMap((p: any) =>
                    p.tasks
                      ?.filter((t: any) => t.assignedToId === user?.id && t.status !== 'done')
                      .map((t: any) => ({ ...t, project: p })) || []
                  )
                  .slice(0, 5)
                  .map((task: any) => (
                    <Link
                      key={task.id}
                      href={`/projects/${task.project.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.project.name}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : task.status === 'blocked'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Projekty aktywne */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projekty aktywne</h2>
            <Link
              href="/projects"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Zobacz wszystkie →
            </Link>
          </div>
          <div className="p-6">
            {activeProjects.length === 0 ? (
              <p className="text-gray-500">Brak aktywnych projektów</p>
            ) : (
              <div className="space-y-4">
                {activeProjects.slice(0, 5).map((project: any) => {
                  const totalTasks = project.tasks?.length || 0;
                  const doneTasks = project.tasks?.filter((t: any) => t.status === 'done').length || 0;
                  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
