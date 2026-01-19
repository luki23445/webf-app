import type { FastifyInstance } from 'fastify';
import { generateToken, Errors, hash, verifyHash } from '@webf/core';
import { getDb } from '../db';
import { loginSchema, registerSchema } from '@webf/shared';

export async function registerAuthRoutes(app: FastifyInstance) {
  // Register
  app.post('/api/auth/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    // Check if user exists
    const existing = await getDb().user.findUnique({
      where: { email: body.email },
    });

    if (existing) {
      throw Errors.conflict('User already exists');
    }

    // Create organization (simplified - one org per user for MVP)
    const org = await getDb().organization.create({
      data: { name: `${body.name}'s Organization` },
    });

    // Create user
    const { hash: passwordHash, salt: passwordSalt } = hash(body.password);
    const user = await getDb().user.create({
      data: {
        email: body.email,
        name: body.name,
        passwordHash,
        passwordSalt,
      },
    });

    // Create default role and membership
    const adminRole = await getDb().role.findUnique({ where: { name: 'admin' } });
    if (adminRole) {
      await getDb().membership.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          roleId: adminRole.id,
        },
      });
    }

    // Generate token
    const token = generateToken(
      {
        userId: user.id,
        organizationId: org.id,
        email: user.email,
        roles: ['admin'],
        permissions: [], // Will be loaded from role
      },
      process.env.JWT_SECRET!,
      process.env.JWT_EXPIRES_IN || '7d'
    );

    return reply.status(201).send({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  });

  // Login
  app.post('/api/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await getDb().user.findUnique({
      where: { email: body.email },
      include: {
        memberships: {
          include: {
            organization: true,
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw Errors.unauthorized('Invalid credentials');
    }

    if (!verifyHash(body.password, user.passwordHash, user.passwordSalt)) {
      throw Errors.unauthorized('Invalid credentials');
    }

    // Get first membership (simplified - one org per user for MVP)
    const membership = user.memberships[0];
    if (!membership) {
      throw Errors.unauthorized('No organization membership');
    }

    const permissions = membership.role.rolePermissions.map((rp) => rp.permission.key);

    const token = generateToken(
      {
        userId: user.id,
        organizationId: membership.organizationId,
        email: user.email,
        roles: [membership.role.name],
        permissions,
      },
      process.env.JWT_SECRET!,
      process.env.JWT_EXPIRES_IN || '7d'
    );

    return reply.send({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  });
}
