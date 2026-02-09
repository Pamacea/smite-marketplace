/**
 * SMITE Runtime Validation
 *
 * Dynamic schema loading and runtime validation with Zod.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// Simplified Zod-like types (avoiding heavy dependency)
export type ValidationResult =
  | { success: true; data: unknown }
  | { success: false; errors: string[] };

export interface SchemaDefinition {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array';
  properties?: Record<string, SchemaDefinition>;
  required?: string[];
  items?: SchemaDefinition;
  enum?: unknown[];
}

/**
 * Schema Validator for runtime validation
 */
export class SchemaValidator {
  private schemaCache = new Map<string, SchemaDefinition>();

  /**
   * Load JSON schema and cache it
   */
  async loadSchema(schemaName: string, schemaDir?: string): Promise<SchemaDefinition> {
    if (this.schemaCache.has(schemaName)) {
      return this.schemaCache.get(schemaName)!;
    }

    // Default schema directory
    const defaultSchemaDir = path.join(__dirname, '../../validation/schemas');
    const dir = schemaDir || defaultSchemaDir;

    const schemaPath = path.join(dir, `${schemaName}.schema.json`);

    try {
      const content = await fs.readFile(schemaPath, 'utf-8');
      const schema = JSON.parse(content) as SchemaDefinition;

      this.schemaCache.set(schemaName, schema);

      return schema;
    } catch (error) {
      throw new Error(`Failed to load schema ${schemaName}: ${error}`);
    }
  }

  /**
   * Validate data against schema
   */
  validate(data: unknown, schema: SchemaDefinition): ValidationResult {
    const errors: string[] = [];

    try {
      this.validateRecursive(data, schema, '', errors);

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        errors: [`Validation error: ${error}`],
      };
    }
  }

  /**
   * Validate data against loaded schema
   */
  async validateWithSchema(
    data: unknown,
    schemaName: string,
    schemaDir?: string
  ): Promise<ValidationResult> {
    const schema = await this.loadSchema(schemaName, schemaDir);
    return this.validate(data, schema);
  }

  /**
   * Recursive validation
   */
  private validateRecursive(
    data: unknown,
    schema: SchemaDefinition,
    path: string,
    errors: string[]
  ): void {
    // Type validation
    switch (schema.type) {
      case 'string':
        if (typeof data !== 'string') {
          errors.push(`${path || 'root'}: Expected string, got ${typeof data}`);
        }
        break;

      case 'number':
        if (typeof data !== 'number' || isNaN(data)) {
          errors.push(`${path || 'root'}: Expected number, got ${typeof data}`);
        }
        break;

      case 'boolean':
        if (typeof data !== 'boolean') {
          errors.push(`${path || 'root'}: Expected boolean, got ${typeof data}`);
        }
        break;

      case 'array':
        if (!Array.isArray(data)) {
          errors.push(`${path || 'root'}: Expected array, got ${typeof data}`);
          return;
        }

        if (schema.items) {
          data.forEach((item, index) => {
            this.validateRecursive(
              item,
              schema.items!,
              `${path}[${index}]`,
              errors
            );
          });
        }
        break;

      case 'object':
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
          errors.push(`${path || 'root'}: Expected object, got ${typeof data}`);
          return;
        }

        const obj = data as Record<string, unknown>;

        // Check required fields
        if (schema.required) {
          for (const required of schema.required) {
            if (!(required in obj)) {
              errors.push(`${path}${path ? '.' : ''}${required}: Required field missing`);
            }
          }
        }

        // Validate properties
        if (schema.properties) {
          for (const [prop, propSchema] of Object.entries(schema.properties)) {
            if (prop in obj) {
              this.validateRecursive(
                obj[prop],
                propSchema,
                `${path}${path ? '.' : ''}${prop}`,
                errors
              );
            }
          }
        }
        break;
    }

    // Enum validation
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(
        `${path || 'root'}: Value must be one of ${schema.enum.join(', ')}`
      );
    }
  }

  /**
   * Generate TypeScript type from schema (basic)
   */
  generateType(schema: SchemaDefinition, typeName: string = 'GeneratedType'): string {
    const lines: string[] = [];

    lines.push(`export interface ${typeName} {`);

    if (schema.type === 'object' && schema.properties) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        const optional = schema.required?.includes(prop) ? '' : '?';
        const typeStr = this.schemaToTypeString(propSchema);
        lines.push(`  ${prop}${optional}: ${typeStr};`);
      }
    }

    lines.push('}');

    return lines.join('\n');
  }

  /**
   * Convert schema to TypeScript type string
   */
  private schemaToTypeString(schema: SchemaDefinition): string {
    switch (schema.type) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        const itemType = schema.items
          ? this.schemaToTypeString(schema.items)
          : 'unknown';
        return `${itemType}[]`;
      case 'object':
        return 'Record<string, unknown>';
      default:
        return 'unknown';
    }
  }

  /**
   * Clear schema cache
   */
  clearCache(): void {
    this.schemaCache.clear();
  }
}
