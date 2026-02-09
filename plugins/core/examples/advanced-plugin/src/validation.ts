/**
 * Advanced SMITE Plugin - Validation Example
 *
 * Demonstrates runtime validation with schemas.
 */

import {
  SchemaValidator,
  type SchemaDefinition,
} from '@smite/core';

/**
 * Validate user input
 */
export async function validateUserInput(input: unknown): Promise<boolean> {
  const validator = new SchemaValidator();

  // Define schema for user input
  const schema: SchemaDefinition = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name', 'email'],
  };

  const result = validator.validate(input, schema);

  if (!result.success) {
    console.error('[Advanced] Validation failed:', result.errors);
    return false;
  }

  console.log('[Advanced] Input validated successfully');
  return true;
}
