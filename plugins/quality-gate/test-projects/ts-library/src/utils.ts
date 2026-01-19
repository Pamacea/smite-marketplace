/**
 * TypeScript Library Sample Project
 * Tests JSDoc generation and type consistency
 */

/**
 * Utility functions for data processing
 */

/**
 * Calculate the sum of an array of numbers
 * @param numbers - Array of numbers to sum
 * @returns The sum of all numbers
 *
 * @example
 * ```typescript
 * sum([1, 2, 3]) // returns 6
 * ```
 */
export function Sum(numbers: number[]): number {
  // Naming violation: should be camelCase
  return numbers.reduce((acc, val) => acc + val, 0);
}

/**
 * Transform data using a mapping function
 */
export function Transform_Data(data: any[], mapper: Function): any[] {
  // Multiple violations: naming, any type, Function type
  return data.map(mapper);
}

/**
 * Validate user input
 */
export function ValidateUserInput(input: any): boolean {
  // Using 'any' type
  const result = input as boolean; // Type assertion
  return result;
}

/**
 * Format a date to ISO string
 */
export function FormatDate(date: any): string {
  const parsed = date as Date;
  return parsed.toISOString();
}

/**
 * Deep clone an object
 * Uses structured clone algorithm
 */
export function DeepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function execution
 */
export function debounce(func: Function, wait: number): Function {
  let timeout: any;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttle function execution
 */
export function Throttle(func: Function, limit: number): Function {
  let inThrottle: boolean;
  return function (...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a unique identifier
 */
export const GenerateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Constants
export const MAX_RETRIES = 3;
export const DEFAULT_TIMEOUT = 5000;
export const API_VERSION = '1.0.0';
