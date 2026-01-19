import { z } from 'zod';

// ============================================
// Auth
// ============================================
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

// ============================================
// Projects
// ============================================
export const createProjectSchema = z.object({
  name: z.string().min(1),
  clientId: z.string().uuid(),
  type: z.enum(['website', 'shop', 'custom', 'other']),
  description: z.string().optional(),
  urls: z.array(z.string().url()).optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  assignedManagerId: z.string().uuid().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectStatusSchema = z.enum([
  'new',
  'in_progress',
  'blocked',
  'review',
  'done',
  'archived',
]);

// ============================================
// Tasks
// ============================================
export const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  order: z.number().int().optional(),
  assignedToId: z.string().uuid().optional(),
  estimateMinutes: z.number().int().positive().optional(),
  dueDate: z.string().datetime().optional(),
  dependsOnTaskIds: z.array(z.string().uuid()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  projectId: z.string().uuid().optional(),
});

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'blocked', 'review', 'done']);

export const createChecklistItemSchema = z.object({
  taskId: z.string().uuid(),
  text: z.string().min(1),
});

// ============================================
// Time Tracking
// ============================================
export const createTimeEntrySchema = z.object({
  projectId: z.string().uuid(),
  taskId: z.string().uuid().optional(),
  minutes: z.number().int().positive(),
  note: z.string().optional(),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
});

export const startTimerSchema = z.object({
  projectId: z.string().uuid(),
  taskId: z.string().uuid().optional(),
});

// ============================================
// Clients
// ============================================
export const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

// ============================================
// Resources
// ============================================
export const createDomainResourceSchema = z.object({
  projectId: z.string().uuid(),
  domain: z.string().min(1),
  registrar: z.string().optional(),
  expiryDate: z.string().datetime().optional(),
  nameservers: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const createHostingResourceSchema = z.object({
  projectId: z.string().uuid(),
  provider: z.string().min(1),
  plan: z.string().optional(),
  ip: z.string().optional(),
  panelUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const createDnsRecordSchema = z.object({
  projectId: z.string().uuid(),
  type: z.enum(['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']),
  name: z.string().min(1),
  value: z.string().min(1),
  ttl: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const createProjectLinkSchema = z.object({
  projectId: z.string().uuid(),
  category: z.enum(['repo', 'figma', 'gsc', 'ga', 'docs', 'other']),
  url: z.string().url(),
  label: z.string().min(1),
});

// ============================================
// PageSpeed
// ============================================
export const createPageSpeedTargetSchema = z.object({
  projectId: z.string().uuid(),
  url: z.string().url(),
  label: z.string().optional(),
  active: z.boolean().optional(),
});

// ============================================
// Google Calendar
// ============================================
export const createCalendarEventSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  type: z.enum(['meeting', 'domain_expiry', 'ssl_expiry', 'deployment', 'milestone']).optional(),
  description: z.string().optional(),
});

// ============================================
// Integrations
// ============================================
export const updateIntegrationConfigSchema = z.object({
  type: z.enum(['pagespeed', 'google_calendar', 'n8n']),
  config: z.record(z.unknown()),
});

// ============================================
// n8n Actions
// ============================================
export const n8nCreateTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
});

export const n8nUpdateProjectStatusSchema = z.object({
  projectId: z.string().uuid(),
  status: projectStatusSchema,
});

export const n8nAddCalendarEventSchema = createCalendarEventSchema;
