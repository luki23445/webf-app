import { hasPermission, Errors, eventBus, createAuditLogger } from '@webf/core';
import type { AuthContext } from '@webf/core';
import { ProjectRepository } from '../repositories/project-repository';
import type { CreateProjectInput, UpdateProjectInput } from '@webf/shared';

export class ProjectService {
  private repo: ProjectRepository;

  constructor(getDb: () => any) {
    this.repo = new ProjectRepository(getDb);
  }

  async list(context: AuthContext, filters?: {
    status?: string;
    clientId?: string;
    assignedManagerId?: string;
    search?: string;
  }) {
    if (!hasPermission(context, 'projects:read')) {
      throw Errors.forbidden();
    }

    return this.repo.findMany(context, filters);
  }

  async getById(context: AuthContext, id: string) {
    if (!hasPermission(context, 'projects:read')) {
      throw Errors.forbidden();
    }

    const project = await this.repo.findById(context, id);
    if (!project) {
      throw Errors.notFound('Project not found');
    }

    // Calculate progress
    const progress = await this.repo.calculateProgress(id);

    return {
      ...project,
      progress,
    };
  }

  async create(context: AuthContext, input: CreateProjectInput) {
    if (!hasPermission(context, 'projects:create')) {
      throw Errors.forbidden();
    }

    const project = await this.repo.create(context, {
      name: input.name,
      clientId: input.clientId,
      type: input.type,
      description: input.description,
      urls: input.urls,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      assignedManagerId: input.assignedManagerId,
    });

    // Publish event
    await eventBus.publish({
      type: 'project.created',
      data: { projectId: project.id },
      timestamp: new Date(),
      userId: context.userId,
      organizationId: context.organizationId,
    });

    // Audit log
    const audit = createAuditLogger(context);
    await audit.log('create', 'project', project.id, { name: project.name });

    return project;
  }

  async update(context: AuthContext, id: string, input: UpdateProjectInput) {
    if (!hasPermission(context, 'projects:update')) {
      throw Errors.forbidden();
    }

    const existing = await this.repo.findById(context, id);
    if (!existing) {
      throw Errors.notFound('Project not found');
    }

    const project = await this.repo.update(context, id, {
      ...(input.name && { name: input.name }),
      ...(input.status && { status: input.status }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.urls && { urls: input.urls }),
      ...(input.startDate && { startDate: new Date(input.startDate) }),
      ...(input.dueDate && { dueDate: new Date(input.dueDate) }),
      ...(input.assignedManagerId !== undefined && { assignedManagerId: input.assignedManagerId }),
    });

    // Publish event
    await eventBus.publish({
      type: 'project.updated',
      data: { projectId: project.id, changes: input },
      timestamp: new Date(),
      userId: context.userId,
      organizationId: context.organizationId,
    });

    if (input.status && input.status !== existing.status) {
      await eventBus.publish({
        type: 'project.status_changed',
        data: { projectId: project.id, oldStatus: existing.status, newStatus: input.status },
        timestamp: new Date(),
        userId: context.userId,
        organizationId: context.organizationId,
      });
    }

    // Audit log
    const audit = createAuditLogger(context);
    await audit.log('update', 'project', project.id, { changes: input });

    return project;
  }

  async delete(context: AuthContext, id: string) {
    if (!hasPermission(context, 'projects:delete')) {
      throw Errors.forbidden();
    }

    const project = await this.repo.findById(context, id);
    if (!project) {
      throw Errors.notFound('Project not found');
    }

    await this.repo.delete(context, id);

    // Publish event
    await eventBus.publish({
      type: 'project.deleted',
      data: { projectId: id },
      timestamp: new Date(),
      userId: context.userId,
      organizationId: context.organizationId,
    });

    // Audit log
    const audit = createAuditLogger(context);
    await audit.log('delete', 'project', id);

    return { success: true };
  }
}
