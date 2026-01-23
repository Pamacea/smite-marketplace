/**
 * Jest Setup File
 *
 * Runs before each test suite
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests (optional)
global.console = {
  ...console,
  // Uncomment to suppress specific console output during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  /**
   * Create a mock delay
   */
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Create a mock source file content
   */
  mockSourceFile: (content) => `
    // Mock file
    ${content}
  `,

  /**
   * Create a mock PRD
   */
  mockPRD: (overrides = {}) => ({
    name: 'Test PRD',
    description: 'Test description',
    version: '1.0.0',
    userStories: [],
    ...overrides,
  }),
};
