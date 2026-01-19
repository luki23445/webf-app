import type { ModuleManifest } from './types';

/**
 * Module Registry - central registry for all modules
 */
export class ModuleRegistry {
  private modules = new Map<string, ModuleManifest>();

  /**
   * Register a module
   */
  register(manifest: ModuleManifest): void {
    if (this.modules.has(manifest.name)) {
      throw new Error(`Module ${manifest.name} is already registered`);
    }
    this.modules.set(manifest.name, manifest);
  }

  /**
   * Get module manifest
   */
  get(name: string): ModuleManifest | undefined {
    return this.modules.get(name);
  }

  /**
   * Get all registered modules
   */
  getAll(): ModuleManifest[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get all navigation entries from all modules
   */
  getNavigationEntries(): Array<{ module: string; entry: import('./types').NavigationEntry }> {
    const entries: Array<{ module: string; entry: import('./types').NavigationEntry }> = [];
    for (const [name, manifest] of this.modules.entries()) {
      if (manifest.navigation) {
        for (const entry of manifest.navigation) {
          entries.push({ module: name, entry });
        }
      }
    }
    return entries;
  }

  /**
   * Get all routes from all modules
   */
  getRoutes(): Array<{ module: string; route: import('./types').RouteDefinition }> {
    const routes: Array<{ module: string; route: import('./types').RouteDefinition }> = [];
    for (const [name, manifest] of this.modules.entries()) {
      if (manifest.routes) {
        for (const route of manifest.routes) {
          routes.push({ module: name, route });
        }
      }
    }
    return routes;
  }

  /**
   * Get all permissions from all modules
   */
  getAllPermissions(): string[] {
    const permissions = new Set<string>();
    for (const manifest of this.modules.values()) {
      if (manifest.permissions) {
        for (const perm of manifest.permissions) {
          permissions.add(perm);
        }
      }
    }
    return Array.from(permissions);
  }
}

// Singleton instance
export const moduleRegistry = new ModuleRegistry();
