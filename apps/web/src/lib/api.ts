const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    // Sprawdź czy odpowiedź to JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`API returned non-JSON: ${text.substring(0, 100)}`);
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || data.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    // Jeśli to błąd sieci
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Nie można połączyć się z serwerem. Sprawdź czy API działa na porcie 3001.');
    }
    throw error;
  }
}

// Auth
export const authApi = {
  login: async (email: string, password: string) => {
    return request<{ user: { id: string; email: string; name: string }; token: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },
  register: async (email: string, password: string, name: string) => {
    return request<{ user: { id: string; email: string; name: string }; token: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );
  },
};

// Projects
export const projectsApi = {
  list: async (filters?: { status?: string; clientId?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.clientId) params.append('clientId', filters.clientId);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString();
    return request<any[]>(`/api/projects${query ? `?${query}` : ''}`);
  },
  get: async (id: string) => {
    return request<any>(`/api/projects/${id}`);
  },
  create: async (data: {
    name: string;
    clientId: string;
    type: string;
    description?: string;
    urls?: string[];
    startDate?: string;
    dueDate?: string;
  }) => {
    return request<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<any>) => {
    return request<any>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tasks
export const tasksApi = {
  create: async (data: {
    projectId: string;
    title: string;
    description?: string;
    priority?: string;
    assignedToId?: string;
    estimateMinutes?: number;
    dueDate?: string;
  }) => {
    return request<any>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<any>) => {
    return request<any>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  addChecklistItem: async (taskId: string, text: string) => {
    return request<any>(`/api/tasks/${taskId}/checklist`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
  toggleChecklistItem: async (itemId: string, done: boolean) => {
    return request<any>(`/api/tasks/checklist/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ done }),
    });
  },
};

// Time
export const timeApi = {
  list: async (filters?: { userId?: string; projectId?: string; startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const query = params.toString();
    return request<any[]>(`/api/time${query ? `?${query}` : ''}`);
  },
  create: async (data: {
    projectId: string;
    taskId?: string;
    minutes: number;
    note?: string;
  }) => {
    return request<any>('/api/time', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Clients
export const clientsApi = {
  list: async () => {
    return request<any[]>('/api/clients');
  },
  create: async (data: { name: string; email?: string; phone?: string; notes?: string }) => {
    return request<any>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<any>) => {
    return request<any>(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
