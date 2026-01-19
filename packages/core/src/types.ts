/**
 * Core types - shared across the framework
 */

export interface ModuleManifest {
  name: string;
  version: string;
  description?: string;
  permissions?: string[];
  routes?: RouteDefinition[];
  navigation?: NavigationEntry[];
  events?: {
    published?: string[];
    subscribed?: string[];
  };
  migrations?: string[];
}

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: string; // path to handler function
  permissions?: string[];
  public?: boolean; // if true, skip auth
}

export interface NavigationEntry {
  label: string;
  path: string;
  icon?: string;
  permissions?: string[];
  children?: NavigationEntry[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  key: string;
}

export interface AuthContext {
  userId: string;
  organizationId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface EventPayload {
  type: string;
  data: unknown;
  timestamp: Date;
  userId?: string;
  organizationId: string;
}
