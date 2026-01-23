/**
 * Tests for Agent Mapper
 *
 * @module services/agent-mapper.test
 */

import { mapAgentToSkill } from './agent-mapper.js';

describe('Agent Mapper', () => {
  describe('builder agent mappings', () => {
    it('should map builder:task to builder:build', () => {
      expect(mapAgentToSkill('builder:task')).toBe('builder:build');
    });

    it('should map builder:builder to builder:build', () => {
      expect(mapAgentToSkill('builder:builder')).toBe('builder:build');
    });

    it('should map builder to builder:build', () => {
      expect(mapAgentToSkill('builder')).toBe('builder:build');
    });
  });

  describe('architect agent mappings', () => {
    it('should map architect:task to architect:design', () => {
      expect(mapAgentToSkill('architect:task')).toBe('architect:design');
    });

    it('should map architect to architect:design', () => {
      expect(mapAgentToSkill('architect')).toBe('architect:design');
    });
  });

  describe('explorer agent mappings', () => {
    it('should map explorer:task to explorer:explore', () => {
      expect(mapAgentToSkill('explorer:task')).toBe('explorer:explore');
    });

    it('should map explorer to explorer:explore', () => {
      expect(mapAgentToSkill('explorer')).toBe('explorer:explore');
    });
  });

  describe('simplifier agent mappings', () => {
    it('should map simplifier:task to simplifier:simplify', () => {
      expect(mapAgentToSkill('simplifier:task')).toBe('simplifier:simplify');
    });

    it('should map simplifier to simplifier:simplify', () => {
      expect(mapAgentToSkill('simplifier')).toBe('simplifier:simplify');
    });
  });

  describe('unknown agent mappings', () => {
    it('should return original agent if no mapping exists', () => {
      expect(mapAgentToSkill('unknown:agent')).toBe('unknown:agent');
    });

    it('should trim whitespace from agent names', () => {
      expect(mapAgentToSkill('  builder:task  ')).toBe('builder:build');
    });
  });
});
