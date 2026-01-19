'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../../../components/layout/main-layout';
import { projectsApi, tasksApi, timeApi } from '../../../lib/api';
import { useState } from 'react';
import Link from 'next/link';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'time' | 'resources'>('overview');

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId),
  });

  const projectData = project?.data;

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => projectsApi.update(projectId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Ładowanie...</p>
        </div>
      </MainLayout>
    );
  }

  if (!projectData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Projekt nie znaleziony</p>
          <Link href="/projects" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← Powrót do listy
          </Link>
        </div>
      </MainLayout>
    );
  }

  const totalTasks = projectData.tasks?.length || 0;
  const doneTasks = projectData.tasks?.filter((t: any) => t.status === 'done').length || 0;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/projects" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
              ← Powrót do listy
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{projectData.name}</h1>
            <p className="text-gray-600 mt-1">{projectData.description || 'Brak opisu'}</p>
          </div>
          <select
            value={projectData.status}
            onChange={(e) => updateStatusMutation.mutate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Klient</p>
            <p className="font-semibold mt-1">{projectData.client?.name || 'Brak'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Postęp</p>
            <p className="font-semibold mt-1">{progress}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Zadania</p>
            <p className="font-semibold mt-1">
              {doneTasks} / {totalTasks}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Typ</p>
            <p className="font-semibold mt-1">{projectData.type}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Przegląd' },
              { id: 'tasks', label: 'Zadania' },
              { id: 'time', label: 'Czas' },
              { id: 'resources', label: 'Zasoby' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && <OverviewTab project={projectData} />}
          {activeTab === 'tasks' && <TasksTab projectId={projectId} tasks={projectData.tasks || []} />}
          {activeTab === 'time' && <TimeTab projectId={projectId} />}
          {activeTab === 'resources' && <ResourcesTab project={projectData} />}
        </div>
      </div>
    </MainLayout>
  );
}

function OverviewTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Informacje</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium">{project.status}</span>
          </div>
          <div>
            <span className="text-gray-600">Typ:</span>
            <span className="ml-2 font-medium">{project.type}</span>
          </div>
          {project.startDate && (
            <div>
              <span className="text-gray-600">Data rozpoczęcia:</span>
              <span className="ml-2 font-medium">
                {new Date(project.startDate).toLocaleDateString('pl-PL')}
              </span>
            </div>
          )}
          {project.dueDate && (
            <div>
              <span className="text-gray-600">Termin:</span>
              <span className="ml-2 font-medium">
                {new Date(project.dueDate).toLocaleDateString('pl-PL')}
              </span>
            </div>
          )}
        </div>
      </div>

      {project.urls && project.urls.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">URLs</h3>
          <div className="space-y-1">
            {project.urls.map((url: string, i: number) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm block"
              >
                {url}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TasksTab({ projectId, tasks }: { projectId: string; tasks: any[] }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: () =>
      tasksApi.create({
        projectId,
        title: newTaskTitle,
        priority: 'medium',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setNewTaskTitle('');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tasksApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newTaskTitle.trim()) {
              createTaskMutation.mutate();
            }
          }}
          placeholder="Dodaj nowe zadanie..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => createTaskMutation.mutate()}
          disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Dodaj
        </button>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Brak zadań</p>
        ) : (
          tasks.map((task: any) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={(e) =>
                    updateTaskMutation.mutate({
                      id: task.id,
                      status: e.target.checked ? 'done' : 'todo',
                    })
                  }
                  className="w-5 h-5"
                />
                <div>
                  <p className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
              </div>
              <select
                value={task.status}
                onChange={(e) => updateTaskMutation.mutate({ id: task.id, status: e.target.value })}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TimeTab({ projectId }: { projectId: string }) {
  const [minutes, setMinutes] = useState('');
  const [note, setNote] = useState('');
  const queryClient = useQueryClient();

  const { data: timeEntries } = useQuery({
    queryKey: ['time', projectId],
    queryFn: () => timeApi.list({ projectId }),
  });

  const createTimeMutation = useMutation({
    mutationFn: () =>
      timeApi.create({
        projectId,
        minutes: parseInt(minutes),
        note: note || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time', projectId] });
      setMinutes('');
      setNote('');
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-semibold mb-4">Zaloguj czas</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minuty</label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Notatka</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Co robiłeś?"
            />
          </div>
          <button
            onClick={() => createTimeMutation.mutate()}
            disabled={!minutes || createTimeMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Zaloguj czas
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Historia</h3>
        {timeEntries?.data?.length === 0 ? (
          <p className="text-gray-500">Brak logów czasu</p>
        ) : (
          <div className="space-y-2">
            {timeEntries?.data?.map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">{entry.minutes} minut</p>
                  {entry.note && <p className="text-sm text-gray-600">{entry.note}</p>}
                  <p className="text-xs text-gray-500">
                    {new Date(entry.startedAt).toLocaleString('pl-PL')}
                  </p>
                </div>
                <p className="text-sm text-gray-600">{entry.user?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResourcesTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      {project.domainResources && project.domainResources.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Domeny</h3>
          <div className="space-y-2">
            {project.domainResources.map((domain: any) => (
              <div key={domain.id} className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium">{domain.domain}</p>
                {domain.registrar && <p className="text-sm text-gray-600">Rejestrator: {domain.registrar}</p>}
                {domain.expiryDate && (
                  <p className="text-sm text-gray-600">
                    Wygasa: {new Date(domain.expiryDate).toLocaleDateString('pl-PL')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {project.hostingResources && project.hostingResources.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Hosting</h3>
          <div className="space-y-2">
            {project.hostingResources.map((hosting: any) => (
              <div key={hosting.id} className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium">{hosting.provider}</p>
                {hosting.plan && <p className="text-sm text-gray-600">Plan: {hosting.plan}</p>}
                {hosting.ip && <p className="text-sm text-gray-600">IP: {hosting.ip}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {project.projectLinks && project.projectLinks.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Linki</h3>
          <div className="space-y-2">
            {project.projectLinks.map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <p className="font-medium">{link.label}</p>
                <p className="text-sm text-blue-600">{link.url}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {(!project.domainResources || project.domainResources.length === 0) &&
        (!project.hostingResources || project.hostingResources.length === 0) &&
        (!project.projectLinks || project.projectLinks.length === 0) && (
          <p className="text-gray-500 text-center py-8">Brak zasobów</p>
        )}
    </div>
  );
}
