/**
 * Tests for Prompt Builder
 *
 * @module services/prompt-builder.test
 */

import { buildPrompt } from './prompt-builder.js';
import type { UserStory } from '../types';

describe('Prompt Builder', () => {
  const mockStory: UserStory = {
    id: 'us-001',
    title: 'Test Story',
    description: 'A test user story for testing',
    acceptanceCriteria: [
      'Given the system is ready',
      'When the user clicks',
      'Then the result is shown',
    ],
    agent: 'builder:build',
    tech: 'typescript',
    dependencies: [],
    priority: 10,
    passes: false,
    notes: '',
  };

  it('should build a basic prompt without spec', () => {
    const prompt = buildPrompt(mockStory);

    expect(prompt).toContain('Story ID: us-001');
    expect(prompt).toContain('Title: Test Story');
    expect(prompt).toContain('Description: A test user story for testing');
    expect(prompt).toContain('Acceptance Criteria:');
    expect(prompt).toContain('1. Given the system is ready');
    expect(prompt).toContain('No dependencies - can start immediately');
  });

  it('should build a prompt with spec path', () => {
    const prompt = buildPrompt(mockStory, '/path/to/spec.md');

    expect(prompt).toContain('SPEC-FIRST MODE ENABLED');
    expect(prompt).toContain('You MUST read the specification at: /path/to/spec.md');
    expect(prompt).toContain('Follow the specification EXACTLY:');
  });

  it('should include dependencies when present', () => {
    const storyWithDeps: UserStory = {
      ...mockStory,
      dependencies: ['us-000', 'us-002'],
    };

    const prompt = buildPrompt(storyWithDeps);

    expect(prompt).toContain('Dependencies: us-000, us-002');
    expect(prompt).not.toContain('No dependencies');
  });

  it('should include spec-first instructions when spec path provided', () => {
    const prompt = buildPrompt(mockStory, '/spec.md');

    expect(prompt).toContain('1. Read the spec completely before starting');
    expect(prompt).toContain('2. Implement steps in the order defined');
    expect(prompt).toContain('3. DO NOT deviate from the spec without updating it first');
    expect(prompt).toContain('4. If you find a logic gap: STOP, report it, wait for spec update');
  });
});
