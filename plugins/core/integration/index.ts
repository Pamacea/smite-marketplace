/**
 * SMITE v2.0 Integration Layer - Main Exports
 *
 * This file provides a clean API for using all SMITE v2.0 features
 */

// Main integrator
export { SMITEIntegrator, smiteIntegrator, initSMITE, SMITE } from './smite-integrator';

// Model routing
export { ModelRouter, modelRouter, selectModel } from './model-router';

// Hooks
export {
  onSessionStart,
  onPreToolUse,
  onUserPromptSubmit,
  onStop,
  loadSkill
} from './hooks';

// Types
export type {
  SMITEConfig,
  ModelRoute,
  ModelRoutingConfig,
  ModelSelection
} from './smite-integrator';

/**
 * Quick access to SMITE v2.0 features
 */
export const SMITEv2 = {
  // Initialization
  init: initSMITE,
  isInitialized: () => (smiteIntegrator as any).initialized,

  // Features
  lazy: {
    load: async (skillName: string) => {
      const { loadSkill } = await import('./hooks');
      return loadSkill(skillName);
    },
    stats: () => {
      const { skillLoader } = require('../skills/skill-loader');
      return skillLoader.getStats();
    }
  },

  routing: {
    select: selectModel,
    stats: () => {
      const { modelRouter } = require('./model-router');
      return modelRouter.getUsageStats();
    }
  },

  memory: {
    save: async (category: string, data: any) => {
      const { Memory } = require('../memory/agent-memory');
      return Memory.saveSuccess(data.title, data.content, data);
    },
    search: async (query: string) => {
      const { Memory } = require('../memory/agent-memory');
      return Memory.search(query);
    }
  },

  teams: {
    execute: async (teamName: string, task: string) => {
      const { Team } = require('./teams/team-orchestrator');
      return Team.execute(teamName, task);
    },
    list: () => {
      const { teamOrchestrator } = require('./teams/team-orchestrator');
      return teamOrchestrator.listTeams();
    }
  },

  telemetry: {
    record: async (event: any) => {
      const { Telemetry } = require('../telemetry/analytics');
      return Telemetry.record(event);
    },
    stats: () => {
      const { telemetry } = require('../telemetry/analytics');
      return telemetry.getAllStats();
    },
    report: (days?: number) => {
      const { telemetry } = require('../telemetry/analytics');
      return telemetry.generateReport(days);
    }
  },

  marketplace: {
    search: async (query: string) => {
      const { Market } = require('../marketplace/marketplace');
      return Market.search(query);
    },
    install: async (source: string, skill: string) => {
      const { Market } = require('../marketplace/marketplace');
      return Market.install(source, skill);
    }
  },

  // System status
  status: () => {
    return SMITE.stats();
  }
};

// Export everything for convenience
export * from './smite-integrator';
export * from './model-router';
export * from './hooks';

/**
 * Auto-initialize on import (optional)
 * Commented out to avoid auto-initialization
 */
// initSMITE().catch(console.error);
