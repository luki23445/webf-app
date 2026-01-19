import { PrismaClient } from '@prisma/client';
import { hash } from '../../packages/core/src/encryption';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create organization
  const org = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'WebF Organization',
    },
  });

  // Create permissions
  const permissions = [
    'projects:read',
    'projects:create',
    'projects:update',
    'projects:delete',
    'tasks:read',
    'tasks:create',
    'tasks:update',
    'tasks:delete',
    'time:read',
    'time:create',
    'time:update',
    'clients:read',
    'clients:create',
    'clients:update',
    'clients:delete',
    'resources:read',
    'resources:create',
    'resources:update',
    'resources:delete',
    'pagespeed:read',
    'pagespeed:create',
    'pagespeed:trigger',
    'calendar:read',
    'calendar:create',
    'calendar:sync',
    'integrations:read',
    'integrations:update',
    'audit:read',
  ];

  const createdPermissions = [];
  for (const key of permissions) {
    const perm = await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
    createdPermissions.push(perm);
  }

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      rolePermissions: {
        create: createdPermissions.map((p) => ({
          permissionId: p.id,
        })),
      },
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      rolePermissions: {
        create: createdPermissions
          .filter((p) => !p.key.includes(':delete') && p.key !== 'integrations:update')
          .map((p) => ({
            permissionId: p.id,
          })),
      },
    },
  });

  // Create admin user
  const { hash: passwordHash, salt: passwordSalt } = hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@webf.app' },
    update: {},
    create: {
      email: 'admin@webf.app',
      name: 'Admin User',
      passwordHash,
      passwordSalt,
      memberships: {
        create: {
          organizationId: org.id,
          roleId: adminRole.id,
        },
      },
    },
  });

  // Create example client
  const client = await prisma.client.create({
    data: {
      organizationId: org.id,
      name: 'Example Client',
      email: 'client@example.com',
      phone: '+48 123 456 789',
      notes: 'Example client for demonstration',
    },
  });

  // Create example project
  const project = await prisma.project.create({
    data: {
      organizationId: org.id,
      clientId: client.id,
      name: 'Example Website Project',
      type: 'website',
      status: 'in_progress',
      description: 'Example project with tasks and resources',
      urls: ['https://example.com'],
      createdById: admin.id,
      tasks: {
        create: [
          {
            title: 'Setup domain',
            description: 'Configure domain DNS',
            status: 'done',
            priority: 'high',
            order: 1,
          },
          {
            title: 'Deploy staging',
            description: 'Deploy to staging environment',
            status: 'in_progress',
            priority: 'high',
            order: 2,
          },
          {
            title: 'Performance optimization',
            description: 'Optimize PageSpeed scores',
            status: 'todo',
            priority: 'medium',
            order: 3,
          },
        ],
      },
      domainResources: {
        create: {
          domain: 'example.com',
          registrar: 'Example Registrar',
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        },
      },
      pagespeedTargets: {
        create: {
          url: 'https://example.com',
          label: 'Homepage',
          active: true,
        },
      },
    },
  });

  console.log('✅ Seeding completed!');
  console.log('📧 Admin login: admin@webf.app / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
