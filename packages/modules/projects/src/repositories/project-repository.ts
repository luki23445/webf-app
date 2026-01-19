import type { AuthContext } from '@webf/core';
import type { Prisma } from '@prisma/client';

export class ProjectRepository {
  constructor(private getDb: () => any) {}

  async findMany(context: AuthContext, filters?: {
    status?: string;
    clientId?: string;
    assignedManagerId?: string;
    search?: string;
  }) {
    const where: Prisma.ProjectWhereInput = {
      organizationId: context.organizationId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.clientId && { clientId: filters.clientId }),
      ...(filters?.assignedManagerId && { assignedManagerId: filters.assignedManagerId }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    return this.getDb().project.findMany({
      where,
      include: {
        client: true,
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            timeEntries: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(context: AuthContext, id: string) {
    return this.getDb().project.findFirst({
      where: {
        id,
        organizationId: context.organizationId,
      },
      include: {
        client: true,
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            dependencies: {
              include: {
                dependsOnTask: {
                  select: {
                    id: true,
                    title: true,
                    status: true,
                  },
                },
              },
            },
            checklistItems: true,
            _count: {
              select: {
                timeEntries: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        timeEntries: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            task: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { startedAt: 'desc' },
          take: 50,
        },
        domainResources: true,
        hostingResources: true,
        dnsRecordPlans: true,
        projectLinks: true,
        pagespeedTargets: {
          include: {
            snapshots: {
              orderBy: { fetchedAt: 'desc' },
              take: 30,
            },
          },
        },
        calendarEventMirrors: {
          orderBy: { startAt: 'asc' },
        },
        _count: {
          select: {
            tasks: true,
            timeEntries: true,
            comments: true,
          },
        },
      },
    });
  }

  async create(context: AuthContext, data: {
    name: string;
    clientId: string;
    type: string;
    description?: string;
    urls?: string[];
    startDate?: Date;
    dueDate?: Date;
    assignedManagerId?: string;
  }) {
    return this.getDb().project.create({
      data: {
        ...data,
        organizationId: context.organizationId,
        createdById: context.userId,
      },
      include: {
        client: true,
      },
    });
  }

  async update(context: AuthContext, id: string, data: Partial<{
    name: string;
    status: string;
    description: string;
    urls: string[];
    startDate: Date;
    dueDate: Date;
    assignedManagerId: string;
  }>) {
    return this.getDb().project.update({
      where: {
        id,
        organizationId: context.organizationId,
      },
      data,
      include: {
        client: true,
      },
    });
  }

  async delete(context: AuthContext, id: string) {
    return this.getDb().project.delete({
      where: {
        id,
        organizationId: context.organizationId,
      },
    });
  }

  async calculateProgress(projectId: string): Promise<number> {
    const tasks = await this.getDb().task.findMany({
      where: { projectId },
      select: { status: true },
    });

    if (tasks.length === 0) {
      return 0;
    }

    const doneCount = tasks.filter((t) => t.status === 'done').length;
    return Math.round((doneCount / tasks.length) * 100);
  }
}
