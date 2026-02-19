/**
 * SMITE v2.0 Main Integrator
 *
 * Initializes and coordinates all v2.0 features:
 * - Lazy loading system
 * - Model routing
 * - Agent memory
 * - Team orchestration
 * - Telemetry & analytics
 *
 * This is the "brain" that connects all the systems.
 */

import { LazySkillLoader, skillLoader, autoPreloadSkills } from '../skills/skill-loader';
import { AgentMemoryManager, agentMemory, Memory } from '../memory/agent-memory';
import { MarketplaceManager, marketplace, Market } from '../marketplace/marketplace';
import { TeamOrchestrator, teamOrchestrator, Team } from '../teams/team-orchestrator';
import { TelemetryManager, telemetry, Telemetry } from '../telemetry/analytics';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface SMITEConfig {
  lazyLoading: {
    enabled: boolean;
    skillsPath: string;
  };
  modelRouting: {
    enabled: boolean;
    configPath: string;
  };
  agentMemory: {
    enabled: boolean;
  };
  marketplace: {
    enabled: boolean;
    configPath: string;
  };
  teamOrchestration: {
    enabled: boolean;
    teamsPath: string;
  };
  telemetry: {
    enabled: boolean;
    configPath: string;
  };
}

/**
 * Main SMITE v2.0 Integrator
 */
export class SMITEIntegrator {
  private config: SMITEConfig;
  private initialized = false;

  constructor(config?: Partial<SMITEConfig>) {
    this.config = {
      lazyLoading: {
        enabled: true,
        skillsPath: '.claude/skills'
      },
      modelRouting: {
        enabled: true,
        configPath: '.claude/settings.model-routing.json'
      },
      agentMemory: {
        enabled: true
      },
      marketplace: {
        enabled: true,
        configPath: '.claude/marketplace.json'
      },
      teamOrchestration: {
        enabled: true,
        teamsPath: '.claude/teams'
      },
      telemetry: {
        enabled: true,
        configPath: '.claude/telemetry-config.json'
      },
      ...config
    };
  }

  /**
   * Initialize all SMITE v2.0 systems
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('✓ SMITE v2.0 already initialized');
      return;
    }

    console.log('🚀 Initializing SMITE v2.0...\n');

    try {
      // 1. Initialize telemetry first (to track initialization)
      if (this.config.telemetry.enabled) {
        await this.initializeTelemetry();
      }

      // 2. Initialize lazy loading
      if (this.config.lazyLoading.enabled) {
        await this.initializeLazyLoading();
      }

      // 3. Initialize model routing
      if (this.config.modelRouting.enabled) {
        await this.initializeModelRouting();
      }

      // 4. Initialize agent memory
      if (this.config.agentMemory.enabled) {
        await this.initializeAgentMemory();
      }

      // 5. Initialize marketplace
      if (this.config.marketplace.enabled) {
        await this.initializeMarketplace();
      }

      // 6. Initialize team orchestration
      if (this.config.teamOrchestration.enabled) {
        await this.initializeTeamOrchestration();
      }

      this.initialized = true;

      console.log('\n✅ SMITE v2.0 fully initialized!');
      this.printStatus();

    } catch (error) {
      console.error('❌ Failed to initialize SMITE v2.0:', error);
      throw error;
    }
  }

  /**
   * Initialize lazy loading system
   */
  private async initializeLazyLoading(): Promise<void> {
    console.log('⚡ Initializing lazy loading...');

    try {
      // Find all skill files
      const skillsPath = path.resolve(this.config.lazyLoading.skillsPath);
      const skillFiles = await this.findSkillFiles(skillsPath);

      // Initialize skill loader
      await skillLoader.initializeIndex(skillFiles);

      // Auto-preload based on project context
      const projectRoot = process.cwd();
      await autoPreloadSkills(projectRoot);

      // Get stats
      const stats = skillLoader.getStats();
      console.log(`   ✓ Loaded ${stats.totalSkills} skills`);
      console.log(`   ✓ Preloaded ${stats.loadedSkills} active skills`);
      console.log(`   ✓ Memory saved: ${stats.memorySaved}`);
      console.log(`   ✓ Estimated tokens saved: ${stats.estimatedTokensSaved}`);

    } catch (error) {
      console.warn('   ⚠️ Lazy loading initialization failed:', error);
      console.warn('   → Continuing without lazy loading');
    }
  }

  /**
   * Initialize model routing system
   */
  private async initializeModelRouting(): Promise<void> {
    console.log('🧠 Initializing model routing...');

    try {
      const configPath = path.resolve(this.config.modelRouting.configPath);

      // Check if config exists
      try {
        await fs.access(configPath);
      } catch {
        console.log('   ⚠️ Model routing config not found, creating default...');
        await this.createDefaultModelRoutingConfig(configPath);
      }

      // Load and validate config
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      console.log(`   ✓ Strategy: ${config.model_routing.strategy}`);
      console.log(`   ✓ Routes defined: ${Object.keys(config.model_routing.routes || {}).length}`);

      // Log routes
      if (config.model_routing.routes) {
        for (const [name, route]: any of Object.entries(config.model_routing.routes)) {
          console.log(`      - ${name}: ${route.model}`);
        }
      }

      // Make model routing available globally
      (global as any).smiteModelRouting = config.model_routing;

    } catch (error) {
      console.warn('   ⚠️ Model routing initialization failed:', error);
      console.warn('   → Continuing without model routing');
    }
  }

