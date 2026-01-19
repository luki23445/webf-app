import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { extractTokenFromHeader, verifyToken, createAuthContext, Errors } from '@webf/core';
import type { AuthContext } from '@webf/core';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  // Auth middleware
  async function authenticate(request: FastifyRequest) {
    const token = extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw Errors.unauthorized('No token provided');
    }

    try {
      const payload = verifyToken(token, jwtSecret);
      request.auth = createAuthContext(payload);
    } catch (error) {
      throw Errors.unauthorized('Invalid token');
    }
  }

  // Decorate request with auth helper
  fastify.decorateRequest('requireAuth', async function (this: FastifyRequest) {
    await authenticate(this);
  });

  // Optional auth (doesn't throw if no token)
  fastify.decorateRequest('getAuth', async function (this: FastifyRequest) {
    try {
      await authenticate(this);
      return this.auth;
    } catch {
      return undefined;
    }
  });
}

export const setupAuth = fp(authPlugin);
