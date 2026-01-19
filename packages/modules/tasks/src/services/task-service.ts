import { hasPermission, Errors, eventBus, createAuditLogger } from '@webf/core';
import type { AuthContext } from '@webf/core';
import type { CreateTaskInput, UpdateTaskInput } from '@webf/shared';

// getDb will be passed from routes
declare function getDb(): any;

export class TaskService {
  constructor(private getDb: () => any) {}

  async create(context: AuthContext, input: CreateTaskInput) {
    if (!hasPermission(context, 'tasks:create')) {
      throw Errors.forbidden();
    }

    const task = await this.getDb().task.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        description: input.description,
        priority: input.priority || 'medium',
        order: input.order ?? 0,
        assignedToId: input.assignedToId,
        estimateMinutes: input.estimateMinutes,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      },
    });

    // Create dependencies
    if (input.dependsOnTaskIds && input.dependsOnTaskIds.length > 0) {
      await this.getDb().taskDependency.createMany({
        data: input.dependsOnTaskIds.map((dependsOnTaskId) => ({
          taskId: task.id,
          dependsOnTaskId,
        })),
      });
    }

    await eventBus.publish({
      type: 'task.created',
      data: { taskId: task.id, projectId: input.projectId },
      timestamp: new Date(),
      userId: context.userId,
      organizationId: context.organizationId,
    });

    const audit = createAuditLogger(context);
    await audit.log('create', 'task', task.id, { title: task.title });

    return task;
  }

  async update(context: AuthContext, id: string, input: UpdateTaskInput) {
    if (!hasPermission(context, 'tasks:update')) {
      throw Errors.forbidden();
    }

    const existing = await this.getDb().task.findUnique({ where: { id } });
    if (!existing) {
      throw Errors.notFound('Task not found');
    }

    const task = await this.getDb().task.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status && { status: input.status }),
        ...(input.priority && { priority: input.priority }),
        ...(input.order !== undefined && { order: input.order }),
        ...(input.assignedToId !== undefined && { assignedToId: input.assignedToId }),
        ...(input.estimateMinutes !== undefined && { estimateMinutes: input.estimateMinutes }),
        ...(input.dueDate && { dueDate: new Date(input.dueDate) }),
      },
    });

    if (input.status && input.status !== existing.status) {
      await eventBus.publish({
        type: 'task.status_changed',
        data: { taskId: task.id, oldStatus: existing.status, newStatus: input.status },
        timestamp: new Date(),
        userId: context.userId,
        organizationId: context.organizationId,
      });

      if (input.status === 'done') {
        await eventBus.publish({
          type: 'task.completed',
          data: { taskId: task.id, projectId: task.projectId },
          timestamp: new Date(),
          userId: context.userId,
          organizationId: context.organizationId,
        });
      }
    }

    const audit = createAuditLogger(context);
    await audit.log('update', 'task', task.id, { changes: input });

    return task;
  }

  async addChecklistItem(context: AuthContext, taskId: string, text: string) {
    if (!hasPermission(context, 'tasks:update')) {
      throw Errors.forbidden();
    }

    return this.getDb().taskChecklistItem.create({
      data: { taskId, text },
    });
  }

  async toggleChecklistItem(context: AuthContext, itemId: string, done: boolean) {
    if (!hasPermission(context, 'tasks:update')) {
      throw Errors.forbidden();
    }

    return this.getDb().taskChecklistItem.update({
      where: { id: itemId },
      data: { done },
    });
  }
}