  /**
   * Create default model routing config
   */
  private async createDefaultModelRoutingConfig(configPath: string): Promise<void> {
    const defaultConfig = {
      $schema: './settings.schema.json',
      model_routing: {
        enabled: true,
        strategy: 'smart',
        routes: {
          discovery: {
            model: 'claude-haiku-4-5',
            description: 'Fast code exploration and pattern matching',
            triggers: ['grep', 'glob', 'find', 'search', 'list files', 'explore codebase'],
            max_tokens: 16000,
            priority: 1
          },
          implementation: {
            model: 'claude-sonnet-4-5',
            description: 'Standard code implementation and refactoring',
            triggers: ['edit', 'write', 'create', 'refactor', 'implement', 'generate'],
            max_tokens: 200000,
            priority: 2
          },
          architecture: {
            model: 'claude-opus-4-6',
            description: 'Complex architectural decisions and reviews',
            triggers: ['plan', 'design', 'architecture', 'review', 'optimize strategy'],
            max_tokens: 200000,
            priority: 3
          }
        }
      }
    };

    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
  }

  /**
   * Initialize agent memory system
   */
  private async initializeAgentMemory(): Promise<void> {
    console.log('💾 Initializing agent memory...');

    try {
      await agentMemory.initialize();
      console.log('   ✓ Agent memory ready');
      console.log('   ✓ Categories: solutions, mistakes, decisions, workflows');

      // Make memory available globally
      (global as any).smiteMemory = Memory;

    } catch (error) {
      console.warn('   ⚠️ Agent memory initialization failed:', error);
      console.warn('   → Continuing without agent memory');
    }
  }

  /**
   * Initialize marketplace
   */
  private async initializeMarketplace(): Promise<void> {
    console.log('🌐 Initializing marketplace...');

    try {
      await marketplace.initialize();
      console.log('   ✓ Marketplace ready');

      const sources = marketplace['listSources'] ? marketplace.listSources() : [];
      console.log(`   ✓ Sources configured: ${sources.length}`);

      // Make marketplace available globally
      (global as any).smiteMarketplace = Market;

    } catch (error) {
      console.warn('   ⚠️ Marketplace initialization failed:', error);
      console.warn('   → Continuing without marketplace');
    }
  }

  /**
   * Initialize team orchestration
   */
  private async initializeTeamOrchestration(): Promise<void> {
    console.log('🤖 Initializing team orchestration...');

    try {
      await teamOrchestrator.initialize();
      console.log('   ✓ Team orchestration ready');

      const teams = teamOrchestrator.listTeams();
      console.log(`   ✓ Teams configured: ${teams.length}`);

      // Make teams available globally
      (global as any).smiteTeams = Team;

    } catch (error) {
      console.warn('   ⚠️ Team orchestration initialization failed:', error);
      console.warn('   → Continuing without team orchestration');
    }
  }

  /**
   * Initialize telemetry
   */
  private async initializeTelemetry(): Promise<void> {
    console.log('📊 Initializing telemetry...');

    try {
      await telemetry.initialize();
      console.log('   ✓ Telemetry ready');
      console.log('   ✓ Tracking: performance, costs, quality');

      // Make telemetry available globally
      (global as any).smiteTelemetry = Telemetry;

    } catch (error) {
      console.warn('   ⚠️ Telemetry initialization failed:', error);
      console.warn('   → Continuing without telemetry');
    }
  }

  /**
   * Find all skill files recursively
   */
  private async findSkillFiles(skillsPath: string): Promise<string[]> {
    const skillFiles: string[] = [];

    async function scanDirectory(dir: string) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            await scanDirectory(fullPath);
          } else if (entry.name === 'SKILL.md') {
            skillFiles.push(fullPath);
          }
        }
      } catch (error) {
        // Directory doesn't exist or can't read, skip
      }
    }

    await scanDirectory(skillsPath);
    return skillFiles;
  }

  /**
   * Print system status
   */
  private printStatus(): void {
    console.log('\n📊 System Status:');
    console.log('─────────────────────────────────────────────');

    const features = [
      { name: 'Lazy Loading', enabled: this.config.lazyLoading.enabled },
      { name: 'Model Routing', enabled: this.config.modelRouting.enabled },
      { name: 'Agent Memory', enabled: this.config.agentMemory.enabled },
      { name: 'Marketplace', enabled: this.config.marketplace.enabled },
      { name: 'Team Orchestration', enabled: this.config.teamOrchestration.enabled },
      { name: 'Telemetry', enabled: this.config.telemetry.enabled }
    ];

    for (const feature of features) {
      const status = feature.enabled ? '✅' : '❌';
      const state = feature.enabled ? 'ON' : 'OFF';
      console.log(`  ${status} ${feature.name.padEnd(20)} ${state}`);
    }

    console.log('─────────────────────────────────────────────\n');
  }

  /**
   * Get system statistics
   */
  getStats() {
    return {
      lazyLoading: skillLoader.getStats(),
      teams: teamOrchestrator.listTeams(),
      modelUsage: telemetry.getModelUsage(),
      telemetry: telemetry.getStatsFromMcp()
    };
  }
}

/**
 * Global integrator instance
 */
export const smiteIntegrator = new SMITEIntegrator();

/**
 * Initialize SMITE v2.0
 *
 * Call this at application startup:
 * ```typescript
 * import { initSMITE } from '@smite/core/integration';
 * await initSMITE();
 * ```
 */
export async function initSMITE(config?: Partial<SMITEConfig>): Promise<void> {
  await smiteIntegrator.initialize(config);
}

/**
 * Quick access functions
 */
export const SMITE = {
  init: (config?: Partial<SMITEConfig>) => initSMITE(config),
  stats: () => smiteIntegrator.getStats(),
  isInitialized: () => smiteIntegrator['initialized']
};
