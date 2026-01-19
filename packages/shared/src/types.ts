// Re-export types from schemas
import type { z } from 'zod';
import type {
  createProjectSchema,
  createTaskSchema,
  createTimeEntrySchema,
  createClientSchema,
  createDomainResourceSchema,
  createHostingResourceSchema,
  createDnsRecordSchema,
  createProjectLinkSchema,
  createPageSpeedTargetSchema,
  createCalendarEventSchema,
  projectStatusSchema,
  taskStatusSchema,
} from './schemas';

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = Partial<CreateProjectInput>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = Partial<CreateTaskInput>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = Partial<CreateClientInput>;

export type CreateDomainResourceInput = z.infer<typeof createDomainResourceSchema>;
export type CreateHostingResourceInput = z.infer<typeof createHostingResourceSchema>;
export type CreateDnsRecordInput = z.infer<typeof createDnsRecordSchema>;
export type CreateProjectLinkInput = z.infer<typeof createProjectLinkSchema>;

export type CreatePageSpeedTargetInput = z.infer<typeof createPageSpeedTargetSchema>;
export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;
