/**
 * SMITE Hook Registry
 *
 * Plugin lifecycle hooks for extensibility and integration.
 */

export type HookEvent =
  | 'plugin.load'
  | 'plugin.unload'
  | 'config.change'
  | 'command.before'
  | 'command.after'
  | 'session.start'
  | 'session.end';

export interface HookContext {
  pluginName?: string;
  [key: string]: unknown;
}

export type HookHandler = (context: HookContext) => Promise<void> | void;

export interface HookRegistration {
  id: string;
  pluginName: string;
  event: HookEvent;
  handler: HookHandler;
  priority?: number;
}

/**
 * Hook Registry for plugin lifecycle management
 */
export class HookRegistry {
  private hooks = new Map<HookEvent, HookRegistration[]>();
  private nextId = 0;

  /**
   * Register a hook for an event
   */
  register(
    event: HookEvent,
    handler: HookHandler,
    pluginName: string,
    priority: number = 0
  ): string {
    const id = `hook-${this.nextId++}`;

    const registration: HookRegistration = {
      id,
      pluginName,
      event,
      handler,
      priority,
    };

    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }

    const hooks = this.hooks.get(event)!;
    hooks.push(registration);

    // Sort by priority (higher priority first)
    hooks.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return id;
  }

  /**
   * Unregister a hook by ID
   */
  unregister(hookId: string): boolean {
    for (const [event, hooks] of this.hooks.entries()) {
      const index = hooks.findIndex(h => h.id === hookId);
      if (index !== -1) {
        hooks.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Unregister all hooks for a plugin
   */
  unregisterPlugin(pluginName: string): void {
    for (const hooks of this.hooks.values()) {
      const filtered = hooks.filter(h => h.pluginName !== pluginName);
      hooks.length = 0;
      hooks.push(...filtered);
    }
  }

  /**
   * Trigger all hooks for an event
   */
  async trigger(event: HookEvent, context: HookContext = {}): Promise<void> {
    const hooks = this.hooks.get(event) || [];

    for (const hook of hooks) {
      try {
        await hook.handler({ ...context, pluginName: hook.pluginName });
      } catch (error) {
        console.error(
          `[HookRegistry] Hook ${hook.id} failed for ${event}:`,
          error
        );
        // Continue executing other hooks even if one fails
      }
    }
  }

  /**
   * Get all registered hooks for an event
   */
  getHooks(event: HookEvent): HookRegistration[] {
    return [...(this.hooks.get(event) || [])];
  }

  /**
   * Check if any hooks are registered for an event
   */
  hasHooks(event: HookEvent): boolean {
    const hooks = this.hooks.get(event);
    return hooks !== undefined && hooks.length > 0;
  }

  /**
   * Clear all hooks (useful for testing)
   */
  clear(): void {
    this.hooks.clear();
  }
}

// Global hook registry instance
let globalRegistry: HookRegistry | undefined;

/**
 * Get or create global hook registry
 */
export function getGlobalHookRegistry(): HookRegistry {
  if (!globalRegistry) {
    globalRegistry = new HookRegistry();
  }
  return globalRegistry;
}
