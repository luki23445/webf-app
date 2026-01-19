'use client';

import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../../components/layout/main-layout';
import { timeApi } from '../../lib/api';
import { useAuth } from '../../contexts/auth-context';

export default function TimePage() {
  const { user } = useAuth();

  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['time', 'all'],
    queryFn: () => timeApi.list({ userId: user?.id }),
    enabled: !!user?.id,
  });

  const entries = timeEntries?.data || [];
  const totalMinutes = entries.reduce((sum: number, entry: any) => sum + entry.minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Czas pracy</h1>
          <p className="text-gray-600 mt-1">Twoje logi czasu pracy</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600">Łączny czas</p>
              <p className="text-3xl font-bold mt-1">
                {totalHours}h {totalMins}m
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Ładowanie...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Brak logów czasu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry: any) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{entry.project?.name || 'Brak projektu'}</p>
                    {entry.task && <p className="text-sm text-gray-600">{entry.task.title}</p>}
                    {entry.note && <p className="text-sm text-gray-500 mt-1">{entry.note}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(entry.startedAt).toLocaleString('pl-PL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{entry.minutes} min</p>
                    <p className="text-sm text-gray-500">
                      {Math.floor(entry.minutes / 60)}h {entry.minutes % 60}m
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
