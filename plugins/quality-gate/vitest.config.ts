/**
 * Vitest Configuration
 * Test configuration for quality-gate plugin
 */

import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/cli.ts',
        'src/config-init.ts',
        'src/judge-hook.ts',
        'node_modules/**',
        'dist/**',
      ],
      // Target 80% coverage with stricter thresholds for critical modules
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      // Per-file thresholds for critical analyzers
      thresholdsAutoUpdate: true,
    },
    // Test timeout
    testTimeout: 30000,
    // Test match patterns
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist'],
    // Setup files
    setupFiles: [],
    // Parallel execution
    threads: true,
    maxThreads: 4,
    // Reporting
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/results.json',
    },
    // Mock configuration
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
