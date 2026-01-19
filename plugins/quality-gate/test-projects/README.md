/**
 * Quality Gate Test Infrastructure
 *
 * This directory contains the complete test suite for the quality-gate plugin.
 *
 * ## Test Structure
 *
 * ### Unit Tests (src/**/*.test.ts)
 * - `analyzers/complexity.test.ts` - Complexity calculation tests
 * - `analyzers/security.test.ts` - Security vulnerability detection tests
 * - `analyzers/semantic.test.ts` - Semantic analysis tests
 * - `parser.test.ts` - TypeScript parser tests
 * - `judge.test.ts` - Judge orchestrator tests (TODO)
 * - `config.test.ts` - Configuration manager tests (TODO)
 * - `feedback.test.ts` - Feedback generator tests (TODO)
 * - `test-runner.test.ts` - Test runner integration tests (TODO)
 * - `mcp-client.test.ts` - MCP client tests (TODO)
 * - `doc-trigger.test.ts` - Documentation trigger tests (TODO)
 *
 * ### Integration Tests (src/integration.test.ts)
 * - Complete validation pipeline tests
 * - Hook trigger scenarios
 * - Configuration override tests
 * - Retry logic tests
 * - Error handling tests
 *
 * ### E2E Tests (src/e2e.test.ts)
 * - Production -> Critique -> Fix workflow
 * - Real-world scenarios (Express, React, utility libraries)
 * - Performance tests with large codebases
 * - Edge cases and corner cases
 *
 * ### Sample Projects (test-projects/)
 * - `express-api/` - Express API with security vulnerabilities
 * - `nextjs-app/` - Next.js API routes for testing
 * - `ts-library/` - TypeScript library with semantic issues
 * - `mixed-project/` - Combined issues for comprehensive testing
 *
 * ## Running Tests
 *
 * ```bash
 * # Run all tests
 * npm test
 *
 * # Run tests once
 * npm run test:run
 *
 * # Run tests with coverage
 * npm run test:coverage
 *
 * # Run tests in watch mode
 * npm run test:watch
 *
 * # Run specific test file
 * npx vitest src/analyzers/complexity.test.ts
 * ```
 *
 * ## Coverage Goals
 *
 * Target coverage: >80% across all modules
 * - Lines: 80%
 * - Functions: 80%
 * - Branches: 75%
 * - Statements: 80%
 *
 * Coverage reports are generated in:
 * - `coverage/index.html` - HTML report
 * - `coverage/lcov.info` - LCOV format for CI/CD
 *
 * ## Test Categories
 *
 * ### 1. Positive Tests
 * - Verify correct code passes validation
 * - Test all allowed patterns
 *
 * ### 2. Negative Tests
 * - Detect issues in problematic code
 * - Verify error messages are helpful
 *
 * ### 3. Edge Cases
 * - Empty files
 * - Syntax errors
 * - Very large files
 * - Complex nested structures
 *
 * ### 4. Performance Tests
 * - Large codebase handling (1000+ files)
 * - Concurrent execution
 * - Memory usage tracking
 * - Analysis time benchmarking
 *
 * ## Writing New Tests
 *
 * 1. Place unit tests next to source files: `src/module.test.ts`
 * 2. Use `describe` blocks to group related tests
 * 3. Use `beforeEach` for setup
 * 4. Mock external dependencies (file system, MCP, etc.)
 * 5. Test both success and failure paths
 * 6. Include edge cases
 *
 * Example:
 * ```typescript
 * import { describe, it, expect, beforeEach } from 'vitest';
 * import { MyModule } from './my-module';
 *
 * describe('MyModule', () => {
 *   let module: MyModule;
 *
 *   beforeEach(() => {
 *     module = new MyModule();
 *   });
 *
 *   it('should do something', () => {
 *     expect(module.doSomething()).toBe('result');
 *   });
 * });
 * ```
 *
 * ## Continuous Integration
 *
 * Tests run automatically on:
 * - Every pull request
 * - Every push to main branch
 * - Before publishing to npm
 *
 * Coverage is enforced via coverage thresholds.
 */

export {};
