/**
 * Jest Setup File for Ralph
 *
 * Runs before each test suite
 */

process.env.NODE_ENV = 'test';

// Global test utilities for Ralph
global.testUtils = {
  mockUserStory: (overrides = {}) => ({
    id: 'us-001',
    title: 'Test User Story',
    description: 'Test description',
    acceptanceCriteria: ['Given', 'When', 'Then'],
    agent: 'builder:build',
    tech: 'typescript',
    dependencies: [],
    priority: 10,
    passes: false,
    notes: '',
    ...overrides,
  }),

  mockPRD: (overrides = {}) => ({
    name: 'Test PRD',
    description: 'Test description',
    version: '1.0.0',
    userStories: [],
    ...overrides,
  }),
};
