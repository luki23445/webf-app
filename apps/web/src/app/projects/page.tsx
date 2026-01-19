'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../../components/layout/main-layout';
import { projectsApi } from '../../lib/api';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  new: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  blocked: 'bg-red-100 text-red-800',
  review: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-600',
};

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['projects', statusFilter, search],
    queryFn: () => projectsApi.list({ status: statusFilter || undefined, search: search || undefined }),
  });

  const projects = data?.data || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projekty</h1>
            <p className="text-gray-600 mt-1">Zarządzaj wszystkimi projektami</p>
          </div>
          <Link
            href="/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nowy projekt
          </Link>
        </div>

        {/* Filtry */}
        <div className="bg-white rounded-lg shadow p-4 flex gap-4">
          <input
            type="text"
            placeholder="Szukaj projektów..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wszystkie statusy</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Lista projektów */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Ładowanie...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">Brak projektów</p>
            <Link
              href="/projects/new"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Utwórz pierwszy projekt →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => {
              const totalTasks = project.tasks?.length || 0;
              const doneTasks = project.tasks?.filter((t: any) => t.status === 'done').length || 0;
              const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${statusColors[project.status] || statusColors.new}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description || 'Brak opisu'}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Postęp</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.client?.name || 'Brak klienta'}</span>
                    <span>{totalTasks} zadań</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
