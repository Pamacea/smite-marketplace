/**
 * SMITE Template Engine
 *
 * Simple template processor for variable substitution and includes.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export interface TemplateContext {
  [key: string]: unknown;
}

export interface TemplateOptions {
  includeRoot?: string;
  escapeHTML?: boolean;
}

/**
 * Simple Template Engine for SMITE
 */
export class TemplateEngine {
  private cache = new Map<string, string>();

  /**
   * Process template with variables
   */
  process(template: string, context: TemplateContext = {}): string {
    let result = template;

    // Process includes first
    result = this.processIncludes(result, context);

    // Process conditionals
    result = this.processConditionals(result, context);

    // Process loops
    result = this.processLoops(result, context);

    // Process variables
    result = this.processVariables(result, context);

    return result;
  }

  /**
   * Load and process template file
   */
  async loadFile(
    templatePath: string,
    context: TemplateContext = {},
    options: TemplateOptions = {}
  ): Promise<string> {
    const cacheKey = `${templatePath}:${options.includeRoot || ''}`;

    let template: string;
    if (this.cache.has(cacheKey)) {
      template = this.cache.get(cacheKey)!;
    } else {
      template = await fs.readFile(templatePath, 'utf-8');
      this.cache.set(cacheKey, template);
    }

    // Set include root if provided
    const includeRoot = options.includeRoot || path.dirname(templatePath);

    // Add include root to context
    const enhancedContext: TemplateContext = {
      ...context,
      __include_root: includeRoot,
    };

    return this.process(template, enhancedContext);
  }

  /**
   * Clear template cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Process variable substitution: {{variableName}}
   */
  private processVariables(template: string, context: TemplateContext): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (_, varPath) => {
      const trimmed = varPath.trim();
      return this.getNestedValue(context, trimmed) as string ?? '';
    });
  }

  /**
   * Process includes: {{include:file.md}}
   */
  private processIncludes(template: string, context: TemplateContext): string {
    const includeRoot = (context.__include_root as string) || process.cwd();

    return template.replace(
      /\{\{include:([^}]+)\}\}/g,
      async (_, includePath) => {
        const fullPath = path.resolve(includeRoot, includePath.trim());
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          return content;
        } catch (error) {
          return `[Include error: ${includePath}]`;
        }
      }
    );
  }

  /**
   * Process conditionals: {{#if condition}}...{{/if}}
   */
  private processConditionals(template: string, context: TemplateContext): string {
    return template.replace(
      /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_, condition, body) => {
        const value = this.getNestedValue(context, condition.trim());
        const isTruthy = this.isTruthy(value);
        return isTruthy ? body : '';
      }
    );
  }

  /**
   * Process loops: {{#each items}}...{{/each}}
   */
  private processLoops(template: string, context: TemplateContext): string {
    return template.replace(
      /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (_, arrayPath, itemTemplate) => {
        const value = this.getNestedValue(context, arrayPath.trim());

        if (!Array.isArray(value)) {
          return '';
        }

        return value
          .map((item, index) => {
            // Create context for each item
            const itemContext: TemplateContext = {
              ...context,
              item,
              index,
              first: index === 0,
              last: index === value.length - 1,
            };

            // Process item template
            return this.processVariables(itemTemplate, itemContext);
          })
          .join('');
      }
    );
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: TemplateContext, path: string): unknown {
    const keys = path.split('.');
    let value: unknown = obj;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as TemplateContext)[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Check if value is truthy
   */
  private isTruthy(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  }
}
